import { useState } from "react";
import { api } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

export function DialogExcluirPromocao({ open, onOpenChange, promocao, onPromocaoExcluida }) {
    const [loading, setLoading] = useState(false);

    async function excluirPromocao() {
        if (!promocao?.id) return;
        setLoading(true);
        try {
            await api.delete(`/promocoes/${promocao.id}`);
            onPromocaoExcluida(promocao.id);
            toast.success("Promoção excluída com sucesso!");
            onOpenChange(false);
        } catch (error) {
            toast.error(error.response?.data?.error || "Erro ao excluir promoção.");
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
                        Você tem certeza que deseja deletar a promoção <strong className="text-gray-200">{promocao?.nome}</strong>?
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
                        onClick={excluirPromocao}
                        disabled={loading}
                        className="bg-linear-to-r from-red-500 to-rose-500 hover:from-red-400 hover:to-rose-400 text-white rounded-xl"
                    >
                        {loading ? 'Excluindo...' : 'Excluir'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}