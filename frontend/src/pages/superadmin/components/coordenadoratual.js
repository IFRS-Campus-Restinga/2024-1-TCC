import React, { useRef, useState } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Timeline } from 'primereact/timeline';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast'; // Importando o Toast
import CustomAvatar from '../../../components/ui/CustomAvatar';
import { AdminCursoService } from '../../../services/CursoService';

const CoordenadorAtual = ({ curso }) => {
    const [visible, setVisible] = useState(false);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [selectedProfessor, setSelectedProfessor] = useState(null);
    const [loading, setLoading] = useState(false);

    const toast = useRef(null); // Referência para o Toast

    const fetchHistorico = async () => {
        try {
            const historico = await AdminCursoService.getHistoricoCoordenadores(curso.id);
            curso.historico_coordenadores = historico;
        } catch (error) {
            console.error('Erro ao buscar histórico de coordenadores:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Não foi possível atualizar o histórico de coordenadores.',
                life: 3000,
            });
        }
    };
    
    const handleSalvar = async () => {
        if (!selectedProfessor) {
            toast.current.show({
                severity: 'warn',
                summary: 'Atenção',
                detail: 'Selecione um professor antes de salvar.',
                life: 3000,
            });
            return;
        }
    
        setLoading(true);
    
        try {
            const response = await AdminCursoService.trocarCoordenador(curso.id, selectedProfessor.id);
    
            // Atualiza os dados do card com o novo coordenador
            curso.coordenador_atual = response.coordenador_atual;
    
            // Atualiza a timeline
            await fetchHistorico();
    
            toast.current.show({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Coordenador atualizado com sucesso.',
                life: 3000,
            });
    
            setDialogVisible(false);
        } catch (error) {
            console.error('Erro ao trocar coordenador:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Ocorreu um erro ao atualizar o coordenador.',
                life: 3000,
            });
        } finally {
            setLoading(false);
        }
    };
    
    

    const professorOptionTemplate = (option) => {
        return (
            <div className="flex items-center">
                <CustomAvatar
                    className="w-[40px] h-[40px] text-[20px]"
                    image={option.avatar}
                    fullname={option.nome}
                    size="large"
                    shape="circle"
                />
                <span className="ml-3">{option.nome}</span>
            </div>
        );
    };

    const selectedProfessorTemplate = (option) => {
        if (option) {
            return (
                <div className="flex items-center">
                    <CustomAvatar
                        className="w-[40px] h-[40px] text-[20px]"
                        image={option.avatar}
                        fullname={option.nome}
                        size="large"
                        shape="circle"
                    />
                    <span className="ml-3">{option.nome}</span>
                </div>
            );
        }
        return <span>Selecione um professor</span>;
    };

    return (
        <>
            <Toast ref={toast} /> {/* Componente Toast */}
            <Card className="mb-4" title="Coordenador Atual">
                <div className="flex items-center justify-between">
                    {/* Avatar e informações */}
                    <div className="flex items-center">
                        <CustomAvatar
                            className="w-[80px] h-[80px] text-[40px]"
                            image={curso?.coordenador_atual?.avatar}
                            fullname={curso?.coordenador_atual?.nome || ''}
                            size="xlarge"
                            shape="circle"
                        />
                        <div className="ml-5">
                            <div>
                                <label className="text-lg font-bold text-gray-700">
                                    {curso.coordenador_atual?.nome || 'Coordenador não definido'}
                                </label>
                            </div>
                            <div>
                                <span className="text-sm text-gray-700">
                                    {`Email: ${curso.coordenador_atual?.email || 'Não disponível'}`}
                                </span>
                            </div>
                        </div>
                    </div>
                    {/* Botões */}
                    <div className="flex flex-col items-end gap-2">
                        <Button
                            className='w-full'
                            label="Ver Histórico"
                            severity="secondary"
                            icon="pi pi-history"
                            outlined
                            onClick={() => setVisible(true)}
                        />
                        <Button
                            label="Alterar Coordenador"
                            icon="pi pi-user-edit"
                            severity="secondary"
                            onClick={() => setDialogVisible(true)}
                        />
                    </div>
                </div>
                {/* Dialogs */}
                <Dialog
                    header="Histórico de Alterações"
                    visible={visible}
                    style={{ width: '50vw' }}
                    onHide={() => setVisible(false)}
                >
                    <Timeline
                        value={curso.historico_coordenadores || []}
                        opposite={(item) => (
                            <div className="text-sm text-gray-700">
                                {item.nome || item.coordenador || 'Coordenador não identificado'}
                            </div>
                        )}
                        content={(item) => (
                            <div className="text-sm text-gray-600">
                                <small>{item.data_alteracao}</small>
                            </div>
                        )}
                    />
                </Dialog>

                <Dialog
                    header={`Alterar Coordenador - ${curso?.nome || ''}`}
                    visible={dialogVisible}
                    style={{ width: '40vw' }}
                    onHide={() => setDialogVisible(false)}
                    footer={
                        <div className="flex justify-end gap-2">
                            <Button
                                label="Cancelar"
                                icon="pi pi-times"
                                severity='danger'
                                outlined
                                onClick={() => setDialogVisible(false)}
                            />
                            <Button
                                label="Salvar"
                                icon="pi pi-check"
                                severity='success'
                                onClick={handleSalvar}
                                loading={loading}
                            />
                        </div>
                    }
                >
                    <Dropdown
                        value={selectedProfessor}
                        options={curso.professores}
                        onChange={(e) => setSelectedProfessor(e.value)}
                        optionLabel="nome"
                        valueTemplate={selectedProfessorTemplate}
                        itemTemplate={professorOptionTemplate}
                        placeholder="Selecione um professor"
                        className="w-full"
                    />
                </Dialog>
            </Card>
        </>
    );
};

export default CoordenadorAtual;
