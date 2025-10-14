import { useState, useEffect, type ReactNode } from "react";
import { AuthContext } from "./AuthContext.ts";
import { getJson, postJson } from "../api/http";
import type { User } from "../types/User";

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const login = async (username: string, password: string) => {
        try {
            const { token, user } = await postJson<{ token: string; user: User }>(
                "/api/auth/login",
                { usernameOrEmail: username, password }
            );
            localStorage.setItem("jwt", token);
            console.log("user after login:", user);
            setUser(user);
        } catch (e: unknown) {
            if (typeof e === "object" && e && "error" in e &&
                ((e as { error?: string }).error === "USER_NOT_FOUND" ||
                    (e as { error?: string }).error === "INCORRECT_PASSWORD")) {
                throw new Error("Invalid username or password.");
            } else {
                throw new Error("Login failed. Please try again.");
            }
        }
    };

    const logout = () => {
        localStorage.removeItem("jwt");
        setUser(null);
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const ghToken = urlParams.get("github_token");
        if (ghToken) {
            localStorage.setItem("jwt", ghToken);
            window.history.replaceState({}, document.title, window.location.pathname);
            getJson<{ user: User }>("/api/auth/me")
                .then((res) => setUser(res.user))
                .catch(() => {
                    localStorage.removeItem("jwt");
                    setUser(null);
                })
                .finally(() => setLoading(false));
        } else {
            // existing token logic
            const token = localStorage.getItem("jwt");
            if (!token) return setLoading(false);

            getJson<{ user: User }>("/api/auth/me")
                .then((res) => setUser(res.user))
                .catch(() => {
                    localStorage.removeItem("jwt");
                    setUser(null);
                })
                .finally(() => setLoading(false));
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, isConnected: !!user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
