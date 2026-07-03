import { useState, useEffect } from "react";
import { api } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { DialogNovoProduto } from "@/components/produtos/DialogNovoProduto";
import { DialogEditarProduto } from "@/components/produtos/DialogEditarProduto";
import { DialogExcluirProduto } from "@/components/produtos/DialogExcluirProduto";
import { toast } from "sonner";


function calcularPrecoPromocional(preco, promocao) {
    if (promocao.tipo_desconto === "percentual") {
        return preco - (preco * promocao.valor_desconto) / 100;
    }

    return Math.max(0, preco - promocao.valor_desconto);
}

export default function ProductsPage() {
    const [products, setProducts] = useState([]);

    const [openNovoProduto, setOpenNovoProduto] = useState(false);
    const [produtoEditando, setProdutoEditando] = useState(null);
    const [produtoParaExcluir, setProdutoParaExcluir] = useState(null);
    const [filtroAtivo, setFiltroAtivo] = useState(null);

    useEffect(() => {
        async function fetchProducts() {
            try {
                const response = await api.get('/produtos');
                setProducts(response.data);
            } catch (error) {
                toast.error('Erro ao buscar produtos:', error);
            }
        }
        fetchProducts();
    }, []);

    function handleFiltroChange(value) {
        setFiltroAtivo(value);
    }

    const produtosFiltrados = filtroAtivo === null
        ? products
        : products.filter(p => p.ativo === (filtroAtivo === "ativo"));

    function handleProdutoAdicionado(novoProduto) {
        setProducts((prev) => [...prev, novoProduto]);
    }

    function handleProdutoAtualizado(produtoEditado) {
        setProducts((prev) =>
            prev.map((p) => p.id === produtoEditado.id ? produtoEditado : p)
        );
    }

    function handleProdutoExcluido(idExcluido) {
        setProducts((prev) => prev.filter((p) => p.id !== idExcluido));
    }

    return (
        <div className="min-h-screen bg-[#0a0a0f] bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.05)_1px,transparent_0)] bg-size-[32px_32px] p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-serif text-white mb-1">Produtos</h1>
                        <p className="text-sm text-violet-400">
                            {produtosFiltrados.length} produto{produtosFiltrados.length !== 1 ? "s" : ""} cadastrado{produtosFiltrados.length !== 1 ? "s" : ""}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <label htmlFor="filtroAtivo" className="sr-only">
                            Filtrar por status
                        </label>
                        <Select
                            value={filtroAtivo}
                            onValueChange={handleFiltroChange}
                        >
                            <SelectTrigger className="bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 h-auto gap-2 hover:bg-white/10 [&>svg]:text-gray-400">
                                <span className="text-gray-400">Filtrar:</span>
                                <SelectValue placeholder="Todos" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#111117] border border-white/10 text-white">
                                <SelectItem value="inativo">Inativos</SelectItem>
                                <SelectItem value="ativo">Ativos</SelectItem>
                                <SelectItem value={null}>Todos</SelectItem>
                            </SelectContent>
                        </Select>

                        <Button
                            onClick={() => setOpenNovoProduto(true)}
                            className="bg-linear-to-r from-violet-600 to-indigo-500 hover:from-violet-500 hover:to-indigo-400 text-white rounded-xl px-5 py-2.5 h-auto gap-2"
                        >
                            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M12 5v14M5 12h14" />
                            </svg>
                            Adicionar Produto
                        </Button>
                    </div>
                </div>

                <div className="space-y-3">
                    {produtosFiltrados.map((product) => {
                        const promocoes = (product.produto_promocao ?? [])
                            .map(pp => pp.promocoes)
                            .filter(Boolean);

                        const emPromocao = promocoes.length > 0;

                        return (
                            <div
                                key={product.id}
                                className="p-4 rounded-xl bg-white/3 border border-white/10 flex justify-between items-center"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-500 to-violet-600 flex items-center justify-center shrink-0">
                                        <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M21 8l-9-5-9 5 9 5 9-5z" />
                                            <path d="M3 8v8l9 5 9-5V8" />
                                            <path d="M12 13v8" />
                                        </svg>
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2">
                                            <p className="font-medium text-white">{product.nome}</p>
                                            {emPromocao ? (
                                                <span className="text-xs font-medium bg-emerald-500/15 text-emerald-300 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                                                    Em promoção
                                                </span>
                                            ) : (
                                                <span className="text-xs font-medium bg-white/5 text-gray-400 border border-white/10 px-2 py-0.5 rounded-full">
                                                    Sem promoção
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-2 flex-wrap">
                                            {emPromocao && (
                                                <span className="text-sm text-gray-500 line-through">
                                                    R$ {Number(product.preco).toFixed(2)}
                                                </span>
                                            )}
                                            {!emPromocao && (
                                                <span className="text-sm text-gray-300">
                                                    R$ {Number(product.preco).toFixed(2)}
                                                </span>
                                            )}

                                            {promocoes.map((promocao) => {
                                                const precoFinal = calcularPrecoPromocional(product.preco, promocao);
                                                return (
                                                    <span key={promocao.id} className="flex items-center gap-1.5">
                                                        <span className="text-sm font-bold text-emerald-400">
                                                            R$ {Number(precoFinal).toFixed(2)}
                                                        </span>
                                                        <span className="text-xs text-gray-500">
                                                            ({promocao.tipo_desconto === "percentual"
                                                                ? `${promocao.valor_desconto}% off`
                                                                : `R$ ${Number(promocao.valor_desconto).toFixed(2)} off`})
                                                        </span>
                                                        <span className="text-xs text-orange-400 font-medium flex items-center gap-1">
                                                            <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2">
                                                                <path d="M20.6 12.4L12 21l-9-9 8.6-8.6H20a1 1 0 011 1v8z" />
                                                                <circle cx="16" cy="8" r="1" fill="currentColor" stroke="none" />
                                                            </svg>
                                                            {promocao.nome}
                                                        </span>
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Button
                                        onClick={() => setProdutoEditando(product)}
                                        className="bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg px-4 py-2 h-auto gap-2"
                                    >
                                        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
                                        </svg>
                                        Editar
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        onClick={() => setProdutoParaExcluir(product)}
                                        className="bg-linear-to-r from-red-500 to-rose-500 hover:from-red-400 hover:to-rose-400 text-white rounded-lg px-4 py-2 h-auto gap-2"
                                    >
                                        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0l-1 14a2 2 0 01-2 2H7a2 2 0 01-2-2L4 6h16z" />
                                        </svg>
                                        Excluir
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <DialogNovoProduto
                    open={openNovoProduto}
                    onOpenChange={setOpenNovoProduto}
                    onProdutoAdicionado={handleProdutoAdicionado}
                />

                {produtoEditando && (
                    <DialogEditarProduto
                        open={produtoEditando !== null}
                        onOpenChange={(isOpen) => {
                            if (!isOpen) setProdutoEditando(null);
                        }}
                        produtoInicial={produtoEditando}
                        onProdutoAtualizado={handleProdutoAtualizado}
                    />
                )}
                {produtoParaExcluir && (
                    <DialogExcluirProduto
                        open={produtoParaExcluir !== null}
                        onOpenChange={(isOpen) => {
                            if (!isOpen) setProdutoParaExcluir(null);
                        }}
                        produto={produtoParaExcluir}
                        onProdutoExcluido={handleProdutoExcluido}
                    />
                )}
            </div>
        </div>
    );
}
