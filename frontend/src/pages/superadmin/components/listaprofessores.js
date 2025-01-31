import React, { useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import CustomAvatar from '../../../components/ui/CustomAvatar';
import { AdminCursoService } from '../../../services/CursoService';
import ProfessorService from '../../../services/ProfessorService';
import { FilterMatchMode } from 'primereact/api';

const ListaProfessores = ({ curso }) => {
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        nome: { operator: 'AND', constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        email: { operator: 'AND', constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
    });
    const [professoresDisponiveis, setProfessoresDisponiveis] = useState([]);
    const [professorSelecionado, setProfessorSelecionado] = useState(null);
    const [selectedProfessor, setSelectedProfessor] = useState(null);
    const [confirmDialog, setConfirmDialog] = useState(false);
    const [addDialog, setAddDialog] = useState(false);
    const [professoresAtualizados, setProfessoresAtualizados] = useState(curso.professores);
    const toast = useRef(null);

    const carregarProfessoresDisponiveis = async () => {
        try {
            const todosProfessores = await ProfessorService.getProfessoresInternos();
            const idsJaAssociados = professoresAtualizados.map((prof) => prof.id);
            setProfessoresDisponiveis(
                todosProfessores.filter((professor) => !idsJaAssociados.includes(professor.id))
            );
        } catch (error) {
            toast.current.show({
                severity: 'error',
                summary: 'Erro',
                detail: `Erro Inesperado: ${error.message}`,
                life: 3000,
            });
        }
    };

    const handleAdicionar = async () => {
        if (!professorSelecionado) {
            toast.current.show({
                severity: 'warn',
                summary: 'Atenção',
                detail: 'Selecione um professor para adicionar.',
                life: 3000,
            });
            return;
        }

        try {
            const response = await AdminCursoService.adicionarProfessor(curso.id, professorSelecionado.id);
            toast.current.show({
                severity: 'success',
                summary: 'Sucesso',
                detail: `Professor ${professorSelecionado.nome} adicionado com sucesso!`,
                life: 3000,
            });
            setProfessoresAtualizados(response.professores);
            setAddDialog(false);
        } catch (error) {
            toast.current.show({
                severity: 'error',
                summary: 'Erro',
                detail: `Erro Inesperado: ${error.message}`,
                life: 3000,
            });
        }
    };

    const handleExcluir = async () => {
        try {
            const response = await AdminCursoService.removerProfessor(curso.id, selectedProfessor.id);
            toast.current.show({
                severity: 'success',
                summary: 'Sucesso',
                detail: `Professor ${selectedProfessor.nome} removido com sucesso!`,
                life: 3000,
            });
            setProfessoresAtualizados(response.professores);
            setConfirmDialog(false);
        } catch (error) {
            toast.current.show({
                severity: 'error',
                summary: 'Erro',
                detail: `Erro Inesperado: ${error.message}`,
                life: 3000,
            });
        }
    };

    const renderHeader = () => (
        <div className="flex justify-between items-center">
            <div>
                <Button
                    label="Adicionar Professor"
                    icon="pi pi-plus"
                    severity='success'
                    onClick={() => {
                        setAddDialog(true);
                        carregarProfessoresDisponiveis();
                    }}
                />
            </div>
            <div className="p-inputgroup max-w-40%" id='buscaCurso'>
                <span className="p-inputgroup-addon">
                    <i className="pi pi-search"></i>
                </span>
                <InputText className='text-left'
                    icon="pi pi-search"
                    placeholder="Buscar professores"
                    onInput={(e) => setFilters({ ...filters, global: { value: e.target.value, matchMode: FilterMatchMode.CONTAINS } })}
                />
            </div>
        </div>
    );

    const avatarTemplate = (professor) => (
        <CustomAvatar
            className="w-[55px] h-[55px] text-[23px]"
            image={professor.avatar}
            fullname={professor.nome}
            size="xlarge"
            shape="circle"
        />
    );

    const actionsTemplate = (professor) => (
        <div className="flex gap-2">
            <Button
                label="Perfil"
                icon="pi pi-user"
                className="p-button-rounded p-button-info"
                severity='success'
                outlined
                onClick={() => window.open(`/perfil/${professor.id}`, '_blank')}
            />
            <Button
                label='Excluir'
                icon="pi pi-trash"
                className="p-button-rounded p-button-danger"
                onClick={() => {
                    setSelectedProfessor(professor);
                    setConfirmDialog(true);
                }}
            />
        </div>
    );

    return (
        <div>
            <Toast ref={toast} />

            <DataTable
                value={professoresAtualizados || []}
                stripedRows
                paginator
                rows={5}
                rowsPerPageOptions={[5, 10, 20]}
                globalFilterFields={['nome', 'email']}
                header={renderHeader()}
                filters={filters}
                responsiveLayout="scroll"
                filterDisplay="menu"
                emptyMessage="Nenhum Professor Associado ao Curso"
            >
                <Column header="Avatar" body={avatarTemplate} style={{ width: '100px' }} />
                <Column field="nome" sortable header="Nome" />
                <Column field="email" header="Email" />
                <Column header="Ações" body={actionsTemplate} style={{ width: '200px' }} />
            </DataTable>

            <Dialog
                className='text-center'
                visible={confirmDialog}
                onHide={() => setConfirmDialog(false)}
                header="Atenção"
                footer={
                    <div>
                        <Button
                            label="Cancelar"
                            icon="pi pi-times"
                            className="p-button-text"
                            onClick={() => setConfirmDialog(false)}
                        />
                        <Button
                            label="Confirmar"
                            icon="pi pi-check"
                            className="p-button-danger"
                            onClick={handleExcluir}
                        />
                    </div>
                }
            >
                <p className='text-xl'>
                    Deseja desassociar o professor <strong>{selectedProfessor?.nome}</strong> 
                </p>
                <p className='text-xl'>
                    do curso <strong>{curso.nome}</strong>?
                </p>
            </Dialog>

            <Dialog
                visible={addDialog}
                onHide={() => setAddDialog(false)}
                header="Adicionar Professor"
                filter
                footer={
                    <div>
                        <Button
                            label="Cancelar"
                            icon="pi pi-times"
                            className="p-button-text"
                            onClick={() => setAddDialog(false)}
                        />
                        <Button
                            label="Adicionar"
                            icon="pi pi-check"
                            className="p-button-success"
                            onClick={handleAdicionar}
                        />
                    </div>
                }
            >
                <div className='text-center'>
                    <p className='text-xl'>
                    Escolha um professor para adicionar ao curso
                    </p>
                    <p className='text-xl'>
                    <strong>{curso.nome}</strong>
                    </p>
                    </div>
                    <Dropdown
                        value={professorSelecionado}
                        options={professoresDisponiveis}
                        emptyMessage="Nenhum Disponível para Associar ao Curso"
                        onChange={(e) => setProfessorSelecionado(e.value)}
                        optionLabel="nome"
                        placeholder="Selecione um professor"
                        className="w-full"
                    />

            </Dialog>
        </div>
    );
};

export default ListaProfessores;
