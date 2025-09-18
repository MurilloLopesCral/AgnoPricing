"""Agente de Precificação - app.py unificado"""

from __future__ import annotations

import os
import time
from collections import deque
from typing import Deque, Dict, List, Optional
from urllib.parse import urlsplit

import streamlit as st
from agno.agent import Agent
from agno.models.message import Message
from agno.run.agent import RunOutput

# =============== CONFIG .ENV ===============
try:
    from dotenv import load_dotenv

    load_dotenv()
except ImportError:
    pass

# Variáveis de ambiente
DATABASE_URL = os.getenv("DATABASE_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
DEFAULT_OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
EMBEDDING_MODEL = os.getenv("OPENAI_EMBEDDING_MODEL", "text-embedding-3-small")
DEFAULT_MATCH_THRESHOLD = 0.4
DEFAULT_LIMIT = 150
DEFAULT_MATCH_COUNT = 100
MAX_HISTORY_MESSAGES = 12

# =============== CLIENTES ===============
from openai import OpenAI
from supabase import Client, create_client


def _derive_supabase_url(database_url: str) -> Optional[str]:
    if not database_url:
        return None
    hostname = urlsplit(database_url).hostname
    if not hostname:
        return None
    if hostname.startswith("db.") and hostname.endswith(".supabase.co"):
        project_ref = hostname[len("db.") : -len(".supabase.co")]
        return f"https://{project_ref}.supabase.co"
    return None


SUPABASE_URL = _derive_supabase_url(DATABASE_URL)

_supabase_client: Optional[Client] = None
if SUPABASE_URL and SUPABASE_ANON_KEY:
    try:
        _supabase_client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)
    except Exception as exc:
        print(f"[Tools] Erro ao inicializar Supabase: {exc}")

_openai_client: Optional[OpenAI] = None
if OPENAI_API_KEY:
    try:
        _openai_client = OpenAI(api_key=OPENAI_API_KEY)
    except Exception as exc:
        print(f"[Tools] Erro ao inicializar OpenAI: {exc}")


def get_supabase_client() -> Optional[Client]:
    return _supabase_client


def get_openai_client() -> Optional[OpenAI]:
    return _openai_client


# =============== FUNÇÕES AUXILIARES ===============
def _generate_embedding(text: str) -> Optional[List[float]]:
    client = get_openai_client()
    if client is None:
        return None
    try:
        response = client.embeddings.create(model=EMBEDDING_MODEL, input=text)
        return response.data[0].embedding
    except Exception as exc:
        print(f"[Tools] Falha ao gerar embedding: {exc}")
        return None


def _resolve_match_count(match_count: Optional[int]) -> int:
    if match_count is None:
        return DEFAULT_MATCH_COUNT
    return min(match_count, DEFAULT_MATCH_COUNT)


def _call_match_fn(
    function_name: str,
    query: str,
    match_threshold: float,
    limit: Optional[int],
    match_count: Optional[int],
    result_fields: List[str],
) -> Dict[str, object]:
    client = get_supabase_client()
    resolved_limit = DEFAULT_LIMIT
    resolved_count = _resolve_match_count(match_count)
    embedding = _generate_embedding(query)

    if client is None or embedding is None:
        return {
            "function": function_name,
            "query": query,
            "matches": [],
            "error": "Supabase ou embedding indisponível",
        }

    try:
        response = client.rpc(
            function_name,
            {
                "query_embedding": embedding,
                "match_count": resolved_count,
                "match_threshold": match_threshold,
            },
        ).execute()
    except Exception as exc:
        return {
            "function": function_name,
            "query": query,
            "matches": [],
            "error": str(exc),
        }

    data = response.data if hasattr(response, "data") else response
    matches: List[str] = []
    for row in data:
        if not isinstance(row, dict):
            continue
        value: Optional[str] = None
        for field in result_fields:
            candidate = row.get(field)
            if candidate:
                value = candidate
                break
        if value:
            matches.append(value)

    return {
        "function": function_name,
        "query": query,
        "limit": resolved_limit,
        "match_count": resolved_count,
        "matches": matches,
        "result_fields": result_fields,
    }


