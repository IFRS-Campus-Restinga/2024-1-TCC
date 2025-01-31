
import React, { useState } from 'react';
import { FilterMatchMode } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import Link from 'next/link';

export default function Table({ ...props }) {
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    const [globalFilterValue, setGlobalFilterValue] = useState('');

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-content-end">
                <IconField iconPosition="left">
                    <InputIcon className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Buscar por tema" />
                </IconField>
            </div>
        );
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="flex gap-2">
                <Link href={`/detalhes-tcc/${rowData.id}`} passHref>
                    <button className="p-button p-button-rounded p-button-text">Ver trabalho</button>
                </Link>
            </div>
        );
    };

    const header = renderHeader();

    return (
        <div className="card">
            <DataTable value={props.tccs} paginator rows={10} dataKey="id" filters={filters}
                globalFilterFields={['tema']} header={header} emptyMessage="Nenhum trabalho encontrado">
                <Column field="tema" header="Tema" style={{ minWidth: '12rem' }} />
                <Column field="autor.nome" header="Aluno" style={{ minWidth: '12rem' }} />
                <Column field="orientador.nome" header="Orientado por" body={({ orientador, coorientador }) => coorientador === null ? orientador.nome : `${orientador.nome} e ${coorientador.nome}`} style={{ minWidth: '12rem' }} />
                <Column field="" header="Ações" body={actionBodyTemplate} style={{ minWidth: '12rem' }} />
            </DataTable>
        </div>
    );
}
