import React from 'react';
import { useRouter } from 'next/router';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import AuthService from 'meutcc/services/AuthService';
import { GUARDS } from 'meutcc/core/constants';
import { useAuth } from 'meutcc/core/context/AuthContext';

const DashboardSuperAdmin = () => {
    const router = useRouter();
    const { user } = useAuth(); // Obtém o usuário autenticado

    return (
        <div className="flex flex-col items-center justify-center bg-gray-100 pt-4 pb-12">
            <h1 className="text-4xl font-bold mb-8 text-gray-800">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
                {/* Card Gerenciar Cursos */}
                <Card
                    title="Gerenciar Cursos"
                    subTitle="Gerencia as configurações, coordenador e professores de um curso."
                    className="hover:shadow-lg transition-shadow"
                >
                    <Button
                        label="Acessar"
                        icon="pi pi-arrow-right"
                        className="p-button-outlined p-button-info"
                        onClick={() => router.push('/superadmin/cursos')}
                    />
                </Card>

                {/* Card Gerenciar Coordenadores */}
                {user?.resourcetype === 'SuperAdmin' && (
                    <Card
                        title="Gerenciar Coordenadores"
                        subTitle="Associe contas de coordenador a um curso já cadastrado no sistema."
                        className="hover:shadow-lg transition-shadow"
                    >
                        <Button
                            label="Acessar"
                            icon="pi pi-arrow-right"
                            className="p-button-outlined p-button-warning"
                            onClick={() => router.push('/superadmin/coordenadores')}
                        />
                    </Card>
                )}

                {/* Card Adicionar Curso */}
                {user?.resourcetype === 'SuperAdmin' && (
                    <Card
                        title="Adicionar Curso"
                        subTitle="Adicione um novo curso ao sistema de Gerenciamento de TCCs."
                        className="hover:shadow-lg transition-shadow"
                    >
                        <Button
                            label="Acessar"
                            icon="pi pi-plus"
                            className="p-button-outlined p-button-success"
                            onClick={() => router.push('/superadmin/cursos/adicionar')}
                        />
                    </Card>
                )}

                {/* Card Visibilidade de Curso */}
                <Card
                    title="Visibilidade de Curso"
                    subTitle="Altere a visibilidade dos cursos do existentes do sistema."
                    className="hover:shadow-lg transition-shadow"
                >
                    <Button
                        label="Acessar"
                        icon="pi pi-eye-slash"
                        className="p-button-outlined p-button-danger"
                        onClick={() => router.push('/superadmin/cursos/visibilidade')}
                    />
                </Card>
            </div>
        </div>
    );
};

DashboardSuperAdmin.guards = [GUARDS.COORDENADOR, GUARDS.SUPERADMIN];
DashboardSuperAdmin.title = 'Gerenciamento do Sistema';
export default DashboardSuperAdmin;
