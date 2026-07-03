import { createContext, useContext, useState, useEffect } from "react";


const AuthContext = createContext(null);

function decodeToken(token) {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}


function isTokenValid(decoded) {
  if (!decoded || !decoded.exp) return false;
  return decoded.exp * 1000 > Date.now();
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = decodeToken(token);
      if (decoded && isTokenValid(decoded)) {
        setUser({ id: decoded.id, email: decoded.email, perfil: decoded.perfil });
      } else {
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, []);


  function login(token, userData) {
    localStorage.setItem("token", token);
    setUser({ id: userData.id, email: userData.email, perfil: userData.perfil });
  }

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}