import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { BookText, Bot, Github } from "lucide-react";

export function AppHeader() {
    return (
        <header className="sticky top-0 z-50 w-full glass border-b border-border/50">
            <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <SidebarTrigger className="lg:hidden" />

                    <div className="hidden lg:flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
                            <span className="text-sm font-bold text-primary-foreground">
                                CL
                            </span>
                        </div>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                            CralLabs
                        </h1>
                    </div>
                </div>

                {/* <div className="flex-1 max-w-md mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Buscar na documentação..."
              className="pl-10 glass border-border/50 focus:border-primary/50 focus:ring-primary/25"
            />
          </div>
        </div> */}

                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="hidden sm:flex items-center gap-2"
                    >
                        <Github
                            className="w-4 h-4"
                            href="https://github.com/MurilloLopesCral/AgnoPricing"
                        />
                        <span className="hidden md:inline">AgnoPricing</span>
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="hidden sm:flex items-center gap-2"
                    >
                        <Github
                            className="w-4 h-4"
                            href="https://github.com/MurilloLopesCral/CompetitionForm"
                        />
                        <span className="hidden md:inline">
                            CompetitionForm
                        </span>
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="hidden sm:flex items-center gap-2"
                    >
                        <Bot
                            className="w-4 h-4"
                            href="https://agnopricing.onrender.com"
                        />
                        <span className="hidden md:inline">
                            Pricing Chatbot
                        </span>
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="hidden sm:flex items-center gap-2"
                    >
                        <BookText
                            className="w-4 h-4"
                            href="https://competition-form.vercel.app"
                        />
                        <span className="hidden md:inline">
                            Formulário concorrentes
                        </span>
                    </Button>

                    {/* <Button
                        variant="ghost"
                        size="sm"
                        className="hidden sm:flex items-center gap-2"
                    >
                        <ExternalLink className="w-4 h-4" />
                        <span className="hidden md:inline">Deploy</span>
                    </Button> */}
                </div>
            </div>
        </header>
    );
}
