import { useState, useEffect } from "react";
import { api } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DialogNovoUsuario } from "@/components/usuarios/DialogNovoUsuario";
import { DialogEditarUsuario } from "@/components/usuarios/DialogEditarUsuario";
import { DialogExcluirUsuario } from "@/components/usuarios/DialogExcluirUsuario";
import { toast } from "sonner";

const AVATAR_COLORS = [
    "from-indigo-500 to-violet-600",
    "from-fuchsia-500 to-purple-600",
    "from-blue-500 to-indigo-600",
    "from-emerald-500 to-teal-600",
    "from-rose-500 to-pink-600",
];

function getInitials(nome = "") {
    return nome
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((p) => p[0]?.toUpperCase())
        .join("");
}

function getAvatarColor(id) {
    const index =
        typeof id === "number"
            ? id
            : String(id ?? "")
                .split("")
                .reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return AVATAR_COLORS[index % AVATAR_COLORS.length];
}

export default function UsuariosPage() {
    const [users, setUsers] = useState([]);
    const [open, setOpen] = useState(false);
    const [openUsuarioEditar, setOpenUsuarioEditar] = useState(false);
    const [openUsuarioExcluir, setOpenUsuarioExcluir] = useState(false);
    const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);

    useEffect(() => {
        async function fetchUsers() {
            try {
                const response = await api.get('/usuarios');
                setUsers(response.data);
            } catch (error) {
                toast.error('Erro ao buscar usuários:', error);
            }
        }

        fetchUsers();
    }, []);

    function handleUsuarioAdicionado(novoUsuario) {
        setUsers((prev) => [...prev, novoUsuario]);
    }

    return (
        <>

            <div className="min-h-screen bg-[#0a0a0f] bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.05)_1px,transparent_0)] bg-size-[32px_32px] p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-3xl font-serif text-white mb-1">Usuários</h1>
                            <p className="text-sm text-violet-400">
                                {users.length} usuário{users.length !== 1 ? "s" : ""} cadastrado{users.length !== 1 ? "s" : ""}
                            </p>
                        </div>
                        <Button
                            onClick={() => setOpen(true)}
                            className="bg-linear-to-r from-violet-600 to-indigo-500 hover:from-violet-500 hover:to-indigo-400 text-white rounded-xl px-5 py-2.5 h-auto gap-2"
                        >
                            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M12 5v14M5 12h14" />
                            </svg>
                            Adicionar Usuário
                        </Button>
                    </div>



                    <div className="space-y-3">
                        {users.map((user) => (
                            <div
                                key={user.id}
                                className="p-4 rounded-xl bg-white/3 border border-white/10 flex justify-between items-center"
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`w-10 h-10 rounded-full bg-linear-to-br ${getAvatarColor(
                                            user.id
                                        )} flex items-center justify-center text-white text-sm font-semibold shrink-0`}
                                    >
                                        {getInitials(user.nome)}
                                    </div>
                                    <div>
                                        <p className="font-medium text-white">{user.nome}</p>
                                        <p className="text-sm text-gray-400 flex items-center gap-1.5">
                                            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                                                <rect x="3" y="5" width="18" height="14" rx="2" />
                                                <path d="M3 7l9 6 9-6" />
                                            </svg>
                                            {user.email}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Button
                                        onClick={() => {
                                            setUsuarioSelecionado(user);
                                            setOpenUsuarioEditar(true);
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
                                        onClick={() => {
                                            setUsuarioSelecionado(user);
                                            setOpenUsuarioExcluir(true);
                                        }}
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


            <DialogNovoUsuario
                open={open}
                onOpenChange={setOpen}
                onUsuarioAdicionado={handleUsuarioAdicionado}
            />

            <DialogEditarUsuario
                open={openUsuarioEditar}
                onOpenChange={setOpenUsuarioEditar}
                usuario={usuarioSelecionado}
                onUsuarioAtualizado={(usuarioAtualizado) => {
                    setUsers((prev) =>
                        prev.map((u) => (u.id === usuarioAtualizado.id ? usuarioAtualizado : u))
                    );
                    setOpenUsuarioEditar(false);
                }}
            />

            <DialogExcluirUsuario
                open={openUsuarioExcluir}
                onOpenChange={setOpenUsuarioExcluir}
                usuario={usuarioSelecionado}
                onUsuarioExcluido={(idExcluido) => {
                    setUsers((prev) => prev.filter((u) => u.id !== idExcluido));
                    setOpenUsuarioExcluir(false);
                }}
            />
        </>
    );
}