import React from 'react';
import { useRouter } from 'next/router';
import { Button } from 'primereact/button';

const AcessoProibidoPage = () => {
    const router = useRouter();

    const handleRedirect = () => {
        router.push('/'); // Redireciona para a página inicial
    };

    return (
        <div className="flex flex-col justify-center items-center p-8 bg-gray-50 text-center rounded-md shadow-lg mx-auto mt-20 max-w-md">
            <h1 className="text-3xl font-bold text-red-500 mb-4">Acesso Proibido</h1>
            <p className="text-base text-gray-700 mb-6">
                Você não tem permissão para acessar esta página. <br />
                Por favor, volte para a página inicial e continue navegando.
            </p>
            <Button
                label="Voltar para a Home"
                icon="pi pi-home"
                className="p-button-primary"
                onClick={handleRedirect}
            />
        </div>
    );
};

export default AcessoProibidoPage;
