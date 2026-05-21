import { useState, type ReactNode } from "react";

import { AuthContext, type AuthUser } from "./auth-context";


type AuthProviderProps = {
    children: ReactNode,
};

export function AuthProvider({ children }: AuthProviderProps) {
    const [token, setToken] = useState<string | null>(() => {
        return localStorage.getItem("token");
    });

    const [user, setUser] = useState<AuthUser | null>(() => {
        const savedUser = localStorage.getItem("user");
        if (!savedUser) {
            return null;
        }
        return JSON.parse(savedUser) as AuthUser;
    });


    function login(token: string, user: AuthUser) {
        setToken(token);
        setUser(user);
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
    }

    function logout() {
        setToken(null);
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    }

    const isAuthenticated = Boolean(token && user);

    return (
        <AuthContext.Provider
            value={{
                token,
                user,
                isAuthenticated,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );

}

