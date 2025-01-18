

import AuthService from "meutcc/services/AuthService";
import { useRouter } from "next/router";
import React from "react";

const AuthContext = React.createContext({
    user: null,
});

export const useAuth = () => {
    const context = React.useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export const AuthProvider = ({ children, guards }) => {
    const [user, setUser] = React.useState(null);
    const [loading, setLoading] = React.useState(guards.length > 0);

    const router = useRouter();

    React.useEffect(() => {
        const fetchUsuario = async () => {
            const accessToken = localStorage.getItem('token');

           // Exceção para rotas que começam com "/superadmin"
           if (router.pathname.startsWith('/superadmin')) {
                if (accessToken) {
                    await AuthService.logout(); // Realiza o logout
                    localStorage.removeItem('token');
                }
            setLoading(false);
            return;
            }           

            if (guards && guards.length > 0 && !accessToken) {
                window.location.href = ('/auth');
            }

            if (!accessToken) {
                setLoading(false);
                return;
            }

            try {
                const data = await AuthService.detalhesUsuario();

                if ('cadastroIncompleto' in data) {
                    setLoading(false);
                    if (router.pathname !== '/cadastro') {
                        window.location.href = ('/cadastro')
                    }
                    return;
                }
                setUser(data);

                if (guards && guards.length > 0 && !guards.includes(data.resourcetype)) {
                    window.location.href = '/acesso-proibido';
                    return;
                }

            } catch (error) {
                setUser(null);
                localStorage.removeItem('token');
                if (guards && guards.length > 0 && router.pathname !== '/auth') {
                    window.location.href = ('/auth');
                }
                console.error(error);
            }

            setLoading(false);

        }

        fetchUsuario();

    }, []);

    const value = {
        user,
    };

    return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}

export const handleUserLogout = async () => {
    localStorage.removeItem('token');
    window.location.href = '/auth';
}