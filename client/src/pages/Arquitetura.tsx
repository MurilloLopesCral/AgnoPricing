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
import { Cpu, Database, GitBranch, Server, Zap } from "lucide-react";

const architectureComponents = [
    {
        name: "Supabase",
        description:
            "Backend-as-a-Service completo com PostgreSQL, autenticação, índexação e consultas em tempo real",
        icon: Database,
        category: "Backend",
        features: ["PostgreSQL", "Real-time", "Auth", "Storage", "Indexes"]
    },
    {
        name: "Agno Framework",
        description:
            "Framework de IA personalizado para processamento inteligente e automação e criação de agentes autônomos",
        icon: Cpu,
        category: "IA",
        features: ["ML Models", "NLP", "Automation", "Custom Agents"]
    },
    {
        name: "Python Ecosystem",
        description:
            "Stack Python robusto para processamento de dados e machine learning",
        icon: GitBranch,
        category: "Backend",
        features: ["FastAPI", "Pandas", "Scikit-learn", "TensorFlow"]
    },
    {
        name: "N8N Workflows",
        description: "Orquestração de workflows e integrações sem código",
        icon: Zap,
        category: "Automação",
        features: [
            "Visual Workflows",
            "API Integrations",
            "Scheduling",
            "Webhooks"
        ]
    },
    {
        name: "Chatbot Engine",
        description:
            "Motor de conversação inteligente com processamento de linguagem natural",
        icon: Server,
        category: "IA",
        features: ["NLU", "Context Aware", "Multi-language", "Deep thinking"]
    },
    {
        name: "SQL Datawarehouse",
        description:
            "Armazenamento centralizado para consultas analíticas e relatórios estratégicos",
        icon: Database,
        category: "Dados",
        features: [
            "ETL",
            "Consultas Analíticas",
            "SQL Server",
            "Escalabilidade de Leitura"
        ]
    }
];

const internalFlow = [
    {
        step: 1,
        title: "SQL Senior",
        description: "Extração de dados do banco da Senior"
    },
    {
        step: 2,
        title: "Excel",
        description: "Tratamento e organização dos dados em planilhas"
    },
    {
        step: 3,
        title: "Supabase Registros",
        description: "Geração de registros prontos para inserção"
    },
    {
        step: 4,
        title: "Supabase",
        description: "Inserção final no banco e indexação"
    }
];

const externalFlow = [
    {
        step: 1,
        title: "Formulário Concorrente",
        description: "Preenchimento manual dos concorrentes pelas consultoras"
    },
    {
        step: 2,
        title: "N8N",
        description: "Tratamento e automação do fluxo de dados recebidos"
    },
    {
        step: 3,
        title: "Supabase",
        description: "Inserção no banco de dados central"
    },
    {
        step: 4,
        title: "Indexação",
        description: "Indexação para consultas e análise semântica"
    }
];

