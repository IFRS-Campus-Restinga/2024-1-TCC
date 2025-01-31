import React, { useState, useRef, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import toast from 'react-hot-toast';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { format } from 'date-fns';
import FormularioJustificativa from './formularioJustificativa'
import TccService from 'meutcc/services/TccService';
import { STATUS_TCC } from 'meutcc/core/constants';
import { handleApiResponse } from 'meutcc/core/utils/apiResponseHandler';

export default function ListaTccsPendentes() {
    let emptyTcc = {
        id: null,
        tema: '',
        autor: '',
        resumo: '',
        dataSubmissaoProposta: '',
    };

    const [tccs, setTccs] = useState(null);
    const [TccDialog, setTccDialog] = useState(false);
    const [tcc, setTcc] = useState(emptyTcc);
    const [selectedTcc, setSelectedTcc] = useState(null);
    const toastJanela = useRef(null);

    const [exibeFormulario, setExibeFormulario] = useState(false);

    const fetchTccsPendentes = async () => {
        try {
            const tccsPendentes = await TccService.getListarTccsPendente();
            setTccs(tccsPendentes);
            handleApiResponse(response);
        } catch (error) {
            handleApiResponse(error.response);
            console.error('Erro ao obter convites pendentes:', error);
            // Exiba uma mensagem de erro se necessário
        }
    }

    const atualizaConvitesPosAvaliacao = async () => {
        fetchTccsPendentes()
        hideDialog()
    }

    const aceitarConvite = async () => {
        const data = await toast.promise(TccService.responderProposta(tcc.id, { aprovar: true }), {
            loading: 'Aprovando tcc de proposta tcc...',
            success: 'tcc de proposta tcc aprovado com sucesso!',
            error: 'Erro ao aprovar tcc de proposta tcc.',
        });
        atualizaConvitesPosAvaliacao()
    };


    useEffect(() => {
        fetchTccsPendentes();
    }, []); // Adicionando [] como dependência para garantir que o useEffect seja executado apenas uma vez

    const hideDialog = () => {
        setTccDialog(false);
    };

    const detalhesConvite = (tcc) => {
        setTcc({ ...tcc });
        setTccDialog(true);
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <Button label="Analisar" icon='pi pi-book' severity="success" outlined onClick={() => detalhesConvite(rowData)} />
        );
    };

    const dataSubmissaoBodyTemplate = (rowDate) => {
        return format(rowDate.dataSubmissaoProposta, 'dd/MM/yyyy')
    }

    const coorientadorTemplate = (data) => {
        return data.coorientador && data.coorientador.nome || 'Sem coorientador';
    }

    return (
        <div>
            <Toast ref={toastJanela} />
            <div className="card">
                <DataTable value={tccs} selection={selectedTcc} onSelectionChange={(e) => setSelectedTcc(e.value)} dataKey="id" paginator rows={5} currentPageReportTemplate="Showing {first} to {last} of {totalRecords} tccs">
                    <Column field="tema" header="Tema" sortable style={{ width: '40%' }}></Column>
                    <Column field="autor.nome" header="Autor" sortable style={{ width: '25%' }}></Column>
                    <Column field="orientador.nome" header="Orientador" sortable style={{ width: '25%' }}></Column>
                    <Column body={coorientadorTemplate} header="Coorientador" sortable style={{ width: '25%' }}></Column>
                    <Column body={dataSubmissaoBodyTemplate} field="dataSubmissaoProposta" header="Data de Submissão" sortable style={{ width: '25%' }}></Column>
                    <Column body={actionBodyTemplate} align='center' header="Ações" exportable={false} style={{ width: '10%' }}></Column>
                </DataTable>
            </div>

            <Dialog visible={TccDialog} style={{ width: '32rem' }} header="Analisar" modal className="p-fluid" onHide={hideDialog}>
                <div style={{ marginBottom: '1rem' }}>
                    <label htmlFor="tema" className="font-bold">Tema: </label>
                    <span>{tcc.tema}</span>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label htmlFor="autor.nome" className="font-bold">Autor: </label>
                    <span>{tcc.autor.nome}</span>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label htmlFor="resumo" className="font-bold">Resumo: </label>
                    <span>{tcc.resumo}</span>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label htmlFor="dataSubmissao" className="font-bold">Data de Submissão da Proposta: </label>
                    <span>{tcc.dataSubmissaoProposta && format(tcc.dataSubmissaoProposta, 'dd/MM/yyyy')}</span>
                </div>
                <div className='pt-4 border-0 border-t border-gray-200 border-dashed'>
                    <div className={'flex justify-around ' + (exibeFormulario ? 'hidden' : '')}>
                        <div>
                            <Button label="Aceitar" severity="success" icon='pi pi-thumbs-up-fill' iconPos='right' onClick={aceitarConvite} />
                        </div>
                        <div>
                            <Button label="Recusar" severity="danger" icon='pi pi-thumbs-down-fill' iconPos='right' onClick={() => setExibeFormulario(!exibeFormulario)} />
                        </div>
                    </div>
                    <div className={(!exibeFormulario ? 'hidden' : '')} >
                        <FormularioJustificativa onSetVisibility={setExibeFormulario} onPosAvaliacao={atualizaConvitesPosAvaliacao} tcc={tcc} />
                    </div>
                </div>
            </Dialog>
        </div>
    );
}
