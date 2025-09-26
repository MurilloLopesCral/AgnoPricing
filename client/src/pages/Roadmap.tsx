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
import {
    AlertCircle,
    CheckCircle,
    Clock,
    Lightbulb,
    MapPin,
    Target
} from "lucide-react";

const roadmapItems = [
    {
        phase: "Q1 2025",
        status: "completed",
        title: "Levantamento de requisitos",
        description:
            "Estabelecimento das ferramentas e necessidades para o projeto",
        items: [
            { name: "Principais ferramentas de mercado", completed: true },
            { name: "Fluxograma de entregas", completed: true },
            {
                name: "Análise dos dados para aprendizado dos agentes",
                completed: true
            },
            { name: "Estrutura da regra de negócios", completed: true }
        ],
        learnings:
            "Para esta etapa foram necessárias várias reuniões até que ficasse decidido como seria o andamento do projeto, estabelecendo os prazos e metas para entrega."
    },
    {
        phase: "Q2 2025",
        status: "completed",
        title: "Fundação do Ecossistema",
        description:
            "Estabelecimento da arquitetura base e componentes principais",
        items: [
            { name: "Setup Supabase + PostgreSQL", completed: true },
            { name: "Estrutura base de dados", completed: true },
            { name: "Desenvolvimento da ingestão de dados", completed: true },
            { name: "Ingestão inicial via N8N", completed: true }
        ],
        learnings:
            "A escolha do Supabase se mostrou acertada para prototipagem rápida, especialmente com RLS policies e real-time subscriptions."
    },
    {
        phase: "Q3 2025",
        status: "completed",
        title: "Pipeline de Dados e IA",
        description:
            "Implementação do processamento de dados e primeiros agentes IA",
        items: [
            {
                name: "Pipeline de ingestão de dados com embeddings",
                completed: true
            },
            { name: "Interface feita via React e NestJS", completed: true },
            { name: "Chatbot básico com OpenAI", completed: true },
            { name: "Workflows N8N iniciais", completed: true }
        ],
        learnings:
            "O uso de embeddings vetoriais com pgvector permitiu busca semântica eficiente, mas requer otimização de índices para escala."
    },
    {
        phase: "Q4 2025",
        status: "completed",
        title: "Reajuste de banco de dados",
        description:
            "Análise e reestruturação do banco de dados de informações internas",
        items: [
            {
                name: "Funções de text para jsonb e enriquecimento do metadata",
                completed: true
            },
            { name: "PSQL para execução de funções", completed: true },
            { name: "Re-indexação de colunas metadata", completed: true },
            { name: "Nomeclatura das colunas", completed: true }
        ],
        learnings:
            "Durante o desenvolvimento do projeto começamos ver que a tabela principal de dados havia sido inserida de forma errada em no Supabase, dessa forma pensamos que ao invés de refazer tudo seria melhor iniciar um tratamento de dados sem custo adicional para análise."
    },
    {
        phase: "Q5 2025",
        status: "in-progress",
        title: "Integrações e Automação",
        description: "Expansão das conectividades e automação de processos",
        items: [
            { name: "Leitura do SQL Server DW", completed: true },
            { name: "Weekly Report Agent", completed: true },
            {
                name: "Otimização de consultas do Pricing Chatbot",
                completed: false
            },
            {
                name: "Melhorias no formulário de ingestão dos dados externos",
                completed: false
            }
        ],
        learnings:
            "Estamos atuando em melhorias para resposta do chatbot e desenvolvendo a V1 do agente de weekly report"
    },
    {
        phase: "Q6 2025",
        status: "in-progress",
        title: "Otimização e Escala",
        description: "Performance, segurança e preparação para produção",
        items: [
            { name: "Otimização de performance", completed: false },
            { name: "Auditoria de segurança", completed: false },
            { name: "Benchmark de performance", completed: false },
            { name: "Documentação completa", completed: true }
        ],
        focus: "Foco em estabilidade e performance para ambientes de produção"
    }
];

