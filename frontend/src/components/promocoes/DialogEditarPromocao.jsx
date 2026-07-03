import { useState, useEffect } from "react";
import { api } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export function DialogEditarPromocao({ open, onOpenChange, promocao, onPromocaoAdicionada }) {
    const [promocaoEditada, setPromocaoEditada] = useState({
        nome: "",
        valor_desconto: 0,
        tipo_desconto: "percentual",
        data_inicio: "",
        data_fim: "",
        produtoIds: [],
    });
    const [produtos, setProdutos] = useState([]);
    const [buscaProduto, setBuscaProduto] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open && promocao) {

            api.get('/produtos').then(res => setProdutos(res.data)).catch(err => toast.error("Erro ao buscar produtos:", err));

            const idsVinculados = (promocao.produto_promocao ?? []).map(pp => Number(pp.produto_id));

            setPromocaoEditada({
                id: promocao.id,
                nome: promocao.nome,
                valor_desconto: promocao.valor_desconto,
                tipo_desconto: promocao.tipo_desconto,
                data_inicio: promocao.data_inicio?.split("T")[0] ?? "",
                data_fim: promocao.data_fim?.split("T")[0] ?? "",
                produtoIds: idsVinculados,
            });
        }
    }, [open, promocao]);

    function toggleProduto(id) {
        setPromocaoEditada(prev => ({
            ...prev,
            produtoIds: prev.produtoIds.includes(id)
                ? prev.produtoIds.filter(pid => pid !== id)
                : [...prev.produtoIds, id]
        }));
    }

    async function salvarPromocao() {
        if (!promocaoEditada.id) {
            toast.error("Promoção inválida. Não é possível salvar.");
            return;
        }

        if (promocaoEditada.tipo_desconto === "percentual" && promocaoEditada.valor_desconto > 100) {
            toast.error("O desconto percentual não pode ser maior que 100%.");
            return;
        }

        try {
            setLoading(true);

            const payload = {
                nome: promocaoEditada.nome,
                desconto: promocaoEditada.valor_desconto,
                tipoDesconto: promocaoEditada.tipo_desconto,
                dataInicio: promocaoEditada.data_inicio,
                dataFim: promocaoEditada.data_fim,
                produtoIds: promocaoEditada.produtoIds,
            };

            const response = await api.put(`/promocoes/${promocaoEditada.id}`, payload);
            onPromocaoAdicionada(response.data);
            toast.success("Promoção atualizada com sucesso!");
            onOpenChange(false);
        } catch (error) {
            if (error.response) {
                const errMsg = error.response.data.error;
                toast.error(typeof errMsg === "string" ? errMsg : "Dados inválidos, verifique os campos.");
            } else {
                toast.error("Erro ao atualizar promoção.");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto bg-[#111117] border border-white/10 text-white rounded-2xl sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="font-serif text-2xl text-white">Editar Promoção</DialogTitle>
                </DialogHeader>
                <DialogDescription className="text-sm text-gray-400">
                    Faça as alterações desejadas na promoção e clique em "Salvar" para atualizar os detalhes.
                </DialogDescription>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="nome" className="text-xs font-medium tracking-wide text-gray-400 uppercase">Nome</Label>
                            <Input
                                id="nome"
                                value={promocaoEditada.nome}
                                onChange={(e) => setPromocaoEditada({ ...promocaoEditada, nome: e.target.value })}
                                className="mt-1.5 bg-white/5 border-white/10 text-white rounded-xl focus-visible:border-violet-500 focus-visible:ring-violet-500/40"
                            />
                        </div>
                        <div>
                            <Label htmlFor="desconto" className="text-xs font-medium tracking-wide text-gray-400 uppercase">Desconto</Label>
                            <Input
                                id="desconto"
                                type="number"
                                value={promocaoEditada.valor_desconto}
                                onChange={(e) => setPromocaoEditada({ ...promocaoEditada, valor_desconto: parseFloat(e.target.value) || 0 })}
                                className="mt-1.5 bg-white/5 border-white/10 text-white rounded-xl focus-visible:border-violet-500 focus-visible:ring-violet-500/40"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="tipoDesconto" className="text-xs font-medium tracking-wide text-gray-400 uppercase">Tipo de Desconto</Label>
                            <Select
                                value={promocaoEditada.tipo_desconto}
                                onValueChange={(value) => setPromocaoEditada({ ...promocaoEditada, tipo_desconto: value })}
                            >
                                <SelectTrigger className="mt-1.5 bg-white/5 border-white/10 text-white rounded-xl">
                                    <SelectValue placeholder="Selecione o tipo de desconto" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#111117] border border-white/10 text-white">
                                    <SelectItem value="percentual">Percentual</SelectItem>
                                    <SelectItem value="valor">Valor</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="dataInicio" className="text-xs font-medium tracking-wide text-gray-400 uppercase">Data de Início</Label>
                            <Input
                                id="dataInicio"
                                type="date"
                                value={promocaoEditada.data_inicio}
                                onChange={(e) => setPromocaoEditada({ ...promocaoEditada, data_inicio: e.target.value })}
                                className="mt-1.5 bg-white/5 border-white/10 text-white rounded-xl focus-visible:border-violet-500 focus-visible:ring-violet-500/40 scheme-dark"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="dataFim" className="text-xs font-medium tracking-wide text-gray-400 uppercase">Data de Fim</Label>
                            <Input
                                id="dataFim"
                                type="date"
                                value={promocaoEditada.data_fim}
                                onChange={(e) => setPromocaoEditada({ ...promocaoEditada, data_fim: e.target.value })}
                                className="mt-1.5 bg-white/5 border-white/10 text-white rounded-xl focus-visible:border-violet-500 focus-visible:ring-violet-500/40 scheme-dark"
                            />
                        </div>
                    </div>


                    <div>
                        <Label className="block mb-2 text-xs font-medium tracking-wide text-gray-400 uppercase">Produtos:</Label>

                        <Input
                            type="text"
                            placeholder="Buscar produto pelo nome..."
                            value={buscaProduto}
                            onChange={(e) => setBuscaProduto(e.target.value)}
                            className="mb-2 bg-white/5 border-white/10 text-white placeholder-gray-500 rounded-xl focus-visible:border-violet-500 focus-visible:ring-violet-500/40"
                        />

                        {produtos.length === 0 ? (
                            <p className="text-sm text-gray-500">Nenhum produto disponível.</p>
                        ) : (
                            <div className="border border-white/10 rounded-xl max-h-48 overflow-y-auto divide-y divide-white/10">
                                {produtos
                                    .filter(p => p.nome.toLowerCase().includes(buscaProduto.toLowerCase()))
                                    .map(produto => (
                                        <label
                                            key={produto.id}
                                            className="flex items-center gap-3 px-3 py-2 hover:bg-white/5 cursor-pointer"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={promocaoEditada.produtoIds?.includes(Number(produto.id))}
                                                onChange={() => toggleProduto(Number(produto.id))}
                                                className="accent-violet-600"
                                            />
                                            <span className="text-sm text-gray-200">{produto.nome}</span>
                                            <span className="ml-auto text-sm text-gray-500">
                                                R$ {Number(produto.preco).toFixed(2)}
                                            </span>
                                        </label>
                                    ))}
                            </div>
                        )}
                        {promocaoEditada.produtoIds?.length > 0 && (
                            <p className="text-xs text-violet-400 mt-1.5">
                                {promocaoEditada.produtoIds.length} produto(s) selecionado(s)
                            </p>
                        )}
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        onClick={salvarPromocao}
                        disabled={loading}
                        className="bg-linear-to-r from-violet-600 to-indigo-500 hover:from-violet-500 hover:to-indigo-400 text-white rounded-xl"
                    >
                        {loading ? "Salvando..." : "Salvar"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}