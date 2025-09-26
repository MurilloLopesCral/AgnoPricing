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
import { Globe, Monitor, Shield } from "lucide-react";

const deploymentLayers = [
    {
        name: "Front-end & Back-end",
        provider: "Vercel",
        description:
            "Front-end React/Streamlit e APIs Python hospedados de forma unificada",
        icon: Globe,
        features: [
            "Deploy automático via Git",
            "Execução de Streamlit e APIs Python",
            "Integração direta com Supabase",
            "Sem hospedagem adicional"
        ],
        configuration: {
            buildCommand: "npm run build",
            outputDirectory: "dist",
            runtime: "Python 3.11 + Node 18.x",
            environmentVariables: [
                "SUPABASE_URL",
                "SUPABASE_ANON_KEY",
                "OPENAI_API_KEY"
            ]
        }
    }
];

const infrastructureCode = `# docker-compose.yml para ambiente de desenvolvimento
version: '3.8'

services:
  backend:
    build: .
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=\${DATABASE_URL}
      - OPENAI_API_KEY=\${OPENAI_API_KEY}
    depends_on:
      - postgres
      
  postgres:
    image: postgres:15
    environment:
      - POSTGRES_DB=crallabs
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  n8n:
    image: n8nio/n8n
    ports:
      - "5678:5678"
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=password
    volumes:
      - n8n_data:/home/node/.n8n

volumes:
  postgres_data:
  n8n_data:`;

const deploymentScript = `# Script de deploy automatizado
#!/bin/bash

# Build e deploy do frontend
echo "🚀 Deploying frontend to Vercel..."
vercel --prod

# Build e push da imagem Docker para Render
echo "🐳 Building and pushing Docker image..."
docker build -t crallabs-backend .
docker tag crallabs-backend registry.render.com/crallabs-backend
docker push registry.render.com/crallabs-backend

# Trigger deploy no Render
echo "☁️ Triggering Render deployment..."
curl -X POST "https://api.render.com/deploy/srv-xxx" \\
  -H "Authorization: Bearer \$RENDER_API_KEY"

# Backup de dados críticos
echo "💾 Creating backup..."
pg_dump \$DATABASE_URL | gzip > backup_\$(date +%Y%m%d).sql.gz

# Upload backup para Kinghost
echo "📤 Uploading backup..."
scp backup_\$(date +%Y%m%d).sql.gz user@kinghost:/backups/

# Verificar health checks
echo "🏥 Running health checks..."
curl -f https://api.crallabs.com/health || exit 1
curl -f https://app.crallabs.com || exit 1

echo "✅ Deployment completed successfully!"`;

const monitoringDashboard = [
    { metric: "Frontend Response Time", value: "< 200ms", status: "good" },
    { metric: "API Response Time", value: "< 500ms", status: "good" },
    { metric: "Database Transactions", value: "~100/dia", status: "good" },
    { metric: "Error Rate", value: "< 0.1%", status: "good" },
    { metric: "Workflow Success Rate", value: "99.2%", status: "good" },
    { metric: "Uptime (30d)", value: "99.95%", status: "excellent" }
];

