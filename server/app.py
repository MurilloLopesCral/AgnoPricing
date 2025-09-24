"""Agente de Precificação - app.py unificado"""

from __future__ import annotations

import os
import time
from collections import deque
from typing import Deque, Dict, List, Optional
from urllib.parse import urlsplit

import streamlit as st
import yaml
from agno.agent import Agent
from agno.models.message import Message
from agno.run.agent import RunOutput
from supabase_auth import Any

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


SUPABASE_URL = _derive_supabase_url(DATABASE_URL)  # type: ignore

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
        resolved_threshold = _resolve_threshold(query, match_threshold)
        response = client.rpc(
            function_name,
            {
                "query_embedding": embedding,
                "match_count": resolved_count,
                "match_threshold": resolved_threshold,
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


def _resolve_threshold(query: str, match_threshold: float) -> float:
    """
    Ajusta o threshold de similaridade com base no tamanho da query.
    Queries muito curtas (1 ou 2 palavras) tendem a precisar de um threshold menor.
    """
    token_count = len(query.split())
    if token_count <= 2 and match_threshold >= 0.4:
        return 0.1  # mais tolerante para nomes curtos
    return match_threshold


def load_instructions(path: str = "./instructions.yaml") -> str:
    with open(path, "r", encoding="utf-8") as f:
        data = yaml.safe_load(f)
    return (
        data["agent"]["description"]
        + "\n\nRegras de Conduta\n"
        + data["agent"]["rules"]
        + "\n\n🔑 Exemplos\n"
        + data["agent"]["examples"]
        + "\n\n📌 Regras SQL\n"
        + data["agent"]["sql_guidelines"]
        + "\n\n📌 Colunas\n"
        + data["agent"]["available_columns"]
    )


def load_users_from_env() -> dict:
    users = {}
    for key, value in os.environ.items():
        if key.startswith("USER"):
            parts = value.split(":", 1)  # garante no máximo 2 pedaços
            if len(parts) == 2:
                user, pwd = parts
                users[user.strip()] = pwd.strip()
            else:
                print("")
                # print(
                #     f"[Login] Variável {key} ignorada (esperado 'usuario:senha', recebido: '{value}')"
                # )
    return users


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
    print(f"[query_thirdparty_documents] Recebi do agente: {query}")  # 🔎 Debug
    result = _call_match_fn(
        "match_thirdparty",
        query,
        match_threshold,
        limit,
        match_count,
        result_fields=["cliente", "descricao", "consultor", "regiao", "content"],
    )
    print(f"[query_thirdparty_documents] Resultado bruto: {result}")  # 🔎 Debug
    return result


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
    print(f"[run_sql] Recebi query do agente:\n{query}")  # 🔎 Debug

    if client is None:
        # print("[run_sql] Supabase client não inicializado")
        return {"error": "Supabase indisponível"}

    try:
        response = client.rpc("exec_safe_view", {"query": query}).execute()
        print(f"[run_sql] Resposta bruta do Supabase:\n{response.data}")  # 🔎 Debug
        return {"query": query, "results": response.data}
    except Exception as exc:
        print(f"[run_sql] Erro ao executar query: {exc}")  # 🔎 Debug
        return {"error": str(exc), "query": query}


def query_comparison_data(query: str, limit: int = 200) -> Dict[str, Any]:
    """
    Busca dados nas três views (interno, concorrente_nf, concorrente_proposta),
    normaliza para um schema comum e retorna dataset unificado.
    """

    print(f"[query_comparison_data] Recebi do agente: {query}")  # DEBUG

    # Montar SQL seguro (usar ILIKE para cliente/produto)
    safe_query = f"%{query}%"

    docs = run_sql(
        f"""
        select id,produto,cliente,cidade,uf,marca,faturamento,mc,cmv,icms,pis,cofins,frete,preco_unitario,
        quantidade,comissao,emissao,nota_fiscal,descricao,percentual_mc from documents_view
        where cliente ilike '{safe_query}' or produto ilike '{safe_query}'
        limit {limit}
        """
    )["results"]

    print(f"[query_comparison_data] Internos encontrados: {len(docs)}")  # type: ignore # DEBUG

    tp_docs = run_sql(
        f"""
        select id,ncm,cnpj,regiao,cliente,consultor,descricao,frete,dataregistro,ipi,icms from thirdpartydocs_view
        where cliente ilike '{safe_query}' or descricao ilike '{safe_query}'
        limit {limit}
        """
    )["results"]

    print(f"[query_comparison_data] Concorrente NF encontrados: {len(tp_docs)}")  # type: ignore # DEBUG

    tp_props = run_sql(
        f"""
        select id,preco_cral,codigo_cral,comentario,dataregistro,consultora_nome,grupo_id_cliente,nome_concorrente,
        consultora_regiao,preco_concorrente from thirdpartyproposals_view
        where grupo_id_cliente ilike '{safe_query}' or nome_concorrente ilike '{safe_query}'
        limit {limit}
        """
    )["results"]

    print(f"[query_comparison_data] Propostas encontradas: {len(tp_props)}")  # type: ignore # DEBUG

    dataset = unify_data(docs, tp_docs, tp_props)  # type: ignore

    print(f"[query_comparison_data] Total unificado: {len(dataset)}")  # DEBUG

    return {
        "function": "query_comparison_data",
        "query": query,
        "limit": limit,
        "count": len(dataset),
        "results": dataset,
    }


# =============== NORMALIZAÇÃO DE DADOS ===============


def _clean_price(value: Optional[str]) -> Optional[float]:
    """Limpa strings de preço tipo 'R$ 48,99' e retorna float"""
    if not value or not isinstance(value, str):
        return None
    cleaned = value.replace("R$", "").replace(",", ".").strip()
    try:
        return float(cleaned)
    except ValueError:
        return None


def normalize_documents(rows: List[Dict]) -> List[Dict]:
    normalized = []
    for r in rows:
        normalized.append(
            {
                "origem": "interno",
                "produto": r.get("produto"),
                "cliente": r.get("cliente"),
                "data": r.get("emissao"),
                "preco_unitario": r.get("preco_unitario"),
                "faturamento": r.get("faturamento"),
                "quantidade": r.get("quantidade"),
                "consultor": None,
                "regiao": None,
            }
        )
    return normalized


def normalize_thirdparty_docs(rows: List[Dict]) -> List[Dict]:
    normalized = []
    for r in rows:
        normalized.append(
            {
                "origem": "concorrente_nf",
                "produto": r.get("descricao"),
                "cliente": r.get("cliente"),
                "data": r.get("dataregistro"),
                "preco_unitario": None,
                "faturamento": None,
                "quantidade": None,
                "consultor": r.get("consultor"),
                "regiao": r.get("regiao"),
            }
        )
    return normalized


def normalize_thirdparty_proposals(rows: List[Dict]) -> List[Dict]:
    normalized = []
    for r in rows:
        preco = _clean_price(r.get("preco_concorrente"))
        normalized.append(
            {
                "origem": "concorrente_proposta",
                "produto": r.get("nome_concorrente"),
                "cliente": r.get("grupo_id_cliente"),
                "data": r.get("dataregistro"),
                "preco_unitario": preco,
                "faturamento": None,
                "quantidade": None,
                "consultor": r.get("consultora_nome"),
                "regiao": r.get("consultora_regiao"),
            }
        )
    return normalized


def unify_data(
    docs: List[Dict], tp_docs: List[Dict], tp_props: List[Dict]
) -> List[Dict]:
    all_data = []
    all_data.extend(normalize_documents(docs))
    all_data.extend(normalize_thirdparty_docs(tp_docs))
    all_data.extend(normalize_thirdparty_proposals(tp_props))
    return all_data


# =============== AGENTE ===============
from agno.models.openai import OpenAIChat


def build_agent() -> Agent:
    model = OpenAIChat(id=DEFAULT_OPENAI_MODEL)
    return Agent(
        name="PricingAgent",
        instructions=load_instructions(),
        model=model,
        tools=[
            query_documents,
            query_thirdparty_documents,
            query_thirdparty_proposals,
            query_comparison_data,
            run_sql,
        ],
    )


agent: Agent = build_agent()


def _extract_response_text(response: RunOutput) -> str:
    if isinstance(response.content, str):
        return response.content
    if hasattr(response, "output") and isinstance(
        response.output, str  # type: ignore
    ):  # pyright: ignore[reportAttributeAccessIssue]
        return response.output  # type: ignore
    return str(response.content)


# =============== INTERFACE STREAMLIT ===============

# ====== LOGIN ======
if "logged_in" not in st.session_state:
    st.session_state.logged_in = False

if not st.session_state.logged_in:
    st.title("🔐 Login no Pricing AI")

    username = st.text_input("Usuário")
    password = st.text_input("Senha", type="password")
    login_button = st.button("Entrar")

    # Carregar usuários (pode escolher env ou txt)
    users = load_users_from_env()

    if login_button:
        if username in users and users[username] == password:
            st.session_state.logged_in = True
            st.session_state.username = username
            st.success(f"Bem-vindo, {username}!")
            st.rerun()  # recarregar a página já logado
        else:
            st.error("Usuário ou senha inválidos.")
    st.stop()  # Impede o resto da app de rodar se não logado


# ====== AGENTE ======
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
            time.sleep(0.0005)
            placeholder.markdown(f"**Agente:** {reply_text}")
            placeholder.markdown(f"**Agente:** {rendered}|")
            time.sleep(0.0005)
            placeholder.markdown(f"**Agente:** {reply_text}")
            placeholder.markdown(f"**Agente:** {rendered}|")
            time.sleep(0.0005)
            placeholder.markdown(f"**Agente:** {reply_text}")
