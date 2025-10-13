// src/contexts/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import { getJson, postJson } from "../api/http";

type User = { username: string };
type AuthContextType = {
    user: User | null;
    loading: boolean;
    isConnected: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // 🔹 Check JWT when app loads
    useEffect(() => {
        const token = localStorage.getItem("jwt");
        if (!token) {
            setLoading(false);
            return;
        }

        getJson<{ user: User }>("/api/auth/me")
            .then((res) => setUser(res.user))
            .catch(() => {
                console.warn("Invalid or expired token — logging out.");
                localStorage.removeItem("jwt");
                setUser(null);
            })
            .finally(() => setLoading(false));
    }, []);

    // 🔹 Login logic
    const login = async (username: string, password: string) => {
        try {
            const { token, user } = await postJson<{ token: string; user: User }>(
                "/api/auth/login",
                { usernameOrEmail: username, password }
            );
            localStorage.setItem("jwt", token);
            setUser(user);
        } catch (e: any) {
            if (e?.error === "USER_NOT_FOUND" || e?.error === "INCORRECT_PASSWORD") {
                throw new Error("Invalid username or password.");
            } else {
                throw new Error("Login failed. Please try again.");
            }
        }
    };

    // 🔹 Logout logic
    const logout = () => {
        localStorage.removeItem("jwt");
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{ user, loading, isConnected: !!user, login, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
