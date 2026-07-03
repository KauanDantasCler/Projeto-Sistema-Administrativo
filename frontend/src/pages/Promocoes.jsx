import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { Button } from "@/components/ui/button";
import { DialogNovaPromocao } from "@/components/promocoes/DialogNovaPromocao";
import { DialogEditarPromocao } from "@/components/promocoes/DialogEditarPromocao";
import { DialogExcluirPromocao } from "@/components/promocoes/DialogExcluirPromocao";
import { toast } from "sonner";

function formatDesconto(promocao) {
    const { tipo_desconto, valor_desconto } = promocao;
    if (tipo_desconto === "percentual") {
        return `${valor_desconto}% off`;
    }
    return `R$ ${valor_desconto} off`;
}

export default function PromocoesPage() {
    const [promocoes, setPromocoes] = useState([]);
    const [openNovaPromocao, setOpenNovaPromocao] = useState(false);
    const [openEditarPromocao, setOpenEditarPromocao] = useState(false);
    const [promocaoEditada, setPromocaoEditada] = useState(null);
    const [promocaoParaExcluir, setPromocaoParaExcluir] = useState(null);


    useEffect(() => {
        async function fetchPromocoes() {
            try {
                const response = await api.get('/promocoes');
                setPromocoes(response.data);
            } catch (error) {
                toast.error('Erro ao buscar promoções:', error);
            }
        }

        fetchPromocoes();
    }, []);

    function handlePromocaoAdicionada(novaPromocao) {
        setPromocoes((prev) => [...prev, novaPromocao]);
    }

    function handlePromocaoAtualizada(promocaoEditada) {
        setPromocoes((prev) =>
            prev.map((p) => p.id === promocaoEditada.id ? promocaoEditada : p)
        );
    }

    function handlePromocaoExcluida(idExcluido) {
        setPromocoes((prev) => prev.filter((p) => p.id !== idExcluido));
    }




    return (
        <>

            <div className="min-h-screen bg-[#0a0a0f] bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.05)_1px,transparent_0)] bg-size-[32px_32px] p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-3xl font-serif text-white mb-1">Promoções</h1>
                            <p className="text-sm text-violet-400">
                                {promocoes.length} promoçõe{promocoes.length !== 1 ? "s" : ""} ativa{promocoes.length !== 1 ? "s" : ""}
                            </p>
                        </div>
                        <Button
                            onClick={() => setOpenNovaPromocao(true)}
                            className="bg-linear-to-r from-violet-600 to-indigo-500 hover:from-violet-500 hover:to-indigo-400 text-white rounded-xl px-5 py-2.5 h-auto gap-2"
                        >
                            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M12 5v14M5 12h14" />
                            </svg>
                            Adicionar Promoção
                        </Button>
                    </div>

                    <div className="grid gap-3">
                        {promocoes.map((promocao) => (
                            <div
                                key={promocao.id}
                                className="p-4 rounded-xl bg-white/3 border border-white/10 flex justify-between items-center"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-500 to-violet-600 flex items-center justify-center shrink-0">
                                        <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M20.6 12.4L12 21l-9-9 8.6-8.6H20a1 1 0 011 1v8z" />
                                            <circle cx="16" cy="8" r="1" fill="currentColor" stroke="none" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 flex-wrap mb-1">
                                            <h2 className="font-medium text-white">{promocao.nome}</h2>
                                            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/20">
                                                {formatDesconto(promocao)}
                                            </span>
                                            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-300 border border-orange-500/20">
                                                {promocao.tipo_desconto}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-400 flex items-center gap-1.5">
                                            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                                                <rect x="3" y="4" width="18" height="18" rx="2" />
                                                <path d="M3 9h18M8 2v4M16 2v4" />
                                            </svg>
                                            {promocao.data_inicio ? new Date(promocao.data_inicio.toString().substring(0, 10) + "T00:00:00").toLocaleDateString() : 'N/A'}
                                            {" \u2192 "}
                                            {promocao.data_fim ? new Date(promocao.data_fim.toString().substring(0, 10) + "T00:00:00").toLocaleDateString() : 'N/A'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Button
                                        onClick={() => {
                                            setPromocaoEditada(promocao);
                                            setOpenEditarPromocao(true);
                                        }}
                                        className="bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg px-4 py-2 h-auto gap-2"
                                    >
                                        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
                                        </svg>
                                        Editar
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        onClick={() => setPromocaoParaExcluir(promocao)}
                                        className="bg-linear-to-r from-red-500 to-rose-500 hover:from-red-400 hover:to-rose-400 text-white rounded-lg px-4 py-2 h-auto gap-2"
                                    >
                                        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0l-1 14a2 2 0 01-2 2H7a2 2 0 01-2-2L4 6h16z" />
                                        </svg>
                                        Excluir
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <DialogNovaPromocao
                open={openNovaPromocao}
                onOpenChange={setOpenNovaPromocao}
                onPromocaoAdicionada={handlePromocaoAdicionada}
            />

            <DialogEditarPromocao
                open={openEditarPromocao}
                onOpenChange={setOpenEditarPromocao}
                promocao={promocaoEditada}
                onPromocaoAdicionada={handlePromocaoAtualizada}
            />

            <DialogExcluirPromocao
                open={!!promocaoParaExcluir}
                onOpenChange={() => setPromocaoParaExcluir(null)}
                promocao={promocaoParaExcluir}
                onPromocaoExcluida={handlePromocaoExcluida}
            />
        </>
    );
}