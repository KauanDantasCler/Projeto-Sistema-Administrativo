import { useState, useEffect } from "react";
import { api } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export function DialogEditarProduto({ open, onOpenChange, produtoInicial, onProdutoAtualizado }) {
    const [produtoEditando, setProdutoEditando] = useState(produtoInicial || { nome: "", preco: 0, ativo: true, descricao: "" });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (produtoInicial) {
            setProdutoEditando(produtoInicial);
        }
    }, [produtoInicial]);

    function isValidName(name) {
        return !/^\d+$/.test(name);
    }

    async function salvarProduto() {
        if (!produtoEditando?.id) return;



        if (!produtoEditando.nome || produtoEditando.preco <= 0 || !produtoEditando.descricao) {
            toast.error("Nome, preço e descrição são obrigatórios. O preço não pode ser negativo ou zero.");
            return;
        }

        if (produtoEditando.nome.length < 3 || !isValidName(produtoEditando.nome)) {
            toast.error("O nome do produto deve ter pelo menos 3 caracteres e não pode ser composto apenas por números.");
            return;
        }

        try {
            setLoading(true);
            await api.put(`/produtos/${produtoEditando.id}`, produtoEditando);


            onProdutoAtualizado(produtoEditando);
            toast.success("Produto atualizado com sucesso!");
            onOpenChange(false);
        } catch (error) {
            toast.error(error.response?.data?.error || "Erro ao atualizar produto.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-[#111117] border border-white/10 text-white rounded-2xl sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="font-serif text-2xl text-white">Editar Produto</DialogTitle>
                </DialogHeader>


                <form onSubmit={(e) => {
                    e.preventDefault();
                    salvarProduto();
                }} className="space-y-4">
                    <div>
                        <label htmlFor="nomeEdit" className="block text-xs font-medium tracking-wide text-gray-400 uppercase mb-1.5">
                            Nome:
                        </label>
                        <Input
                            type="text"
                            id="nomeEdit"
                            value={produtoEditando.nome || ""}
                            onChange={(e) => setProdutoEditando({ ...produtoEditando, nome: e.target.value })}
                            className="mt-1 block w-full bg-white/5 border-white/10 text-white placeholder-gray-500 rounded-xl focus-visible:border-violet-500 focus-visible:ring-violet-500/40"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="precoEdit" className="block text-xs font-medium tracking-wide text-gray-400 uppercase mb-1.5">
                            Preço (R$):
                        </label>
                        <Input
                            type="number"
                            id="precoEdit"
                            step="0.01"
                            value={produtoEditando.preco}
                            onChange={(e) => setProdutoEditando({ ...produtoEditando, preco: parseFloat(e.target.value) || 0 })}
                            className="mt-1 block w-full bg-white/5 border-white/10 text-white placeholder-gray-500 rounded-xl focus-visible:border-violet-500 focus-visible:ring-violet-500/40"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="descricaoEdit" className="block text-xs font-medium tracking-wide text-gray-400 uppercase mb-1.5">
                            Descrição:
                        </label>
                        <textarea
                            rows={4}
                            id="descricaoEdit"
                            value={produtoEditando.descricao || ""}
                            onChange={(e) => setProdutoEditando({ ...produtoEditando, descricao: e.target.value })}
                            className="mt-1 block w-full bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-xl shadow-sm p-3 outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="ativoEdit" className="block text-xs font-medium tracking-wide text-gray-400 uppercase mb-1.5">
                            Status:
                        </label>
                        <Select
                            id="ativoEdit"
                            value={produtoEditando.ativo ? "ativo" : "inativo"}
                            onValueChange={(value) => setProdutoEditando({ ...produtoEditando, ativo: value === "ativo" })}
                            className="mt-1 block w-full"
                        >
                            <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-xl">
                                <SelectValue placeholder="Selecione o status" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#111117] border border-white/10 text-white">
                                <SelectItem value="ativo">Ativo</SelectItem>
                                <SelectItem value="inativo">Inativo</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <DialogDescription className="text-sm text-gray-400">
                        Altere os detalhes do produto e clique em "Salvar Alterações".
                    </DialogDescription>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="bg-transparent border border-white/10 text-gray-300 hover:bg-white/5 hover:text-white rounded-xl"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-linear-to-r from-violet-600 to-indigo-500 hover:from-violet-500 hover:to-indigo-400 text-white rounded-xl"
                        >
                            {loading ? "Salvando..." : "Salvar Alterações"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}