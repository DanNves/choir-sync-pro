import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ShieldCheck, ShieldAlert } from "lucide-react";

export default function OAuthConsent() {
  const [params] = useSearchParams();
  const authorizationId = params.get("authorization_id") ?? "";
  const [details, setDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!authorizationId) return setError("Missing authorization_id");
      
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) {
        const next = window.location.pathname + window.location.search;
        window.location.href = "/login?next=" + encodeURIComponent(next);
        return;
      }
      
      // @ts-ignore - Supabase Beta OAuth API
      const { data, error } = await supabase.auth.oauth.getAuthorizationDetails(authorizationId);
      
      if (!active) return;
      if (error) return setError(error.message);
      
      const immediate = data?.redirect_url ?? data?.redirect_to;
      if (immediate && !data?.client) {
        window.location.href = immediate;
        return;
      }
      
      setDetails(data);
    })();
    return () => { active = false; };
  }, [authorizationId]);

  async function decide(approve: boolean) {
    setBusy(true);
    // @ts-ignore - Supabase Beta OAuth API
    const { data, error } = approve
      ? await supabase.auth.oauth.approveAuthorization(authorizationId)
      : await supabase.auth.oauth.denyAuthorization(authorizationId);
      
    if (error) {
      setBusy(false);
      return setError(error.message);
    }
    
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) {
      setBusy(false);
      return setError("No redirect returned by the authorization server.");
    }
    window.location.href = target;
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4 bg-gray-50">
        <Card className="w-full max-w-md border-red-200">
          <CardHeader>
            <div className="flex items-center gap-2 text-red-600 mb-2">
              <ShieldAlert className="h-5 w-5" />
              <CardTitle>Erro de Autorização</CardTitle>
            </div>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => window.location.href = '/'}>
              Voltar ao Início
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (!details) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4 bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-20 w-full mb-4" />
          </CardContent>
          <CardFooter className="flex gap-2">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 flex-1" />
          </CardFooter>
        </Card>
      </div>
    );
  }

  const clientName = details.client?.name ?? "um aplicativo externo";

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-md shadow-lg border-primary/10">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
            <ShieldCheck className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Conectar ao {clientName}</CardTitle>
          <CardDescription className="text-base pt-2">
            Este aplicativo solicita permissão para acessar sua conta Choir Sync Pro em seu nome.
          </CardDescription>
        </CardHeader>
        <CardContent className="py-6 border-y border-gray-100 my-4">
          <ul className="space-y-3 text-sm text-gray-600">
            <li className="flex items-start gap-3">
              <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5" />
              <span>Acessar seu perfil e informações básicas.</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5" />
              <span>Visualizar equipes e eventos que você participa.</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5" />
              <span>Realizar ações permitidas pelo seu nível de acesso.</span>
            </li>
          </ul>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button 
            className="w-full text-base font-semibold py-6 shadow-md hover:shadow-lg transition-all" 
            disabled={busy} 
            onClick={() => decide(true)}
          >
            Autorizar Acesso
          </Button>
          <Button 
            variant="ghost" 
            className="w-full text-gray-500 hover:text-gray-700" 
            disabled={busy} 
            onClick={() => decide(false)}
          >
            Cancelar
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
