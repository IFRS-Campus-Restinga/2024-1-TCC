import React, { useRef, useState, useEffect } from 'react';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Button } from 'primereact/button';
import TccService from 'meutcc/services/TccService';
import AvaliacaoService from 'meutcc/services/AvaliacaoService';
import { Tag } from 'primereact/tag';
import { format } from 'date-fns';
import { useRouter } from 'next/router';
import { Dialog } from 'primereact/dialog';
import { Timeline } from 'primereact/timeline';
import { GUARDS } from 'meutcc/core/constants';
import { InputText } from 'primereact/inputtext';
import { useAuth } from 'meutcc/core/context/AuthContext';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import ProfessorService from 'meutcc/services/ProfessorService';
import toast from 'react-hot-toast';
import { Calendar } from 'primereact/calendar';
import CustomAvatar from 'meutcc/components/ui/CustomAvatar';
import { Toast } from 'primereact/toast';
import { Checkbox } from "primereact/checkbox";
import FormSessao from 'meutcc/components/ui/FormSessao';
import SessoesService from 'meutcc/services/SessoesService';
import { handleApiResponse } from 'meutcc/core/utils/apiResponseHandler';
import { ToggleButton } from 'primereact/togglebutton';

const FileItem = ({ file, sessaoId, prazoEntrega, user, onFileUpload, onFileDelete, onFileDownload, avaliacaoAjusteId, avaliacaoId, orientador }) => {
    const toast = useRef(null);
    const fileInputRef = useRef(null);
    const [inputId, setInputId] = useState('');

    const formatFileSize = (size) => {
        if (!size) return '';
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

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            onFileUpload(file, sessaoId, avaliacaoId, avaliacaoAjusteId);
            if (fileInputRef.current) {
                fileInputRef.current.value = null; // Reseta o campo de input de arquivo
            }
        }
    };

    const handleFileDelete = () => {
        onFileDelete(sessaoId, avaliacaoId, avaliacaoAjusteId);
        if (fileInputRef.current) {
            fileInputRef.current.value = null; // Reseta o campo de input de arquivo
        }
    };

    const handleFileDownload = () => {
        onFileDownload(sessaoId, avaliacaoId, avaliacaoAjusteId);
    };

    useEffect(() => {
        if (avaliacaoId) {
            setInputId(`fileUpload-avaliacao-${avaliacaoId}`);
        } else if (avaliacaoAjusteId) {
            setInputId(`fileUpload-avaliacao-ajuste-${avaliacaoAjusteId}`);
        } else if (sessaoId) {
            setInputId(`fileUpload-sessao-${sessaoId}`);
        } else {
            setInputId(`fileUpload-tcc`);
        }
    }, [avaliacaoId, avaliacaoAjusteId, sessaoId]);

    return (
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '35px', borderRadius: '10px', border: '1px solid #ccc', padding: '10px', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                {file && file.name ? (
                    <>
                        <div className="file-icon" style={{ margin: 0, marginRight: '1%' }}><i className="pi pi-file-pdf" style={{ fontSize: '250%' }}></i></div>
                        <div className="file-details" style={{ flex: 1 }}>
                            <p>{file.name} <br /> {formatFileSize(file.size)}</p>
                        </div>
                    </>
                ) : (
                    <span>Nenhum documento anexado</span>
                )}
            </div>
            <div style={{ display: 'flex' }}>
                {file && file.name ? (
                    <>
                        <Button icon="pi pi-download" rounded severity="success" aria-label="Baixar" style={{ marginRight: '10px' }} onClick={handleFileDownload} />
                        {(user.resourcetype === 'Estudante' && !avaliacaoId) && (
                            <>
                                {prazoExpirado ? (
                                    <>
                                        <Button icon="pi pi-upload" rounded severity="secondary" aria-label="Anexar" style={{ marginRight: '10px' }} onClick={erroPrazoExpirado} />
                                        <Toast ref={toast} />
                                    </>
                                ) : (
                                    <>
                                        <Button icon="pi pi-trash" rounded severity="danger" aria-label="Excluir" style={{ marginRight: '10px' }} onClick={handleFileDelete} />
                                    </>
                                )}
                            </>
                        )}
                        {(orientador && user.id === orientador.id && avaliacaoId) && (
                            <>
                                {prazoExpirado ? (
                                    <>
                                        <Button icon="pi pi-upload" rounded severity="secondary" aria-label="Anexar" style={{ marginRight: '10px' }} onClick={erroPrazoExpirado} />
                                        <Toast ref={toast} />
                                    </>
                                ) : (
                                    <>
                                        <Button icon="pi pi-trash" rounded severity="danger" aria-label="Excluir" style={{ marginRight: '10px' }} onClick={handleFileDelete} />
                                    </>
                                )}
                            </>
                        )}
                    </>
                ) : (
                    <>
                        {(user.resourcetype === 'Estudante' && !avaliacaoId && !prazoExpirado) && (
                            <>
                                <input type="file" accept="application/pdf" style={{ display: 'none' }} onChange={handleFileChange} id={`fileUpload-${sessaoId}${avaliacaoId}${avaliacaoAjusteId}`} ref={fileInputRef} />
                                <Button icon="pi pi-upload" rounded severity="success" aria-label="Anexar" onClick={() => document.getElementById(`fileUpload-${sessaoId}${avaliacaoId}${avaliacaoAjusteId}`).click()} />
                            </>
                        )}
                        {(user.resourcetype === 'Estudante' && !avaliacaoId && prazoExpirado) && (
                            <>
                                <Button icon="pi pi-upload" rounded severity="secondary" aria-label="Anexar" style={{ marginRight: '10px' }} onClick={erroPrazoExpirado} />
                                <Toast ref={toast} />
                            </>
                        )}
                        {(orientador && user.id === orientador.id && avaliacaoId && !prazoExpirado) && (
                            <>
                                <input type="file" accept="application/pdf" style={{ display: 'none' }} onChange={handleFileChange} id={inputId} ref={fileInputRef} />
                                <Button icon="pi pi-upload" rounded severity="success" aria-label="Anexar" onClick={() => document.getElementById(inputId).click()} />
                            </>
                        )}
                        {(orientador && user.id === orientador.id && avaliacaoId && prazoExpirado) && (
                            <>
                                <Button icon="pi pi-upload" rounded severity="secondary" aria-label="Anexar" style={{ marginRight: '10px' }} onClick={erroPrazoExpirado} />
                                <Toast ref={toast} />
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

const SessoesComponent = ({ estudante, orientador, sessoes, status, user, onSugerirBancaSessaoPreviaClick, onSugerirBancaSessaoFinalClick, onAvaliacaoClick, onAvaliacaoAjusteClick, onAvaliacaoPreviaClick, onFileUpload, onFileDelete, onFileDownload, onFichaAvaliacaoPreenchidaDownload }) => {
    return (
        <Accordion multiple activeIndex={[0]}>
            {sessoes.map((sessao, index) => (
                <AccordionTab key={index} header={sessao.tipo}>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <div style={{ width: '100%' }}>
                            <p className="mb-7"><b>Data {sessao.tipo}:</b> {format(sessao.data_inicio || new Date(), 'dd/MM/yyyy HH:mm')}</p>
                            <p className="mb-7"><b>Local:</b> {sessao.local}</p>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <p className="mb-7" style={{ margin: 0, marginRight: '40px' }}><b>Participantes:</b></p>
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
                            <p className="mb-7"><b>Parecer Orientador: </b>{sessao.parecer_orientador}</p>
                            <p className="mb-7"><b>Parecer Coordenador: </b> {sessao.parecer_coordenador}</p>
                            <p><b>Documento TCC {sessao.tipo}:</b></p>
                            <FileItem file={sessao.documentoTCCSessao} prazoEntrega={sessao.prazoEntregaDocumento} user={user} onFileUpload={onFileUpload} onFileDelete={onFileDelete} onFileDownload={onFileDownload} sessaoId={sessao.id} />
                            {(sessao.tipo === 'Sessão Final' && new Date(sessao.data_inicio) < new Date()) && (
                                <>
                                    <p><b>Ficha Avaliação:</b></p>
                                    <FileItem orientador={orientador} avaliacaoId={sessao.avaliacao.id} file={sessao.avaliacao.ficha_avaliacao} user={user} onFileUpload={onFileUpload} onFileDelete={onFileDelete} onFileDownload={onFileDownload} />
                                </>
                            )}
                            <p className="mb-7"><b>Prazo Para Entrega do Documento:</b> {format(sessao.prazoEntregaDocumento || new Date(), 'dd/MM/yyyy HH:mm')}</p>
                            {(sessao.validacaoCoordenador == true && sessao.tipo === 'Sessão Final' && new Date(sessao.data_inicio) < new Date() && sessao.avaliacao.ficha_avaliacao.url == null && (user.id === orientador.id || sessao.banca.professores.map(professor => professor.id).includes(user.id))) && (
                                <div>
                                    {sessao.avaliacao.avaliado_orientador == true && sessao.avaliacao.avaliado_avaliador1 == true && sessao.avaliacao.avaliado_avaliador2 == true ? (
                                        <div className='flex flex-column'>
                                            <Button className="w-1/5" label="Avaliado" icon="pi pi-check" severity="info" />
                                            <a className="ml-10 flex items-center w-full"
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                onFichaAvaliacaoPreenchidaDownload(sessao.avaliacao.id);
                                            }}
                                        >
                                            Clique aqui para fazer o download da ficha de avaliação preenchida
                                        </a>
                                        </div>
                                    ) : ((user.id === orientador.id && sessao.avaliacao.avaliado_orientador == true) || (user.id === sessao.banca.professores[0].id && sessao.avaliacao.avaliado_avaliador1 == true) || (user.id === sessao.banca.professores[1].id && sessao.avaliacao.avaliado_avaliador2 == true)) ? (
                                        <Button label="Aguardando Avaliações" icon="pi pi-clock" severity="warning" />
                                    ) : (
                                        <Button label="Avaliar" icon="pi pi-file-edit" style={{ backgroundColor: '#2F9E41' }} onClick={() => onAvaliacaoClick(sessao.id)} />
                                    )}
                                </div>
                            )}
                            {(sessao.validacaoCoordenador == true && sessao.tipo === 'Sessão Prévia' && new Date(sessao.data_inicio) < new Date() && (user.id === orientador.id || sessao.banca.professores.map(professor => professor.id).includes(user.id))) && (
                                <div>
                                    {sessao.avaliado == true ? (
                                        <div className='flex flex-column'>
                                            <Button className="w-1/5" label="Avaliado" icon="pi pi-check" severity="info" />
                                        </div>
                                    ) : (
                                        <Button label="Avaliar" icon="pi pi-file-edit" style={{ backgroundColor: '#2F9E41' }} onClick={() => onAvaliacaoPreviaClick(sessao.id)} />
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </AccordionTab>
            ))}
            {sessoes.length === 0 && (
                <AccordionTab key="sessao-previa" header={"Sessão Prévia"}>
                    {user.resourcetype === 'Estudante' || user.resourcetype === 'ProfessorInterno' ?
                        <Button style={{ width: '100%', backgroundColor: '#2F9E41' }} label="Sugerir Banca" onClick={() => onSugerirBancaSessaoPreviaClick(true)} />
                        : <Button style={{ width: '100%', backgroundColor: '#2F9E41' }} label="Agendar Sessão Prévia" onClick={() => console.log("Adicionar sessão prévia")} />}
                </AccordionTab>
            )}
            {sessoes.some(sessao => (sessao.tipo === 'Sessão Prévia' && sessao.avaliado == true)) && status.some(stat => stat.status === 'PREVIA_OK') && !sessoes.some(sessao => sessao.tipo === 'Sessão Final') && (
                <AccordionTab key="sessao-final" header={"Sessão Final"}>
                    {user.resourcetype === 'Estudante' || user.resourcetype === 'ProfessorInterno' ?
                        <Button style={{ width: '100%', backgroundColor: '#2F9E41' }} label="Sugerir Banca" onClick={() => onSugerirBancaSessaoFinalClick(true)} />
                        : <Button style={{ width: '100%', backgroundColor: '#2F9E41' }} label="Agendar Sessão Final" onClick={() => console.log("Adicionar sessão final")} />}
                </AccordionTab>
            )}
            {sessoes.map(sessao => (
                sessao.avaliacao && sessao.avaliacao.ajuste && (
                    <AccordionTab key="ajuste" header="Ajuste">
                        <div className="ajuste">
                            <p className="mb-7"><b>Data de Entrega dos Ajustes: </b>{format(sessao.avaliacao.data_entrega_ajuste || new Date(), 'dd/MM/yyyy HH:mm')}</p>
                            <p className="mb-7"><b>Ajustes Necessários: </b>{sessao.avaliacao.descricao_ajuste}</p>
                            <p><b>Documento TCC Versão Definitiva:</b></p>
                            <FileItem avaliacaoAjusteId={sessao.avaliacao.id} file={sessao.avaliacao.tcc_definitivo} prazoEntrega={sessao.avaliacao.data_entrega_ajuste} user={user} onFileUpload={onFileUpload} onFileDelete={onFileDelete} onFileDownload={onFileDownload} />
                            {(sessao.avaliacao.parecer_orientador !== null || sessao.avaliacao.parecer_orientador !== '') && (
                                <p className="mb-7"><b>Parecer Orientador: </b>{sessao.avaliacao.parecer_orientador}</p>
                            )
                            }
                            {
                                (user.id === orientador.id) && (
                                    <>
                                        {(sessao.avaliacao.parecer_orientador === null || sessao.avaliacao.parecer_orientador === '') ? (
                                            <Button label="Avaliar" icon="pi pi-file-edit" style={{ backgroundColor: '#2F9E41' }} onClick={() => onAvaliacaoAjusteClick(sessao.avaliacao.id)} />
                                        ) : (
                                            <Button label="Avaliado" icon="pi pi-check" severity={'info'} />
                                        )}
                                    </>

                                )
                            }
                        </div >
                    </AccordionTab >
                )
            ))}
        </Accordion >
    );
};
const getClassForStatus = (status) => {
    switch (status) {
        case 'PROPOSTA_ANALISE_PROFESSOR':
        case 'PROPOSTA_ANALISE_COORDENADOR':
        case 'DESENVOLVIMENTO':
        case 'PREVIA_ORIENTADOR':
        case 'PREVIA_COORDENADOR':
        case 'PREVIA_AGENDADA':
        case 'PREVIA_OK':
        case 'FINAL_ORIENTADOR':
        case 'FINAL_COORDENADOR':
        case 'FINAL_AGENDADA':
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
            return '#000000';
    }
};

const DetalhesTCC = () => {
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const router = useRouter();
    const [TCCData, setTCCData] = useState({});
    const [visibleSessao, setVisibleSessao] = useState(false);
    const [selectedOrientador, setSelectedOrientador] = useState([]);
    const [selectedCoorientador, setSelectedCoorientador] = useState([]);
    const [visibleAvaliacao, setVisibleAvaliacao] = useState(false);
    const [visibleFormTCC, setVisibleFormTCC] = useState(false);
    const [visibleStatus, setVisibleStatus] = useState(false);
    const [visibleAvaliarAjuste, setVisibleAvaliarAjuste] = useState(false);
    const [visibleAvaliarPrevia, setVisibleAvaliarPrevia] = useState(false);
    const [orientadores, setOrientadores] = useState([]);
    const [coorientadores, setCoorientadores] = useState([]);
    const [temaMensagemErro, setTemaMensagemErro] = useState('');
    const [resumoMensagemErro, setResumoMensagemErro] = useState('');
    const [orientadorMensagemErro, setOrientadorMensagemErro] = useState('');
    const [coorientadorMensagemErro, setCoorientadorMensagemErro] = useState('');
    const [datetime24h, setDateTime24h] = useState(null);
    const [documentoTCC, setDocumentoTCC] = useState(null);
    const [necessarioAdequacoes, setNecessarioAdequacoes] = React.useState(false);
    const [ajuste, setAjuste] = React.useState(false);
    const [previa, setPrevia] = React.useState(false);
    const [autorizacaoPublicacao, setAutorizacaoPublicacao] = useState(null);
    const [sessaoId, setSessaoId] = useState(0);
    const [avaliacaoId, setAvaliacaoId] = useState(0);
    const [sessaoPreviaId, setSessaoPreviaId] = useState(0);
    const [adequacoesMensagemErro, setAdequacoesMensagemErro] = useState('');
    const [notaEstruturaMensagemErro, setNotaEstruturaMensagemErro] = useState('');
    const [notaRelevanciaMensagemErro, setNotaRelevanciaMensagemErro] = useState('');
    const [notaConhecimentoMensagemErro, setNotaConhecimentoMensagemErro] = useState('');
    const [notaBibliografiaMensagemErro, setNotaBibliografiaMensagemErro] = useState('');
    const [notaRecursosMensagemErro, setNotaRecursosMensagemErro] = useState('');
    const [notaConteudoMensagemErro, setNotaConteudoMensagemErro] = useState('');
    const [notaSinteseMensagemErro, setNotaSinteseMensagemErro] = useState('');
    const [dataEntregaMensagemErro, setDataEntregaMensagemErro] = useState('');
    const [horarioEntregaMensagemErro, setHorarioEntregaMensagemErro] = useState('');
    const [parecerOrientadorErro, setParecerOrientadorErro] = useState('');
    const [avaliarAjusteErro, setAvaliarAjusteErro] = useState('');

    const handleEditarClick = () => {
        setVisibleFormTCC(true);
        setSelectedOrientador(TCCData?.orientador.id);
        setSelectedCoorientador(TCCData?.coorientador ? TCCData?.coorientador?.id : null);
    };

    const handleSugerirBancaSessaoPreviaClick = () => {
        setSessaoForm({ ...sessaoForm, tipo: 'previa', idTCC: TCCData.id });
        setVisibleSessao(true);
    };

    const handleSugerirBancaSessaoFinalClick = () => {
        setSessaoForm({ ...sessaoForm, tipo: 'final', idTCC: TCCData.id });
        setVisibleSessao(true);
    };

    const handleAvaliacao = (sessaoIdAvaliacao) => {
        setSessaoId(sessaoIdAvaliacao)
        setVisibleAvaliacao(true);
    };

    const handleAvaliacaoAjuste = (avaliacaoAjusteId) => {
        setAvaliacaoId(avaliacaoAjusteId)
        setVisibleAvaliarAjuste(true);
    };

    const handleAvaliacaoPrevia = (sessaoPreviaId) => {
        setSessaoPreviaId(sessaoPreviaId)
        setVisibleAvaliarPrevia(true);
    };

    const carregarDetalhesTCC = async () => {
        try {
            const tccId = router.query.tccId;
            if (!tccId) return;
            const data = await TccService.getDetalhesTCC(tccId);
            setTCCData(data);
        } catch (error) {
            handleApiResponse(error.response);
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
                handleApiResponse(error.response);
                console.error('Erro ao buscar professores', error);
            }
        };

        carregarProfessores();
        carregarDetalhesTCC();
    }, [router]);

    const onSubmitAvaliacao = async (event) => {
        event.preventDefault();
        setLoading(true);
        const formData = new FormData(event.currentTarget);
        const jsonData = Object.fromEntries(formData);

        if (jsonData.estrutura_trabalho == '') {
            setNotaEstruturaMensagemErro('A nota de Estrutura do Trabalho é obrigatória');
            setLoading(false);
            return;
        } else {
            setNotaEstruturaMensagemErro('');
        }

        if (jsonData.relevancia_originalidade_qualidade == '') {
            setNotaRelevanciaMensagemErro('A nota de Relevância, Originalidade e Qualidade do Conteúdo é obrigatória');
            setLoading(false);
            return;
        } else {
            setNotaRelevanciaMensagemErro('');
        }

        if (jsonData.grau_conhecimento == '') {
            setNotaConhecimentoMensagemErro('A nota de Grau de Conhecimento é obrigatória');
            setLoading(false);
            return;
        } else {
            setNotaConhecimentoMensagemErro('');
        }

        if (jsonData.bibliografia_apresentada == '') {
            setNotaBibliografiaMensagemErro('A nota de Bibliografia Apresentada é obrigatória');
            setLoading(false);
            return;
        } else {
            setNotaBibliografiaMensagemErro('');
        }

        if (jsonData.utilizacao_recursos_didaticos == '') {
            setNotaRecursosMensagemErro('A nota de Utilização de Recursos Didáticos é obrigatória');
            setLoading(false);
            return;
        } else {
            setNotaRecursosMensagemErro('');
        }

        if (jsonData.conteudo_apresentacao == '') {
            setNotaConteudoMensagemErro('A nota de Conteúdo da Apresentação é obrigatória');
            setLoading(false);
            return;
        } else {
            setNotaConteudoMensagemErro('');
        }

        if (jsonData.utilizacao_tempo_sintese == '') {
            setNotaSinteseMensagemErro('A nota de Utilização do Tempo e Poder de Síntese é obrigatória');
            setLoading(false);
            return;
        } else {
            setNotaSinteseMensagemErro('');
        }

        if (necessarioAdequacoes && jsonData.data_entrega === '') {
            setDataEntregaMensagemErro('O campo Data é obrigatório');
            setLoading(false);
            return;
        } else {
            setDataEntregaMensagemErro('');
        }

        if (necessarioAdequacoes && jsonData.horario_entrega === '') {
            setHorarioEntregaMensagemErro('O campo Horário é obrigatório');
            setLoading(false);
            return;
        } else {
            setHorarioEntregaMensagemErro('');
        }

        if (necessarioAdequacoes && jsonData.adequacoes_necessarias === '') {
            setAdequacoesMensagemErro('O campo Adequações Necessárias é obrigatório');
            setLoading(false);
            return;
        } else {
            setAdequacoesMensagemErro('');
        }

        const response = await AvaliacaoService.avaliar(sessaoId, jsonData);

        if (response) {
            toast.success('Avaliação realizada com sucesso');
        } else {
            toast.error('Erro ao realizar avaliação');
        }

        setLoading(false);
        carregarDetalhesTCC();
        setVisibleAvaliacao(false);
    };

    const onSubmitAvaliacaoAjuste = async (event) => {
        event.preventDefault();
        setLoading(true);
        const formData = new FormData(event.currentTarget);
        formData.append('resultado_ajuste', ajuste);
        const jsonData = Object.fromEntries(formData);


        if (jsonData.parecer_orientador == '') {
            setParecerOrientadorErro('O Parecer do Orientador é obrigatório');
            setLoading(false);
            return;
        } else {
            setParecerOrientadorErro('');
        }

        const response = await AvaliacaoService.avaliarAjustes(avaliacaoId, jsonData);

        if (response) {
            toast.success('Avaliação realizada com sucesso');
        } else {
            toast.error('Erro ao realizar avaliação');
        }

        setLoading(false);
        carregarDetalhesTCC();
        setVisibleAvaliarAjuste(false);
    };

     const onSubmitAvaliacaoPrevia = async (event) => {
        event.preventDefault();
        setLoading(true);
        const formData = new FormData(event.currentTarget);
        formData.append('resultado_previa', previa);
        const jsonData = Object.fromEntries(formData);


        if (jsonData.parecer_orientador == '') {
            setParecerOrientadorErro('O Parecer do Orientador é obrigatório');
            setLoading(false);
            return;
        } else {
            setParecerOrientadorErro('');
        }

        const response = await SessoesService.avaliarPrevia(sessaoPreviaId, jsonData);

        if (response) {
            toast.success('Avaliação realizada com sucesso');
        } else {
            toast.error('Erro ao realizar avaliação');
        }

        setLoading(false);
        carregarDetalhesTCC();
        setVisibleAvaliarPrevia(false);
    };

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

        const response = await TccService.editarTCC(TCCData.id, jsonData);

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
        { label: 'Conferência', value: 'conferencia' },
        { label: 'Hibrido', value: 'hibrido' }
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

    const handleFileUpload = async (file, sessaoId, avaliacaoId, avaliacaoAjusteId) => {
        const formData = new FormData();
        formData.append('file', file);
        console.log("Sessão Id: " + sessaoId + " Avaliação Id: " + avaliacaoId + " Avaliação Ajuste Id: " + avaliacaoAjusteId);
        try {
            if (avaliacaoId) {
                await AvaliacaoService.uploadFichaAvaliacao(avaliacaoId, formData);
                toast.success('Ficha de avaliação atualizada com sucesso');
            } else if (avaliacaoAjusteId) {
                await AvaliacaoService.uploadDocumentoAjuste(avaliacaoAjusteId, formData);
                toast.success('Documento da ajuste atualizado com sucesso');
                setDocumentoTCC(file); // Atualiza o documento principal com o último documento enviado
            } else if (sessaoId) {
                await TccService.uploadDocumentoSessao(sessaoId, formData);
                toast.success('Documento da sessão atualizado com sucesso');
                setDocumentoTCC(file); // Atualiza o documento principal com o último documento enviado
            } else {
                await TccService.uploadDocumentoTCC(TCCData.id, formData);
                toast.success('Documento TCC atualizado com sucesso');
                setDocumentoTCC(file); // Atualiza o documento principal com o último documento enviado
            }
            carregarDetalhesTCC();
        } catch (error) {
            handleApiResponse(error.response);
            console.error('Erro ao fazer upload do arquivo:', error);
            //toast.error('Erro ao fazer upload do arquivo');
        }
    };

    const handleFileDelete = async (sessaoId, avaliacaoId, avaliacaoAjusteId) => {
        try {
            if (avaliacaoId) {
                await AvaliacaoService.excluirFichaAvaliacao(avaliacaoId);
                toast.success('Ficha de avaliação excluída com sucesso');
            } else if (avaliacaoAjusteId) {
                await AvaliacaoService.excluirDocumentoAjuste(avaliacaoAjusteId);
                toast.success('Documento de ajuste excluído com sucesso');
                setDocumentoTCC(null); // Atualiza o documento principal para null
                setTCCData(prevData => ({ ...prevData, documentoTCC: null }));
            } else if (sessaoId) {
                await TccService.excluirDocumentoSessao(sessaoId);
                toast.success('Documento da sessão excluído com sucesso');
                setDocumentoTCC(null); // Atualiza o documento principal para null
                setTCCData(prevData => ({ ...prevData, documentoTCC: null }));
            } else {
                await TccService.excluirDocumentoTCC(TCCData.id);
                toast.success('Documento TCC excluído com sucesso');
                setDocumentoTCC(null); // Atualiza o documento principal para null
                setTCCData(prevData => ({ ...prevData, documentoTCC: null }));
            }
            carregarDetalhesTCC();
        } catch (error) {
            console.error('Erro ao excluir arquivo:', error);
            handleApiResponse(error.response);
            //toast.error('Erro ao excluir arquivo');
        }
    };

    const handleFileDownload = async (sessaoId, avaliacaoId, avaliacaoAjusteId) => {
        try {
            let response;
            if (avaliacaoId) {
                response = await AvaliacaoService.downloadFichaAvaliacao(avaliacaoId);
            } else if (avaliacaoAjusteId) {
                response = await AvaliacaoService.downloadDocumentoAjuste(avaliacaoAjusteId);
            } else if (sessaoId) {
                response = await TccService.downloadDocumentoSessao(sessaoId);
            } else {
                response = await TccService.downloadDocumentoTCC(TCCData.id);
            }
            const url = window.URL.createObjectURL(new Blob([response]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'documento.pdf'); // or extract the file name from response
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            handleApiResponse(response);
            //toast.success('Download do documento realizado com sucesso');
        } catch (error) {
            handleApiResponse(error.response);
            console.error('Erro ao fazer download do arquivo:', error);
            //toast.error('Erro ao fazer download do arquivo');
        }
    };

    const handleFichaAvaliacaoPrrenchidaDownload = async (avaliacaoId) => {
        try {
            let response;
            response = await AvaliacaoService.downloadFichaAvaliacaoPreenchida(avaliacaoId);
            const url = window.URL.createObjectURL(new Blob([response]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'documento.pdf'); // or extract the file name from response
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            handleApiResponse(response);
            //toast.success('Download do documento realizado com sucesso');
        } catch (error) {
            handleApiResponse(error.response);
            console.error('Erro ao fazer download do arquivo:', error);
            //toast.error('Erro ao fazer download do arquivo');
        }
    };

    const handleAdequacoesChange = (e) => {
        setNecessarioAdequacoes(!necessarioAdequacoes);
    }

    const handleAprovacaoAjusteChange = (e) => {
        setAjusteAprovado(!ajusteAprovado);
        if (ajusteReprovado) {
            setAjusteReprovado(!ajusteReprovado);
        }
    }

    const handleReprovacaoAjusteChange = (e) => {
        setAjusteReprovado(!ajusteReprovado);
        if (ajusteAprovado) {
            setAjusteAprovado(!ajusteAprovado);
        }
    }

    const [sessaoForm, setSessaoForm] = useState({
        idTCC: '',
        tipo: '',
        idSessao: '',
        avaliador1: null,
        avaliador2: null,
        dataInicio: null,
        localForma: '',
        localDescricao: '',
    });

    const handleConfirmarSessao = async () => {
        setLoading(true);
        const response = await SessoesService.postNovaSessao(sessaoForm);
        if (response) {
            toast.success(sessaoForm.tipo == 'previa' ? 'Sessão Prévia agendada com sucesso' : 'Sessão Final agendada com sucesso');
            setSessaoForm({
                idTCC: '',
                tipo: '',
                idSessao: '',
                avaliador1: null,
                avaliador2: null,
                dataInicio: null,
                localForma: '',
                localDescricao: '',
            });
        } else {
            toast.error(sessaoForm.tipo == 'previa' ? 'Erro ao agendar sessão prévia' : 'Erro ao agendar sessão final');
        }
        setLoading(false);
        setVisibleSessao(false);
        carregarDetalhesTCC();
    };

    const footerContent = (
        <div className='flex items-center justify-between gap-4'>
            <div className='w-full'>
                <Button className='w-full' label="Confirmar Sessão" severity="success" icon='pi pi-check' iconPos='right' onClick={handleConfirmarSessao} />
            </div>
        </div>
    );

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
                <p><b>Documento TCC:</b></p> <FileItem file={documentoTCC || TCCData?.documentoTCC} user={user} onFileUpload={handleFileUpload} onFileDelete={handleFileDelete} onFileDownload={handleFileDownload} />
                <div>
                    {TCCData?.sessoes && (
                        <SessoesComponent
                            estudante={TCCData?.autor}
                            orientador={TCCData?.orientador}
                            sessoes={TCCData?.sessoes}
                            status={TCCData?.status}
                            user={user}
                            onSugerirBancaSessaoPreviaClick={handleSugerirBancaSessaoPreviaClick}
                            onSugerirBancaSessaoFinalClick={handleSugerirBancaSessaoFinalClick}
                            onAvaliacaoClick={handleAvaliacao}
                            onAvaliacaoAjusteClick={handleAvaliacaoAjuste}
                            onAvaliacaoPreviaClick={handleAvaliacaoPrevia}
                            onFileUpload={handleFileUpload}
                            onFileDelete={handleFileDelete}
                            onFileDownload={handleFileDownload}
                            onFichaAvaliacaoPreenchidaDownload={handleFichaAvaliacaoPrrenchidaDownload}
                        />
                    )}
                </div>
            </div>
            <Dialog header="Timeline Do TCC" visible={visibleStatus} style={{ width: '50vw' }} onHide={() => setVisibleStatus(false)}>
                <Timeline value={TCCData?.status} opposite={(item) => item.statusMensagem} content={(item) => <small className="text-color-secondary">{format(item.dataStatus || new Date(), 'dd/MM/yyyy HH:mm')} </small>} />
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
                                <Dropdown value={selectedOrientador} name="orientador" onChange={(e) => setSelectedOrientador(e.value)} options={orientadores} optionLabel="name" placeholder="Selecione o orientador" className={"w-full md " + (orientadorMensagemErro ? ' p-invalid' : '')} />
                                {orientadorMensagemErro && <small id="orientador-help" className="px-2 py-1 text-red-500">{orientadorMensagemErro}</small>}
                            </div>
                            {TCCData?.coorientador && (
                                <div className="flex flex-wrap gap-2 mb-3 align-items-center">
                                    <label htmlFor="coorientador"><b>Corientador</b></label>
                                    <Dropdown value={selectedCoorientador} name="coorientador" onChange={(e) => setSelectedCoorientador(e.value)} options={coorientadores} optionLabel="name" placeholder="Selecione o coorientador" className={"w-full md " + (coorientadorMensagemErro ? ' p-invalid' : '')} />
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
            <Dialog header={sessaoForm.tipo == 'previa' ? "Sugerir Banca - Sessão Prévia" : 'Sugerir Banca - Sessão Final'} visible={visibleSessao} style={{ width: '50vw' }} footer={footerContent} onHide={() => setVisibleSessao(false)}>
                <FormSessao onSubmit={() => true} formDisabled={false} sessaoForm={sessaoForm} setSessaoForm={setSessaoForm} />
            </Dialog>
            <Dialog header="Avalar TCC" visible={visibleAvaliacao} style={{ width: '50vw' }} onHide={() => setVisibleAvaliacao(false)}>
                <form onSubmit={onSubmitAvaliacao}>
                    <div className='grid gap-4'>
                        <h4> NOTAS TRABALHO ESCRITO </h4>
                        <div className='grid grid-cols-2 gap-4'>
                            <div className="flex flex-col gap-2 mb-3 align-items-center">
                                <label htmlFor="estrutura_trabalho"><b>Estrutura do Trabalho</b></label>
                                <InputNumber className="w-4/6" id="estrutura_trabalho" name="estrutura_trabalho" placeholder='Máximo 1,0 ponto' mode="decimal" minFractionDigits={1} maxFractionDigits={2} min={0} max={1} step={0.1} />
                                {notaEstruturaMensagemErro && <small id="nota-estrutura-help" className="px-2 py-1 text-red-500">{notaEstruturaMensagemErro}</small>}
                            </div>
                            <div className="flex flex-col gap-2 mb-3 align-items-center">
                                <label htmlFor="relevancia_originalidade_qualidade"><b>Relevância, Originalidade e Qualidade do Conteúdo</b></label>
                                <InputNumber className="w-4/6" id="relevancia_originalidade_qualidade" name="relevancia_originalidade_qualidade" placeholder='Máximo 3,0 pontos' mode="decimal" minFractionDigits={1} maxFractionDigits={2} min={0} max={3} step={0.1} />
                                {notaRelevanciaMensagemErro && <small id="nota-relevancia-help" className="px-2 py-1 text-red-500">{notaRelevanciaMensagemErro}</small>}
                            </div>
                        </div>
                        <div className='grid grid-cols-2 gap-4'>
                            <div className="flex flex-col gap-2 mb-3 align-items-center">
                                <label htmlFor="grau_conhecimento"><b>Grau de Conhecimento</b></label>
                                <InputNumber className="w-4/6" id="grau_conhecimento" name="grau_conhecimento" placeholder='Máximo 2,0 pontos' mode="decimal" minFractionDigits={1} maxFractionDigits={2} min={0} max={2} step={0.1} />
                                {notaConhecimentoMensagemErro && <small id="nota-conhecimento-help" className="px-2 py-1 text-red-500">{notaConhecimentoMensagemErro}</small>}
                            </div>
                            <div className="flex flex-col gap-2 mb-3 align-items-center">
                                <label htmlFor="bibliografia_apresentada"><b>Bibliografia Apresentada</b></label>
                                <InputNumber className="w-4/6" id="bibliografia_apresentada" name="bibliografia_apresentada" placeholder='Máximo 1,0 ponto' mode="decimal" minFractionDigits={1} maxFractionDigits={2} min={0} max={1} step={0.1} />
                                {notaBibliografiaMensagemErro && <small id="nota-bibliografia-help" className="px-2 py-1 text-red-500">{notaBibliografiaMensagemErro}</small>}
                            </div>
                        </div>
                        <h4> NOTAS APRESENTAÇÃO DO TRABALHO </h4>
                        <div className='grid grid-cols-2 gap-4'>
                            <div className="flex flex-col gap-2 mb-3 align-items-center">
                                <label htmlFor="utilizacao_recursos_didaticos"><b>Utilização de Recursos Didáticos</b></label>
                                <InputNumber className="w-4/6" id="utilizacao_recursos_didaticos" name="utilizacao_recursos_didaticos" placeholder='Máximo 1,0 ponto' mode="decimal" minFractionDigits={1} maxFractionDigits={2} min={0} max={1} step={0.1} />
                                {notaRecursosMensagemErro && <small id="nota-recursos-help" className="px-2 py-1 text-red-500">{notaRecursosMensagemErro}</small>}
                            </div>
                            <div className="flex flex-col gap-2 mb-3 align-items-center">
                                <label htmlFor="conteudo_apresentacao"><b>Conteúdo da Apresentação</b></label>
                                <InputNumber className="w-4/6" id="conteudo_apresentacao" name="conteudo_apresentacao" placeholder='Máximo 1,0 ponto' mode="decimal" minFractionDigits={1} maxFractionDigits={2} min={0} max={1} step={0.1} />
                                {notaConteudoMensagemErro && <small id="nota-apresentacao-help" className="px-2 py-1 text-red-500">{notaConteudoMensagemErro}</small>}
                            </div>
                        </div>
                        <div className='grid grid-cols-2 gap-4'>
                            <div className="flex flex-col gap-2 mb-3 align-items-center">
                                <label htmlFor="utilizacao_tempo_sintese"><b>Utilização do Tempo e Poder de Síntese</b></label>
                                <InputNumber className="w-4/6" id="utilizacao_tempo_sintese" name="utilizacao_tempo_sintese" placeholder='Máximo 1,0 ponto' mode="decimal" minFractionDigits={1} maxFractionDigits={2} min={0} max={1} step={0.1} />
                                {notaSinteseMensagemErro && <small id="nota-sintese-help" className="px-2 py-1 text-red-500">{notaSinteseMensagemErro}</small>}
                            </div>
                        </div>
                        <h4> CONSIDERAÇÕES FINAIS </h4>
                        {(user.id === TCCData?.orientador?.id) && (<> <div className="flex flex-wrap gap-1 pt-2 mb-3 align-items-center">
                            <Checkbox inputId="adequacoes" name='adequacoes' onChange={handleAdequacoesChange} checked={necessarioAdequacoes} />
                            <label htmlFor="adequacoes" className="ml-2">O Trabalho de Conclusão de Curso (TCC) necessita de adequações para aprovação da versão final</label>
                        </div>
                            <div className='grid grid-cols-2 gap-4' style={{ display: necessarioAdequacoes ? 'flex' : 'none' }}>
                                <div className="flex flex-col w-full gap-2 mb-3 align-items-center">
                                    <label htmlFor="data_entrega"><b>Data</b></label>
                                    <Calendar className="w-10/12" id="data_entrega" name="data_entrega" placeholder="Data para entrega da versão definitiva" value={datetime24h} minDate={new Date()} readOnlyInput onChange={(e) => setDateTime24h(e.value)} />
                                    {dataEntregaMensagemErro && <small id="data-help" className="px-2 py-1 text-red-500">{dataEntregaMensagemErro}</small>}
                                </div>
                                <div className="flex flex-col w-full gap-2 mb-3 align-items-center">
                                    <label htmlFor="horario_entrega"><b>Horário</b></label>
                                    <Calendar className="w-10/12" id="horario_entrega" name="horario_entrega" value={datetime24h} placeholder="Horário para entrega da versão definitiva" readOnlyInput onChange={(e) => setDateTime24h(e.value)} timeOnly />
                                    {horarioEntregaMensagemErro && <small id="horario-help" className="px-2 py-1 text-red-500">{horarioEntregaMensagemErro}</small>}
                                </div>
                            </div>
                            <div className='flex flex-wrap gap-2 mb-3 align-items-center' style={{ display: necessarioAdequacoes ? 'flex' : 'none' }}>
                                <label htmlFor="adequacoes_necessarias" className="ml-2"><b>Adequações Necessárias</b></label>
                                <InputTextarea id='adequacoes_necessarias' name='adequacoes_necessarias' placeholder='Descreva quais ajustes devem ser realizados pelo estudante mediante a aprovação do trabalho de conclusão de curso (TCC)' rows={6} className={'w-full ' + (adequacoesMensagemErro ? 'p-invalid' : '')} />
                                {adequacoesMensagemErro && <small id='adequacoes_necessarias-help' className='px-2 py-1 text-red-500'>{adequacoesMensagemErro}</small>}
                            </div></>)}
                        <div className='flex flex-wrap gap-2 mb-3 align-items-center'>
                            <label htmlFor="comentarios_adicionais" className="ml-2"><b>Comentários Adicionais</b></label>
                            <InputTextarea id='comentarios_adicionais' name='comentarios_adicionais' placeholder='Escreva comentários que achar pertinente quanto ao do trabalho de conclusão de curso (TCC) apresentado' rows={6} className={'w-full '} />
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3 align-items-center">
                        <Button label={loading ? "Avaliando TCC" : "Avaliar TCC"} loading={loading} className="w-full" />
                    </div>
                </form>
            </Dialog>
            <Dialog header="Avaliar Ajustes" visible={visibleAvaliarAjuste} style={{ width: '50vw' }} onHide={() => setVisibleAvaliarAjuste(false)}>
                <form onSubmit={onSubmitAvaliacaoAjuste}>
                    <div className='flex flex-wrap gap-2 mb-3 align-items-center'>
                        <label htmlFor="parecer_orientador" className="ml-2"><b>Parecer Orientador</b></label>
                        <InputTextarea id='parecer_orientador' name='parecer_orientador' placeholder='Escreva seu parecer quanto aos ajustes realizados' rows={6} className={'w-full ' + (parecerOrientadorErro ? 'p-invalid' : '')} />
                        {parecerOrientadorErro && <small id='parecer-orientador-help' className='px-2 py-1 text-red-500'>{parecerOrientadorErro}</small>}
                    </div>
                    <div className="flex flex-col items-center gap-1 pt-2 mb-3">
                                    <label htmlFor="resultado_ajuste" className="ml-2 text-center">
                                        Após a análise dos ajustes realizados, concluo que o Trabalho de Conclusão de Curso (TCC) está
                                    </label>
                                    <ToggleButton
                                        id='resultado_ajuste'
                                        name='resultado_ajuste'
                                        onLabel="Aprovado"
                                        offLabel="Reprovado"
                                        onIcon="pi pi-check"
                                        offIcon="pi pi-times"
                                        checked={ajuste}
                                        onChange={(e) => setAjuste(e.value)}
                                    />
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3 align-items-center">
                        {avaliarAjusteErro && <small id='avaliar-ajuste-help' className='px-2 py-1 text-red-500'>{avaliarAjusteErro}</small>}
                        <Button label={loading ? "Avaliando Ajustes" : "Avaliar Ajustes"} loading={loading} className="w-full mt-5"  />
                    </div>
                </form>
            </Dialog>
            <Dialog header="Avaliar Sessão Prévia" visible={visibleAvaliarPrevia} style={{ width: '50vw' }} onHide={() => setVisibleAvaliarPrevia(false)}>
                <form onSubmit={onSubmitAvaliacaoPrevia}>
                    {
                        ( user.id === TCCData?.orientador.id ? (
                            <>
                                <div className='flex flex-wrap gap-2 mb-3 align-items-center'>
                                    <label htmlFor="parecer_orientador" className="ml-2"><b>Parecer Orientador</b></label>
                                    <InputTextarea id='parecer_orientador' name='parecer_orientador' placeholder='Escreva seu parecer quanto aos ajustes realizados' rows={6} className={'w-full ' + (parecerOrientadorErro ? 'p-invalid' : '')} />
                                    {parecerOrientadorErro && <small id='parecer-orientador-help' className='px-2 py-1 text-red-500'>{parecerOrientadorErro}</small>}
                                </div>
                                <div className="flex flex-col items-center gap-1 pt-2 mb-3">
                                    <label htmlFor="resultado_previa" className="ml-2 text-center">
                                        Após a apresentação, concluo que a Sessão Prévia deste trabalho está
                                    </label>
                                    <ToggleButton
                                        className="mt-2"
                                        id='resultado_previa'
                                        name='resultado_previa'
                                        onLabel="Aprovada"
                                        offLabel="Reprovada"
                                        onIcon="pi pi-check"
                                        offIcon="pi pi-times"
                                        checked={previa}
                                        onChange={(e) => setPrevia(e.value)}
                                    />
                                </div>
                            </>
                        ) : (
                            <div className='flex flex-wrap gap-2 mb-3 align-items-center'>
                                <label htmlFor="comentarios_adicionais" className="ml-2"><b>Comentários Adicionais</b></label>
                                <InputTextarea id='comentarios_adicionais' name='comentarios_adicionais' placeholder='Escreva comentários que achar pertinente quanto ao do trabalho de conclusão de curso (TCC) apresentado' rows={6} className={'w-full '} />
                            </div>
                        ))
                    }
                    <div className="flex flex-wrap gap-2 mb-3 align-items-center">
                        <Button label={loading ? "Avaliando Sessão Prévia" : "Avaliar Sessão Prévia"} loading={loading} className="w-full mt-5" />
                    </div>
                </form>
            </Dialog>
        </div>
    );
}

DetalhesTCC.guards = [GUARDS.ESTUDANTE, GUARDS.PROFESSOR_INTERNO, GUARDS.PROFESSOR_EXTERNO, GUARDS.COORDENADOR];
DetalhesTCC.title = 'Detalhes do TCC';

export default DetalhesTCC;