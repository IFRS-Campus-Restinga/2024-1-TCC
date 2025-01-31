import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Card } from 'primereact/card';
import { AdminCursoService } from '../../../services/CursoService';
import { GUARDS } from 'meutcc/core/constants';
import { useAuth } from 'meutcc/core/context/AuthContext';

const CursosPage = () => {
    const { user } = useAuth();
    const [cursos, setCursos] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchCursos = async () => {
            try {
                const data = await AdminCursoService.getCursos();
                setCursos(data);
            } catch (error) {
                console.error('Erro ao buscar cursos:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCursos();
    }, []);

    const handleEdit = (rowData) => {
        router.push(`/superadmin/cursos/${rowData.id}`);
    };

    const actionTemplate = (rowData) => {
        return (
            <Button
                label="Editar"
                severity="success"
                icon="pi pi-pencil"
                className="p-button-rounded p-button-sm p-button-text"
                onClick={() => handleEdit(rowData)}
            />
        );
    };

    const coordenadorTemplate = (rowData) => {
        return rowData.coordenador_atual
            ? rowData.coordenador_atual.nome
            : <span className="text-gray-500">Sem coordenador</span>;
    };

    const header = (
        <div className="flex justify-between items-center px-6 pt-6">
            <div>
            <h1 className="text-2xl font-bold">Gerenciamento de Cursos</h1>
            </div>
            <Button
                label="Voltar ao Dashboard"
                icon="pi pi-arrow-left"
                className="p-button-secondary"
                onClick={() => router.push('dashboard')}
            />
        </div>
    );

    return (
        <div className="p-4 max-w-screen-lg mx-auto">
            <Card header={header}>
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <ProgressSpinner />
                    </div>
                ) : (
                    <div className='mx-auto'>
                    <DataTable value={cursos} responsiveLayout="scroll" paginator rows={10}>
                        <Column field="sigla" header="Sigla" sortable></Column>
                        <Column field="nome" header="Nome" sortable></Column>
                        <Column body={coordenadorTemplate} header="Coordenador Atual"></Column>
                        <Column body={actionTemplate} header="Editar"></Column>
                    </DataTable>
                    </div>
                )}
            </Card>
        </div>
    );
};

CursosPage.guards = [GUARDS.COORDENADOR, GUARDS.SUPERADMIN];
CursosPage.title = 'Gerenciamento de Cursos';
export default CursosPage;
