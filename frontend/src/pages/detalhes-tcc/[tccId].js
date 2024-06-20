import React, { useRef, useState, useEffect } from 'react';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Button } from 'primereact/button';
import TccService from 'meutcc/services/TccService';
import { Tag } from 'primereact/tag';
import { format } from 'date-fns';
import { useRouter } from 'next/router';
import { Dialog } from 'primereact/dialog';
import { Timeline } from 'primereact/timeline';
import { GUARDS } from 'meutcc/core/constants';
import { InputText } from 'primereact/inputtext';
import { useAuth } from 'meutcc/core/context/AuthContext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from "primereact/dropdown";
import ProfessorService from "meutcc/services/ProfessorService";
import toast from "react-hot-toast";
import { Calendar } from 'primereact/calendar';
import CustomAvatar from 'meutcc/components/ui/CustomAvatar';
import { Toast } from 'primereact/toast';

const FileItem = ({ file, prazoEntrega, user }) => {
  const toast = useRef(null);

  const formatFileSize = (size) => {
    if (size === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(size) / Math.log(k));
    return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const prazoExpirado = prazoEntrega && new Date(prazoEntrega) < new Date();

  const erroPrazoExpirado = () => {
    toast.current.show({ severity: 'error', summary: 'Erro', detail: 'O prazo para entrega do documento está expirado!' });
  };


  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '35px', borderRadius: '10px', border: '1px solid #ccc', padding: '10px', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {file?.url ? (
          <div className="file-icon" style={{ margin: 0, marginRight: '1%' }}><i className="pi pi-file-pdf" style={{ fontSize: '250%' }} ></i></div>
        ) : (
          <span>Nenhum documento anexado</span>
        )}
        <div className="file-details" style={{ flex: 1 }}>
          {file?.url && (
            <p>{file.name} <br /> {formatFileSize(file.size)}</p>
          )}
        </div>
      </div>
      <div style={{ display: 'flex' }}>
        {file?.url && (<Button icon="pi pi-download" rounded severity="success" aria-label="Baixar" style={{ marginRight: '10px' }} />)}
        {(file && user.resourcetype === 'Estudante') && (
          <>
            {prazoExpirado ? (
              <>
                <Button icon="pi pi-upload" rounded severity="secondary" aria-label="Anexar" style={{ marginRight: '10px' }} onClick={erroPrazoExpirado} />
                <Toast ref={toast} />
              </>
            ) : (
              <>
                <Button icon="pi pi-upload" rounded severity="success" aria-label="Anexar" style={{ marginRight: '10px' }} />
                {file?.url && (<Button icon="pi pi-trash" rounded severity="danger" aria-label="Excluir" style={{ marginRight: '10px' }} />)}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const SessoesComponent = ({ estudante, orientador, sessoes, user, onSugerirBancaSessaoPreviaClick, onSugerirBancaSessaoFinalClick }) => {
  return (
    <Accordion multiple activeIndex={[0]}>
      {sessoes.map((sessao, index) => (
        <AccordionTab key={index} header={sessao.tipo}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '100%' }}>
              <p><b>Data {sessao.tipo}:</b> {format(sessao.data_inicio || new Date(), 'dd/MM/yyyy HH:mm:ss')}</p>
              <p><b>Local:</b> {sessao.local}</p>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <p style={{ margin: 0, marginRight: '40px' }}><b>Participantes:</b></p>
                <table>
                  <tbody>
                    <tr>
                      <td><b>Autor:</b></td>
                      <td>{estudante.nome}</td>
                    </tr>
                    <tr>
                      <td><b>Orientador:</b></td>
                      <td>{orientador.nome}</td>
                    </tr>
                    {sessao.banca.professores.map((professor, index) => (
                      <tr key={index}>
                        <td><b>Avaliador {index + 1}:</b></td>
                        <td>{professor.nome}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p><b>Parecer Orientador: </b>{sessao.parecer_orientador}</p>
              <p><b>Parecer Coordenador: </b> {sessao.parecer_coordenador}</p>
              <FileItem file={sessao.documentoTCCSessao} prazoEntrega={sessao.prazoEntregaDocumento} user={user} />
              <p><b>Prazo Para Entrega do Documento:</b> {format(sessao.prazoEntregaDocumento || new Date(), 'dd/MM/yyyy HH:mm:ss')}</p>
            </div>
            {user.resourcetype !== 'Estudante' && (
              <div>
                <Button label="Editar" icon="pi pi-pencil" style={{ backgroundColor: '#2F9E41' }} />
              </div>
            )}
          </div>
        </AccordionTab>
      ))}
      {sessoes.length == 0 && (
        <AccordionTab key="sessao-previa" header={"Sessão Prévia"}>
          {user.resourcetype === 'Estudante' || user.resourcetype === 'ProfessorInterno' ?
            <Button style={{ width: '100%', backgroundColor: '#2F9E41' }} label="Sugerir Banca" onClick={() => onSugerirBancaSessaoPreviaClick(true)} />
            : <Button style={{ width: '100%', backgroundColor: '#2F9E41' }} label="Agendar Sessão Prévia" onClick={() => console.log("Adicionar sessão prévia")} />}
        </AccordionTab>
      )}
      {sessoes.some(sessao => sessao.tipo == 'Sessão Prévia') && !sessoes.some(sessao => sessao.tipo == 'Sessão Final') && (
        <AccordionTab key="sessao-final" header={"Sessão Final"}>
          {user.resourcetype === 'Estudante' || user.resourcetype === 'ProfessorInterno' ?
            <Button style={{ width: '100%', backgroundColor: '#2F9E41' }} label="Sugerir Banca" onClick={() => onSugerirBancaSessaoFinalClick(true)} />
            : <Button style={{ width: '100%', backgroundColor: '#2F9E41' }} label="Agendar Sessão Final" onClick={() => console.log("Adicionar sessão final")} />}
        </AccordionTab>
      )}
    </Accordion>
  );
};

const getClassForStatus = (status) => {
  switch (status) {
    case 'PROPOSTA_ANALISE_PROFESSOR':
    case 'PROPOSTA_ANALISE_COORDENADOR':
    case 'DESENVOLVIMENTO':
    case 'PREVIA':
    case 'FINAL':
    case 'AJUSTE':
      return '#FFBF00';
    case 'PROPOSTA_RECUSADA_PROFESSOR':
    case 'PROPOSTA_RECUSADA_COORDENADOR':
    case 'REPROVADO_PREVIA':
    case 'REPROVADO_FINAL':
      return '#D2222D';
    case 'APROVADO':
      return '#007000';
    default:
  }
};

const DetalhesTCC = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter()
  const [TCCData, setTCCData] = useState({});
  const [visibleSessaoPrevia, setVisibleSessaoPrevia] = useState(false);
  const [visibleSessaoFinal, setVisibleSessaoFinal] = useState(false);
  const [selectedOrientador, setSelectedOrientador] = useState([]);
  const [selectedCoorientador, setSelectedCoorientador] = useState([]);
  const [visibleFormTCC, setVisibleFormTCC] = useState(false);
  const [visibleStatus, setVisibleStatus] = useState(false);
  const [orientadores, setOrientadores] = useState([]);
  const [coorientadores, setCoorientadores] = useState([]);
  const [temaMensagemErro, setTemaMensagemErro] = useState('');
  const [resumoMensagemErro, setResumoMensagemErro] = useState('');
  const [orientadorMensagemErro, setOrientadorMensagemErro] = useState('');
  const [coorientadorMensagemErro, setCoorientadorMensagemErro] = useState('');
  const [datetime24h, setDateTime24h] = useState(null);

  const handleEditarClick = () => {
    setVisibleFormTCC(true);
    setSelectedOrientador(TCCData?.orientador.id);
    setSelectedCoorientador(TCCData?.coorientador ? TCCData?.coorientador?.id : null);
  };

  const handleSugerirBancaSessaoPreviaClick = () => {
    setVisibleSessaoPrevia(true);
  };

  const handleSugerirBancaSessaoFinalClick = () => {
    setVisibleSessaoFinal(true);
  };

  const carregarDetalhesTCC = async () => {
    try {
      const tccId = router.query.tccId;
      if (!tccId) return;
      const data = await TccService.getDetalhesTCC(tccId);
      setTCCData(data);
    } catch (error) {
      console.error('Erro ao carregar detalhes:', error);
    }
  };

  useEffect(() => {
    const carregarProfessores = async () => {
      try {
        const data = await ProfessorService.getProfessores();
        const professores = data.map((professor) => ({ name: professor.nome, value: professor.id }));
        setOrientadores(professores);
        setCoorientadores(professores);
        setAvaliadores(data.map((professor) => ({ ...professor, name: professor.nome, value: professor.id })));

      } catch (error) {
        console.error('Erro ao buscar professores', error);
      }
    };

    carregarProfessores();
    carregarDetalhesTCC();
  }, [router]);

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    const jsonData = Object.fromEntries(formData);

    if (jsonData.tema === '') {
      setTemaMensagemErro('O campo tema é obrigatório');
    } else {
      setTemaMensagemErro('');
    }

    if (jsonData.resumo === '') {
      setResumoMensagemErro('O campo resumo é obrigatório');
    } else {
      setResumoMensagemErro('');
    }

    if (!selectedOrientador) {
      setOrientadorMensagemErro('O campo orientador é obrigatório');
    } else {
      setOrientadorMensagemErro('');
    }

    if (selectedOrientador === selectedCoorientador) {
      setCoorientadorMensagemErro('O orientador e coorientador não podem ser a mesma pessoa');
      setLoading(false);
      return;
    }

    const response = await TccService.editarTCC(tccId, jsonData);

    if (response) {
      toast.success('TCC atualizado com sucesso');
    } else {
      toast.error('Erro ao editar proposta');
    }

    setLoading(false);
    carregarDetalhesTCC();
    setVisibleFormTCC(false);
  };

  const [selectedAvaliador1, setSelectedAvaliador1] = useState(null);
  const [selectedAvaliador2, setSelectedAvaliador2] = useState(null);
  const [avaliadores, setAvaliadores] = useState([]);
  const [optionLocalSessao, setOptionLocalSessao] = useState(null);
  const optionsLocalSessao = [
    { label: 'Presencial', value: 'presencial' },
    { label: 'Conferência', value: 'conferencia' }
  ];

  const selectedAvaliadorTemplate = (option, props) => {
    if (option) {
      return (
        <div className="flex items-center">
          <CustomAvatar image={option.avatar} fullname={option.nome} size={30} />
          <div className='ps-3'>{option.name}</div>
        </div>
      );
    }

    return <span>{props.placeholder}</span>;
  };

  const avaliadorOptionTemplate = (option) => {
    return (
      <div className="flex items-center">
        <CustomAvatar image={option.avatar} fullname={option.nome} size={30} />
        <div className='ps-3'>{option.name}</div>
      </div>
    );
  };

  if (TCCData?.id == null) {
    return (
      <div className='flex flex-col max-w-screen-lg m-3 mx-auto mt-6 bg-white'>
        <div className='py-3 border-0 border-b border-gray-200 border-dashed'>
          <h1 className='px-6 text-gray-700 heading-1'>Detalhes do TCC</h1>
        </div>
        <div className='px-2 py-6' style={{ padding: '35px', display: 'flex', justifyContent: 'center' }}>
          <p>TCC não encontrado.</p>
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col max-w-screen-lg m-3 mx-auto mt-6 bg-white'>
      <div className='py-3 border-0 border-b border-gray-200 border-dashed' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 className='px-6 text-gray-700 heading-1'>Detalhes do TCC</h1>
        {(user.resourcetype === 'Estudante' || user.resourcetype === 'Coordenador') && (<div className='mr-5'><Button label="Editar" icon="pi pi-pencil" style={{ backgroundColor: '#2F9E41' }} onClick={handleEditarClick} /></div>)}
      </div>
      <div className='px-2 py-6' style={{ padding: '35px' }}>
        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
          <p><b>Estudante: </b>{TCCData?.autor.nome}</p>
          <p><b>Fase: </b><Tag value={TCCData?.status?.[TCCData?.status.length - 1]?.statusMensagem} style={{ backgroundColor: getClassForStatus(TCCData?.status?.[TCCData?.status.length - 1]?.status) }} onClick={() => setVisibleStatus(true)}></Tag></p>
        </div>
        <p style={{ marginBottom: '35px' }}><b>Orientador:</b> {TCCData?.orientador.nome}</p>
        {TCCData?.coorientador && (<p style={{ marginBottom: '35px' }}><b>Coorientador:</b> {TCCData?.coorientador.nome}</p>)}
        <p style={{ marginBottom: '35px' }}><b>Semestre: </b>{TCCData?.semestre?.periodo}</p>
        <p style={{ marginBottom: '35px' }}><b>Tema:</b> {TCCData?.tema}</p>
        <p style={{ marginBottom: '35px' }}><b>Data de Submissão:</b> {format(TCCData?.dataSubmissaoProposta || new Date(), 'dd/MM/yyyy')}</p>
        <p style={{ marginBottom: '35px' }}><b>Resumo:</b> {TCCData?.resumo}</p>
        {TCCData?.sessoes.length > 0 && (
          <FileItem file={TCCData?.documentoTCC} user={user} />
        )}
        <div>
          {TCCData?.sessoes && (
            <SessoesComponent estudante={TCCData?.autor} orientador={TCCData?.orientador} sessoes={TCCData?.sessoes} user={user} onSugerirBancaSessaoPreviaClick={handleSugerirBancaSessaoPreviaClick}
              onSugerirBancaSessaoFinalClick={handleSugerirBancaSessaoFinalClick} />
          )}
        </div>
      </div>
      <Dialog header="Timeline Do TCC" visible={visibleStatus} style={{ width: '50vw' }} onHide={() => setVisibleStatus(false)}>
        <Timeline value={TCCData?.status} opposite={(item) => item.statusMensagem} content={(item) => <small className="text-color-secondary">{format(item.dataStatus || new Date(), 'dd/MM/yyyy HH:mm:ss')}</small>} />
      </Dialog>
      <Dialog header="Editar TCC" visible={visibleFormTCC} style={{ width: '50vw' }} onHide={() => setVisibleFormTCC(false)}>
        <form onSubmit={onSubmit}>
          {user.resourcetype === 'Estudante' && (
            <div>
              <div className="flex flex-wrap gap-2 mb-3 align-items-center">
                <label htmlFor="tema"><b>Tema</b></label>
                <InputText id="tema" name="tema" placeholder="Tema" className={'w-full ' + (temaMensagemErro ? 'p-invalid' : '')} defaultValue={TCCData?.tema} />
                {temaMensagemErro && <small id="tema-help" className="px-2 py-1 text-red-500">{temaMensagemErro}</small>}
              </div>
              <div className="flex flex-wrap gap-2 mb-3 align-items-center">
                <label htmlFor="resumo"><b>Resumo</b></label>
                <InputTextarea id="resumo" name="resumo" placeholder="Resumo" rows={6} className={'w-full ' + (resumoMensagemErro ? 'p-invalid' : '')} defaultValue={TCCData?.resumo} />
                {resumoMensagemErro && <small id="resumo-help" className="px-2 py-1 text-red-500">{resumoMensagemErro}</small>}
              </div>
            </div>
          )}
          {user.resourcetype === 'Coordenador' && (
            <div>
              <div className="flex flex-wrap gap-2 mb-3 align-items-center">
                <label htmlFor="orientador"><b>Orientador</b></label>
                <Dropdown value={selectedOrientador} name="orientador" onChange={(e) => setSelectedOrientador(e.value)} options={orientadores} optionLabel="name" placeholder="Selecione o orientador" className={"w-full md:w-14rem" + (orientadorMensagemErro ? ' p-invalid' : '')} />
                {orientadorMensagemErro && <small id="orientador-help" className="px-2 py-1 text-red-500">{orientadorMensagemErro}</small>}
              </div>
              {TCCData?.coorientador && (
                <div className="flex flex-wrap gap-2 mb-3 align-items-center">
                  <label htmlFor="coorientador"><b>Corientador</b></label>
                  <Dropdown value={selectedCoorientador} name="coorientador" onChange={(e) => setSelectedCoorientador(e.value)} options={coorientadores} optionLabel="name" placeholder="Selecione o coorientador" className={"w-full md:w-14rem" + (coorientadorMensagemErro ? ' p-invalid' : '')} />
                  {coorientadorMensagemErro && <small id="coorientador-help" className="px-2 py-1 text-red-500">{coorientadorMensagemErro}</small>}
                </div>
              )}
            </div>
          )}
          <div className="flex flex-wrap gap-2 mb-3 align-items-center">
            <Button label={loading ? "Editando TCC" : "Editar TCC"} loading={loading} className="w-full" />
          </div>
        </form>

      </Dialog>
      <Dialog header="Editar Sessão Prévia" visible={visibleSessaoPrevia} style={{ width: '50vw' }} onHide={() => setVisibleSessaoPrevia(false)}>
        <form onSubmit={onSubmit}>
          <div className='grid gap-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div className="flex flex-wrap gap-2 mb-3 align-items-center">
                <label htmlFor="tema"><b>Data</b></label>
                <Calendar value={datetime24h} minDate={new Date()} readOnlyInput onChange={(e) => setDateTime24h(e.value)} className='w-full' />
                {temaMensagemErro && <small id="tema-help" className="px-2 py-1 text-red-500">{temaMensagemErro}</small>}
              </div>
              <div className="flex flex-wrap gap-2 mb-3 align-items-center">
                <label htmlFor="tema"><b>Horário</b></label>
                <Calendar value={datetime24h} readOnlyInput onChange={(e) => setDateTime24h(e.value)} timeOnly className='w-full' />
                {temaMensagemErro && <small id="tema-help" className="px-2 py-1 text-red-500">{temaMensagemErro}</small>}
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className="flex flex-wrap gap-2 mb-3 align-items-center">
                <label htmlFor="tema"><b>Local</b></label>
                <Dropdown value={optionLocalSessao} onChange={(e) => setOptionLocalSessao(e.value)} options={optionsLocalSessao} className='w-full' />
              </div>
              <div className="flex flex-wrap gap-2 mb-3 align-items-center">
                <label htmlFor="tema"><b>Local</b></label>
                <InputText id="tema" name="tema" className={'w-full ' + (temaMensagemErro ? 'p-invalid' : '')} placeholder='Exemplo, Campus Restinga, sala 403' />
                {temaMensagemErro && <small id="tema-help" className="px-2 py-1 text-red-500">{temaMensagemErro}</small>}
              </div>
            </div>


            <div className="flex flex-wrap gap-2 mb-3 align-items-center">
              <label htmlFor="tema"><b>Avaliador 1</b></label>
              <Dropdown value={selectedAvaliador1} onChange={(e) => setSelectedAvaliador1(e.value)} options={avaliadores} optionLabel="name" placeholder="Selecione o nome do avaliador" filter valueTemplate={selectedAvaliadorTemplate} itemTemplate={avaliadorOptionTemplate} className="w-full md:w-14rem" />
              {temaMensagemErro && <small id="tema-help" className="px-2 py-1 text-red-500">{temaMensagemErro}</small>}
            </div>
            <div className="flex flex-wrap gap-2 mb-3 align-items-center">
              <label htmlFor="tema"><b>Avaliador 2</b></label>
              <Dropdown value={selectedAvaliador2} onChange={(e) => setSelectedAvaliador2(e.value)} options={avaliadores} optionLabel="name" placeholder="Selecione o nome do avaliador" filter valueTemplate={selectedAvaliadorTemplate} itemTemplate={avaliadorOptionTemplate} className="w-full md:w-14rem" />
              {temaMensagemErro && <small id="tema-help" className="px-2 py-1 text-red-500">{temaMensagemErro}</small>}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-3 align-items-center">
            <Button label={loading ? "Editando TCC" : "Editar TCC"} loading={loading} className="w-full" />
          </div>
        </form>
      </Dialog>
      <Dialog header="Editar Sessão Final" visible={visibleSessaoFinal} style={{ width: '50vw' }} onHide={() => setVisibleSessaoFinal(false)}>
        <p>A</p>
      </Dialog>
    </div>
  );
};

DetalhesTCC.guards = [GUARDS.ESTUDANTE, GUARDS.PROFESSOR_INTERNO, GUARDS.PROFESSOR_EXTERNO, GUARDS.COORDENADOR]
DetalhesTCC.title = 'Detalhes do TCC';

export default DetalhesTCC;
