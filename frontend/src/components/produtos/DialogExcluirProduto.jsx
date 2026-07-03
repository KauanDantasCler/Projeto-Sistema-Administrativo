import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { api } from "@/services/api";
import { useState } from "react";
import { toast } from "sonner";

export function DialogExcluirProduto({ open, onOpenChange, produto, onProdutoExcluido }) {
    const [loading, setLoading] = useState(false);

    async function excluirProduto() {
        if (!produto?.id) return;

        try {
            setLoading(true);
            await api.delete(`/produtos/${produto.id}`);

            onProdutoExcluido(produto.id);
            toast.success("Produto excluído com sucesso!");
            onOpenChange(false);
        } catch (error) {
            toast.error(error.response?.data?.error || "Erro ao excluir produto.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-[#111117] border border-white/10 text-white rounded-2xl sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="font-serif text-2xl text-white">Confirmar Exclusão</DialogTitle>
                    <DialogDescription className="text-sm text-gray-400">
                        Você tem certeza que deseja deletar o produto <strong className="text-gray-200">{produto?.nome}</strong>?
                        Essa ação não pode ser desfeita.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="bg-transparent border border-white/10 text-gray-300 hover:bg-white/5 hover:text-white rounded-xl"
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="destructive"
                        disabled={loading}
                        onClick={excluirProduto}
                        className="bg-linear-to-r from-red-500 to-rose-500 hover:from-red-400 hover:to-rose-400 text-white rounded-xl"
                    >
                        {loading ? "Excluindo..." : "Sim, excluir"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}