# =============== TOOLS ===============
def query_documents(
    query: str,
    match_threshold: float = DEFAULT_MATCH_THRESHOLD,
    limit: Optional[int] = DEFAULT_LIMIT,
    match_count: Optional[int] = DEFAULT_MATCH_COUNT,
) -> Dict[str, object]:
    return _call_match_fn(
        "match_documents",
        query,
        match_threshold,
        limit,
        match_count,
        result_fields=["content_plain", "content"],
    )


def query_thirdparty_documents(
    query: str,
    match_threshold: float = DEFAULT_MATCH_THRESHOLD,
    limit: Optional[int] = DEFAULT_LIMIT,
    match_count: Optional[int] = DEFAULT_MATCH_COUNT,
) -> Dict[str, object]:
    return _call_match_fn(
        "match_thirdparty",
        query,
        match_threshold,
        limit,
        match_count,
        result_fields=["content"],
    )


def query_thirdparty_proposals(
    query: str,
    match_threshold: float = DEFAULT_MATCH_THRESHOLD,
    limit: Optional[int] = DEFAULT_LIMIT,
    match_count: Optional[int] = DEFAULT_MATCH_COUNT,
) -> Dict[str, object]:
    return _call_match_fn(
        "match_proposals",
        query,
        match_threshold,
        limit,
        match_count,
        result_fields=["content"],
    )


def run_sql(query: str) -> Dict[str, object]:
    client = get_supabase_client()
    # print(f"[run_sql] Recebi query do agente:\n{query}")  # 🔎 Debug

    if client is None:
        # print("[run_sql] Supabase client não inicializado")
        return {"error": "Supabase indisponível"}

    try:
        response = client.rpc("exec_documents_view", {"query": query}).execute()
        # print(f"[run_sql] Resposta bruta do Supabase:\n{response.data}")  # 🔎 Debug
        return {"query": query, "results": response.data}
    except Exception as exc:
        # print(f"[run_sql] Erro ao executar query: {exc}")  # 🔎 Debug
        return {"error": str(exc), "query": query}


# =============== AGENTE ===============
from agno.models.openai import OpenAIChat


def build_agent() -> Agent:
    model = OpenAIChat(id=DEFAULT_OPENAI_MODEL)
    return Agent(
        name="PricingAgent",
        instructions=(
            "Você é um Agente de Pricing com QI elevado, mais de 20 anos de experiência em precificação, vendas e estratégia comercial, atuando como se fosse um diretor sênior de Pricing. "
            "Seu papel é apoiar Diretoria, CEO e Vendas com análises profundas, claras e fundamentadas.\n\n"
            "Regras de Conduta\n"
            "1. Nunca inventar dados — se não houver informação na base, diga explicitamente que falta dado.\n"
            "2. Usar somente as informações disponíveis em planilhas, relatórios e integrações.\n"
            "3. Linguagem executiva, objetiva e clara, como se estivesse falando com C-Level.\n"
            "4. Sempre estruturar relatórios em seções fixas (Resumo, Performance, Preços, Insights, Recomendações).\n"
            "5. Gerar gráficos, tabelas e comparativos sempre que possível.\n"
            "6. Não ser prolixo, mas também não ser superficial — o objetivo é decisão rápida.\n"
            "7. Destacar alertas e oportunidades com símbolos (➡, 🔴, 🟢).\n\n"
            "🔑 Exemplos de Resposta Esperada\n"
            "• Não inventar: 'Não há dados de custos disponíveis, portanto não é possível calcular margem de contribuição real.'\n"
            "• Claro: 'AGV2508 (agulha múltipla) cresceu 50% em volume e manteve preço estável ➡ oportunidade de ajuste de preço.'\n"
            "• Executivo: Relatórios sempre trazem tabelas + bullets + gráficos.\n\n"
            "📌 Regras adicionais de uso das ferramentas:\n"
            "- Se não houver ano informado na pergunta, assuma sempre o ano atual para consultas e interpretações.\n"
            "- Se a pergunta envolver datas, clientes, produtos, faturamento, margem ou análises quantitativas, "
            "gere uma query SQL para a view documents_view e execute usando a ferramenta run_sql.\n"
            "- Se a pergunta exigir busca semântica em documentos/textos, use query_documents.\n"
            "- Se exigir ambos (filtro + semântica), primeiro use run_sql para reduzir o conjunto e depois aplique query_documents.\n"
            "- Sempre prefira SQL (run_sql) quando for possível responder de forma exata com dados estruturados.\n"
            "📌 Ao gerar SQL para a view documents_view:\n"
            "- Sempre use a sintaxe do PostgreSQL.\n"
            "- Para buscar clientes, produtos ou marcas, use sempre ILIKE '%texto%' em vez de =, para garantir correspondência parcial e insensível a maiúsculas/minúsculas.\n"
            "- Para extrair mês e ano de uma coluna DATE, use EXTRACT(MONTH FROM emissao) e EXTRACT(YEAR FROM emissao).\n"
            "- Se não houver ano informado na pergunta, assuma sempre o ano atual para consultas e interpretações.\n"
            "- Nunca use funções como MONTH() ou YEAR(), pois não existem em PostgreSQL.\n"
            "- Prefira filtros com BETWEEN 'YYYY-MM-DD' AND 'YYYY-MM-DD' quando possível.\n"
            "- Caso não seja informado o ano na conversa, assuma o ano atual (2025).\n"
            "📌 Colunas disponíveis na view documents_view:\n"
            "- produto (texto)\n"
            "- cliente (texto)\n"
            "- cidade (texto)\n"
            "- uf (texto)\n"
            "- marca (texto)\n"
            "- tipo_estoque (texto)\n"
            "- faturamento (numérico)\n"
            "- mc (numérico)\n"
            "- cmv (numérico)\n"
            "- icms (numérico)\n"
            "- pis (numérico)\n"
            "- cofins (numérico)\n"
            "- frete (numérico)\n"
            "- preco_unitario (numérico)\n"
            "- quantidade (numérico)\n"
            "- comissao (numérico)\n"
            "- emissao (date)\n"
            "- nota_fiscal (texto)\n"
            "- descricao (texto)\n"
            "- percentual_mc (texto)\n"
        ),
        model=model,
        tools=[
            query_documents,
            query_thirdparty_documents,
            query_thirdparty_proposals,
            run_sql,
        ],
    )


