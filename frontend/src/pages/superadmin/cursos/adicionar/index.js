import React, { useRef, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { parseISO } from 'date-fns';
import { useRouter } from 'next/router';
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';
import { Card } from 'primereact/card';

import { useAuth } from 'meutcc/core/context/AuthContext';
import { AdminCursoService } from '../../../../services/CursoService';
import { GUARDS } from 'meutcc/core/constants';

const CriarCurso = () => {
  const router = useRouter();
  const toast = useRef(null);
  const { user } = useAuth();

  // Estado do formulário (iniciado vazio para criar um curso)
  const [formData, setFormData] = useState({
    nome: '',
    sigla: '',
    descricao: '',
    limite_orientacoes: '',
    regra_sessao_publica: '',
    prazo_propostas_inicio: '',
    prazo_propostas_fim: '',
  });

  // Diálogo de sucesso
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  // Cabeçalho do Card
  const header = (
    <div className="flex justify-between items-center px-6 pt-6">
      <div>
        <h1 className="text-2xl font-bold">Adicionar um Curso ao Sistema</h1>
      </div>
      <Button
        label="Voltar ao Dashboard"
        icon="pi pi-arrow-left"
        className="p-button-secondary"
        onClick={() => router.push('/superadmin/dashboard')}
      />
    </div>
  );

  /**
   * Verifica se todos os campos obrigatórios estão preenchidos.
   */
  const validarCamposObrigatorios = () => {
    const {
      nome,
      sigla,
      descricao,
      limite_orientacoes,
      regra_sessao_publica,
      prazo_propostas_inicio,
      prazo_propostas_fim,
    } = formData;

    return (
      nome.trim() &&
      sigla.trim() &&
      descricao.trim() &&
      limite_orientacoes &&
      regra_sessao_publica &&
      prazo_propostas_inicio &&
      prazo_propostas_fim
    );
  };

  /**
   * Função para salvar (criar) o curso.
   */
  const handleSave = async () => {
    if (!validarCamposObrigatorios()) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Campos obrigatórios',
        detail: 'Preencha todos os campos antes de salvar.',
        life: 3000,
      });
      return;
    }

    try {
      const novoCurso = {
        nome: formData.nome,
        sigla: formData.sigla,
        descricao: formData.descricao,
        limite_orientacoes: formData.limite_orientacoes,
        regra_sessao_publica: formData.regra_sessao_publica,
        prazo_propostas_inicio: formData.prazo_propostas_inicio.split('T')[0],
        prazo_propostas_fim: formData.prazo_propostas_fim.split('T')[0],
      };

      await AdminCursoService.criarCurso(novoCurso);

      toast.current?.show({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Curso criado com sucesso!',
        life: 2000,
      });

      setShowSuccessDialog(true);
    } catch (error) {
      console.error('Erro ao criar o curso:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Erro',
        detail: 'Ocorreu um erro ao criar o curso.',
        life: 3000,
      });
    }
  };

  /**
   * Fecha o diálogo de sucesso e (opcional) reseta o form.
   */
  const handleCloseSuccessDialog = () => {
    setShowSuccessDialog(false);
    // Se quiser limpar o form para criar outro curso:
    // setFormData({ ...formDataInicial });
  };

  return (
    <div className="max-w-screen-lg mx-auto p-4">
      <Card header={header}>
        <Toast ref={toast} />

        {/* Formulário para criar curso */}
        <div className="flex gap-4 mb-4 mt-4">
          <div className="flex-1 max-w-[100px]">
            <label className="block text-sm font-medium mb-2">Sigla *</label>
            <InputText
              value={formData.sigla}
              onChange={(e) => setFormData({ ...formData, sigla: e.target.value })}
              className="w-full"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">Nome do Curso *</label>
            <InputText
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              className="w-full"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Descrição *</label>
          <InputTextarea
            value={formData.descricao}
            onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
            className="w-full"
          />
        </div>

        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">Limite de Orientações *</label>
            <InputText
              type="number"
              value={formData.limite_orientacoes}
              onChange={(e) => setFormData({ ...formData, limite_orientacoes: e.target.value })}
              className="w-full"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">Regra de Sessão Pública *</label>
            <Dropdown
              value={formData.regra_sessao_publica}
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
            <label className="block text-sm font-medium mb-2">
              Prazo de Propostas (Início) *
            </label>
            <Calendar
              value={formData.prazo_propostas_inicio ? parseISO(formData.prazo_propostas_inicio) : null}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  prazo_propostas_inicio: e.value.toISOString(),
                })
              }
              dateFormat="dd/mm/yy"
              showButtonBar
              locale="ptbr"
              className="w-full"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">
              Prazo de Propostas (Fim) *
            </label>
            <Calendar
              value={formData.prazo_propostas_fim ? parseISO(formData.prazo_propostas_fim) : null}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  prazo_propostas_fim: e.value.toISOString(),
                })
              }
              dateFormat="dd/mm/yy"
              showButtonBar
              locale="ptbr"
              className="w-full"
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
        </div>
      </Card>

      {/* Dialog de sucesso */}
      <Dialog
        visible={showSuccessDialog}
        onHide={handleCloseSuccessDialog}
        header="Curso Criado!"
        modal
        footer={
          <div className="flex gap-2">
            <Button
              label="Voltar para o Dashboard"
              icon="pi pi-arrow-left"
              onClick={() => router.push('/superadmin/dashboard')}
              className="p-button-secondary"
            />
            <Button
              label="Ver Cursos"
              icon="pi pi-list"
              onClick={() => router.push('/superadmin/cursos')}
              className="p-button-primary"
            />
          </div>
        }
      >
        <p className="text-lg">O curso foi criado com sucesso!</p>
      </Dialog>
    </div>
  );
};

CriarCurso.guards = [GUARDS.SUPERADMIN];
CriarCurso.title = 'Criar Curso';

export default CriarCurso;
