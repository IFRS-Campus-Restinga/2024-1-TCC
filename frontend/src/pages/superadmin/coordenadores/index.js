import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { Card } from 'primereact/card';
import { Dropdown } from 'primereact/dropdown';
import { useRouter } from 'next/router';
import coordenadorService from '../../../services/CoordenadorService';
import { AdminCursoService } from '../../../services/CursoService';
import { GUARDS } from 'meutcc/core/constants';

const CoordenadoresDoSistema = () => {
    const router = useRouter();

    // Tabelas de coordenadores
    const [coordenadoresComCurso, setCoordenadoresComCurso] = useState([]);
    const [coordenadoresSemCurso, setCoordenadoresSemCurso] = useState([]);

    // Filtros independentes para cada tabela
    const [globalFilterComCurso, setGlobalFilterComCurso] = useState('');
    const [globalFilterSemCurso, setGlobalFilterSemCurso] = useState('');

    // Diálogo de confirmação de desassociar
    const [confirmDialog, setConfirmDialog] = useState(false);
    const [selectedCoordenador, setSelectedCoordenador] = useState(null);

    // Diálogo de associar curso
    const [addDialog, setAddDialog] = useState(false);
    const [selectedCoordenadorToAdd, setSelectedCoordenadorToAdd] = useState(null);
    const [availableCourses, setAvailableCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);

    const toast = useRef(null);

    useEffect(() => {
        carregarCoordenadores();
        fetchCourses();
    }, []);

    /**
     * Carrega e separa coordenadores com/sem curso.
     */
    const carregarCoordenadores = async () => {
        try {
            const response = await coordenadorService.listarCoordenadores();

            const coordsWithCourse = [];
            const coordsWithoutCourse = [];

            for (const coordenador of response) {
                if (coordenador.curso) {
                    const curso = await AdminCursoService.getCursoById(coordenador.curso);
                    coordsWithCourse.push({
                        ...coordenador,
                        curso: `${curso.sigla} - ${curso.nome}`
                    });
                } else {
                    coordsWithoutCourse.push({
                        ...coordenador,
                        curso: 'Nenhum Curso Atribuído'
                    });
                }
            }

            setCoordenadoresComCurso(coordsWithCourse);
            setCoordenadoresSemCurso(coordsWithoutCourse);
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: `Não foi possível carregar os coordenadores: ${error.message}`,
                life: 3000
            });
        }
    };

    /**
     * Carrega lista de cursos, formatando o label como "SIGLA - Nome".
     */
    const fetchCourses = async () => {
        try {
            const data = await AdminCursoService.getCursos();
            const courses = data.map((c) => ({
                ...c,
                label: `${c.sigla} - ${c.nome}` // rótulo que aparece no Dropdown
            }));
            setAvailableCourses(courses);
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: `Não foi possível carregar os cursos: ${error.message}`,
                life: 3000
            });
        }
    };

    /**
     * Clique em "Desassociar" (tabela com curso).
     */
    const onClickDesassociar = (coordenador) => {
        setSelectedCoordenador(coordenador);
        setConfirmDialog(true);
    };

    /**
     * Confirmação de desassociar
     */
    const handleConfirmExcluir = async () => {
        if (!selectedCoordenador) return;

        try {
            await coordenadorService.limparCurso(selectedCoordenador.id);
            toast.current?.show({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Curso removido do coordenador com sucesso.',
                life: 3000
            });
            // Recarrega tabelas
            await carregarCoordenadores();
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: `Erro ao remover curso: ${error.message}`,
                life: 3000
            });
        } finally {
            setConfirmDialog(false);
            setSelectedCoordenador(null);
        }
    };

    /**
     * Clique em "Associar" (tabela sem curso).
     */
    const onClickAssociar = (coordenador) => {
        setSelectedCoordenadorToAdd(coordenador);
        setAddDialog(true);
    };

    /**
     * Confirmar associação: chama coordenadorService.adicionarCurso
     */
    const handleAdicionar = async () => {
        if (!selectedCoordenadorToAdd || !selectedCourse) return;

        try {
            // Chamada ao serviço para associar
            await coordenadorService.adicionarCurso(selectedCoordenadorToAdd.id, selectedCourse.id);

            toast.current?.show({
                severity: 'success',
                summary: 'Sucesso',
                detail: `Coordenador associado ao curso "${selectedCourse.label}" com sucesso!`,
                life: 3000
            });

            // Recarrega tabelas
            await carregarCoordenadores();

            // Fecha e limpa
            setAddDialog(false);
            setSelectedCoordenadorToAdd(null);
            setSelectedCourse(null);
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: `Não foi possível associar o curso: ${error.message}`,
                life: 3000
            });
        }
    };

    /**
     * Header da primeira tabela (coordenadores com curso)
     * com filtro independente (globalFilterComCurso).
     */
    const renderHeaderComCurso = () => (
        <div className="flex justify-between items-center">
            <p className="text-xl">Contas de Coordenador com Curso</p>
            <div className="p-inputgroup" style={{ maxWidth: '40%' }}>
                <span className="p-inputgroup-addon">
                    <i className="pi pi-search"></i>
                </span>
                <InputText
                    className="w-[60%]"
                    placeholder="Buscar Coordenadores"
                    value={globalFilterComCurso}
                    onChange={(e) => setGlobalFilterComCurso(e.target.value)}
                />
            </div>
        </div>
    );

    /**
     * Header da segunda tabela (coordenadores sem curso)
     * com filtro independente (globalFilterSemCurso).
     */
    const renderHeaderSemCurso = () => (
        <div className="flex justify-between items-center">
            <p className="text-xl">Contas de Coordenador sem Curso</p>
            <div className="p-inputgroup" style={{ maxWidth: '40%' }}>
                <span className="p-inputgroup-addon">
                    <i className="pi pi-search"></i>
                </span>
                <InputText
                    className="w-[60%]"
                    placeholder="Buscar Coordenadores"
                    value={globalFilterSemCurso}
                    onChange={(e) => setGlobalFilterSemCurso(e.target.value)}
                />
            </div>
        </div>
    );

    /**
     * Ação da tabela de coordenadores com curso
     */
    const renderActionsComCurso = (coordenador) => (
        <Button
            label="Desassociar"
            icon="pi pi-trash"
            severity='danger'
            onClick={() => onClickDesassociar(coordenador)}
        />
    );

    /**
     * Ação da tabela de coordenadores sem curso
     */
    const renderActionsSemCurso = (coordenador) => (
        <Button
            label="Associar"
            icon="pi pi-plus"
            severity='success'
            onClick={() => onClickAssociar(coordenador)}
        />
    );

    /**
     * Header principal do Card
     */
    const cardHeader = (
        <div className="flex justify-between items-center px-6 pt-6">
            <div>
                <h1 className="text-2xl font-bold">Coordenadores do Sistema</h1>
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
            <Card header={cardHeader}>
                <Toast ref={toast} />

                {/* TABELA 1: Coordenadores COM curso */}
                <DataTable
                    stripedRows
                    value={coordenadoresComCurso}
                    header={renderHeaderComCurso()}
                    globalFilter={globalFilterComCurso}
                    paginator
                    rows={10}
                    emptyMessage="Nenhum coordenador encontrado."
                    className="mt-4"
                >
                    <Column field="curso" header="Curso" sortable />
                    <Column field="email" header="E-mail" sortable />
                    <Column header="Ação" body={renderActionsComCurso}  />
                </DataTable>


            {/* TABELA 2: Coordenadores SEM curso */}
                <DataTable
                    stripedRows
                    value={coordenadoresSemCurso}
                    header={renderHeaderSemCurso()}
                    globalFilter={globalFilterSemCurso}
                    paginator
                    rows={10}
                    emptyMessage="Nenhum coordenador encontrado."
                    className='mt-8'
                >
                    <Column field="nome" header="Nome" sortable className='w-[25%]'/>
                    <Column field="email" header="E-mail" sortable className='w-[55%]'/>
                    <Column header="Ação" body={renderActionsSemCurso} className='w-[20%]'/>
                </DataTable>
            </Card>

            {/* Diálogo: Confirmar DESASSOCIAR */}
            <Dialog
                className="text-center"
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
                            onClick={handleConfirmExcluir}
                        />
                    </div>
                }
            >
                <p className="text-xl">
                    Deseja desassociar o coordenador{' '}
                    <strong>{selectedCoordenador?.email}</strong>
                </p>
                <p className="text-xl">
                    do curso <strong>{selectedCoordenador?.curso}</strong>?
                </p>
            </Dialog>

            {/* Diálogo: ASSOCIAR curso a coordenador SEM curso */}
            <Dialog
                visible={addDialog}
                onHide={() => setAddDialog(false)}
                header="Associar Coordenador a um Curso"
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
                <div className="text-center mb-4">
                    <p className="text-xl">
                        Escolha um curso para associar a{' '}
                        <strong>{selectedCoordenadorToAdd?.nome || 'o coordenador'}</strong>
                    </p>
                </div>
                <Dropdown
                    value={selectedCourse}
                    options={availableCourses}
                    onChange={(e) => setSelectedCourse(e.value)}
                    optionLabel="label"
                    placeholder="Selecione um curso"
                    className="w-full"
                    emptyMessage="Nenhum curso disponível"
                />
            </Dialog>
        </div>
    );
};

CoordenadoresDoSistema.title = 'Coordenadores';
CoordenadoresDoSistema.guards = [GUARDS.SUPERADMIN];

export default CoordenadoresDoSistema;
