
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { FilterMatchMode } from 'primereact/api';
import { Button } from 'primereact/button';
import React, { useState, useEffect, useRef } from 'react';

import { GUARDS } from 'meutcc/core/constants';
import { set } from 'date-fns';
import { Tag } from 'primereact/tag';

import { useAuth } from "meutcc/core/context/AuthContext";

import TccService from 'meutcc/services/TccService';
import Link from 'next/link';
import LoadingSpinner from 'meutcc/components/ui/LoadingSpinner';
import getClassForStatus from 'meutcc/core/utils/corStatus';
import SemestreService from 'meutcc/services/SemestreService';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import styled from 'styled-components';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';

import { handleApiResponse } from 'meutcc/core/utils/apiResponseHandler';

// Estilo para exibir status
const StatusInfo = styled.div`
    margin-bottom: 10px;
    h4 {
        margin-bottom: 5px;
    }
`;

// Estilo para justificativa da recusa
const JustificativaContainer = styled.div`
    margin-top: 1em;
    h4 {
        margin-bottom: 5px;
    }
`;

// Estilo para o botão "Detalhes"
const DetailsButton = styled.div`
    display: flex;
    justify-content: center; /* Centraliza o botão horizontalmente */
    margin-top: 1em; /* Ajustado para ficar abaixo de tudo */
    margin-left: 1em;
    margin-right: 1em;
`;

// Estilo para os textareas para evitar que o conteúdo ultrapasse a largura da div
const TextArea = styled(InputTextarea)`
    width: 100%;
    overflow: auto; /* Adiciona uma barra de rolagem automática se necessário */
    white-space: pre-wrap; /* Mantém quebras de linha no texto */
    word-wrap: break-word; /* Quebra palavras longas */
`;

const orientadoresTemplate = (rowData) => {
    const { orientador, coorientador } = rowData;
    return coorientador && coorientador.nome
        ? `${orientador.nome} e ${coorientador.nome}`
        : orientador.nome;
};

