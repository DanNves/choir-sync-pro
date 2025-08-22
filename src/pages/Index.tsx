import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Header } from "@/components/Header"
import { DashboardStats } from "@/components/DashboardStats"

const Index = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Dashboard Administrativo
                </h1>
                <p className="text-muted-foreground">
                  Bem-vindo ao sistema de gestão musical. Gerencie membros, eventos e acompanhe o desempenho da sua comunidade.
                </p>
              </div>
              <DashboardStats />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
