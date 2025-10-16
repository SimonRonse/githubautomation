import {createContext, useContext} from "react";
import type { User } from "../types/User";

export type AuthContextType = {
    user: User | null;
    loading: boolean;
    isConnected: boolean;
    login: (username: string, password: string, ghtoken: string) => Promise<void>;
    logout: () => void;
};

// Pure context, no JSX — no Fast Refresh issue here
export const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
