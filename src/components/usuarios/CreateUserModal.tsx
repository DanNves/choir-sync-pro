import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { User, Plus } from "lucide-react"
import { roles, instruments } from "@/data/mockData"

interface CreateUserModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onUserCreate: (user: any) => void
}

export function CreateUserModal({ open, onOpenChange, onUserCreate }: CreateUserModalProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    papel: "",
    instrumento: "",
    endereco: "",
    equipe: ""
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.nome || !formData.email || !formData.papel) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      })
      return
    }

    const newUser = {
      id: Date.now(),
      ...formData,
      status: "Ativo",
      dataIngresso: new Date().toISOString().split('T')[0]
    }

    onUserCreate(newUser)
    
    toast({
      title: "Sucesso",
      description: "Usuário criado com sucesso!"
    })

    setFormData({
      nome: "",
      email: "",
      telefone: "",
      papel: "",
      instrumento: "",
      endereco: "",
      equipe: ""
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Novo Usuário
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome Completo *</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
              placeholder="Digite o nome completo"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="email@exemplo.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefone">Telefone</Label>
            <Input
              id="telefone"
              value={formData.telefone}
              onChange={(e) => setFormData(prev => ({ ...prev, telefone: e.target.value }))}
              placeholder="(11) 99999-9999"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="papel">Papel *</Label>
              <Select value={formData.papel} onValueChange={(value) => setFormData(prev => ({ ...prev, papel: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role} value={role}>{role}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="instrumento">Instrumento</Label>
              <Select value={formData.instrumento} onValueChange={(value) => setFormData(prev => ({ ...prev, instrumento: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar" />
                </SelectTrigger>
                <SelectContent>
                  {instruments.map((instrument) => (
                    <SelectItem key={instrument} value={instrument}>{instrument}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="endereco">Endereço</Label>
            <Textarea
              id="endereco"
              value={formData.endereco}
              onChange={(e) => setFormData(prev => ({ ...prev, endereco: e.target.value }))}
              placeholder="Rua, número, bairro, cidade/estado"
              rows={2}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              <Plus className="w-4 h-4 mr-2" />
              Criar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}