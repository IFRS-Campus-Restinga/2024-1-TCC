import React from 'react';
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import DropdownProfessores from './DropdownProfessores';

export default function FormSessao({ ...props }) {
    const optionsLocalSessao = [
        { label: 'Presencial', value: 'presencial' },
        { label: 'Conferência', value: 'conferencia' },
        { label: 'Hibrido', value: 'hibrido' },
    ];

    return (
        <form onSubmit={props.onSubmit}>
            <div className="my-2 p-field">
                <label htmlFor="membroBanca1">Avaliador 1:</label>
                <DropdownProfessores value={props.sessaoForm.avaliador1} onChange={(e) => props.setSessaoForm({ ...props.sessaoForm, avaliador1: e.target.value })} />

            </div>
            <div className="my-2 p-field">
                <label htmlFor="membroBanca2">Avaliador 2:</label>
                <DropdownProfessores disabled={props.formDisabled} value={props.sessaoForm.avaliador2} onChange={(e) => props.setSessaoForm({ ...props.sessaoForm, avaliador2: e.target.value })} />
            </div>
            <div className='flex justify-between gap-32'>
                <div className="my-2 p-field">
                    <label htmlFor="data">Data:</label>
                    <Calendar id="dataSessao"
                        value={props.sessaoForm.dataInicio}
                        onChange={(e) => props.setSessaoForm({ ...props.sessaoForm, dataInicio: e.target.value })}
                        dateFormat='dd/mm/yy'
                        className=''
                        showButtonBar
                        locale='ptbr'
                        showIcon={!props.formDisabled}
                        disabled={props.formDisabled}
                    />
                </div>
                <div className="my-2 p-field">
                    <label htmlFor="hora">Hora:</label>
                    <Calendar id="horaSessao"
                        value={props.sessaoForm.dataInicio}
                        onChange={(e) => props.setSessaoForm({ ...props.sessaoForm, dataInicio: e.target.value })}
                        timeOnly
                        showIcon={!props.formDisabled}
                        icon={'pi pi-clock'}
                        disabled={props.formDisabled} />
                </div>
            </div>
            <div className='grid grid-cols-2 gap-4'>
                <div className="flex flex-wrap gap-2 mb-3 align-items-center">
                    <label htmlFor="tema"><b>Local</b></label>
                    <Dropdown value={props.sessaoForm.localForma} onChange={(e) => props.setSessaoForm({ ...props.sessaoForm, localForma: e.value })} options={optionsLocalSessao} className='w-full' />
                </div>
                <div className="flex flex-wrap gap-2 mb-3 align-items-center">
                    <label htmlFor="tema"><b>Local</b></label>
                    <InputText id="tema" value={props.sessaoForm.localDescricao}
                        onChange={(e) => props.setSessaoForm({ ...props.sessaoForm, localDescricao: e.target.value })}
                        name="tema" className={'w-full ' + (false ? 'p-invalid' : '')} placeholder='Exemplo, Campus Restinga, sala 403' />
                </div>
            </div>
        </form>
    );
}