const MeusTccsPage = () => {

    const { user } = useAuth();

    const [loading, setLoading] = useState(false);
    const [possuiProposta, setPossuiProposta] = useState(false);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    const [tableSearchValue, setTableSearchValue] = useState('');
    const [expandedRows, setExpandedRows] = useState({});
    const [estaNoPrazo, setEstaNoPrazo] = useState(false);
    
    const [tccs, setTccs] = useState([]);

    const statusPriority = {
        'PROPOSTA_ANALISE_PROFESSOR': 15,
        'PROPOSTA_ANALISE_COORDENADOR': 14,
        'PREVIA_ORIENTADOR': 13,
        'PREVIA_COORDENADOR': 12,
        'FINAL_ORIENTADOR': 11,
        'FINAL_COORDENADOR': 10,
        'DESENVOLVIMENTO': 9,
        'PREVIA_AGENDADA': 8,
        'PREVIA_OK': 7,
        'FINAL_AGENDADA': 6,
        'AJUSTE': 5,
        'APROVADO': 4,
        'REPROVADO_FINAL': 3,
        'REPROVADO_PREVIA': 2,
        'PROPOSTA_RECUSADA_PROFESSOR': 1,
        'PROPOSTA_RECUSADA_COORDENADOR': 0
    };

    const fetchJaPossuiProposta = async () => {

        setLoading(true);
        try {
            const data = await TccService.getPossuiTcc();
            console.log(data.value);
    
            if (data.possuiProposta == true) {
                setPossuiProposta(true);
            }
            setLoading(false);
            handleApiResponse(response);

        } catch (error) {
            handleApiResponse(error.response);
        }
    }

    const verificarPrazoEnvioProposta = async () => {
        try {
            const data = await SemestreService.getPrazoEnvioProposta();
            const hoje = new Date();
            const dataAbertura = new Date(data.dataAberturaPrazoPropostas);
            const dataFechamento = new Date(data.dataFechamentoPrazoPropostas);
    
            if (hoje >= dataAbertura && hoje <= dataFechamento) {
                setEstaNoPrazo(true);
            } else {
                setEstaNoPrazo(false);
            }

            handleApiResponse(response);
            
        } catch (error) {
            if (error.response) {
                handleApiResponse(error.response);
            } else {
                console.error(error);
                toast.error('Erro inesperado ao buscar prazo de envio de proposta');
            }
        }
    };

    const fetchTccs = async () => {

        setLoading(true);
        let data;
        try {
            if (user.resourcetype == 'ProfessorExterno' || user.resourcetype == 'ProfessorInterno') {
                data = await TccService.getTccsByOrientador();
            }else if(user.resourcetype == 'Estudante') {
                data = await TccService.getTccsByAluno();
            }else if(user.resourcetype == 'Coordenador'){
                data = await TccService.getTccsCoordenacao();
            }

            if (data) {
                const dataWithPriority = data.map(item => ({
                    ...item,
                    priority: statusPriority[item.status[item.status.length - 1].status]
                }));
            
                dataWithPriority.sort((a, b) => b.priority - a.priority);
            
                data = dataWithPriority.map(item => {
                    const { priority, ...originalItem } = item;
                    return originalItem;
                });
            }

            setTccs(data);
            setLoading(false);

            handleApiResponse(response);

        } catch (error) {
            handleApiResponse(error.response);
        }
    };

    React.useEffect(() => {
        if(user.resourcetype == 'Estudante'){
            fetchJaPossuiProposta();
        }
        fetchTccs();
        initFilters();
        verificarPrazoEnvioProposta();
    }, []);

    const initFilters = () => {
        setFilters({
            global: { value: '', matchMode: FilterMatchMode.CONTAINS }
        });
    };

    const onTableSearchChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setTableSearchValue(value);
    };

    const renderHeader = () =>{
        return (
            <div className="flex justify-content-end">
                <IconField iconPosition="left">
                    <InputIcon className="pi pi-search" />
                    <InputText value={tableSearchValue} onChange={onTableSearchChange} placeholder="Buscar por tema" />
                </IconField>
            </div>
        );
    };

    const statusBodyTemplate = (rowData) => {
        return <Tag value={getClassForStatus(rowData?.status?.[rowData.status.length - 1]?.status).status} style={{ backgroundColor: getClassForStatus(rowData?.status?.[rowData.status.length - 1]?.status).cor}}></Tag>
    }

    // Eventos de expansão de linhas

    const allowExpansion = true;

    const onRowToggle = (e) => {
        setExpandedRows(e.data);
    }
    
    const onRowExpand = (e) => {
        console.log('Row Expanded', e.data);
    }
    
    const onRowCollapse = (e) => {
        console.log('Row Collapsed', e.data);
    }

    const rowExpansionTemplate = (data) => {
        // Obtém o último status da lista de status
        const ultimoStatus = data.status[data.status.length - 1] || {};

        // Acessa o `justificativa` do último status
        const justificativa = ultimoStatus.justificativa;
        const status = ultimoStatus.status;
        const statusMensagem = ultimoStatus.statusMensagem;
        return (
            <div>
                <h4>Resumo:</h4>
                <TextArea value={data.resumo} readOnly rows={5} />
                {status && statusMensagem && (
                    <StatusInfo>
                        <h4>Status Atual:</h4>
                        <p>{statusMensagem}</p>
                    </StatusInfo>
                )}
                {status === 'PROPOSTA_RECUSADA_PROFESSOR' && justificativa && (
                    <JustificativaContainer>
                        <h4>Justificativa da Recusa:</h4>
                        <TextArea value={justificativa} readOnly rows={2} />
                    </JustificativaContainer>
                )}
                <DetailsButton>
                    <Link href={`/detalhes-tcc/${data.id}`} passHref>
                        <Button label="Detalhes" icon='pi pi-external-link' iconPos='right' severity="success" />
                    </Link>
                </DetailsButton>
            </div>
        );
    }

    const AbrirProposta = () => {

        if(!estaNoPrazo){
            return(
                <>
                    <div className='py-6 px-2'>
                        <h2 className='heading-1 px-6 text-gray-700 text-center'>O período de envio de propostas está fechado!</h2>
                    </div>
                </>
            );
        }else{
            return(
                <>
                    <div className='py-6 px-2'>
                        <h2 className='heading-1 px-6 text-gray-700 text-center'>Você não possui uma proposta de TCC ativa</h2>
                    </div>
                    <div className='flex justify-center pb-10'>
                        <Link href="/submeter-proposta">
                            <Button label="Submeter Proposta" icon='pi pi-plus' iconPos='right' className='w-full' severity="success"/>
                        </Link>
                    </div>
                </>
            );
        }

    }

    const customCollapsedIcon = <i className="pi pi-angle-down"></i>;
    const customExpandedIcon = <i className="pi pi-angle-up"></i>;

   if(loading){
        return <LoadingSpinner />;
    }

    if(user.resourcetype == 'Estudante'){
        if(possuiProposta){
            return <div className='max-w-screen-lg mx-auto bg-white m-3 mt-6 flex flex-col'>
                <div className='py-3 border-0 border-b border-dashed border-gray-200'>
                    <h1 className='heading-1 px-6 text-gray-700'>Meus TCCs</h1>
                </div>
                    
                    <div className='py-6 px-2'>
                        <DataTable value={tccs} filters={filters} globalFilter={'tema'} expandedRows={expandedRows} 
                            onRowToggle={(e) => setExpandedRows(e.data)} onRowExpand={onRowExpand} onRowCollapse={onRowCollapse} 
                            rowExpansionTemplate={rowExpansionTemplate} dataKey="id" header={renderHeader} tableStyle={{ minWidth: '50rem' }} 
                            emptyMessage="Nenhum tema encontrado" paginator rows={5} expandedRowIcon={customExpandedIcon} collapsedRowIcon={customCollapsedIcon}>

                            <Column field="tema" header="Título" style={{ width: '80%' }}></Column>

                            {(user.resourcetype === 'Coordenador' || user.resourcetype === 'ProfessorInterno' || user.resourcetype === 'ProfessorExterno') && 
                                <Column field="autor.nome" header="Aluno" style={{ width: '20%' }}></Column>
                            }

                            <Column field="semestre.periodo" header="Semestre" style={{ width: '20%' }}></Column>
                            <Column body={orientadoresTemplate} header="Orientadores" style={{ width: '20%' }}></Column>
                            <Column body={statusBodyTemplate} header="Status" style={{ width: '10%' }} ></Column>
                            <Column expander={allowExpansion} style={{ width: '5rem' }} />
                        </DataTable>
                    </div>
        
            </div>;
        }else{
            return(
                tccs.length > 0 ? (
                    <div className='max-w-screen-lg mx-auto bg-white m-3 mt-6 flex flex-col'>
                        <div className='py-3 border-0 border-b border-dashed border-gray-200'>
                            <h1 className='heading-1 px-6 text-gray-700'>Meus TCCs</h1>
                        </div>
                        <AbrirProposta />
                        
                        <div className='py-6 px-2'>
                            <DataTable value={tccs} filters={filters} globalFilter={'tema'} expandedRows={expandedRows} 
                                onRowToggle={(e) => setExpandedRows(e.data)} onRowExpand={onRowExpand} onRowCollapse={onRowCollapse} 
                                rowExpansionTemplate={rowExpansionTemplate} dataKey="id" header={renderHeader} tableStyle={{ minWidth: '50rem' }} 
                                emptyMessage="Nenhum tema encontrado" paginator rows={5} expandedRowIcon={customExpandedIcon} collapsedRowIcon={customCollapsedIcon}>

                                <Column field="tema" header="Título" style={{ width: '80%' }}></Column>

                                {(user.resourcetype === 'Coordenador' || user.resourcetype === 'ProfessorInterno' || user.resourcetype === 'ProfessorExterno') && 
                                    <Column field="autor.nome" header="Aluno" style={{ width: '20%' }}></Column>
                                }

                                <Column field="semestre.periodo" header="Semestre" style={{ width: '20%' }}></Column>
                                <Column body={orientadoresTemplate} header="Orientadores" style={{ width: '20%' }}></Column>
                                <Column body={statusBodyTemplate} header="Status" style={{ width: '10%' }} ></Column>
                                <Column expander={allowExpansion} style={{ width: '5rem' }} />
                            </DataTable>
                        </div>
        
                    </div>
                    
                ) : (
                    <div className='max-w-screen-lg mx-auto bg-white m-3 mt-6 flex flex-col'>
                        <div className='py-3 border-0 border-b border-dashed border-gray-200'>
                            <h1 className='heading-1 px-6 text-gray-700'>Meus TCCs</h1>
                        </div>
                        <AbrirProposta />
                    </div>
                )
            )
        }
    }

    if(user.resourcetype == 'ProfessorExterno' || user.resourcetype == 'ProfessorInterno' || user.resourcetype == 'Coordenador'){
        if(tccs.length == 0){
            return (
                <div className='max-w-screen-lg mx-auto bg-white m-3 mt-6 flex flex-col'>
                    <div className='py-3 border-0 border-b border-dashed border-gray-200'>
                        <h1 className='heading-1 px-6 text-gray-700'>{user.resourcetype === 'Coordenador' ? 'TCCs' : 'Meus TCCs'}</h1>
                    </div>
                    <div className='py-6 px-2'>
                        <h2 className='heading-1 px-6 text-gray-700 text-center'>Nenhum TCC encontrado</h2>
                    </div>
                </div>
            );
        }
        return (
            <div className='max-w-screen-lg mx-auto bg-white m-3 mt-6 flex flex-col'>
            <div className='py-3 border-0 border-b border-dashed border-gray-200'>
                <h1 className='heading-1 px-6 text-gray-700'>{user.resourcetype === 'Coordenador' ? 'TCCs' : 'Meus TCCs'}</h1>
            </div>
                <div className='py-6 px-2'>
                    <DataTable value={tccs} filters={filters} globalFilter={'tema'} expandedRows={expandedRows} 
                        onRowToggle={(e) => setExpandedRows(e.data)} onRowExpand={onRowExpand} onRowCollapse={onRowCollapse} 
                        rowExpansionTemplate={rowExpansionTemplate} dataKey="id" header={renderHeader} tableStyle={{ minWidth: '50rem' }} 
                        emptyMessage="Nenhum tema encontrado" paginator rows={5} expandedRowIcon={customExpandedIcon} collapsedRowIcon={customCollapsedIcon}>

                        <Column field="tema" header="Título" style={{ width: '80%' }}></Column>

                        {(user.resourcetype === 'Coordenador' || user.resourcetype === 'ProfessorInterno' || user.resourcetype === 'ProfessorExterno') && 
                            <Column field="autor.nome" header="Aluno" style={{ width: '20%' }}></Column>
                        }

                        <Column field="semestre.periodo" header="Semestre" style={{ width: '20%' }}></Column>
                        <Column body={orientadoresTemplate} header="Orientadores" style={{ width: '20%' }}></Column>
                        <Column body={statusBodyTemplate} header="Status" style={{ width: '10%' }} ></Column>
                        <Column expander={allowExpansion} style={{ width: '5rem' }} />
                    </DataTable>
                </div>
        
            </div>
        );

    }
}

MeusTccsPage.guards = [GUARDS.ESTUDANTE, GUARDS.PROFESSOR_INTERNO, GUARDS.PROFESSOR_EXTERNO, GUARDS.COORDENADOR];
MeusTccsPage.title = 'Meus TCCs';

export default MeusTccsPage;