export default function Deployment() {
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
                        <BreadcrumbPage>Deployment</BreadcrumbPage>
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
                    Estratégia de Deployment
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl">
                    Infraestrutura distribuída e resiliente que garante alta
                    disponibilidade, performance otimizada e escalabilidade
                    automática para o ecossistema CralLabs.
                </p>
            </motion.div>

            {/* Deployment Layers */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="space-y-6"
            >
                <h2 className="text-2xl font-semibold">
                    Camadas de Infraestrutura
                </h2>

                <div className="grid lg:grid-cols-2 gap-6">
                    {deploymentLayers.map((layer, index) => (
                        <motion.div
                            key={layer.name}
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
                                                <layer.icon className="w-6 h-6 text-primary" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold group-hover:text-primary transition-colors duration-300">
                                                    {layer.name}
                                                </h3>
                                                <Badge
                                                    variant="secondary"
                                                    className="text-xs"
                                                >
                                                    {layer.provider}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {layer.description}
                                    </p>

                                    <div className="space-y-3">
                                        <div>
                                            <h4 className="font-medium text-sm mb-2">
                                                Recursos
                                            </h4>
                                            <ul className="text-xs text-muted-foreground space-y-1">
                                                {layer.features.map(
                                                    (feature, idx) => (
                                                        <li
                                                            key={idx}
                                                            className="flex items-center gap-2"
                                                        >
                                                            <span className="w-1 h-1 bg-primary rounded-full"></span>
                                                            {feature}
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        </div>

                                        <div>
                                            <h4 className="font-medium text-sm mb-2">
                                                Configuração
                                            </h4>
                                            <div className="text-xs text-muted-foreground space-y-1">
                                                {Object.entries(
                                                    layer.configuration
                                                ).map(([key, value]) => (
                                                    <div
                                                        key={key}
                                                        className="flex justify-between"
                                                    >
                                                        <span className="capitalize">
                                                            {key
                                                                .replace(
                                                                    /([A-Z])/g,
                                                                    " $1"
                                                                )
                                                                .trim()}
                                                            :
                                                        </span>
                                                        <span className="font-mono">
                                                            {Array.isArray(
                                                                value
                                                            )
                                                                ? value.join(
                                                                      ", "
                                                                  )
                                                                : value}
                                                        </span>
                                                    </div>
                                                ))}
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
            {/* <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="space-y-6"
            >
                <h2 className="text-2xl font-semibold">
                    Configuração e Automação
                </h2>

                <div className="grid lg:grid-cols-2 gap-6">
                    <Card className="glass-card">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Cloud className="w-5 h-5 text-primary" />
                                <h3 className="text-lg font-semibold">
                                    Docker Compose
                                </h3>
                            </div>
                            <pre className="text-xs bg-muted/30 p-4 rounded-lg overflow-x-auto">
                                <code>{infrastructureCode}</code>
                            </pre>
                        </div>
                    </Card>

                    <Card className="glass-card">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Rocket className="w-5 h-5 text-primary" />
                                <h3 className="text-lg font-semibold">
                                    Script de Deploy
                                </h3>
                            </div>
                            <pre className="text-xs bg-muted/30 p-4 rounded-lg overflow-x-auto">
                                <code>{deploymentScript}</code>
                            </pre>
                        </div>
                    </Card>
                </div>
            </motion.section> */}

            {/* Monitoring Dashboard */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="space-y-6"
            >
                <h2 className="text-2xl font-semibold">
                    Monitoramento em Tempo Real
                </h2>

                <div className="grid md:grid-cols-3 gap-6">
                    {monitoringDashboard.map((metric, index) => (
                        <motion.div
                            key={metric.metric}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                                delay: 0.9 + index * 0.1,
                                duration: 0.4
                            }}
                        >
                            <Card className="glass-card text-center hover:shadow-xl transition-all duration-300 group">
                                <div className="space-y-2">
                                    <div className="text-lg font-bold text-primary group-hover:scale-105 transition-transform duration-300">
                                        {metric.value}
                                    </div>
                                    <div className="text-sm text-muted-foreground font-medium">
                                        {metric.metric}
                                    </div>
                                    <Badge
                                        variant={
                                            metric.status === "excellent"
                                                ? "default"
                                                : "secondary"
                                        }
                                        className="text-xs"
                                    >
                                        {metric.status === "excellent"
                                            ? "Excelente"
                                            : "Bom"}
                                    </Badge>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            {/* Security & Backup */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.6 }}
                className="space-y-6"
            >
                <h2 className="text-2xl font-semibold">Segurança e Backup</h2>

                <div className="grid md:grid-cols-3 gap-6">
                    <Card className="glass-card">
                        <div className="space-y-3">
                            <div className="p-3 rounded-xl bg-primary/10 w-fit">
                                <Shield className="w-5 h-5 text-primary" />
                            </div>
                            <h3 className="font-semibold">SSL/TLS</h3>
                            <p className="text-sm text-muted-foreground">
                                Certificados automáticos via Let's Encrypt com
                                renovação automática e redirect HTTPS.
                            </p>
                        </div>
                    </Card>

                    <Card className="glass-card">
                        <div className="space-y-3">
                            <div className="p-3 rounded-xl bg-primary/10 w-fit">
                                <Monitor className="w-5 h-5 text-primary" />
                            </div>
                            <h3 className="font-semibold">
                                Backup Automatizado
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Backups diários do banco de dados com retenção
                                de 30 dias e teste de recuperação semanal.
                            </p>
                        </div>
                    </Card>
                </div>
            </motion.section>
        </div>
    );
}
