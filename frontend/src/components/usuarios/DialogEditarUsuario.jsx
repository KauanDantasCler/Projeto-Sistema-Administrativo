import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";

export function DialogEditarUsuario({ open, onOpenChange, usuario, onUsuarioAtualizado }) {
    const [usuarioEditando, setUsuarioEditando] = useState(usuario || { nome: "", email: "", perfil: "FUNCIONARIO" });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open && usuario) {
            setUsuarioEditando(usuario);
        }
    }, [open, usuario]);

    function validateName(name) {
        return /^[A-Za-zÀ-ÿ\s]+$/.test(name);
    }

    async function salvarUsuario() {
        if (!usuarioEditando?.id) return;

        if (!usuarioEditando.nome || !usuarioEditando.email) {
            toast.error("Nome e email são obrigatórios.");
            return;
        }

        if (usuarioEditando.nome.length < 3 || !validateName(usuarioEditando.nome)) {
            toast.error("O nome do usuário deve ter pelo menos 3 caracteres e não pode conter números ou caracteres especiais.");
            return;
        }
        try {
            setLoading(true);
            await api.put(`/usuarios/${usuarioEditando.id}`, usuarioEditando);
            onUsuarioAtualizado(usuarioEditando);
            toast.success("Usuário atualizado com sucesso!");
            onOpenChange(false);
        } catch (error) {
            toast.error(error.response?.data?.error || "Erro ao atualizar usuário. Verifique os dados e tente novamente.");
        } finally {
            setLoading(false);
        }

    }

    function handleInputChange(e) {
        const { name, value } = e.target;
        setUsuarioEditando((prev) => ({ ...prev, [name]: value }));
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-[#111117] border border-white/10 text-white rounded-2xl sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="font-serif text-2xl text-white">Editar Usuário</DialogTitle>
                </DialogHeader>

                <DialogDescription className="text-sm text-gray-400">
                    Aqui você pode editar as informações do usuário.
                </DialogDescription>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        salvarUsuario();
                    }}
                >
                    <Card className="grid gap-4 py-4 p-4 mb-2 bg-white/5 border border-white/10 rounded-xl">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="nome" className="text-right text-xs font-medium tracking-wide text-gray-400 uppercase">
                                Nome
                            </label>
                            <Input
                                id="nome"
                                name="nome"
                                value={usuarioEditando?.nome ?? ""}
                                className="col-span-3 bg-white/5 border-white/10 text-white rounded-xl focus-visible:border-violet-500 focus-visible:ring-violet-500/40"
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="email" className="text-right text-xs font-medium tracking-wide text-gray-400 uppercase">
                                Email
                            </label>
                            <Input
                                id="email"
                                name="email"
                                value={usuarioEditando?.email ?? ""}
                                className="col-span-3 bg-white/5 border-white/10 text-white rounded-xl focus-visible:border-violet-500 focus-visible:ring-violet-500/40"
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="cpf" className="text-right text-xs font-medium tracking-wide text-gray-400 uppercase">
                                CPF
                            </label>
                            <Input
                                id="cpf"
                                name="cpf"
                                value={usuarioEditando?.cpf ?? ""}
                                className="col-span-3 bg-white/5 border-white/10 text-gray-500 rounded-xl cursor-not-allowed"
                                disabled
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium tracking-wide text-gray-400 uppercase mb-1.5">
                                Perfil:
                            </label>
                            <Select
                                value={usuarioEditando?.perfil ?? "FUNCIONARIO"}
                                onValueChange={(value) => setUsuarioEditando((prev) => ({ ...prev, perfil: value }))}
                                className="col-span-3"
                            >
                                <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-xl">
                                    <SelectValue placeholder="Selecione o perfil" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#111117] border border-white/10 text-white">
                                    <SelectItem value="ADMIN">Administrador</SelectItem>
                                    <SelectItem value="FUNCIONARIO">Usuário</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </Card>
                    <div className="flex justify-end gap-2">
                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-linear-to-r from-violet-600 to-indigo-500 hover:from-violet-500 hover:to-indigo-400 text-white rounded-xl"
                        >
                            Salvar Alterações
                        </Button>
                    </div>

                </form>
            </DialogContent>
        </Dialog>
    );
}