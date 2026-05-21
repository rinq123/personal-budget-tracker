import { createContext } from "react";

export type AuthUser = {
    id: string;
    email: string;
    firstName: string;
    createdAt: string;
};

export type AuthContextValue = {
    token: string | null;
    user: AuthUser | null;
    isAuthenticated: boolean;
    login: (token: string, user: AuthUser) => void;
    logout: () => void;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);