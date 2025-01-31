import React, { useRef, useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { parseISO, format } from 'date-fns';
import { useRouter } from 'next/router';
import {AdminCursoService} from '../../../services/CursoService';
import { InputTextarea } from 'primereact/inputtextarea';

const DetalhesCurso = ({ curso }) => {
    const router = useRouter();
    const toast = useRef(null);
    const [formData, setFormData] = useState({});
    const [originalCurso, setOriginalCurso] = useState({});

    // Atualiza os campos do formulário com os valores recebidos
    useEffect(() => {
        if (curso) {
            setOriginalCurso(curso);
            setFormData(curso);
        }
    }, [curso]);

    // Função para salvar os dados editados
    const handleSave = async () => {
        if (!toast.current) return;

        try {
            const updatedData = {
                nome: formData.nome,
                sigla: formData.sigla,
                descricao: formData.descricao,
                limite_orientacoes: formData.limite_orientacoes,
                regra_sessao_publica: formData.regra_sessao_publica,
                prazo_propostas_inicio: formData.prazo_propostas_inicio.split('T')[0], // Remove o timestamp
            prazo_propostas_fim: formData.prazo_propostas_fim.split('T')[0], // Remove o timestamp
            };

            const response = await AdminCursoService.updateCurso(curso.id, updatedData);

            toast.current.show({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Curso atualizado com sucesso!',
                life: 3000,
            });

            setFormData(response.curso);
            setOriginalCurso(response.curso);
        } catch (error) {
            console.error('Erro ao salvar o curso:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Ocorreu um erro ao salvar o curso.',
                life: 3000,
            });
        }
    };

    // Função para cancelar as alterações
    const handleCancel = () => {
        setFormData(originalCurso);
        toast.current.show({
            severity: 'info',
            summary: 'Cancelado',
            detail: 'Alterações descartadas.',
            life: 3000,
        });
    };

    return (
        <div className="bg-white mb-5 p-4 shadow-md rounded-md border border-gray-200">
            <Toast ref={toast} />
            <div className='flex gap-4 justify-between items-center mb-4'>
                <div>
                    <h2 className="text-2xl font-bold mb-4">{formData.nome} </h2>
                </div>
                <div>
                    <Button
                        label="Voltar para Cursos"
                        icon="pi pi-arrow-left"
                        className="p-button-secondary"
                        onClick={() => router.push('/superadmin/cursos')}
                    />
                </div>
            </div>

            <div className="flex gap-4 mb-4">
                <div className="flex-1 max-w-[100px]">
                    <label className="block text-sm font-medium mb-2">Sigla</label>
                    <InputText
                        value={formData?.sigla || ''}
                        onChange={(e) => setFormData({ ...formData, sigla: e.target.value })}
                        className="w-full"
                    />
                </div>
                <div className="flex-1">
                    <label className="block text-sm font-medium mb-2">Nome do Curso</label>
                    <InputText
                        value={formData?.nome || ''}
                        onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                        className="w-full"
                    />
                </div>
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Descrição</label>
                <InputTextarea
                    value={formData?.descricao || ''}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                    className="w-full"
                />
            </div>

            <div className="flex gap-4 mb-4">
                <div className="flex-1">
                    <label className="block text-sm font-medium mb-2">Limite de Orientações</label>
                    <InputText
                        type="number"
                        value={formData?.limite_orientacoes || ''}
                        onChange={(e) => setFormData({ ...formData, limite_orientacoes: e.target.value })}
                        className="w-full"
                    />
                </div>
                <div className="flex-1">
                    <label className="block text-sm font-medium mb-2">Regra de Sessão Pública</label>
                    <Dropdown
                        value={formData?.regra_sessao_publica || ''}
                        options={[
                            { label: 'Desabilitar', value: 'Desabilitar' },
                            { label: 'Opcional', value: 'Opcional' },
                            { label: 'Obrigatório', value: 'Obrigatório' },
                        ]}
                        onChange={(e) => setFormData({ ...formData, regra_sessao_publica: e.value })}
                        placeholder="Selecione uma regra"
                        className="w-full"
                    />
                </div>
            </div>

            <div className="flex gap-4 mb-4">
                <div className="flex-1">
                    <label className="block text-sm font-medium mb-2">Prazo de Propostas (Início)</label>
                    <Calendar
                        value={parseISO(formData?.prazo_propostas_inicio || new Date().toISOString())}
                        onChange={(e) => setFormData({ ...formData, prazo_propostas_inicio: e.value.toISOString() })}
                        dateFormat="dd/mm/yy"
                        showButtonBar
                        locale="ptbr"
                        className="w-full"
                    />
                </div>
                <div className="flex-1">
                    <label className="block text-sm font-medium mb-2">Prazo de Propostas (Fim)</label>
                    <Calendar
                        value={parseISO(formData?.prazo_propostas_fim || new Date().toISOString())}
                        onChange={(e) => setFormData({ ...formData, prazo_propostas_fim: e.value.toISOString() })}
                        dateFormat="dd/mm/yy"
                        showButtonBar
                        locale="ptbr"
                        className="w-full"
                    />
                </div>
            </div>

            <div className="flex gap-4 mb-4">
                <div className="flex-1">
                    <label className="block text-sm font-medium mb-2">Última Atualização</label>
                    <InputText
                        value={formData?.ultima_atualizacao ? format(parseISO(formData.ultima_atualizacao), 'dd/MM/yyyy - HH:mm') : ''}
                        readOnly
                        className="w-full bg-gray-100 cursor-not-allowed"
                    />
                </div>
                <div className="flex-1">
                    <label className="block text-sm font-medium mb-2">Data de Criação</label>
                    <InputText
                        value={formData?.data_criacao ? format(parseISO(formData.data_criacao), 'dd/MM/yyyy - HH:mm') : ''}
                        readOnly
                        className="w-full bg-gray-100 cursor-not-allowed"
                    />
                </div>
            </div>

            <div className="flex justify-end mt-4">
                <Button
                    label="Salvar"
                    icon="pi pi-check"
                    onClick={handleSave}
                    className="p-button-success mr-2"
                />
                <Button
                    label="Cancelar"
                    icon="pi pi-times"
                    onClick={handleCancel}
                    className="p-button-secondary"
                />
            </div>
        </div>
    );
};

export default DetalhesCurso;