const futureFeatures = [
    {
        category: "Inteligência Artificial",
        icon: Lightbulb,
        priority: "Alta",
        features: [
            {
                name: "Multi-agent orchestration",
                description:
                    "Sistema avançado de coordenação entre múltiplos agentes IA",
                complexity: "Alta",
                timeline: "Q1 2025"
            },
            {
                name: "Custom model fine-tuning",
                description:
                    "Treinamento de modelos específicos para domínios de negócio",
                complexity: "Muito Alta",
                timeline: "Q2 2025"
            },
            {
                name: "Financial agent",
                description:
                    "Agente de finanças para poscionamento contábil e financeiro da empresa",
                complexity: "Média",
                timeline: "Q6 2025"
            }
        ]
    },
    {
        category: "Dados e Analytics",
        icon: Target,
        priority: "Média",
        features: [
            {
                name: "Spiff BI real-time insights",
                description:
                    "Adicionar ao Spiff insights em tempo real do posicionamento comercial",
                complexity: "Média",
                timeline: "Q6 2024"
            },
            {
                name: "Predictive analytics",
                description: "Modelos preditivos baseados em dados históricos",
                complexity: "Alta",
                timeline: "Q3 2025"
            },
            {
                name: "Data versioning",
                description:
                    "Controle de versão para datasets e transformações",
                complexity: "Média",
                timeline: "Q1 2025"
            }
        ]
    },
    {
        category: "Infraestrutura",
        icon: MapPin,
        priority: "Alta",
        features: [
            {
                name: "Generative Agent",
                description:
                    "Implementação dos agentes que possuem dados em tempo real",
                complexity: "Alta",
                timeline: "Q5 2025"
            },
            {
                name: "Advanced monitoring",
                description: "APM completo com alertas inteligentes",
                complexity: "Média",
                timeline: "Q6 2024"
            },
            {
                name: "Auto-scaling optimization",
                description: "Otimização automática baseada em padrões de uso",
                complexity: "Alta",
                timeline: "Q2 2025"
            }
        ]
    }
];

const technicalDebt = [
    {
        area: "Performance",
        priority: "Alta",
        description: "Otimização de queries PostgreSQL e cache",
        effort: "2-3 sprints",
        impact: "Redução de 80% no tempo de resposta"
    },
    {
        area: "Testing",
        priority: "Alta",
        description: "Cobertura de testes unitários e integração",
        effort: "3-4 sprints",
        impact: "Redução de bugs em produção"
    },
    {
        area: "Documentation",
        priority: "Média",
        description: "Documentação de APIs e arquitetura",
        effort: "1-2 sprints",
        impact: "Facilita onboarding e manutenção"
    },
    {
        area: "Security",
        priority: "Alta",
        description: "Auditoria completa e implementação de best practices",
        effort: "2-3 sprints",
        impact: "Compliance e confiança do usuário"
    }
];

