import { createContext } from "react";
import type { User } from "../types/User";

export type AuthContextType = {
    user: User | null;
    loading: boolean;
    isConnected: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
};

// Pure context, no JSX — no Fast Refresh issue here
export const AuthContext = createContext<AuthContextType | null>(null);
