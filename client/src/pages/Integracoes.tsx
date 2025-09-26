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
import { Code, Database, Globe, Puzzle, Settings, Webhook } from "lucide-react";

const integrations = [
    {
        category: "APIs Externas",
        icon: Globe,
        description:
            "Conexões com serviços de terceiros para enriquecimento de dados",
        items: [
            {
                name: "OpenAI API",
                description:
                    "Processamento de linguagem natural e geração de embeddings",
                type: "IA/ML",
                method: "REST API",
                frequency: "Tempo real"
            },
            {
                name: "Google Sheets API",
                description: "Sincronização de dados de planilhas corporativas",
                type: "Dados",
                method: "OAuth 2.0",
                frequency: "Diário"
            },
            {
                name: "Senior Sistemas ERP",
                description:
                    "Integração com ERP da Senior para extração de dados internos e financeiros",
                type: "ERP",
                method: "REST API / SQL Connector",
                frequency: "Diário"
            }
        ]
    },
    {
        category: "Formulários Inteligentes",
        icon: Code,
        description:
            "Interfaces dinâmicas para coleta e processamento de dados",
        items: [
            {
                name: "Formulário de Concorrentes",
                description: "Análise automatizada de dados de competidores",
                type: "Análise",
                method: "Zod Validation",
                frequency: "Semanal"
            },
            {
                name: "Upload de Documentos",
                description:
                    "Processamento automático de PDFs e extração de dados",
                type: "Documentos",
                method: "Supabase Storage",
                frequency: "Sob demanda"
            }
        ]
    },
    {
        category: "Workflows N8N",
        icon: Settings,
        description: "Automações visuais para processos complexos",
        items: [
            {
                name: "Processamento de Documentos PDF",
                description:
                    "Extração automática de informações relevantes a partir de PDFs",
                type: "Documentos",
                method: "OCR + Parsing",
                frequency: "Sob demanda"
            },
            {
                name: "Registros dos Concorrentes",
                description:
                    "Automação do tratamento e padronização de dados submetidos pelos concorrentes",
                type: "Concorrência",
                method: "N8N Pipelines",
                frequency: "Semanal"
            },

            {
                name: "Backup Automatizado",
                description:
                    "Rotina de backup de dados críticos para múltiplos destinos",
                type: "Infraestrutura",
                method: "Scheduled Jobs",
                frequency: "Diário"
            },
            {
                name: "Relatórios Semanais",
                description: "Geração e distribuição automática de relatórios",
                type: "Relatórios",
                method: "Cron Jobs",
                frequency: "Semanal"
            }
        ]
    }
];

const webhookExample = `// Exemplo de webhook para integração em tempo real
export async function handleWebhook(request: Request) {
  const payload = await request.json();
  
  // Validação de segurança
  const signature = request.headers.get('x-signature');
  if (!verifySignature(payload, signature)) {
    return new Response('Unauthorized', { status: 401 });
  }
  
  // Processamento baseado no tipo de evento
  switch (payload.event_type) {
    case 'user.created':
      await processNewUser(payload.data);
      break;
      
    case 'data.updated':
      await updateDataPipeline(payload.data);
      break;
      
    case 'alert.triggered':
      await sendNotification(payload.data);
      break;
      
    default:
      console.log('Evento não reconhecido:', payload.event_type);
  }
  
  return new Response('OK', { status: 200 });
}

// Processamento de novo usuário
async function processNewUser(userData: any) {
  const { data, error } = await supabase
    .from('users')
    .insert({
      external_id: userData.id,
      email: userData.email,
      metadata: userData.properties,
      created_at: new Date().toISOString()
    });
    
  if (!error) {
    // Dispara workflow de onboarding
    await triggerN8NWorkflow('user-onboarding', userData);
  }
}`;

const n8nWorkflow = `{
  "name": "Processamento de Formulário de Concorrente",
  "active": true,
  "nodes": [
    {
      "name": "Webhook Trigger",
      "type": "n8n-nodes-base.webhook",
      "parameters": {
        "httpMethod": "POST",
        "path": "competitor-form",
        "responseMode": "responseNode"
      }
    },
    {
      "name": "Validar Dados",
      "type": "n8n-nodes-base.code",
      "parameters": {
        "jsCode": "// Validação com Zod schema\\nconst schema = z.object({\\n  company_name: z.string().min(1),\\n  website: z.string().url(),\\n  category: z.string(),\\n  analysis_type: z.enum(['pricing', 'features', 'marketing'])\\n});\\n\\nconst validation = schema.safeParse($json.body);\\nif (!validation.success) {\\n  throw new Error('Dados inválidos');\\n}\\n\\nreturn [{ json: validation.data }];"
      }
    },
    {
      "name": "Analisar Website",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "https://api.example.com/analyze",
        "method": "POST",
        "body": {
          "website": "={{ $json.website }}",
          "type": "={{ $json.analysis_type }}"
        }
      }
    },
    {
      "name": "Salvar no Supabase",
      "type": "n8n-nodes-base.supabase",
      "parameters": {
        "operation": "insert",
        "table": "competitor_analysis",
        "data": {
          "company_name": "={{ $json.company_name }}",
          "analysis_data": "={{ $json.analysis_result }}",
          "processed_at": "={{ new Date().toISOString() }}"
        }
      }
    },
    {
      "name": "Notificar Equipe",
      "type": "n8n-nodes-base.slack",
      "parameters": {
        "channel": "#analytics",
        "text": "Nova análise de concorrente: {{ $json.company_name }}"
      }
    }
  ]
}`;

