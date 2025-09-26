import { Badge } from "@/components/ui/badge";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Bot, Brain, Database, MessageSquare, Workflow } from "lucide-react";

const agents = [
    {
        id: "pricing-chatbot",
        name: "Pricing ChatBot",
        role: "Interação e Precificação",
        description:
            "Agente de conversação especializado em consultas de preços e planejamento de estratégias de precificação.",
        icon: MessageSquare,
        capabilities: [
            "Responder perguntas sobre preços",
            "Comparar concorrência vs CRAL",
            "Gerar simulações rápidas de margem",
            "Auxiliar decisões comerciais"
        ],
        technologies: ["OpenAI GPT", "Supabase", "LangChain"],
        interactions: ["weekly-report", "invoicing-extractor"]
    },
    {
        id: "weekly-report",
        name: "Weekly Report Generator",
        role: "Relatórios Semanais",
        description:
            "Responsável por consolidar dados internos e externos e gerar relatórios semanais com métricas e insights estratégicos.",
        icon: Database,
        capabilities: [
            "Gerar relatórios semanais",
            "Consolidar dados internos e de mercado",
            "Apresentar indicadores de performance",
            "Exportar relatórios estruturados"
        ],
        technologies: ["Python", "Pandas", "Supabase", "Plotly"],
        interactions: ["pricing-chatbot", "invoicing-extractor"]
    },
    {
        id: "invoicing-extractor",
        name: "Invoicing Extractor",
        role: "Extração de Notas",
        description:
            "Agente dedicado à extração e padronização de dados fiscais de documentos de faturamento do mercado externo de concorrentes para análise.",
        icon: Workflow,
        capabilities: [
            "Extrair dados de notas fiscais do concorrente",
            "Leitura e extração de cotações e propostas",
            "Padronizar informações tributárias",
            "Popular Supabase com dados do mercado externo",
            "Servir de base para relatórios e análises"
        ],
        technologies: ["N8N", "FastAPI", "Supabase"],
        interactions: ["pricing-chatbot", "weekly-report"]
    }
];

const communicationFlow = [
    {
        step: 1,
        from: "Usuário",
        to: "Pricing ChatBot",
        action: "Envia consulta",
        description:
            "Usuário interage pelo chatbot para perguntas de precificação"
    },
    {
        step: 2,
        from: "Pricing ChatBot",
        to: "Supabase + Similaridade + RPC",
        action: "Consulta dados",
        description:
            "ChatBot busca informações no banco via embeddings e funções RPC"
    },
    {
        step: 3,
        from: "Weekly Report Generator",
        to: "Supabase + Similaridade + RPC + WeeklyData CSV",
        action: "Consolida relatórios",
        description:
            "Gera relatórios semanais combinando dados internos e externos"
    }
];

const codeExample = `# Exemplo de comunicação entre agentes
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
`;

