import { useEffect, useState, type ReactNode } from "react";

import { AuthContext, type AuthUser } from "./auth-context";
import { getTokenExpiryTime, isTokenExpired } from "../lib/token";


type AuthProviderProps = {
    children: ReactNode,
};


export function AuthProvider({ children }: AuthProviderProps) {

    const [token, setToken] = useState<string | null>(() => {
        const savedToken = localStorage.getItem("token");

        if(!savedToken){
            return null;
        }

        if(isTokenExpired(savedToken)){
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            return null;
        }

        return savedToken;
    });

    const [user, setUser] = useState<AuthUser | null>(() => {
        const savedUser = localStorage.getItem("user");
        const savedToken = localStorage.getItem("token");

        if(!savedToken){
            return null;
        }

        if(isTokenExpired(savedToken)){
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            return null;
        }

        if (!savedUser) {
            return null;
        }

        try {
            return JSON.parse(savedUser) as AuthUser;
        } catch {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            return null;
        }
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

    //logout when the current token expires
     useEffect(() => {
        if(!token){
            return;
        }

        const expiryTime =  getTokenExpiryTime(token);
        const delay = expiryTime ? Math.max(expiryTime - Date.now(), 0) : 0;


        const timeoutId = window.setTimeout(() => {
            logout();
        }, delay);

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [token]);

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