export default function Arquitetura() {
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
                        <BreadcrumbPage>Arquitetura</BreadcrumbPage>
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
                    Arquitetura do Sistema
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl">
                    Conheça a estrutura técnica robusta que sustenta o
                    ecossistema CralLabs, projetada para escalabilidade,
                    performance e confiabilidade.
                </p>
            </motion.div>

            {/* Architecture Overview */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="space-y-6"
            >
                <h2 className="text-2xl font-semibold">
                    Componentes Principais
                </h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {architectureComponents.map((component, index) => (
                        <motion.div
                            key={component.name}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                                delay: 0.3 + index * 0.1,
                                duration: 0.4
                            }}
                        >
                            <Card className="glass-card hover:shadow-xl transition-all duration-300 group h-full">
                                <div className="space-y-4">
                                    <div className="flex items-start justify-between">
                                        <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                                            <component.icon className="w-6 h-6 text-primary" />
                                        </div>
                                        <Badge
                                            variant="secondary"
                                            className="text-xs"
                                        >
                                            {component.category}
                                        </Badge>
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="text-lg font-semibold group-hover:text-primary transition-colors duration-300">
                                            {component.name}
                                        </h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            {component.description}
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap gap-1">
                                        {component.features.map((feature) => (
                                            <Badge
                                                key={feature}
                                                variant="outline"
                                                className="text-xs border-primary/20 text-primary/80"
                                            >
                                                {feature}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            {/* Data Flow */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="space-y-6"
            >
                <h2 className="text-2xl font-semibold">
                    Fluxo de alimentação dos dados - Internos
                </h2>

                <Card className="glass-card">
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {internalFlow.map((flow, index) => (
                                <motion.div
                                    key={flow.step}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{
                                        delay: 0.7 + index * 0.1,
                                        duration: 0.4
                                    }}
                                    className="relative"
                                >
                                    <div className="flex flex-col items-center text-center space-y-3">
                                        <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold text-lg shadow-lg animate-glow">
                                            {flow.step}
                                        </div>

                                        <div className="space-y-1">
                                            <h4 className="font-medium text-sm">
                                                {flow.title}
                                            </h4>
                                            <p className="text-xs text-muted-foreground leading-tight">
                                                {flow.description}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Connection line */}
                                    {index < internalFlow.length - 1 && (
                                        <div className="hidden lg:block absolute top-6 left-full w-4 h-0.5 bg-gradient-to-r from-primary to-primary-glow transform -translate-y-1/2" />
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </Card>

                <h2 className="text-2xl font-semibold">
                    Fluxo de alimentação dos dados - Externos
                </h2>

                <Card className="glass-card">
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {externalFlow.map((flow, index) => (
                                <motion.div
                                    key={flow.step}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{
                                        delay: 0.7 + index * 0.1,
                                        duration: 0.4
                                    }}
                                    className="relative"
                                >
                                    <div className="flex flex-col items-center text-center space-y-3">
                                        <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold text-lg shadow-lg animate-glow">
                                            {flow.step}
                                        </div>

                                        <div className="space-y-1">
                                            <h4 className="font-medium text-sm">
                                                {flow.title}
                                            </h4>
                                            <p className="text-xs text-muted-foreground leading-tight">
                                                {flow.description}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Connection line */}
                                    {index < externalFlow.length - 1 && (
                                        <div className="hidden lg:block absolute top-6 left-full w-4 h-0.5 bg-gradient-to-r from-primary to-primary-glow transform -translate-y-1/2" />
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </Card>
            </motion.section>

            {/* Technical Stack */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="space-y-6"
            >
                <h2 className="text-2xl font-semibold">Stack Tecnológico</h2>

                <div className="grid md:grid-cols-2 gap-6">
                    <Card className="glass-card">
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <Database className="w-5 h-5 text-primary" />
                                Backend & Dados
                            </h3>

                            <div className="space-y-3">
                                <div className="p-3 rounded-lg bg-muted/30">
                                    <div className="font-medium text-sm">
                                        Supabase PostgreSQL
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        Banco principal com triggers, RLS,
                                        extensões, índices e views
                                    </div>
                                </div>

                                <div className="p-3 rounded-lg bg-muted/30">
                                    <div className="font-medium text-sm">
                                        Python + FastAPI
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        APIs robustas e processamento de dados
                                    </div>
                                </div>

                                <div className="p-3 rounded-lg bg-muted/30">
                                    <div className="font-medium text-sm">
                                        Vector Embeddings
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        Busca semântica e similarity matching
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card className="glass-card">
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <Cpu className="w-5 h-5 text-primary" />
                                IA & Automação
                            </h3>

                            <div className="space-y-3">
                                <div className="p-3 rounded-lg bg-muted/30">
                                    <div className="font-medium text-sm">
                                        Agno Framework
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        Framework proprietário para agentes IA
                                    </div>
                                </div>

                                <div className="p-3 rounded-lg bg-muted/30">
                                    <div className="font-medium text-sm">
                                        N8N Workflows
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        Orquestração visual de processos e
                                        documentos
                                    </div>
                                </div>

                                <div className="p-3 rounded-lg bg-muted/30">
                                    <div className="font-medium text-sm">
                                        LLM Integration
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        Modelos de linguagem para conversação
                                        (OpenAI)
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </motion.section>
        </div>
    );
}
