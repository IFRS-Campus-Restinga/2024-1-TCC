import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Card } from 'primereact/card';
import DetalhesCurso from '../components/detalhescurso';
import ListaProfessores from '../components/listaprofessores';
import CoordenadorAtual from '../components/coordenadoratual';
import PermissaoNegada from '../components/permissaonegada';
import { AdminCursoService } from '../../../services/CursoService';
import { GUARDS } from 'meutcc/core/constants';
import { useAuth } from 'meutcc/core/context/AuthContext';

const CursoDetalhes = () => {
    const { user } = useAuth();
    const router = useRouter();
    const { id } = router.query;
    const [curso, setCurso] = useState(null);
    const [loading, setLoading] = useState(true);
    const [hasPermission, setHasPermission] = useState(false);

    useEffect(() => {
        if (id) {
            const fetchCurso = async () => {
                try {
                    const data = await AdminCursoService.getCursoById(id);
                    setCurso(data);

                    // Verifica permissão com base no tipo de usuário
                    if (
                        user.resourcetype === 'SuperAdmin' ||
                        (user.resourcetype === 'Coordenador' && user.curso === data.id)
                    ) {
                        setHasPermission(true);
                    }
                } catch (error) {
                    console.error('Erro ao buscar curso:', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchCurso();
        }
    }, [id, user]);

    if (loading) {
        return <div>Carregando...</div>;
    }

    if (!hasPermission) {
        return (
            <div className="p-4 max-w-screen-lg mx-auto">
                <Card className="text-gray-700 border border-gray-200 border-solid rounded-lg shadow-md shadow-gray-300">
                    <PermissaoNegada />
                </Card>
            </div>
        );
    }

    return (
        <div className="p-4 max-w-screen-lg mx-auto">
            <Card className="text-gray-700 border border-gray-200 border-solid rounded-lg shadow-md shadow-gray-300">
                <DetalhesCurso curso={curso} />
                <CoordenadorAtual curso={curso} />
                <Card title={`Professores de ${curso.nome}`}>
                <ListaProfessores curso={curso} />
                </Card>
                
            </Card>
        </div>
    );
};

CursoDetalhes.guards = [GUARDS.COORDENADOR, GUARDS.SUPERADMIN];
CursoDetalhes.title = "Editar Curso";

export default CursoDetalhes;
