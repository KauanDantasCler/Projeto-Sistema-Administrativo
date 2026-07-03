import { useState } from "react";
import { api } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
export function DialogNovoProduto({ open, onOpenChange, onProdutoAdicionado }) {
    const [produtoNovo, setProdutoNovo] = useState({ nome: "", preco: 0, ativo: true, descricao: "" });
    const [loading, setLoading] = useState(false);


    const validarNome = (nome) => {
        return !/^\d+$/.test(name);
    }
    async function criarProduto() {

        if (!produtoNovo.nome || produtoNovo.preco <= 0 || !produtoNovo.descricao) {
            toast.error("Todos os campos são obrigatórios.");
            return;
        }

        if (produtoNovo.nome.length < 3 || !validarNome(produtoNovo.nome)) {
            toast.error("O nome do produto deve ter pelo menos 3 caracteres e não pode ser composto apenas por números.");
            return;
        }

        try {
            setLoading(true);
            const response = await api.post('/produtos', produtoNovo);

            onProdutoAdicionado(response.data);
            toast.success("Produto criado com sucesso!");

            setProdutoNovo({ nome: "", preco: 0, ativo: true, descricao: "" });
            onOpenChange(false);
        } catch (error) {
            toast.error(error.response?.data?.error || "Erro ao criar produto.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-[#111117] border border-white/10 text-white rounded-2xl sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="font-serif text-2xl text-white">Adicionar Produto</DialogTitle>
                </DialogHeader>
                <DialogDescription className="text-sm text-gray-400">
                    Preencha os detalhes do novo produto e clique em "Criar Produto" para adicioná-lo.
                </DialogDescription>

                <form onSubmit={(e) => {
                    e.preventDefault();
                    criarProduto();
                }}>
                    <div className="mt-4">
                        <label htmlFor="nomeNovo" className="block text-xs font-medium tracking-wide text-gray-400 uppercase mb-1.5">
                            Nome:
                        </label>
                        <Input
                            type="text"
                            id="nomeNovo"
                            value={produtoNovo.nome}
                            onChange={(e) => setProdutoNovo({ ...produtoNovo, nome: e.target.value })}
                            className="mt-1 block w-full bg-white/5 border-white/10 text-white placeholder-gray-500 rounded-xl focus-visible:border-violet-500 focus-visible:ring-violet-500/40"
                            required
                        />
                    </div>
                    <div className="mt-4">
                        <label htmlFor="precoNovo" className="block text-xs font-medium tracking-wide text-gray-400 uppercase mb-1.5">
                            Preço (R$):
                        </label>
                        <Input
                            type="number"
                            id="precoNovo"
                            step="0.01"
                            value={produtoNovo.preco}
                            onChange={(e) => setProdutoNovo({ ...produtoNovo, preco: parseFloat(e.target.value) || 0 })}
                            className="mt-1 block w-full bg-white/5 border-white/10 text-white placeholder-gray-500 rounded-xl focus-visible:border-violet-500 focus-visible:ring-violet-500/40"
                            required
                        />
                    </div>
                    <div className="mt-4">
                        <label htmlFor="descricaoNovo" className="block text-xs font-medium tracking-wide text-gray-400 uppercase mb-1.5">
                            Descrição:
                        </label>
                        <textarea
                            rows={4}
                            id="descricaoNovo"
                            value={produtoNovo.descricao}
                            onChange={(e) => setProdutoNovo({ ...produtoNovo, descricao: e.target.value })}
                            className="mt-1 block w-full bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-xl shadow-sm p-3 outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500 sm:text-sm"
                        />
                    </div>
                    <div className="mt-4">
                        <label htmlFor="ativoNovo" className="block text-xs font-medium tracking-wide text-gray-400 uppercase mb-1.5">
                            Status:
                        </label>
                        <select
                            id="ativoNovo"
                            value={produtoNovo.ativo ? "ativo" : "inativo"}
                            onChange={(e) => setProdutoNovo({ ...produtoNovo, ativo: e.target.value === "ativo" })}
                            className="mt-1 block w-full bg-white/5 border border-white/10 text-white rounded-xl shadow-sm p-2.5 outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500 sm:text-sm [&>option]:bg-[#111117]"
                        >
                            <option value="ativo">Ativo</option>
                            <option value="inativo">Inativo</option>
                        </select>
                    </div>
                    <div className="mt-4 flex justify-end gap-2">
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
                            {loading ? "Salvando..." : "Adicionar Produto"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}