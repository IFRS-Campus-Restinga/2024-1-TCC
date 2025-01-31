import React from 'react';
import { useTccContext } from '../context/TccContext'; // Contexto do TCC
import StatusTag from './StatusTag'; // Componente existente
import EditarForm from './EditarForm'; // Componente existente

const DetalhesHeader = () => {
    const { tccData, user } = useTccContext(); // Obtendo dados do contexto

    // Desestruturação dos dados
    const { tema, autor, orientador, coorientador, semestre, resumo, dataSubmissaoProposta, status } = tccData || {};

    // Verificar se o usuário é coordenador
    const isCoordenador = user?.tipo === 'Coordenador';

    // Verificar se o usuário pode editar
    const isEditAllowed =
        isCoordenador || 
        user?.id === tccData?.autor?.id || 
        user?.id === tccData?.orientador?.id;

    return (
        <div className="bg-white shadow rounded-lg max-w-5xl mx-auto p-6">
            {/* Título e Status */}
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-left text-gray-700 text-2xl font-bold flex-1">
                    {tema || 'Título do TCC'}
                </h1>
                <div className="flex items-center gap-4">
                    {/* StatusTag */}
                    <StatusTag
                        status={status?.[status.length - 1]?.statusMensagem || 'Indefinido'}
                        className="px-4 py-2 text-lg" // Estilo maior para a Tag de Status
                    />
                </div>
            </div>

            {/* Informações Principais */}
            <div className="mb-4">
                <p className="text-gray-600">
                    <span className="font-bold">Aluno: </span>{autor?.nome || 'Não definido'}
                </p>
                <p className="text-gray-600">
                    <span className="font-bold">Orientador: </span>{orientador?.nome || 'Não definido'}
                </p>
                {coorientador?.nome && (
                    <p className="text-gray-600">
                        <span className="font-bold">Coorientador: </span>{coorientador.nome}
                    </p>
                )}
            </div>

            {/* Semestre e Data de Submissão */}
            <div className="flex gap-8 mb-4">
                <p className="text-gray-600">
                    <span className="font-bold">Semestre: </span>{semestre?.periodo || 'Não definido'}
                </p>
                <p className="text-gray-600">
                    <span className="font-bold">Data de Submissão: </span>
                    {dataSubmissaoProposta ? new Date(dataSubmissaoProposta).toLocaleDateString() : 'Não definida'}
                </p>
            </div>

            {/* Resumo e Botão Editar */}
            <div className="mb-4 flex justify-between items-center">
                <div className="flex-1">
                    <h2 className="text-lg font-semibold text-gray-700">Resumo:</h2>
                    <p className="text-gray-600 whitespace-pre-line">{resumo || 'Nenhum resumo fornecido.'}</p>
                </div>
                {isEditAllowed && (
                    <div className="ml-4">
                        <EditarForm
                            buttonLabel="Editar TCC"
                            buttonClassName="p-button-rounded p-button-success px-6"
                            isCoordenador={isCoordenador} // Passa a informação se o usuário é coordenador
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default DetalhesHeader;
