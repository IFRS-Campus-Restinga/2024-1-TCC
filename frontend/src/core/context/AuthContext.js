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
    
            if (guards && guards.length > 0 && !accessToken) {
                if (router.pathname.startsWith('/superadmin/') && router.pathname !== '/superadmin/login') {
                    window.location.href = '/superadmin/login';
                } else{
                    window.location.href = ('/auth');
                }
            }
            // Se não houver token, redireciona para o login
            if (!accessToken) {
                setLoading(false);
                return;
            }

    
            try {
                // Chama a API para obter detalhes do usuário
                const data = await AuthService.detalhesUsuario();

                //Redireciona para página de cadastro
                if ('cadastroIncompleto' in data) {
                    setLoading(false);
                    if (router.pathname !== '/cadastro') {
                        window.location.href = ('/cadastro')
                    }
                    return;
                }
    
                setUser(data); // Define o estado do usuário com os dados retornados
    
                // Verifica se os guards permitem o acesso
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
            }
    
            setLoading(false);
        };
    
        fetchUsuario();
    }, [guards, router]);

    const value = {
        user,
    };

    return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}

export const handleUserLogout = async () => {
    localStorage.removeItem('token');
    window.location.href = '/auth';
}
