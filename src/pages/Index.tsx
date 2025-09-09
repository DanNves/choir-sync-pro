import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Header } from "@/components/Header"
import { DashboardStats } from "@/components/DashboardStats"
import { ConditionalRender } from "@/components/ConditionalRender"
import { ProtectedRoute } from "@/components/ProtectedRoute"

const Index = () => {
  return (
    <ProtectedRoute resource="dashboard">
      <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">
                      Dashboard Administrativo
                    </h1>
                    <p className="text-muted-foreground">
                      Bem-vindo ao sistema de gestão musical. Gerencie membros, eventos e acompanhe o desempenho da sua comunidade.
                    </p>
                  </div>
                </div>
              </div>
              <ConditionalRender permission="manage_users">
                <DashboardStats />
              </ConditionalRender>
              <ConditionalRender resource="usuarios" fallback={
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">
                    Acesso limitado. Entre em contato com seu administrador para mais informações.
                  </p>
                </div>
              }>
                <DashboardStats />
              </ConditionalRender>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
    </ProtectedRoute>
  );
};

export default Index;
