import React, { useState, useRef, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import toast from 'react-hot-toast';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import ProfessorService from 'meutcc/services/ProfessorService';
import { format } from 'date-fns';
import FormularioJustificativa from './formularioJustificativa'

export default function ListaProfessores() {
    let emptyProfessor = {
        id: null,
        tipo: '',
        nome: '',
        cpf: '',
        email: '',
        dataCadastro: '',
        area: '',
        grau_academico: '',
        matricula: '',
        identidade: '',
        diploma: '',
        resourcetype: ''
    };

    const [professors, setProfessors] = useState(null);
    const [professorDialog, setProfessorDialog] = useState(false);
    const [professor, setProfessor] = useState(emptyProfessor);
    const [selectedProfessor, setSelectedProfessor] = useState(null);
    const toastJanela = useRef(null);

    const [exibeFormulario, setExibeFormulario] = useState(false);

    const baseURL = process.env.apiBaseUrl;

    const fetchProfessors = async () => {
        try {
            const professoresPendentes = await ProfessorService.getProfessoresPendentes();

            setProfessors(professoresPendentes);
        } catch (error) {
            console.error('Erro ao obter professores pendentes:', error);
            // Exiba uma mensagem de erro se necessário
        }
    }

    const atualizaProfessoresPosAvaliacao = async () => {
        fetchProfessors()
        hideDialog()
    }

    const aprovarProfessor = async () => {
        const data = await toast.promise(ProfessorService.aprovarProfessor(professor.id), {
            loading: 'Aprovando professor...',
            success: 'Professor aprovado com sucesso!',
            error: 'Erro ao aprovar professor.',
        });
        atualizaProfessoresPosAvaliacao()
    };


    useEffect(() => {
        fetchProfessors();
    }, []); // Adicionando [] como dependência para garantir que o useEffect seja executado apenas uma vez

    const hideDialog = () => {
        setProfessorDialog(false);
    };

    const detalhesProfessor = (professor) => {
        setProfessor({ ...professor });
        setProfessorDialog(true);
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <Button label="Analisar" icon='pi pi-search-plus' severity="success" outlined onClick={() => detalhesProfessor(rowData)} />
        );
    };

    return (
        <div>
            <Toast ref={toastJanela} />
            <div className="card">
                <DataTable value={professors} selection={selectedProfessor} onSelectionChange={(e) => setSelectedProfessor(e.value)} dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} currentPageReportTemplate="Showing {first} to {last} of {totalRecords} professors">
                    <Column field="nome" header="Nome" sortable></Column>
                    <Column field="email" header="Email" sortable></Column>
                    <Column field="tipo" header="Tipo de Registro" sortable style={{ width: '12rem' }}></Column>
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '8rem' }}></Column>
                </DataTable>
            </div>

            <Dialog visible={professorDialog} style={{ width: '32rem' }} header="Detalhes do Cadastro" modal className="p-fluid" onHide={hideDialog}>
                <div style={{ marginBottom: '1rem' }}>
                    <label htmlFor="nome" className="font-bold">Nome: </label>
                    <span>{professor.nome}</span>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label htmlFor="cpf" className="font-bold">CPF: </label>
                    <span>{professor.cpf}</span>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label htmlFor="email" className="font-bold">Email: </label>
                    <span>{professor.email}</span>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label htmlFor="dataCadastro" className="font-bold">Data de Cadastro: </label>
                    <span>{professor.dataCadastro && format(professor.dataCadastro, 'dd/MM/yyyy')}</span>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label htmlFor="area" className="font-bold">Área: </label>
                    <span>{professor.area}</span>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label htmlFor="grauAcademico" className="font-bold">Grau Acadêmico: </label>
                    <span>{professor.grau_academico}</span>
                </div>
                {professor.resourcetype === 'ProfessorInterno' && (
                    <div style={{ marginBottom: '1rem' }}>
                        <label htmlFor="matricula" className="font-bold">Matrícula: </label>
                        <span>{professor.matricula}</span>
                    </div>
                )}
                {professor.resourcetype === 'ProfessorExterno' && (
                    <>
                        <div style={{ marginBottom: '1rem' }}>
                            <label htmlFor="identidade" className="font-bold">Identidade: </label>
                            {professor.identidade ? (
                                <a href={`${baseURL}${professor.identidade}`} target="_blank" rel="noopener noreferrer">{professor.identidade.split('/').pop()}</a>
                            ) : (
                                <span>Não disponível</span>
                            )}
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <label htmlFor="diploma" className="font-bold">Diploma: </label>
                            {professor.diploma ? (
                                <a href={`${baseURL}${professor.diploma}`} target="_blank" rel="noopener noreferrer">{professor.diploma.split('/').pop()}</a>
                            ) : (
                                <span>Não disponível</span>
                            )}
                        </div>
                    </>
                )}
                <div className='pt-4 border-0 border-t border-gray-200 border-dashed'>
                    <div className={'flex justify-around ' + (exibeFormulario ? 'hidden' : '')}>
                        <div>
                            <Button label="Aprovar" severity="success" icon='pi pi-thumbs-up-fill' iconPos='right' onClick={aprovarProfessor} />
                        </div>
                        <div>
                            <Button label="Recusar" severity="danger" icon='pi pi-thumbs-down-fill' iconPos='right' onClick={() => setExibeFormulario(!exibeFormulario)} />
                        </div>
                    </div>
                    <div className={(!exibeFormulario ? 'hidden' : '')} >
                        <FormularioJustificativa onSetVisibility={setExibeFormulario} onPosAvaliacao={atualizaProfessoresPosAvaliacao} professor={professor} />
                    </div>
                </div>
            </Dialog>
        </div>
    );
}
