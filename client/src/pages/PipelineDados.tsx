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
    Calendar,
    Database,
    FileText,
    GitBranch,
    Workflow,
    Zap
} from "lucide-react";

const dataFlowStages = [
    {
        id: 1,
        title: "Ingestão",
        description: "Coleta automatizada de dados de múltiplas fontes",
        icon: Database,
        details: [
            "APIs REST de sistemas externos",
            "SQL server DW",
            "Upload manual via formulários",
            "Integração N8N para dados recorrentes"
        ],
        technologies: ["Supabase Functions", "PostgreSQL", "N8N"]
    },
    {
        id: 2,
        title: "Tratamento",
        description: "Verificação de integridade e qualidade dos dados",
        icon: GitBranch,
        details: [
            "Schema validation com Zod",
            "Padronização de registros",
            "Normalização de formatos e dados",
            "Logging de erros e inconsistências"
        ],
        technologies: ["Python", "Zod", "PostgreSQL Triggers"]
    },
    {
        id: 3,
        title: "Processamento",
        description: "Transformação e enriquecimento dos dados",
        icon: Zap,
        details: [
            "Limpeza e formatação",
            "Geração de embeddings vetoriais",
            "Cálculos e agregações",
            "Classificação automática"
        ],
        technologies: ["Python FastAPI", "OpenAI Embeddings", "pgvector"]
    },
    {
        id: 4,
        title: "Armazenamento",
        description: "Persistência estruturada e otimizada",
        icon: FileText,
        details: [
            "Tabelas relacionais PostgreSQL",
            "Índices para busca vetorial",
            "Particionamento temporal",
            "Backup automatizado"
        ],
        technologies: ["PostgreSQL", "pgvector", "RLS Policies"]
    },
    {
        id: 5,
        title: "Análise",
        description: "Geração de insights e métricas",
        icon: Calendar,
        details: [
            "Views materializadas",
            "Relatórios semanais automatizados",
            "Dashboards em tempo real",
            "Alertas baseados em thresholds"
        ],
        technologies: ["PostgreSQL Views", "Cron Jobs", "Supabase Realtime"]
    },
    {
        id: 6,
        title: "Distribuição",
        description: "APIs e interfaces para consumo dos dados",
        icon: Workflow,
        details: [
            "REST APIs via Supabase",
            "RPC Functions customizadas",
            "Webhooks para notificações",
            "Chatbot de análises"
        ],
        technologies: ["Supabase API", "Agno", "Streamlit"]
    }
];

const codeExamples = {
    rpc: `-- Exemplo de RPC Function do match_* por similaridade
CREATE OR REPLACE FUNCTION match_proposals(
  query_embedding VECTOR(1536),
  match_count INT DEFAULT NULL,
  match_threshold FLOAT DEFAULT 0.0
)
RETURNS TABLE (
  id BIGINT,
  content TEXT,
  metadata JSONB,
  similarity FLOAT
)
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.content,
    p.metadata,
    1 - (p.embedding <=> query_embedding) AS similarity
  FROM thirdpartyproposals p
  WHERE (p.embedding <=> query_embedding) <= 1 - match_threshold
  ORDER BY p.embedding <=> query_embedding
  LIMIT COALESCE(match_count, 100);
END;
$$;`,

    embedding: `# Geração de embeddings para busca semântica
import openai
from supabase import create_client

def generate_embeddings(text_content):
    """Gera embeddings vetoriais para busca semântica"""
    response = openai.Embedding.create(
        input=text_content,
        model="text-embedding-ada-002"
    )
    
    embedding = response['data'][0]['embedding']
    
    # Armazena no PostgreSQL com pgvector
    supabase.table('documents').insert({
        'content': text_content,
        'embedding': embedding,
        'created_at': 'now()'
    }).execute()
    
    return embedding`,

    automation: `// Workflow N8N para processamento automatizado
{
  "name": "Data Processing Pipeline",
  "nodes": [
    {
      "name": "Schedule Trigger",
      "type": "n8n-nodes-base.cron",
      "parameters": {
        "triggerTimes": {
          "hour": 2,
          "minute": 0
        }
      }
    },
    {
      "name": "Fetch New Data",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "https://api.example.com/data",
        "authentication": "headerAuth"
      }
    },
    {
      "name": "Process with Python",
      "type": "n8n-nodes-base.code",
      "parameters": {
        "mode": "runOnceForAllItems",
        "jsCode": "// Processamento customizado dos dados"
      }
    }
  ]
}`
};

