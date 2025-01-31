import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Card } from 'primereact/card';
import DetalhesCurso from '../components/detalhescurso';
import ListaProfessores from '../components/listaprofessores';
import CoordenadorAtual from '../components/coordenadoratual';
import { AdminCursoService } from '../../../services/CursoService';
import { GUARDS } from 'meutcc/core/constants';
import { useAuth } from 'meutcc/core/context/AuthContext';

const CursoDetalhes = () => {
    const { user } = useAuth();
    const router = useRouter();
    const { id } = router.query;
    const [curso, setCurso] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            const fetchCurso = async () => {
                try {
                    const data = await AdminCursoService.getCursoById(id);
                    setCurso(data);
                } catch (error) {
                    console.error('Erro ao buscar curso:', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchCurso();
        }
    }, [id]);

    if (loading) {
        return <div>Carregando...</div>;
    }

    const hasPermission =
        (user.resourcetype === 'Coordenador' && user.curso === curso.id) ||
        user.resourcetype === 'SuperAdmin';

    if (!hasPermission) {
        return (
            <div className="p-4 max-w-screen-lg mx-auto">
                <Card className="text-red-500 border border-red-200 border-solid rounded-lg shadow-md shadow-red-300">
                    <h1 className="text-xl font-bold">Permissão Negada</h1>
                    <p>
                        Você não tem permissão para Gerenciar esse Curso.
                    </p>
                </Card>
            </div>
        );
    }

    return (
        <div className="p-4 max-w-screen-lg mx-auto">
            <Card className="text-gray-700 border border-gray-200 border-solid rounded-lg shadow-md shadow-gray-300">
                <DetalhesCurso curso={curso} />
                <CoordenadorAtual curso={curso} />
                <ListaProfessores curso={curso} />
            </Card>
        </div>
    );
};

CursoDetalhes.guards = [GUARDS.COORDENADOR, GUARDS.SUPERADMIN];
CursoDetalhes.title = "Editar Curso";

export default CursoDetalhes;
