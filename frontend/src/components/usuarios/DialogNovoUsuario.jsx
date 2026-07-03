import { useState } from "react";
import { api } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export function DialogNovoUsuario({ open, onOpenChange, onUsuarioAdicionado }) {
    const [usuario, setUsuario] = useState({
        nome: "",
        email: "",
        cpf: "",
        senha: "",
        perfil: "FUNCIONARIO",
    });
    const [loading, setLoading] = useState(false);

    const formatarCPF = (valor) => {
        return valor
            .replace(/\D/g, "")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d{1,2})/, "$1-$2")
            .replace(/(-\d{2})\d+?$/, "$1");
    };

    const validarNome = (nome) => {
        return /^[A-Za-zÀ-ÿ\s]+$/.test(nome);
    }
    const validarEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
    const validarCPF = (cpf) => {
        cpf = cpf.replace(/\D/g, '');
        if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
        return true;
    };

    async function salvarUsuario() {

        if (!usuario.nome || !usuario.email || !usuario.cpf || !usuario.senha) {
            toast.error("Todos os campos são obrigatórios.");
            return;
        }

        if (usuario.nome.length < 3 || !validarNome(usuario.nome)) {
            toast.error("O nome do usuário deve ter pelo menos 3 caracteres e não pode conter números ou caracteres especiais.");
            return;
        }

        if (!validarEmail(usuario.email)) {
            toast.error("O email informado não é válido.");
            return;
        }

        if (!validarCPF(usuario.cpf)) {
            toast.error("O CPF informado não é válido.");
            return;
        }
        try {
            setLoading(true);

            const dadosParaEnviar = {
                ...usuario,
                cpf: usuario.cpf.replace(/\D/g, "")
            };

            const response = await api.post("/usuarios", dadosParaEnviar);
            onUsuarioAdicionado(response.data);
            toast.success("Usuário criado com sucesso!");
            onOpenChange(false);
        } catch (error) {
            const err = error.response?.data?.error;

            let mensagem = "Erro ao criar usuário. Verifique os dados.";

            if (typeof err === "string") {
                mensagem = err;
            } else if (err?.fieldErrors) {
                mensagem =
                    Object.values(err.fieldErrors)
                        .flat()[0] || mensagem;
            } else if (err?.formErrors?.length) {
                mensagem = err.formErrors[0];
            }

            toast.error(mensagem);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-[#111117] border border-white/10 text-white rounded-2xl sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="font-serif text-2xl text-white">Novo Usuário</DialogTitle>
                </DialogHeader>
                <DialogDescription className="text-sm text-gray-400">
                    Preencha os dados do novo usuário.
                </DialogDescription>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        salvarUsuario();
                    }}
                    className="space-y-4 mt-4"
                >
                    <div>
                        <label htmlFor="nome" className="block text-xs font-medium tracking-wide text-gray-400 uppercase mb-1.5">
                            Nome:
                        </label>
                        <Input
                            type="text"
                            id="nome"
                            value={usuario.nome}
                            onChange={(e) => setUsuario({ ...usuario, nome: e.target.value })}
                            className="mt-1 block w-full bg-white/5 border-white/10 text-white placeholder-gray-500 rounded-xl focus-visible:border-violet-500 focus-visible:ring-violet-500/40"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-xs font-medium tracking-wide text-gray-400 uppercase mb-1.5">
                            Email:
                        </label>
                        <Input
                            type="email"
                            id="email"
                            value={usuario.email}
                            onChange={(e) => setUsuario({ ...usuario, email: e.target.value })}
                            className="mt-1 block w-full bg-white/5 border-white/10 text-white placeholder-gray-500 rounded-xl focus-visible:border-violet-500 focus-visible:ring-violet-500/40"
                        />
                    </div>
                    <div>
                        <label htmlFor="cpf" className="block text-xs font-medium tracking-wide text-gray-400 uppercase mb-1.5">
                            CPF:
                        </label>
                        <Input
                            type="text"
                            id="cpf"
                            value={usuario.cpf}
                            onChange={(e) => setUsuario({ ...usuario, cpf: formatarCPF(e.target.value) })}
                            maxLength={14}
                            className="mt-1 block w-full bg-white/5 border-white/10 text-white placeholder-gray-500 rounded-xl focus-visible:border-violet-500 focus-visible:ring-violet-500/40"
                        />
                    </div>
                    <div>
                        <label htmlFor="senha" className="block text-xs font-medium tracking-wide text-gray-400 uppercase mb-1.5">
                            Senha:
                        </label>
                        <Input
                            type="password"
                            id="senha"
                            value={usuario.senha}
                            onChange={(e) => setUsuario({ ...usuario, senha: e.target.value })}
                            className="mt-1 block w-full bg-white/5 border-white/10 text-white placeholder-gray-500 rounded-xl focus-visible:border-violet-500 focus-visible:ring-violet-500/40"
                        />
                    </div>

                    <div>
                        <label htmlFor="perfil" className="block text-xs font-medium tracking-wide text-gray-400 uppercase mb-1.5">
                            Perfil:
                        </label>

                        <Select
                            id="perfil"
                            value={usuario.perfil}
                            onValueChange={(value) => setUsuario({ ...usuario, perfil: value })}
                        >
                            <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-xl">
                                <SelectValue placeholder="Selecione o perfil" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#111117] border border-white/10 text-white">
                                <SelectItem value="ADMIN">Administrador</SelectItem>
                                <SelectItem value="FUNCIONARIO">Funcionário</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex justify-end gap-2 mt-4">
                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-linear-to-r from-violet-600 to-indigo-500 hover:from-violet-500 hover:to-indigo-400 text-white rounded-xl"
                        >
                            {loading ? "Salvando..." : "Salvar Usuário"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}