export default function Roadmap() {
    const getStatusIcon = (status: string) => {
        switch (status) {
            case "completed":
                return CheckCircle;
            case "in-progress":
                return Clock;
            case "planned":
                return AlertCircle;
            default:
                return Clock;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "completed":
                return "text-green-500";
            case "in-progress":
                return "text-yellow-500";
            case "planned":
                return "text-blue-500";
            default:
                return "text-gray-500";
        }
    };

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
                        <BreadcrumbPage>Roadmap</BreadcrumbPage>
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
                    Roadmap do Projeto
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl">
                    Evolução planejada do CralLabs: marcos alcançados,
                    desenvolvimento atual e visão de futuro para o ecossistema
                    de IA + Data + Automação.
                </p>
            </motion.div>

            {/* Timeline */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="space-y-6"
            >
                <h2 className="text-2xl font-semibold">Linha do Tempo</h2>

                <div className="space-y-8">
                    {roadmapItems.map((item, index) => {
                        const StatusIcon = getStatusIcon(item.status);
                        return (
                            <motion.div
                                key={item.phase}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{
                                    delay: 0.3 + index * 0.1,
                                    duration: 0.5
                                }}
                            >
                                <Card className="glass-card hover:shadow-xl transition-all duration-300 group">
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-4">
                                            <div
                                                className={`p-2 rounded-lg bg-primary/10 ${getStatusColor(
                                                    item.status
                                                )}`}
                                            >
                                                <StatusIcon className="w-5 h-5" />
                                            </div>

                                            <div className="flex-1 space-y-3">
                                                <div className="flex items-center gap-3">
                                                    <h3 className="text-xl font-semibold group-hover:text-primary transition-colors duration-300">
                                                        {item.title}
                                                    </h3>
                                                    <Badge
                                                        variant="outline"
                                                        className="text-xs"
                                                    >
                                                        {item.phase}
                                                    </Badge>
                                                    <Badge
                                                        variant={
                                                            item.status ===
                                                            "completed"
                                                                ? "default"
                                                                : "secondary"
                                                        }
                                                        className="text-xs"
                                                    >
                                                        {item.status ===
                                                        "completed"
                                                            ? "Concluído"
                                                            : item.status ===
                                                              "in-progress"
                                                            ? "Em Progresso"
                                                            : "Planejado"}
                                                    </Badge>
                                                </div>

                                                <p className="text-muted-foreground">
                                                    {item.description}
                                                </p>

                                                <div className="grid md:grid-cols-2 gap-4">
                                                    <div>
                                                        <h4 className="font-medium text-sm mb-2">
                                                            Entregas
                                                        </h4>
                                                        <ul className="text-sm space-y-1">
                                                            {item.items.map(
                                                                (
                                                                    deliverable,
                                                                    idx
                                                                ) => (
                                                                    <li
                                                                        key={
                                                                            idx
                                                                        }
                                                                        className="flex items-center gap-2"
                                                                    >
                                                                        {deliverable.completed ? (
                                                                            <CheckCircle className="w-3 h-3 text-green-500" />
                                                                        ) : (
                                                                            <Clock className="w-3 h-3 text-muted-foreground" />
                                                                        )}
                                                                        <span
                                                                            className={
                                                                                deliverable.completed
                                                                                    ? "line-through text-muted-foreground"
                                                                                    : ""
                                                                            }
                                                                        >
                                                                            {
                                                                                deliverable.name
                                                                            }
                                                                        </span>
                                                                    </li>
                                                                )
                                                            )}
                                                        </ul>
                                                    </div>

                                                    {(item.learnings ||
                                                        item.focus) && (
                                                        <div>
                                                            <h4 className="font-medium text-sm mb-2">
                                                                {item.learnings
                                                                    ? "Aprendizados"
                                                                    : "Foco"}
                                                            </h4>
                                                            <p className="text-xs text-muted-foreground leading-relaxed">
                                                                {item.learnings ||
                                                                    item.focus}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>
            </motion.section>

            {/* Future Features */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="space-y-6"
            >
                <h2 className="text-2xl font-semibold">
                    Funcionalidades Futuras
                </h2>

                <div className="space-y-8">
                    {futureFeatures.map((category, categoryIndex) => (
                        <motion.div
                            key={category.category}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                delay: 0.7 + categoryIndex * 0.2,
                                duration: 0.6
                            }}
                            className="space-y-4"
                        >
                            <div className="flex items-center gap-3">
                                <category.icon className="w-5 h-5 text-primary" />
                                <h3 className="text-xl font-semibold">
                                    {category.category}
                                </h3>
                                <Badge variant="outline" className="text-xs">
                                    Prioridade {category.priority}
                                </Badge>
                            </div>

                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {category.features.map((feature, index) => (
                                    <motion.div
                                        key={feature.name}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{
                                            delay:
                                                0.8 +
                                                categoryIndex * 0.2 +
                                                index * 0.1,
                                            duration: 0.4
                                        }}
                                    >
                                        <Card className="glass-card hover:shadow-lg transition-all duration-300 h-full">
                                            <div className="space-y-3">
                                                <div>
                                                    <h4 className="font-semibold text-sm">
                                                        {feature.name}
                                                    </h4>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        {feature.description}
                                                    </p>
                                                </div>

                                                <div className="flex justify-between items-center text-xs">
                                                    <Badge
                                                        variant="outline"
                                                        className={
                                                            feature.complexity ===
                                                                "Alta" ||
                                                            feature.complexity ===
                                                                "Muito Alta"
                                                                ? "border-orange-300 text-orange-600"
                                                                : "border-green-300 text-green-600"
                                                        }
                                                    >
                                                        {feature.complexity}
                                                    </Badge>
                                                    <span className="text-muted-foreground">
                                                        {feature.timeline}
                                                    </span>
                                                </div>
                                            </div>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            {/* Technical Debt */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.6 }}
                className="space-y-6"
            >
                <h2 className="text-2xl font-semibold">
                    Débito Técnico e Melhorias
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                    {technicalDebt.map((debt, index) => (
                        <motion.div
                            key={debt.area}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                                delay: 1.1 + index * 0.1,
                                duration: 0.4
                            }}
                        >
                            <Card className="glass-card hover:shadow-lg transition-all duration-300">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-semibold">
                                            {debt.area}
                                        </h3>
                                        <Badge
                                            variant={
                                                debt.priority === "Alta"
                                                    ? "destructive"
                                                    : "secondary"
                                            }
                                            className="text-xs"
                                        >
                                            {debt.priority}
                                        </Badge>
                                    </div>

                                    <p className="text-sm text-muted-foreground">
                                        {debt.description}
                                    </p>

                                    <div className="grid grid-cols-2 gap-4 text-xs">
                                        <div>
                                            <span className="font-medium">
                                                Esforço:
                                            </span>
                                            <div className="text-muted-foreground">
                                                {debt.effort}
                                            </div>
                                        </div>
                                        <div>
                                            <span className="font-medium">
                                                Impacto:
                                            </span>
                                            <div className="text-muted-foreground">
                                                {debt.impact}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </motion.section>
        </div>
    );
}
