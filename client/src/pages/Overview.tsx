import { ArrowRight, Database, Bot, Puzzle, Rocket, Building2, GitBranch, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-ai-automation.jpg";

const projectInfo = {
  title: "CralLabs",
  subtitle: "Ecossistema de IA + Data + Automação",
  description: "Documentação técnica do projeto que integra inteligência artificial, processamento de dados e automação para criar um sistema robusto e escalável.",
  context: "Projeto desenvolvido para demonstrar a integração de múltiplas tecnologias em um ecossistema coeso, focando em automação inteligente e processamento de dados em tempo real.",
  technologies: ["React", "Supabase", "Python", "N8N", "PostgreSQL", "FastAPI"]
};

const features = [
  {
    icon: Building2,
    title: "Arquitetura do Sistema",
    description: "Stack tecnológico com Supabase, Python, N8N e infraestrutura de deployment. Explore as decisões técnicas e padrões de arquitetura.",
    link: "/arquitetura"
  },
  {
    icon: Database,
    title: "Pipeline de Dados",
    description: "Fluxos de ingestão, processamento e análise. Implementação de embeddings, RPC SQL e relatórios automatizados.",
    link: "/pipeline"
  },
  {
    icon: Bot,
    title: "Agentes de IA",
    description: "Sistema de agentes inteligentes com processamento de linguagem natural e automação de processos complexos.",
    link: "/agentes"
  },
  {
    icon: Puzzle,
    title: "Integrações",
    description: "APIs externas, formulários dinâmicos e workflows N8N. Como diferentes sistemas se comunicam no ecossistema.",
    link: "/integracoes"
  },
  {
    icon: Rocket,
    title: "Deployment",
    description: "Estratégias de deploy com Vercel, Render e Cloudflare. Configuração de infraestrutura e monitoramento.",
    link: "/deployment"
  },
  {
    icon: MapPin,
    title: "Roadmap",
    description: "Evolução planejada do projeto, próximas funcionalidades e melhorias técnicas identificadas.",
    link: "/roadmap"
  }
];

const projectStats = [
  { value: "6", label: "Tecnologias Principais", description: "Stack integrado" },
  { value: "3", label: "Camadas de Deploy", description: "Frontend, Backend, Automação" },
  { value: "PostgreSQL", label: "Banco de Dados", description: "Com extensões e triggers" },
  { value: "REST + RPC", label: "APIs", description: "Supabase + Python FastAPI" }
];

export default function Overview() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <motion.section 
        className="relative overflow-hidden rounded-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="CralLabs AI Ecosystem"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 gradient-hero" />
        </div>
        
        <div className="relative glass-card border-0 py-20 px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Badge className="mb-6 bg-primary/20 text-primary border-primary/30">
              <Building2 className="w-3 h-3 mr-1" />
              Documentação Técnica
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent">
              {projectInfo.title}
            </h1>
            
            <h2 className="text-2xl md:text-4xl font-semibold mb-8 text-foreground">
              {projectInfo.subtitle}
            </h2>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-6 max-w-3xl mx-auto leading-relaxed">
              {projectInfo.description}
            </p>
            
            <p className="text-base text-muted-foreground/80 mb-10 max-w-3xl mx-auto leading-relaxed">
              {projectInfo.context}
            </p>
            
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {projectInfo.technologies.map((tech) => (
                <Badge key={tech} variant="outline" className="border-primary/30 text-primary/80">
                  {tech}
                </Badge>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/arquitetura">
                <Button size="lg" className="gradient-primary text-primary-foreground font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                  <Building2 className="w-5 h-5 mr-2" />
                  Ver Arquitetura
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              
              <Link to="/pipeline">
                <Button variant="outline" size="lg" className="glass border-primary/30 hover:bg-primary/10 transition-all duration-300">
                  <Database className="w-5 h-5 mr-2" />
                  Pipeline de Dados
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Project Stats Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {projectStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
            >
              <Card className="glass-card text-center hover:shadow-xl transition-all duration-300 group">
                <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground font-medium">
                  {stat.label}
                </div>
                <div className="text-xs text-muted-foreground/70 mt-1">
                  {stat.description}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="space-y-8"
      >
        <div className="text-center space-y-4">
          <h3 className="text-3xl md:text-4xl font-bold">
            Componentes do{" "}
            <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Ecossistema
            </span>
          </h3>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore cada parte da arquitetura e entenda como as tecnologias se integram para formar o sistema completo.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
            >
              <Link to={feature.link}>
                <Card className="glass-card hover:shadow-xl transition-all duration-300 group cursor-pointer border-border/50 hover:border-primary/30 h-full">
                  <div className="space-y-4">
                    <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300 w-fit">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-lg font-semibold group-hover:text-primary transition-colors duration-300">
                        {feature.title}
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                      
                      <div className="flex items-center text-primary text-sm font-medium group-hover:gap-2 transition-all duration-300 pt-2">
                        Explorar
                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Timeline Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="text-center"
      >
        <Card className="glass-card border-primary/20">
          <div className="py-12 px-8">
            <h3 className="text-2xl font-bold mb-4">
              Linha do Tempo do Projeto
            </h3>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Principais marcos no desenvolvimento do ecossistema CralLabs e decisões arquiteturais importantes.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="space-y-2">
                <Badge variant="outline" className="mb-2">Fase 1</Badge>
                <h4 className="font-semibold">Fundação</h4>
                <p className="text-sm text-muted-foreground">
                  Definição da arquitetura base com Supabase e estruturação do banco de dados PostgreSQL.
                </p>
              </div>
              
              <div className="space-y-2">
                <Badge variant="outline" className="mb-2">Fase 2</Badge>
                <h4 className="font-semibold">Integração</h4>
                <p className="text-sm text-muted-foreground">
                  Implementação dos agentes IA, pipeline de dados e workflows N8N para automação.
                </p>
              </div>
              
              <div className="space-y-2">
                <Badge variant="outline" className="mb-2">Fase 3</Badge>
                <h4 className="font-semibold">Deploy</h4>
                <p className="text-sm text-muted-foreground">
                  Configuração da infraestrutura de produção e otimização de performance.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Link to="/arquitetura">
                <Button size="lg" variant="default" className="font-semibold">
                  <Building2 className="w-5 h-5 mr-2" />
                  Explorar Arquitetura
                </Button>
              </Link>
              
              <Link to="/roadmap">
                <Button size="lg" variant="outline">
                  <MapPin className="w-5 h-5 mr-2" />
                  Ver Roadmap
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </motion.section>
    </div>
  );
}