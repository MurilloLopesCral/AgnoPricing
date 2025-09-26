import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar
} from "@/components/ui/sidebar";
import {
    Bot,
    Building2,
    ChevronRight,
    Database,
    Home,
    MapPin,
    Puzzle,
    Rocket
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

const navigationItems = [
    {
        title: "Overview",
        url: "/",
        icon: Home,
        description: "Visão geral"
    },
    {
        title: "Arquitetura",
        url: "/arquitetura",
        icon: Building2,
        description: "Estrutura técnica do sistema"
    },
    {
        title: "Agentes de IA",
        url: "/agentes",
        icon: Bot,
        description: "Inteligência artificial personalizada"
    },
    {
        title: "Pipeline de Dados",
        url: "/pipeline",
        icon: Database,
        description: "Fluxo e processamento de dados"
    },
    {
        title: "Integrações",
        url: "/integracoes",
        icon: Puzzle,
        description: "APIs e conectores externos"
    },
    {
        title: "Deployment",
        url: "/deployment",
        icon: Rocket,
        description: "Deploy e infraestrutura"
    },
    {
        title: "Roadmap",
        url: "/roadmap",
        icon: MapPin,
        description: "Futuro e planejamento"
    }
];

export function AppSidebar() {
    const { state } = useSidebar();
    const location = useLocation();
    const currentPath = location.pathname;

    const isActive = (path: string) => {
        if (path === "/") {
            return currentPath === "/";
        }
        return currentPath.startsWith(path);
    };

    return (
        <Sidebar className="border-r border-border/50 glass" collapsible="icon">
            <SidebarContent className="gap-0">
                {/* Logo section */}
                <div className="p-6 border-b border-border/50">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center animate-glow">
                            <span className="text-lg font-bold text-primary-foreground">
                                CL
                            </span>
                        </div>
                        {state === "expanded" && (
                            <div className="animate-fade-in">
                                <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                                    CralLabs
                                </h2>
                                <p className="text-xs text-muted-foreground">
                                    AI + Data + Automação
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Navigation */}
                <SidebarGroup className="px-3 py-4">
                    <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                        Documentação
                    </SidebarGroupLabel>

                    <SidebarGroupContent>
                        <SidebarMenu className="space-y-1">
                            {navigationItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        className={`group relative transition-all duration-200 ${
                                            isActive(item.url)
                                                ? "bg-primary/10 text-primary border-r-2 border-primary shadow-md"
                                                : "hover:bg-muted/50 hover:text-foreground"
                                        }`}
                                    >
                                        <NavLink
                                            to={item.url}
                                            className="flex items-center gap-3 p-6 rounded-lg"
                                        >
                                            <item.icon
                                                className={`w-5 h-5 transition-colors ${
                                                    isActive(item.url)
                                                        ? "text-primary"
                                                        : "text-muted-foreground group-hover:text-foreground"
                                                }`}
                                            />

                                            {state === "expanded" && (
                                                <div className="flex-1 animate-fade-in">
                                                    <div className="font-medium">
                                                        {item.title}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground leading-tight">
                                                        {item.description}
                                                    </div>
                                                </div>
                                            )}

                                            {state === "expanded" &&
                                                isActive(item.url) && (
                                                    <ChevronRight className="w-4 h-4 text-primary animate-fade-in" />
                                                )}
                                        </NavLink>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Bottom section */}
                {state === "expanded" && (
                    <div className="mt-auto p-6 border-t border-border/50">
                        <div className="glass-card text-center animate-fade-in">
                            <div className="text-sm font-medium text-foreground mb-1">
                                Versão Beta
                            </div>
                            <div className="text-xs text-muted-foreground">
                                v1.0.0-beta
                            </div>
                        </div>
                    </div>
                )}
            </SidebarContent>
        </Sidebar>
    );
}