agent: Agent = build_agent()


def _extract_response_text(response: RunOutput) -> str:
    if isinstance(response.content, str):
        return response.content
    if hasattr(response, "output") and isinstance(response.output, str):
        return response.output
    return str(response.content)


# =============== INTERFACE STREAMLIT ===============
st.set_page_config(
    page_title="CralLabs - Pricing AI", page_icon=":bar_chart:", layout="centered"
)
st.title("📊 Bem-vindo ao Pricing AI")

if "chat_messages" not in st.session_state:
    st.session_state.chat_messages = []

if "conversation" not in st.session_state:
    st.session_state.conversation = []

for message in st.session_state.chat_messages:
    role = message["role"]
    text = message["text"]
    header = "Você" if role == "user" else "Agente"
    with st.chat_message(role):
        st.markdown(f"**{header}:** {text}")

user_input = st.chat_input("Digite sua pergunta...")

if user_input:
    st.session_state.chat_messages.append({"role": "user", "text": user_input})
    st.session_state.conversation.append(Message(role="user", content=user_input))
    st.session_state.conversation = st.session_state.conversation[
        -MAX_HISTORY_MESSAGES:
    ]

    with st.chat_message("user"):
        st.markdown(f"**Você:** {user_input}")

    try:
        response = agent.run(st.session_state.conversation)
        reply_text = _extract_response_text(response)
    except Exception as exc:
        reply_text = f"Ocorreu um erro ao processar sua pergunta: {exc}"

    st.session_state.chat_messages.append({"role": "assistant", "text": reply_text})
    st.session_state.conversation.append(Message(role="assistant", content=reply_text))
    st.session_state.conversation = st.session_state.conversation[
        -MAX_HISTORY_MESSAGES:
    ]

    with st.chat_message("assistant"):
        placeholder = st.empty()
        rendered = ""
        for char in reply_text:
            rendered += char
            placeholder.markdown(f"**Agente:** {rendered}|")
            time.sleep(0.015)
            placeholder.markdown(f"**Agente:** {reply_text}")
            placeholder.markdown(f"**Agente:** {rendered}|")
            time.sleep(0.015)
            placeholder.markdown(f"**Agente:** {reply_text}")
            placeholder.markdown(f"**Agente:** {rendered}|")
            time.sleep(0.015)
            placeholder.markdown(f"**Agente:** {reply_text}")
