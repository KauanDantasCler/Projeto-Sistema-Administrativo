import { useState, useEffect } from "react";
import { api } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

export function DialogNovaPromocao({ open, onOpenChange, onPromocaoAdicionada }) {
    const [promocaoNova, setPromocaoNova] = useState({
        nome: "",
        desconto: 0,
        tipoDesconto: "percentual",
        dataInicio: "",
        dataFim: "",
        produtoIds: [],
    });
    const [produtos, setProdutos] = useState([]);
    const [buscaProduto, setBuscaProduto] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open) {
            api.get('/produtos').then(res => setProdutos(res.data)).catch(err => toast.error("Erro ao buscar produtos:", err));
        }
    }, [open]);

    function toggleProduto(id) {
        setPromocaoNova(prev => ({
            ...prev,
            produtoIds: prev.produtoIds.includes(id)
                ? prev.produtoIds.filter(pid => pid !== id)
                : [...prev.produtoIds, id]
        }));
    }

    async function criarPromocao() {

        if (!promocaoNova.nome || promocaoNova.nome.trim() === "") {
            toast.error("O valor do desconto deve ser maior que 0.");
            return;
        }

        if (!promocaoNova.desconto || Number(promocaoNova.desconto) <= 0) {
            toast.error("O valor do desconto deve ser maior que 0.");
            return;
        }

        if (promocaoNova.tipoDesconto === "percentual" && promocaoNova.desconto > 100) {
            toast.error("O desconto percentual não pode ser maior que 100%.");
            return;
        }

        try {
            setLoading(true);
            const response = await api.post('/promocoes', promocaoNova);
            onPromocaoAdicionada(response.data);
            toast.success("Promoção criada com sucesso!");

            setPromocaoNova({
                nome: "",
                desconto: 0,
                tipoDesconto: "percentual",
                dataInicio: "",
                dataFim: "",
                produtoIds: [],
            });
            onOpenChange(false);
        } catch (error) {

            toast.error("Erro ao criar promoção.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto bg-[#111117] border border-white/10 text-white rounded-2xl sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="font-serif text-2xl text-white">Adicionar Promoção</DialogTitle>
                </DialogHeader>
                <DialogDescription className="text-sm text-gray-400">
                    Preencha os detalhes da nova promoção e clique em "Criar Promoção" para adicioná-lo.
                </DialogDescription>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="nomeNovo" className="text-right text-xs font-medium tracking-wide text-gray-400 uppercase">
                            Nome:
                        </label>
                        <Input
                            id="nomeNovo"
                            value={promocaoNova.nome}
                            onChange={(e) => setPromocaoNova({ ...promocaoNova, nome: e.target.value })}
                            className="col-span-3 bg-white/5 border-white/10 text-white rounded-xl focus-visible:border-violet-500 focus-visible:ring-violet-500/40"
                        />

                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="valorDesconto" className="text-right text-xs font-medium tracking-wide text-gray-400 uppercase">
                            Valor do Desconto:
                        </label>
                        <Input
                            id="valorDesconto"
                            type="number"
                            value={promocaoNova.desconto}
                            onChange={(e) => setPromocaoNova({ ...promocaoNova, desconto: parseFloat(e.target.value) || 0 })}
                            className="col-span-3 bg-white/5 border-white/10 text-white rounded-xl focus-visible:border-violet-500 focus-visible:ring-violet-500/40"
                        />

                    </div>

                    <div>
                        <label htmlFor="tipoDesconto" className="block text-xs font-medium tracking-wide text-gray-400 uppercase mb-1.5">
                            Tipo de Desconto:
                        </label>
                        <select
                            name="tipoDesconto"
                            id="tipoDesconto"
                            value={promocaoNova.tipoDesconto}
                            onChange={(e) => setPromocaoNova({ ...promocaoNova, tipoDesconto: e.target.value })}
                            className="mt-1 block w-full bg-white/5 border border-white/10 text-white rounded-xl p-2.5 text-sm outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500 [&>option]:bg-[#111117]"
                        >
                            <option value="percentual">Percentual</option>
                            <option value="fixo">Fixo</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-medium tracking-wide text-gray-400 uppercase mb-1.5">
                            Data do Início:
                        </label>
                        <Input
                            type="date"
                            value={promocaoNova.dataInicio}
                            onChange={(e) => setPromocaoNova({ ...promocaoNova, dataInicio: e.target.value })}
                            className="bg-white/5 border-white/10 text-white rounded-xl focus-visible:border-violet-500 focus-visible:ring-violet-500/40 scheme-dark"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium tracking-wide text-gray-400 uppercase mb-1.5">
                            Data do Fim:
                        </label>
                        <Input
                            type="date"
                            value={promocaoNova.dataFim}
                            onChange={(e) => setPromocaoNova({ ...promocaoNova, dataFim: e.target.value })}
                            className="bg-white/5 border-white/10 text-white rounded-xl focus-visible:border-violet-500 focus-visible:ring-violet-500/40 scheme-dark"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">
                            Produtos com esta promoção:
                        </label>

                        <Input
                            type="text"
                            placeholder="Buscar produto pelo nome..."
                            className="mb-2 bg-white/5 border-white/10 text-white placeholder-gray-500 rounded-xl focus-visible:border-violet-500 focus-visible:ring-violet-500/40"
                            value={buscaProduto}
                            onChange={(e) => setBuscaProduto(e.target.value)}
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
                                            <Input
                                                type="checkbox"
                                                checked={promocaoNova.produtoIds.includes(Number(produto.id))}
                                                onChange={() => toggleProduto(Number(produto.id))}
                                                className="accent-violet-600 w-4 h-4 mr-2"
                                            />
                                            <span className="text-sm text-gray-200">{produto.nome}</span>
                                            <span className="ml-auto text-sm text-gray-500">
                                                R$ {Number(produto.preco).toFixed(2)}
                                            </span>
                                        </label>
                                    ))}
                            </div>
                        )}
                        {promocaoNova.produtoIds.length > 0 && (
                            <p className="text-xs text-violet-400 mt-1.5">
                                {promocaoNova.produtoIds.length} produto(s) selecionado(s)
                            </p>
                        )}
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        onClick={criarPromocao}
                        disabled={loading}
                        className="bg-linear-to-r from-violet-600 to-indigo-500 hover:from-violet-500 hover:to-indigo-400 text-white rounded-xl"
                    >
                        {loading ? "Criando..." : "Criar Promoção"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}