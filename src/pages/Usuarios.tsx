import { useState } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Header } from "@/components/Header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter,
  MoreHorizontal,
  Edit,
  Trash2
} from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const Usuarios = () => {
  const [busca, setBusca] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [novoUsuario, setNovoUsuario] = useState({
    nome: "",
    email: "",
    papel: "",
    local: "",
    instrumento: ""
  })

  const usuarios = [
    {
      id: 1,
      nome: "João Silva",
      email: "joao.silva@email.com",
      papel: "Músico",
      local: "São Paulo - Central",
      status: "Ativo",
      instrumento: "Violão",
      ultimoAcesso: "Hoje, 14:30"
    },
    {
      id: 2,
      nome: "Maria Santos",
      email: "maria.santos@email.com", 
      papel: "Organista",
      local: "São Paulo - Central",
      status: "Ativo",
      instrumento: "Órgão",
      ultimoAcesso: "Ontem, 19:45"
    },
    {
      id: 3,
      nome: "Pedro Costa",
      email: "pedro.costa@email.com",
      papel: "Candidato",
      local: "Rio de Janeiro - Norte",
      status: "Pendente",
      instrumento: "Bateria",
      ultimoAcesso: "2 dias atrás"
    },
    {
      id: 4,
      nome: "Ana Oliveira",
      email: "ana.oliveira@email.com",
      papel: "Instrutor",
      local: "São Paulo - Central", 
      status: "Ativo",
      instrumento: "Piano",
      ultimoAcesso: "Hoje, 16:20"
    }
  ]

  // Filtrar usuários baseado na busca
  const usuariosFiltrados = usuarios.filter(usuario =>
    usuario.nome.toLowerCase().includes(busca.toLowerCase()) ||
    usuario.email.toLowerCase().includes(busca.toLowerCase()) ||
    usuario.papel.toLowerCase().includes(busca.toLowerCase()) ||
    usuario.local.toLowerCase().includes(busca.toLowerCase()) ||
    usuario.instrumento.toLowerCase().includes(busca.toLowerCase())
  )

  const handleSubmitNovoUsuario = (e: React.FormEvent) => {
    e.preventDefault()
    // Aqui você adicionaria a lógica para salvar o usuário
    console.log("Novo usuário:", novoUsuario)
    setDialogOpen(false)
    setNovoUsuario({
      nome: "",
      email: "",
      papel: "",
      local: "",
      instrumento: ""
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ativo': return 'default'
      case 'Pendente': return 'secondary'
      case 'Inativo': return 'destructive'
      default: return 'secondary'
    }
  }

  const getPapelColor = (papel: string) => {
    switch (papel) {
      case 'Administrador': return 'destructive'
      case 'Instrutor': return 'default'
      case 'Organista': return 'secondary'
      case 'Músico': return 'outline'
      default: return 'outline'
    }
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">
                    Gerenciamento de Usuários
                  </h1>
                  <p className="text-muted-foreground">
                    Gerencie membros, papéis e permissões do sistema
                  </p>
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <UserPlus className="w-4 h-4" />
                      Novo Usuário
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Adicionar Novo Usuário</DialogTitle>
                      <DialogDescription>
                        Preencha as informações do novo usuário abaixo.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmitNovoUsuario}>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="nome">Nome completo</Label>
                          <Input
                            id="nome"
                            value={novoUsuario.nome}
                            onChange={(e) => setNovoUsuario({...novoUsuario, nome: e.target.value})}
                            placeholder="Digite o nome completo"
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="email">E-mail</Label>
                          <Input
                            id="email"
                            type="email"
                            value={novoUsuario.email}
                            onChange={(e) => setNovoUsuario({...novoUsuario, email: e.target.value})}
                            placeholder="Digite o e-mail"
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="papel">Papel</Label>
                          <Select 
                            value={novoUsuario.papel} 
                            onValueChange={(value) => setNovoUsuario({...novoUsuario, papel: value})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o papel" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Administrador">Administrador</SelectItem>
                              <SelectItem value="Instrutor">Instrutor</SelectItem>
                              <SelectItem value="Organista">Organista</SelectItem>
                              <SelectItem value="Músico">Músico</SelectItem>
                              <SelectItem value="Candidato">Candidato</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="local">Local</Label>
                          <Select 
                            value={novoUsuario.local} 
                            onValueChange={(value) => setNovoUsuario({...novoUsuario, local: value})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o local" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="São Paulo - Central">São Paulo - Central</SelectItem>
                              <SelectItem value="Rio de Janeiro - Norte">Rio de Janeiro - Norte</SelectItem>
                              <SelectItem value="Brasília - Plano Piloto">Brasília - Plano Piloto</SelectItem>
                              <SelectItem value="Belo Horizonte - Centro">Belo Horizonte - Centro</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="instrumento">Instrumento</Label>
                          <Select 
                            value={novoUsuario.instrumento} 
                            onValueChange={(value) => setNovoUsuario({...novoUsuario, instrumento: value})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o instrumento" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Piano">Piano</SelectItem>
                              <SelectItem value="Órgão">Órgão</SelectItem>
                              <SelectItem value="Violão">Violão</SelectItem>
                              <SelectItem value="Guitarra">Guitarra</SelectItem>
                              <SelectItem value="Baixo">Baixo</SelectItem>
                              <SelectItem value="Bateria">Bateria</SelectItem>
                              <SelectItem value="Violino">Violino</SelectItem>
                              <SelectItem value="Flauta">Flauta</SelectItem>
                              <SelectItem value="Saxofone">Saxofone</SelectItem>
                              <SelectItem value="Trompete">Trompete</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                          Cancelar
                        </Button>
                        <Button type="submit">
                          Adicionar Usuário
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="bg-gradient-to-br from-card to-card/50 border-0 shadow-card">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Users className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total</p>
                        <p className="text-2xl font-bold text-foreground">243</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-card to-card/50 border-0 shadow-card">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                        <Users className="w-6 h-6 text-success" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Ativos</p>
                        <p className="text-2xl font-bold text-foreground">198</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-card to-card/50 border-0 shadow-card">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                        <Users className="w-6 h-6 text-warning" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Pendentes</p>
                        <p className="text-2xl font-bold text-foreground">32</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-card to-card/50 border-0 shadow-card">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-muted/20 rounded-lg flex items-center justify-center">
                        <Users className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Inativos</p>
                        <p className="text-2xl font-bold text-foreground">13</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Filters and Search */}
              <Card className="bg-gradient-to-br from-card to-card/50 border-0 shadow-card">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input 
                        placeholder="Buscar usuários..." 
                        className="pl-10 bg-background/50"
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                      />
                    </div>
                    <Button variant="outline" size="icon">
                      <Filter className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Papel</TableHead>
                        <TableHead>Local</TableHead>
                        <TableHead>Instrumento</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Último Acesso</TableHead>
                        <TableHead className="w-[70px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {usuariosFiltrados.map((usuario) => (
                        <TableRow key={usuario.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium text-foreground">{usuario.nome}</p>
                              <p className="text-sm text-muted-foreground">{usuario.email}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getPapelColor(usuario.papel)}>
                              {usuario.papel}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {usuario.local}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {usuario.instrumento}
                          </TableCell>
                          <TableCell>
                            <Badge variant={getStatusColor(usuario.status)}>
                              {usuario.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {usuario.ultimoAcesso}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem className="gap-2">
                                  <Edit className="w-4 h-4" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem className="gap-2 text-destructive">
                                  <Trash2 className="w-4 h-4" />
                                  Remover
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Usuarios;