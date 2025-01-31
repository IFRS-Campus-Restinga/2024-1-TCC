import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Card } from 'primereact/card';
import { ToggleButton } from 'primereact/togglebutton';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { useRouter } from 'next/router';
import { useAuth } from 'meutcc/core/context/AuthContext';
import { AdminCursoService } from '../../../services/CursoService';
import { GUARDS } from 'meutcc/core/constants';

const GerenciarVisibilidadeCursos = () => {
  const router = useRouter();
  const toast = useRef(null);
  const { user } = useAuth(); // Se necessário, usuário autenticado

  const [cursos, setCursos] = useState([]);

  // Controle para confirmação ao inativar
  const [confirmInativarDialog, setConfirmInativarDialog] = useState(false);
  const [cursoParaInativar, setCursoParaInativar] = useState(null);

  useEffect(() => {
    carregarCursos();
  }, [user]);

  /**
   * Carrega a lista de cursos: [ { id, sigla, nome, visible, ... }, ... ]
   */
  const carregarCursos = async () => {
    try {
      const data = await AdminCursoService.getCursos();
      setCursos(data);
    } catch (error) {
      toast.current?.show({
        severity: 'error',
        summary: 'Erro',
        detail: `Não foi possível carregar os cursos: ${error.message}`,
        life: 3000,
      });
    }
  };

  /**
   * Altera a visibilidade localmente (somente no state);
   * O salvamento real ocorre no botão "Salvar" de cada linha.
   */
  const handleChangeVisibility = (cursoId, newVisibleValue) => {
    setCursos((prevCursos) =>
      prevCursos.map((curso) =>
        curso.id === cursoId ? { ...curso, visible: newVisibleValue } : curso
      )
    );
  };

  /**
   * Quando o usuário clica em "Salvar":
   *  - Se for ativar (true), chamamos imediatamente o service.
   *  - Se for inativar (false), abrimos o diálogo de confirmação.
   */
  const handleSalvar = (curso) => {
    if (curso.visible === false) {
      setCursoParaInativar(curso);      // Armazenamos o curso no estado
      setConfirmInativarDialog(true);   // Abre o diálogo de confirmação
    } else {
      // Se for “Ativo”, salvamos imediatamente
      salvarVisibilidade(curso);
    }
  };

  /**
   * Após confirmar no diálogo, chamamos o serviço para inativar o curso.
   */
  const confirmarInativar = () => {
    if (!cursoParaInativar) return;
    salvarVisibilidade(cursoParaInativar);
    setConfirmInativarDialog(false);
    setCursoParaInativar(null);
  };

  /**
   * Chama o service para atualizar a visibilidade do curso
   * e recarrega a lista ao concluir.
   */
  const salvarVisibilidade = async (curso) => {
    try {
      await AdminCursoService.atualizarVisibilidade(curso.id, curso.visible);

      toast.current?.show({
        position: 'top-center',
        severity: 'success',
        summary: 'Sucesso',
        detail: `Visibilidade do curso ${curso.sigla} atualizada.`,
        life: 3000,
      });

      // Atualiza a tabela
      carregarCursos();
    } catch (error) {
      toast.current?.show({
        severity: 'error',
        summary: 'Erro',
        detail: `Não foi possível atualizar a visibilidade: ${error.message}`,
        life: 3000,
      });
    }
  };

  /**
   * Renderiza "[SIGLA] - [NOME]" na coluna "Curso".
   */
  const renderCurso = (rowData) => `${rowData.sigla} - ${rowData.nome}`;

  /**
   * Renderiza o ToggleButton na coluna “Visibilidade”.
   */
  const renderToggleVisibility = (rowData) => {
    return (
      <ToggleButton
        className="toggle-ativo-inativo"
        onLabel="Ativo"
        offLabel="Inativo"
        onIcon="pi pi-check"
        offIcon="pi pi-times"
        checked={rowData.visible} 
        onChange={(e) => handleChangeVisibility(rowData.id, e.value)}
      />
    );
  };

  /**
   * Botão "Salvar" na última coluna
   */
  const renderSaveButton = (rowData) => (
    <Button
      label="Salvar"
      icon="pi pi-check"
      className="p-button-success"
      onClick={() => handleSalvar(rowData)}
    />
  );

  // Texto do Tooltip (exibido ao passar o mouse no ícone de info)
  const tooltipContent = `
    Não é possível excluir cursos, pois isso apagaria em cascata todos 
    os TCCs e Estudantes associados a esse curso. Desativar a visibilidade 
    fará com que ele não apareça como opção no momento do cadastro.
  `;

  // Header do Card, com botão "Voltar ao Dashboard"
  const header = (
    <div className="flex justify-between items-center px-6 pt-6">
      <div>
        <h1 className="text-2xl font-bold">Gerenciamento de Cursos</h1>
      </div>
      <Button
        label="Voltar ao Dashboard"
        icon="pi pi-arrow-left"
        className="p-button-secondary"
        onClick={() => router.push('/superadmin/dashboard')}
      />
    </div>
  );

  return (
    <div className="p-4 max-w-screen-lg mx-auto">
      <Card header={header}>
        <Toast ref={toast} />

        {/* Tooltip configurado para mostrar ao passar em cima do ícone */}
        <Tooltip target=".info-icon" content={tooltipContent} position="right" event="hover" className='max-w-[350px]'/>

        <DataTable
          value={cursos}
          paginator
          rows={10}
          emptyMessage="Nenhum curso encontrado."
          className="mt-4"
        >
          {/* Coluna: Curso ([SIGLA] - [NOME]) */}
          <Column header="Curso" body={renderCurso} />

          {/* Coluna: Visibilidade, com tooltip e ToggleButton */}
          <Column
            header={
              <div className="flex items-center">
                <span>Visibilidade</span>
                <i
                  className="pi pi-info-circle ml-2 info-icon"
                  style={{ cursor: 'pointer' }}
                />
              </div>
            }
            body={renderToggleVisibility}
            sortable
          />

          {/* Coluna: Salvar */}
          <Column
            header="Salvar"
            body={renderSaveButton}
            style={{ width: '120px', textAlign: 'center' }}
          />
        </DataTable>
      </Card>

      {/* Diálogo para confirmar se o usuário quer inativar o curso */}
      <Dialog
        visible={confirmInativarDialog}
        onHide={() => setConfirmInativarDialog(false)}
        header="Atenção"
        style={{ maxWidth: '500px' }}
        footer={
          <div className="flex justify-around gap-2">
            <Button
              label="Cancelar"
              icon="pi pi-times"
              className="p-button-text"
              onClick={() => {
                setConfirmInativarDialog(false);
                setCursoParaInativar(null);
              }}
            />
            <Button
              label="Confirmar"
              icon="pi pi-check"
              className="p-button-danger"
              onClick={confirmarInativar}
            />
          </div>
        }
      >
        <p className="text-xl text-center">
          Tem certeza de que deseja tornar o curso{' '}
        </p>
        <p className="text-xl text-center">
          <strong>{cursoParaInativar?.nome}</strong>
        </p>
        <p className="text-xl text-center">
          como <strong>inativo</strong>?
        </p>
      </Dialog>
    </div>
  );
};

// Guards para restringir acesso
GerenciarVisibilidadeCursos.guards = [GUARDS.COORDENADOR, GUARDS.SUPERADMIN];
GerenciarVisibilidadeCursos.title = "Visibilidade de Cursos";

export default GerenciarVisibilidadeCursos;
