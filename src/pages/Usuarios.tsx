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
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [usuarioEditando, setUsuarioEditando] = useState<any>(null)
  const [novoUsuario, setNovoUsuario] = useState({
    nome: "",
    email: "",
    papel: "",
    local: "",
    instrumento: "",
    instrumentoOutro: ""
  })
  const [errors, setErrors] = useState<{[key: string]: string}>({})

  const [usuarios, setUsuarios] = useState([
    {
      id: 1,
      nome: "João Silva",
      email: "joao.silva@email.com",
      papel: "Músico",
      local: "Centro - São Paulo - SP - Brasil",
      status: "Ativo",
      instrumento: "Violão",
      ultimoAcesso: "Hoje, 14:30"
    },
    {
      id: 2,
      nome: "Maria Santos",
      email: "maria.santos@email.com", 
      papel: "Organista",
      local: "Centro - Salvador - BA - Brasil",
      status: "Ativo",
      instrumento: "Órgão",
      ultimoAcesso: "Ontem, 19:45"
    },
    {
      id: 3,
      nome: "Pedro Costa",
      email: "pedro.costa@email.com",
      papel: "Ancião",
      local: "Norte - Rio de Janeiro - RJ - Brasil",
      status: "Pendente",
      instrumento: "Não possui",
      ultimoAcesso: "2 dias atrás"
    },
    {
      id: 4,
      nome: "Ana Oliveira",
      email: "ana.oliveira@email.com",
      papel: "Instrutor",
      local: "Centro - Belo Horizonte - MG - Brasil", 
      status: "Ativo",
      instrumento: "Piano",
      ultimoAcesso: "Hoje, 16:20"
    }
  ])

  const validateForm = (data: any, isEdit = false) => {
    const newErrors: {[key: string]: string} = {}
    
    if (!data.email) {
      newErrors.email = "E-mail é obrigatório"
    } else {
      const emailExists = usuarios.some(u => 
        u.email === data.email && (!isEdit || u.id !== data.id)
      )
      if (emailExists) {
        newErrors.email = "Este e-mail já está sendo usado"
      }
    }
    
    if (!data.papel) {
      newErrors.papel = "Cargo é obrigatório"
    }
    
    if (!data.instrumento) {
      newErrors.instrumento = "Instrumento é obrigatório"
    }
    
    return newErrors
  }

  const handleSubmitNovoUsuario = (e: React.FormEvent) => {
    e.preventDefault()
    
    const formErrors = validateForm(novoUsuario)
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors)
      return
    }
    
    const instrumentoFinal = novoUsuario.instrumento === "Outro" 
      ? novoUsuario.instrumentoOutro 
      : novoUsuario.instrumento

    const novoId = Math.max(...usuarios.map(u => u.id)) + 1
    
    const usuarioCompleto = {
      id: novoId,
      nome: novoUsuario.nome,
      email: novoUsuario.email,
      papel: novoUsuario.papel,
      local: novoUsuario.local,
      status: "Ativo",
      instrumento: instrumentoFinal,
      ultimoAcesso: "Agora mesmo"
    }

    setUsuarios([...usuarios, usuarioCompleto])
    
    setDialogOpen(false)
    setErrors({})
    setNovoUsuario({
      nome: "",
      email: "",
      papel: "",
      local: "",
      instrumento: "",
      instrumentoOutro: ""
    })
  }

  const handleEditUsuario = (usuario: any) => {
    setUsuarioEditando({
      ...usuario,
      instrumentoOutro: ""
    })
    setEditDialogOpen(true)
    setErrors({})
  }

  const handleSubmitEditUsuario = (e: React.FormEvent) => {
    e.preventDefault()
    
    const formErrors = validateForm(usuarioEditando, true)
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors)
      return
    }
    
    const instrumentoFinal = usuarioEditando.instrumento === "Outro" 
      ? usuarioEditando.instrumentoOutro 
      : usuarioEditando.instrumento

    const usuarioAtualizado = {
      ...usuarioEditando,
      instrumento: instrumentoFinal
    }

    setUsuarios(usuarios.map(u => 
      u.id === usuarioEditando.id ? usuarioAtualizado : u
    ))
    
    setEditDialogOpen(false)
    setUsuarioEditando(null)
    setErrors({})
  }

  const handleRemoverUsuario = (id: number) => {
    setUsuarios(usuarios.filter(u => u.id !== id))
  }

  // Filtrar usuários baseado na busca
  const usuariosFiltrados = usuarios.filter(usuario =>
    usuario.nome.toLowerCase().includes(busca.toLowerCase()) ||
    usuario.email.toLowerCase().includes(busca.toLowerCase()) ||
    usuario.papel.toLowerCase().includes(busca.toLowerCase()) ||
    usuario.local.toLowerCase().includes(busca.toLowerCase()) ||
    usuario.instrumento.toLowerCase().includes(busca.toLowerCase())
  )

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
      case 'Ancião': return 'default'
      case 'Diácono': return 'secondary'
      case 'Cooperador': return 'outline'
      case 'Cooperador de Jovens': return 'outline'
      case 'Candidato': return 'secondary'
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
                          {errors.email && (
                            <p className="text-sm text-destructive">{errors.email}</p>
                          )}
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="papel">Cargo</Label>
                          <Select 
                            value={novoUsuario.papel} 
                            onValueChange={(value) => setNovoUsuario({...novoUsuario, papel: value})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o cargo" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Administrador">Administrador</SelectItem>
                              <SelectItem value="Ancião">Ancião</SelectItem>
                              <SelectItem value="Diácono">Diácono</SelectItem>
                              <SelectItem value="Cooperador">Cooperador</SelectItem>
                              <SelectItem value="Cooperador de Jovens">Cooperador de Jovens</SelectItem>
                              <SelectItem value="Instrutor">Instrutor</SelectItem>
                              <SelectItem value="Organista">Organista</SelectItem>
                              <SelectItem value="Músico">Músico</SelectItem>
                              <SelectItem value="Candidato">Candidato</SelectItem>
                            </SelectContent>
                          </Select>
                          {errors.papel && (
                            <p className="text-sm text-destructive">{errors.papel}</p>
                          )}
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="local">Localidade</Label>
                          <Input
                            id="local"
                            value={novoUsuario.local}
                            onChange={(e) => setNovoUsuario({...novoUsuario, local: e.target.value})}
                            placeholder="Ex: Centro - Salvador - BA - Brasil"
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="instrumento">Instrumento</Label>
                          <Select 
                            value={novoUsuario.instrumento} 
                            onValueChange={(value) => {
                              setNovoUsuario({...novoUsuario, instrumento: value, instrumentoOutro: ""})
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o instrumento" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Violino">Violino</SelectItem>
                              <SelectItem value="Viola">Viola</SelectItem>
                              <SelectItem value="Violoncelo">Violoncelo</SelectItem>
                              <SelectItem value="Flauta">Flauta</SelectItem>
                              <SelectItem value="Clarinete">Clarinete</SelectItem>
                              <SelectItem value="Oboé">Oboé</SelectItem>
                              <SelectItem value="Clarone">Clarone</SelectItem>
                              <SelectItem value="Sax Soprano">Sax Soprano</SelectItem>
                              <SelectItem value="Sax Curvo">Sax Curvo</SelectItem>
                              <SelectItem value="Sax Alto">Sax Alto</SelectItem>
                              <SelectItem value="Sax Tenor">Sax Tenor</SelectItem>
                              <SelectItem value="Sax Barítono">Sax Barítono</SelectItem>
                              <SelectItem value="Trompete">Trompete</SelectItem>
                              <SelectItem value="Euphonio">Euphonio</SelectItem>
                              <SelectItem value="Bombardino">Bombardino</SelectItem>
                              <SelectItem value="Trombone">Trombone</SelectItem>
                              <SelectItem value="Tuba">Tuba</SelectItem>
                              <SelectItem value="Não possui">Não possui</SelectItem>
                              <SelectItem value="Outro">Outro</SelectItem>
                            </SelectContent>
                          </Select>
                          {novoUsuario.instrumento === "Outro" && (
                            <Input
                              placeholder="Especifique o instrumento"
                              value={novoUsuario.instrumentoOutro}
                              onChange={(e) => setNovoUsuario({...novoUsuario, instrumentoOutro: e.target.value})}
                              className="mt-2"
                            />
                          )}
                          {errors.instrumento && (
                            <p className="text-sm text-destructive">{errors.instrumento}</p>
                          )}
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

                {/* Dialog de Edição */}
                <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Editar Usuário</DialogTitle>
                      <DialogDescription>
                        Edite as informações do usuário abaixo.
                      </DialogDescription>
                    </DialogHeader>
                    {usuarioEditando && (
                      <form onSubmit={handleSubmitEditUsuario}>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label htmlFor="edit-nome">Nome completo</Label>
                            <Input
                              id="edit-nome"
                              value={usuarioEditando.nome}
                              onChange={(e) => setUsuarioEditando({...usuarioEditando, nome: e.target.value})}
                              placeholder="Digite o nome completo"
                              required
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="edit-email">E-mail</Label>
                            <Input
                              id="edit-email"
                              type="email"
                              value={usuarioEditando.email}
                              onChange={(e) => setUsuarioEditando({...usuarioEditando, email: e.target.value})}
                              placeholder="Digite o e-mail"
                              required
                            />
                            {errors.email && (
                              <p className="text-sm text-destructive">{errors.email}</p>
                            )}
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="edit-papel">Cargo</Label>
                            <Select 
                              value={usuarioEditando.papel} 
                              onValueChange={(value) => setUsuarioEditando({...usuarioEditando, papel: value})}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o cargo" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Administrador">Administrador</SelectItem>
                                <SelectItem value="Ancião">Ancião</SelectItem>
                                <SelectItem value="Diácono">Diácono</SelectItem>
                                <SelectItem value="Cooperador">Cooperador</SelectItem>
                                <SelectItem value="Cooperador de Jovens">Cooperador de Jovens</SelectItem>
                                <SelectItem value="Instrutor">Instrutor</SelectItem>
                                <SelectItem value="Organista">Organista</SelectItem>
                                <SelectItem value="Músico">Músico</SelectItem>
                                <SelectItem value="Candidato">Candidato</SelectItem>
                              </SelectContent>
                            </Select>
                            {errors.papel && (
                              <p className="text-sm text-destructive">{errors.papel}</p>
                            )}
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="edit-local">Localidade</Label>
                            <Input
                              id="edit-local"
                              value={usuarioEditando.local}
                              onChange={(e) => setUsuarioEditando({...usuarioEditando, local: e.target.value})}
                              placeholder="Ex: Centro - Salvador - BA - Brasil"
                              required
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="edit-instrumento">Instrumento</Label>
                            <Select 
                              value={usuarioEditando.instrumento} 
                              onValueChange={(value) => {
                                setUsuarioEditando({...usuarioEditando, instrumento: value, instrumentoOutro: ""})
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o instrumento" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Violino">Violino</SelectItem>
                                <SelectItem value="Viola">Viola</SelectItem>
                                <SelectItem value="Violoncelo">Violoncelo</SelectItem>
                                <SelectItem value="Flauta">Flauta</SelectItem>
                                <SelectItem value="Clarinete">Clarinete</SelectItem>
                                <SelectItem value="Oboé">Oboé</SelectItem>
                                <SelectItem value="Clarone">Clarone</SelectItem>
                                <SelectItem value="Sax Soprano">Sax Soprano</SelectItem>
                                <SelectItem value="Sax Curvo">Sax Curvo</SelectItem>
                                <SelectItem value="Sax Alto">Sax Alto</SelectItem>
                                <SelectItem value="Sax Tenor">Sax Tenor</SelectItem>
                                <SelectItem value="Sax Barítono">Sax Barítono</SelectItem>
                                <SelectItem value="Trompete">Trompete</SelectItem>
                                <SelectItem value="Euphonio">Euphonio</SelectItem>
                                <SelectItem value="Bombardino">Bombardino</SelectItem>
                                <SelectItem value="Trombone">Trombone</SelectItem>
                                <SelectItem value="Tuba">Tuba</SelectItem>
                                <SelectItem value="Não possui">Não possui</SelectItem>
                                <SelectItem value="Outro">Outro</SelectItem>
                              </SelectContent>
                            </Select>
                            {usuarioEditando.instrumento === "Outro" && (
                              <Input
                                placeholder="Especifique o instrumento"
                                value={usuarioEditando.instrumentoOutro}
                                onChange={(e) => setUsuarioEditando({...usuarioEditando, instrumentoOutro: e.target.value})}
                                className="mt-2"
                              />
                            )}
                            {errors.instrumento && (
                              <p className="text-sm text-destructive">{errors.instrumento}</p>
                            )}
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>
                            Cancelar
                          </Button>
                          <Button type="submit">
                            Salvar Alterações
                          </Button>
                        </DialogFooter>
                      </form>
                    )}
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
                                <DropdownMenuItem 
                                  className="gap-2"
                                  onClick={() => handleEditUsuario(usuario)}
                                >
                                  <Edit className="w-4 h-4" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="gap-2 text-destructive"
                                  onClick={() => handleRemoverUsuario(usuario.id)}
                                >
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