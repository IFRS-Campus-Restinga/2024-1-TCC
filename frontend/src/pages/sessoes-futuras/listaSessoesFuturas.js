import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { Dialog } from 'primereact/dialog';
import { locale, addLocale, updateLocaleOption, updateLocaleOptions, localeOption, localeOptions } from 'primereact/api';
import { format } from 'date-fns';
import DropdownProfessores from 'meutcc/components/ui/DropdownProfessores';
import SessoesService from 'meutcc/services/SessoesService';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Card } from 'primereact/card';
import { Calendar } from 'primereact/calendar';

addLocale('ptbr', {
    today: 'Hoje', clear: 'Limpar', monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'], monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'], dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'], dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'], dayNamesMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'], weekHeader: 'Semana', firstDay: 0, isRTL: false, showMonthAfterYear: false, yearSuffix: '', timeOnlyTitle: 'Só Horas', timeText: 'Tempo', hourText: 'Hora', minuteText: 'Minuto', secondText: 'Segundo', ampm: false, month: 'Mês', week: 'Semana', day: 'Dia', allDayText: 'Todo o Dia'
});

export default function ListaSessoesFuturas() {
    const [sessoes, setSessoes] = useState([]);
    const [sessaoSelecionada, setSessaoSelecionada] = useState(null);
    const [exibirDialogo, setExibirDialogo] = useState(false);
    const [modoEdicao, setModoEdicao] = useState(false); // Estado para controlar o modo de edição
    const [sessaoMudancas, SetSessaoMudancas] = useState({
        idSessao: '',
        avaliador1 : '',
        avaliador2 : '',
        dataInicio: '',
        local: ''
    });

    useEffect(() => {
        fetchSessoesFuturas();
    }, []);

    const fetchSessoesFuturas = async () => {
        try {
            const sessoesFuturas = await SessoesService.getSessoesPendentes();
            setSessoes(sessoesFuturas);
        } catch (error) {
            console.error('Erro ao obter sessões:', error);
        }
    };

    const abrirDialogo = (sessao) => {
        setSessaoSelecionada(sessao);
        SetSessaoMudancas({...sessaoMudancas,
            idSessao:sessao.id,
            avaliador1:sessao.banca.professores[0].id,
            avaliador2:sessao.banca.professores[1].id,
            local:sessao.local,
            dataInicio:new Date(sessao.data_inicio)
        })

        setExibirDialogo(true);
    };

    const fecharDialogo = () => {
        setExibirDialogo(false);
        setModoEdicao(false); // Resetando o modo de edição ao fechar o diálogo
    };

    const handleConfirmarSessao = async () => {
        try {
            await SessoesService.putEditarSessao(sessaoMudancas);

            fetchSessoesFuturas();
            fecharDialogo();
        } catch (error) {
            console.error('Erro ao editar sessão:', error);

        }
    };

    const footerContent = (
        <div className='flex justify-between items-center gap-4'>
            <div className='w-1/2'>
                <Button className='w-full' label={modoEdicao ? "Cancelar Edição" : "Editar Sessão"} severity={modoEdicao ? "secondary" : "warning"} icon={modoEdicao ? 'pi pi-times' : 'pi pi-pencil'} iconPos='right' onClick={() => setModoEdicao(!modoEdicao)} /> {/* Alterado para ativar ou desativar o modo de edição */}
            </div>
            <div className='w-1/2'>
                <div>
                    <Button className='w-full' label="Confirmar Sessão" severity="success" icon='pi pi-check' iconPos='right' onClick={handleConfirmarSessao} />
                </div>
            </div>
        </div>
    );

    const dataInicioTemplate = (rowData) => {
        const data = new Date(rowData.data_inicio);
        const dataFormatada = format(data, "dd/MM/yyyy 'às' HH:mm");
        return dataFormatada;
    };

    const validacaoCoordenadorTemplate = (rowData) => {
        return (
            <Tag className={rowData.validacaoCoordenador ? 'p-tag-success' : 'p-tag-warning'} icon={rowData.validacaoCoordenador ? 'pi pi-check-circle' : 'pi pi-exclamation-circle'}>
                {rowData.validacaoCoordenador ? 'Agendado' : 'Não Agendado'}
            </Tag>
        );
    };

    const actionTemplate = (rowData) => {
        return (
            <>
                {rowData.validacaoCoordenador ? (
                    <Button label="Editar" icon='pi pi-pencil' className="p-button-outlined" onClick={() => abrirDialogo(rowData)} />
                ) : (
                    <Button label="Agendar" icon='pi pi-search' severity="warning" onClick={() => abrirDialogo(rowData)} />
                )}
            </>
        );
    };


    const dataInicio = sessaoSelecionada?.data_inicio ? new Date(sessaoSelecionada.data_inicio) : null;
    const dataFormatada = dataInicio ? format(dataInicio, "dd/MM/yyyy") : '';
    const horaFormatada = sessaoSelecionada?.data_inicio ? format(new Date(sessaoSelecionada.data_inicio), 'HH:mm') : '';

    return (
        <div>
            <div className="card">
                <DataTable value={sessoes} selection={sessaoSelecionada} dataKey="id" paginator rows={5} currentPageReportTemplate="Showing {first} to {last} of {totalRecords} sessions">
                    <Column field="tcc.autor.nome" header="Autor" sortable />
                    <Column field="tipo" header="Tipo" sortable />
                    <Column field="data_inicio" header="Data e Hora" body={dataInicioTemplate} sortable />
                    <Column header="Revisado" body={validacaoCoordenadorTemplate} />
                    <Column body={actionTemplate} style={{ textAlign: 'center', width: '8em' }} />
                </DataTable>
            </div>

            <Dialog visible={exibirDialogo} style={{ width: '32rem' }} header="Detalhes da Sessão" modal footer={footerContent} onHide={fecharDialogo}>
                <div className="p-fluid font-bold">
                    <div className='shadow-md shadow-gray-300 border border-solid border-gray-200 px-5 py-3 rounded-lg text-gray-700'>
                        <div className="p-field my-2 font-bold">
                            <label htmlFor="tipo">Tipo: </label>
                            <span className='font-normal'>{sessaoSelecionada?.tipo}</span>
                        </div>
                        <div className="p-field my-2 font-bold">
                            <label htmlFor="tema">Tema: </label>
                            <span className='font-normal'>{sessaoSelecionada?.tcc.tema}</span>
                        </div>
                        <div className="p-field my-2 font-bold">
                            <label htmlFor="autor">Autor: </label>
                            <span className='font-normal'>{sessaoSelecionada?.tcc.autor.nome}</span>
                        </div>
                        <div className="p-field my-2 font-bold">
                            <label htmlFor="orientador">Orientador: </label>
                            <span className='font-normal'>{sessaoSelecionada?.tcc.orientador.nome}</span>
                        </div>
                    </div>
                    <div className='mt-5'>
                        <div className="p-field my-2">
                            <label htmlFor="membroBanca1">Avaliador 1:</label>
                            <DropdownProfessores disabled={!modoEdicao} value={sessaoMudancas.avaliador1} onChange={(e) => SetSessaoMudancas({...sessaoMudancas, avaliador1:e.target.value})}/>

                        </div>
                        <div className="p-field my-2">
                            <label htmlFor="membroBanca2">Avaliador 2:</label>
                            <DropdownProfessores disabled={!modoEdicao} value={sessaoMudancas.avaliador2} onChange={(e) => SetSessaoMudancas({...sessaoMudancas, avaliador2:e.target.value})}/>
                        </div>
                        <div className='flex justify-between gap-32'>
                            <div className="p-field my-2">
                                <label htmlFor="data">Data:</label>
                                <Calendar id="dataSessao"
                                            value={sessaoMudancas.dataInicio}
                                            onChange={(e) => SetSessaoMudancas({...sessaoMudancas, dataInicio:e.target.value})}
                                            dateFormat='dd/mm/yy'
                                            className=''
                                            showButtonBar
                                            locale='ptbr'
                                            showIcon={modoEdicao}
                                            disabled={!modoEdicao}
                                             />
                                {/* <InputText id="data" value={dataFormatada} onChange={(e) => setSessaoSelecionada({ ...sessaoSelecionada, data_inicio: e.target.value })} readOnly={!modoEdicao} /> */}
                            </div>
                            <div className="p-field my-2">
                                <label htmlFor="hora">Hora:</label>
                                <Calendar id="horaSessao"
                                            value={sessaoMudancas.dataInicio}
                                            onChange={(e) => SetSessaoMudancas({...sessaoMudancas, dataInicio:e.target.value})}
                                            timeOnly
                                            showIcon={modoEdicao}
                                            disabled={!modoEdicao}/>
                                {/* <InputText id="hora" value={horaFormatada} onChange={(e) => setSessaoSelecionada({ ...sessaoSelecionada, hora: e.target.value })} readOnly={!modoEdicao} /> */}
                            </div>
                        </div>
                        <div className="p-field my-2">
                            <label htmlFor="local">Local:</label>
                            <InputText id="local" value={sessaoMudancas.local} onChange={(e) => sessaoMudancas.local(e.value)} disabled={!modoEdicao} />
                        </div>
                    </div>
                </div>
            </Dialog>
        </div>
    );
}
