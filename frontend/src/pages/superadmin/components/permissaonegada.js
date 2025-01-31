import React from 'react';
import { useRouter } from 'next/router';
import { Button } from 'primereact/button';

const PermissaoNegada = () => {
    const router = useRouter();

    return (
        <div className="text-center p-4">
            <h1 className="text-xl font-bold text-red-500 mb-4">Permissão Negada</h1>
            <p className="text-gray-700 mb-6">
                Você não tem permissão para acessar os detalhes deste curso.
            </p>
            <Button
                label="Voltar para Cursos"
                icon="pi pi-arrow-left"
                className="p-button-secondary"
                onClick={() => router.push('/superadmin/cursos')}
            />
        </div>
    );
};

export default PermissaoNegada;
