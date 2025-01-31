/**
 * Página de Login para SuperAdmin
 *
 * Este componente renderiza o formulário de login para SuperAdmins.
 * Ele utiliza o APPLayout, garantindo que o cabeçalho e o rodapé sejam configurados globalmente.
 *
 * @module pages/superadmin/login
 */

import React, { useState, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useRouter } from "next/router";
import SuperAdminService from "../../../services/SuperAdminService";

const SuperAdminLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const toast = useRef(null);
    const router = useRouter();

    const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const credentials = { email, password };
    console.log("Tentando login com payload:", credentials);

    try {
        const response = await SuperAdminService.login(credentials);
        toast.current.show({
            severity: "success",
            summary: "Login bem-sucedido",
            detail: "Bem-vindo ao sistema SuperAdmin!",
        });
        localStorage.setItem('token', response.token);
        setTimeout(() => router.push("/superadmin/dashboard"), 1000);
    } catch (error) {
        const errorMessage =
            error.response?.data?.message || "Erro ao realizar login. Verifique suas credenciais.";
        toast.current.show({
            severity: "error",
            summary: "Erro no Login",
            detail: errorMessage,
        });
    } finally {
        setLoading(false);
    }
};


    return (
        <div className="flex items-center justify-center bg-gray-100 pt-16">
            <Toast ref={toast} />
            <div className="w-full max-w-sm bg-white rounded-lg shadow-lg p-6">
                <h1 className="text-2xl font-bold text-center text-primary mb-6">Login de SuperAdmin</h1>
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <InputText
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full mt-1"
                            placeholder="Digite seu email"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Senha
                        </label>
                        <InputText
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full mt-1"
                            placeholder="Digite sua senha"
                            required
                        />
                    </div>
                    <Button
                        label={loading ? "Entrando..." : "Entrar"}
                        className="w-full"
                        icon={loading ? "pi pi-spin pi-spinner" : ""}
                        disabled={loading}
                    />
                </form>
            </div>
        </div>
    );
};

export default SuperAdminLogin;