export default function PipelineDados() {
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
                        <BreadcrumbPage>Pipeline de Dados</BreadcrumbPage>
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
                    Pipeline de Dados
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl">
                    Arquitetura de processamento de dados do CralLabs: da
                    ingestão à entrega, com foco em qualidade, performance e
                    escalabilidade.
                </p>
            </motion.div>

            {/* Pipeline Flow */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="space-y-6"
            >
                <h2 className="text-2xl font-semibold">
                    Fluxo de Processamento
                </h2>

                <div className="grid gap-6">
                    {dataFlowStages.map((stage, index) => (
                        <motion.div
                            key={stage.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                                delay: 0.3 + index * 0.1,
                                duration: 0.5
                            }}
                        >
                            <Card className="glass-card hover:shadow-xl transition-all duration-300 group">
                                <div className="flex items-start gap-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold text-lg shadow-lg">
                                            {stage.id}
                                        </div>
                                        <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                                            <stage.icon className="w-6 h-6 text-primary" />
                                        </div>
                                    </div>

                                    <div className="flex-1 space-y-4">
                                        <div>
                                            <h3 className="text-xl font-semibold group-hover:text-primary transition-colors duration-300 mb-2">
                                                {stage.title}
                                            </h3>
                                            <p className="text-muted-foreground">
                                                {stage.description}
                                            </p>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <h4 className="font-medium text-sm mb-2">
                                                    Processos
                                                </h4>
                                                <ul className="text-sm text-muted-foreground space-y-1">
                                                    {stage.details.map(
                                                        (detail, idx) => (
                                                            <li
                                                                key={idx}
                                                                className="flex items-center gap-2"
                                                            >
                                                                <span className="w-1 h-1 bg-primary rounded-full"></span>
                                                                {detail}
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
                                                    {stage.technologies.map(
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
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            {/* Code Examples */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="space-y-6"
            >
                <h2 className="text-2xl font-semibold">
                    Exemplos de Implementação
                </h2>

                <div className="grid lg:grid-cols-2 gap-6">
                    <Card className="glass-card">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Database className="w-5 h-5 text-primary" />
                                <h3 className="text-lg font-semibold">
                                    RPC Function PostgreSQL
                                </h3>
                            </div>
                            <pre className="text-xs bg-muted/30 p-4 rounded-lg overflow-x-auto">
                                <code>{codeExamples.rpc}</code>
                            </pre>
                        </div>
                    </Card>

                    <Card className="glass-card">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Zap className="w-5 h-5 text-primary" />
                                <h3 className="text-lg font-semibold">
                                    Geração de Embeddings
                                </h3>
                            </div>
                            <pre className="text-xs bg-muted/30 p-4 rounded-lg overflow-x-auto">
                                <code>{codeExamples.embedding}</code>
                            </pre>
                        </div>
                    </Card>
                </div>

                <Card className="glass-card">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Workflow className="w-5 h-5 text-primary" />
                            <h3 className="text-lg font-semibold">
                                Workflow N8N
                            </h3>
                        </div>
                        <pre className="text-xs bg-muted/30 p-4 rounded-lg overflow-x-auto">
                            <code>{codeExamples.automation}</code>
                        </pre>
                    </div>
                </Card>
            </motion.section>

            {/* Performance Metrics */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.6 }}
                className="space-y-6"
            >
                <h2 className="text-2xl font-semibold">
                    Métricas de Performance
                </h2>

                <div className="grid md:grid-cols-3 gap-6">
                    <Card className="glass-card text-center">
                        <div className="space-y-2">
                            <div className="text-2xl font-bold text-primary">
                                +85.4k
                            </div>
                            <div className="text-sm text-muted-foreground">
                                Total de dados processados
                            </div>
                        </div>
                    </Card>

                    <Card className="glass-card text-center">
                        <div className="space-y-2">
                            <div className="text-2xl font-bold text-primary">
                                {" "}
                                {`<5min`}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                Tempo médio de processamento
                            </div>
                        </div>
                    </Card>

                    <Card className="glass-card text-center">
                        <div className="space-y-2">
                            <div className="text-2xl font-bold text-primary">
                                ~70%
                            </div>
                            <div className="text-sm text-muted-foreground">
                                Taxa de acurácia
                            </div>
                        </div>
                    </Card>
                </div>
            </motion.section>
        </div>
    );
}