export default function Integracoes() {
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
                        <BreadcrumbPage>Integrações</BreadcrumbPage>
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
                    Integrações
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl">
                    Conectores e APIs que permitem ao CralLabs comunicar com
                    sistemas externos, automatizar processos e sincronizar dados
                    em tempo real.
                </p>
            </motion.div>

            {/* Integration Categories */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="space-y-8"
            >
                {integrations.map((category, categoryIndex) => (
                    <motion.div
                        key={category.category}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            delay: 0.3 + categoryIndex * 0.2,
                            duration: 0.6
                        }}
                        className="space-y-6"
                    >
                        <div className="flex items-center gap-3">
                            <category.icon className="w-6 h-6 text-primary" />
                            <div>
                                <h2 className="text-2xl font-semibold">
                                    {category.category}
                                </h2>
                                <p className="text-muted-foreground">
                                    {category.description}
                                </p>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {category.items.map((item, index) => (
                                <motion.div
                                    key={item.name}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{
                                        delay:
                                            0.4 +
                                            categoryIndex * 0.2 +
                                            index * 0.1,
                                        duration: 0.4
                                    }}
                                >
                                    <Card className="glass-card hover:shadow-xl transition-all duration-300 group h-full">
                                        <div className="space-y-4">
                                            <div className="flex items-start justify-between">
                                                <h3 className="text-lg font-semibold group-hover:text-primary transition-colors duration-300">
                                                    {item.name}
                                                </h3>
                                                <Badge
                                                    variant="secondary"
                                                    className="text-xs"
                                                >
                                                    {item.type}
                                                </Badge>
                                            </div>

                                            <p className="text-sm text-muted-foreground leading-relaxed">
                                                {item.description}
                                            </p>

                                            <div className="grid grid-cols-2 gap-4 text-xs">
                                                <div>
                                                    <span className="font-medium">
                                                        Método:
                                                    </span>
                                                    <div className="text-muted-foreground">
                                                        {item.method}
                                                    </div>
                                                </div>
                                                <div>
                                                    <span className="font-medium">
                                                        Frequência:
                                                    </span>
                                                    <div className="text-muted-foreground">
                                                        {item.frequency}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                ))}
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
                                <Webhook className="w-5 h-5 text-primary" />
                                <h3 className="text-lg font-semibold">
                                    Webhook Handler
                                </h3>
                            </div>
                            <pre className="text-xs bg-muted/30 p-4 rounded-lg overflow-x-auto">
                                <code>{webhookExample}</code>
                            </pre>
                        </div>
                    </Card>

                    <Card className="glass-card">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Settings className="w-5 h-5 text-primary" />
                                <h3 className="text-lg font-semibold">
                                    Workflow N8N
                                </h3>
                            </div>
                            <pre className="text-xs bg-muted/30 p-4 rounded-lg overflow-x-auto">
                                <code>{n8nWorkflow}</code>
                            </pre>
                        </div>
                    </Card>
                </div>
            </motion.section>

            {/* Security & Best Practices */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.6 }}
                className="space-y-6"
            >
                <h2 className="text-2xl font-semibold">
                    Segurança e Boas Práticas
                </h2>

                <div className="grid md:grid-cols-3 gap-6">
                    <Card className="glass-card">
                        <div className="space-y-3">
                            <div className="p-3 rounded-xl bg-primary/10 w-fit">
                                <Database className="w-5 h-5 text-primary" />
                            </div>
                            <h3 className="font-semibold">Autenticação</h3>
                            <p className="text-sm text-muted-foreground">
                                OAuth 2.0, API keys com rotação automática e
                                validação de signatures para webhooks.
                            </p>
                        </div>
                    </Card>

                    <Card className="glass-card">
                        <div className="space-y-3">
                            <div className="p-3 rounded-xl bg-primary/10 w-fit">
                                <Puzzle className="w-5 h-5 text-primary" />
                            </div>
                            <h3 className="font-semibold">Rate Limiting</h3>
                            <p className="text-sm text-muted-foreground">
                                Controle de taxa para evitar sobrecarga de APIs
                                externas e implementação de retry policies.
                            </p>
                        </div>
                    </Card>

                    <Card className="glass-card">
                        <div className="space-y-3">
                            <div className="p-3 rounded-xl bg-primary/10 w-fit">
                                <Settings className="w-5 h-5 text-primary" />
                            </div>
                            <h3 className="font-semibold">Monitoramento</h3>
                            <p className="text-sm text-muted-foreground">
                                Logs detalhados, alertas de falhas e dashboards
                                de performance para todas as integrações.
                            </p>
                        </div>
                    </Card>
                </div>
            </motion.section>
        </div>
    );
}
