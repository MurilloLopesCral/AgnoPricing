import { AppLayout } from "@/components/layout/AppLayout";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";

// Pages
import AgentesIA from "./pages/AgentesIA";
import Arquitetura from "./pages/Arquitetura";
import Deployment from "./pages/Deployment";
import Integracoes from "./pages/Integracoes";
import NotFound from "./pages/NotFound";
import Overview from "./pages/Overview";
import PipelineDados from "./pages/PipelineDados";
import Roadmap from "./pages/Roadmap";

const queryClient = new QueryClient();

const App = () => (
    <QueryClientProvider client={queryClient}>
        <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
                <AppLayout>
                    <Routes>
                        <Route path="/" element={<Overview />} />
                        <Route path="/arquitetura" element={<Arquitetura />} />
                        {/* Placeholder routes for other pages */}
                        <Route path="/agentes" element={<AgentesIA />} />
                        <Route path="/pipeline" element={<PipelineDados />} />
                        <Route path="/integracoes" element={<Integracoes />} />
                        <Route path="/deployment" element={<Deployment />} />
                        <Route path="/roadmap" element={<Roadmap />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </AppLayout>
            </BrowserRouter>
        </TooltipProvider>
    </QueryClientProvider>
);

export default App;
