import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../services/api";
import { toast } from "sonner";

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showSenha, setShowSenha] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await api.post("/auth/login", { email, senha });
            const { token, usuario } = response.data;
            login(token, usuario);
            toast.success("Login realizado com sucesso!");
            navigate("/produtos");
        } catch (err) {
            setError("Falha no login. Verifique suas credenciais.");
            toast.error("Falha no login. Verifique suas credenciais.");
        } finally {
            setLoading(false);
        }
    }



    return (
        <div className="flex items-center justify-center min-h-screen bg-[#0a0a0f] bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.06)_1px,transparent_0)] bg-size-[32px_32px] px-4">
            <form
                onSubmit={handleSubmit}
                className="bg-[#111117]/80 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl w-full max-w-sm"
            >

                <h2 className="text-3xl font-serif text-white mb-2">Bem-vindo de volta</h2>
                <p className="text-gray-400 text-sm mb-8">Entre com suas credenciais para continuar.</p>

                {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

                <div className="mb-5">
                    <label
                        className="block mb-2 text-xs font-medium tracking-wide text-gray-400 uppercase"
                        htmlFor="email"
                    >
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        placeholder="voce@empresa.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-500 px-4 py-3 rounded-xl outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition"
                        required
                    />
                </div>

                <div className="mb-6">
                    <div className="relative">
                        <input
                            type={showSenha ? "text" : "password"}
                            id="senha"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-500 px-4 py-3 pr-11 rounded-xl outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowSenha((v) => !v)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
                            tabIndex={-1}
                        >
                            {showSenha ? (
                                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M9.5 5.1A9.9 9.9 0 0112 5c5 0 9 4 10 7-.4 1.2-1.2 2.5-2.3 3.6M6.5 6.6C4.6 7.9 3.1 9.8 2 12c1 3 5 7 10 7 1.3 0 2.5-.2 3.6-.6" />
                                </svg>
                            ) : (
                                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" />
                                    <circle cx="12" cy="12" r="3" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 px-4 rounded-xl text-white font-medium flex items-center justify-center gap-2 transition ${loading
                            ? "bg-gray-600 cursor-not-allowed"
                            : "bg-linear-to-r from-violet-600 to-indigo-500 hover:from-violet-500 hover:to-indigo-400"
                        }`}
                >
                    {loading ? (
                        "Carregando..."
                    ) : (
                        <button>
                            Entrar
                        </button>
                    )}
                </button>
            </form>
        </div>
    );
}