export default function AgentesIA() {
    return (
        <div className="space-y-8">
            {/* Breadcrumb */}
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/">Início</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Agentes de IA</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-4"
            >
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                    Agentes de IA
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl">
                    Sistema distribuído de agentes inteligentes que colaboram
                    para processar solicitações complexas, analisar dados e
                    executar workflows automatizados.
                </p>
            </motion.div>

            {/* Agents Overview */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="space-y-6"
            >
                <h2 className="text-2xl font-semibold">
                    Arquitetura dos Agentes
                </h2>

                <div className="grid lg:grid-cols-2 gap-6">
                    {agents.map((agent, index) => (
                        <motion.div
                            key={agent.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                                delay: 0.3 + index * 0.1,
                                duration: 0.5
                            }}
                        >
                            <Card className="glass-card hover:shadow-xl transition-all duration-300 group h-full">
                                <div className="space-y-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                                                <agent.icon className="w-6 h-6 text-primary" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold group-hover:text-primary transition-colors duration-300">
                                                    {agent.name}
                                                </h3>
                                                <Badge
                                                    variant="secondary"
                                                    className="text-xs"
                                                >
                                                    {agent.role}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {agent.description}
                                    </p>

                                    <div className="space-y-3">
                                        <div>
                                            <h4 className="font-medium text-sm mb-2">
                                                Capacidades
                                            </h4>
                                            <ul className="text-xs text-muted-foreground space-y-1">
                                                {agent.capabilities.map(
                                                    (capability, idx) => (
                                                        <li
                                                            key={idx}
                                                            className="flex items-center gap-2"
                                                        >
                                                            <span className="w-1 h-1 bg-primary rounded-full"></span>
                                                            {capability}
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        </div>

                                        <div>
                                            <h4 className="font-medium text-sm mb-2">
                                                Tecnologias
                                            </h4>
                                            <div className="flex flex-wrap gap-1">
                                                {agent.technologies.map(
                                                    (tech) => (
                                                        <Badge
                                                            key={tech}
                                                            variant="outline"
                                                            className="text-xs border-primary/20 text-primary/80"
                                                        >
                                                            {tech}
                                                        </Badge>
                                                    )
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="font-medium text-sm mb-2">
                                                Interações
                                            </h4>
                                            <div className="text-xs text-muted-foreground">
                                                Comunica com:{" "}
                                                {agent.interactions
                                                    .map(
                                                        (id) =>
                                                            agents.find(
                                                                (a) =>
                                                                    a.id === id
                                                            )?.name
                                                    )
                                                    .join(", ")}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            {/* Communication Flow */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="space-y-6"
            >
                <h2 className="text-2xl font-semibold">Fluxo de Comunicação</h2>

                <Card className="glass-card">
                    <div className="p-6 space-y-6">
                        {communicationFlow.map((flow, index) => (
                            <motion.div
                                key={flow.step}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{
                                    delay: 0.7 + index * 0.1,
                                    duration: 0.4
                                }}
                                className="flex items-center gap-4"
                            >
                                <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                                    {flow.step}
                                </div>

                                <div className="flex-1 grid md:grid-cols-4 gap-4 items-center">
                                    <div className="font-medium text-sm">
                                        {flow.from}
                                    </div>
                                    <div className="text-center">
                                        <div className="text-xs text-muted-foreground">
                                            {flow.action}
                                        </div>
                                        <div className="w-full h-px bg-gradient-to-r from-transparent via-primary to-transparent mt-1"></div>
                                    </div>
                                    <div className="font-medium text-sm">
                                        {flow.to}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        {flow.description}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </Card>
            </motion.section>

            {/* Code Example */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.6 }}
                className="space-y-6"
            >
                <h2 className="text-2xl font-semibold">Implementação</h2>

                <Card className="glass-card">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Brain className="w-5 h-5 text-primary" />
                            <h3 className="text-lg font-semibold">
                                Sistema de Comunicação entre Agentes
                            </h3>
                        </div>
                        <pre className="text-xs bg-muted/30 p-4 rounded-lg overflow-x-auto">
                            <code>{codeExample}</code>
                        </pre>
                    </div>
                </Card>
            </motion.section>

            {/* Architecture Decisions */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.6 }}
                className="space-y-6"
            >
                <h2 className="text-2xl font-semibold">
                    Decisões Arquiteturais
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                    <Card className="glass-card">
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <Bot className="w-5 h-5 text-primary" />
                                Separação de Responsabilidades
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Cada agente tem uma responsabilidade específica,
                                permitindo especialização e manutenção
                                independente. Isso facilita debugging e
                                otimização de performance.
                            </p>
                        </div>
                    </Card>

                    <Card className="glass-card">
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <Workflow className="w-5 h-5 text-primary" />
                                Comunicação Assíncrona
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Uso de mensagens assíncronas para comunicação
                                entre agentes, garantindo escalabilidade e
                                resiliência do sistema mesmo com alta demanda.
                            </p>
                        </div>
                    </Card>
                </div>
            </motion.section>
        </div>
    );
}
