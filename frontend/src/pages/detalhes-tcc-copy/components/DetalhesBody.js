import React from 'react';
import { useTccContext } from '../context/TccContext';

const DetalhesBody = () => {
    const { tccData, loading, error } = useTccContext();

    if (loading) return <div className="text-center text-gray-500">Carregando...</div>;
    if (error) return <div className="text-center text-red-500">Erro: {error}</div>;

    if (!tccData) return null; // Garantir que tccData esteja disponível

    const { resumo, sessoes, status } = tccData;

    return (
        <div className="bg-white shadow rounded-lg max-w-5xl mx-auto p-6">
            <div className="mb-6">
                <h2 className="text-xl font-medium mb-4">Resumo</h2>
                <p>{resumo || 'Resumo não disponível'}</p>
            </div>
            <div className="mb-6">
                <h2 className="text-xl font-medium mb-4">Sessões</h2>
                {sessoes?.length > 0 ? (
                    <ul className="list-disc pl-6">
                        {sessoes.map((sessao, index) => (
                            <li key={index}>
                                {sessao.tipo} - {sessao.local}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Sem sessões cadastradas.</p>
                )}
            </div>
            <div>
                <h2 className="text-xl font-medium mb-4">Avaliações</h2>
                {status?.length > 0 ? (
                    <ul className="list-disc pl-6">
                        {status.map((statusItem, index) => (
                            <li key={index}>
                                {statusItem.statusMensagem} -{' '}
                                {new Date(statusItem.dataStatus).toLocaleDateString()}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Sem histórico de avaliações.</p>
                )}
            </div>
        </div>
    );
};

export default DetalhesBody;
