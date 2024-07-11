import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { format } from 'date-fns';
import UsuarioService from 'meutcc/services/UsuarioService';
import { Toast } from 'primereact/toast';
import { SelectButton } from 'primereact/selectbutton';

export default function ListaUsuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [filteredUsuarios, setFilteredUsuarios] = useState([]);
    const [rows, setRows] = useState(10);
    const [first, setFirst] = useState(0);
    const [statusFilter, setStatusFilter] = useState('Todos');
    const toast = useRef(null);

    const fetchUsuarios = async () => {
        try {
            const response = await UsuarioService.listarUsuarios();
            console.log('Usuários recebidos:', response.data);
            setUsuarios(response.data);
            setFilteredUsuarios(response.data);
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Erro ao obter a lista de usuários', life: 3000 });
            console.error('Erro ao obter a lista de usuários:', error);
        }
    }

    useEffect(() => {
        fetchUsuarios();
    }, [rows, first]);

    useEffect(() => {
        filterUsuarios(statusFilter);
    }, [statusFilter, usuarios]);

    const filterUsuarios = (status) => {
        if (status === 'Todos') {
            setFilteredUsuarios(usuarios);
        } else if (status === 'Outros') {
            setFilteredUsuarios(usuarios.filter(user => user.status_cadastro && (user.status_cadastro.status_text === 'Reprovado' || user.status_cadastro.status_text === 'Pendente')));
        } else if (status === 'Aprovados') {
            setFilteredUsuarios(usuarios.filter(user => !user.status_cadastro || user.status_cadastro.status_text === 'Aprovado'));
        }
    }

    const dataCadastroTemplate = (rowData) => {
        return format(new Date(rowData.dataCadastro), 'dd/MM/yyyy');
    }

    const tipoUsuarioTemplate = (rowData) => {
        return rowData.tipo || 'Tipo desconhecido';
    }

    const statusCadastroTemplate = (rowData) => {
        if (rowData.status_cadastro && rowData.status_cadastro.status_text) {
            const statusText = rowData.status_cadastro.status_text;
            let severity;
            if (statusText === 'Aprovado') {
                severity = 'success';
            } else if (statusText === 'Reprovado') {
                severity = 'danger';
            } else if (statusText === 'Pendente') {
                severity = 'warning';
            } else {
                severity = null;
            }
            return <Tag severity={severity} value={statusText} />;
        }
        return <Tag severity='success' value='Cadastrado' />;
    }

    const onPageChange = (e) => {
        setFirst(e.first);
        setRows(e.rows);
    }

    const rowsPerPageOptions = [
        { label: '5', value: 5 },
        { label: '10', value: 10 },
        { label: '20', value: 20 }
    ];

    const statusOptions = [
        { label: 'Todos', value: 'Todos' },
        { label: 'Aprovados', value: 'Aprovados' },
        { label: 'Outros', value: 'Outros' }
    ];

    return (
        <div className="card">
            <Toast ref={toast} />
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                <SelectButton value={statusFilter} onChange={(e) => setStatusFilter(e.value)} options={statusOptions} />
            </div>
            <DataTable
                value={filteredUsuarios}
                paginator
                rows={rows}
                first={first}
                onPage={onPageChange}
                rowsPerPageOptions={[5, 10, 20]}
            >
                <Column field="nome" header="Nome" sortable style={{ width: '20%' }}></Column>
                <Column field="cpf" header="CPF" sortable style={{ width: '20%' }}></Column>
                <Column field="email" header="Email" sortable style={{ width: '20%' }}></Column>
                <Column field="dataCadastro" header="Data de Cadastro" body={dataCadastroTemplate} sortable style={{ width: '15%' }}></Column>
                <Column field="tipo" header="Tipo de Usuário" body={tipoUsuarioTemplate} sortable style={{ width: '15%' }}></Column>
                <Column field="status_cadastro.aprovacao" header="Status de Cadastro" body={statusCadastroTemplate} sortable style={{ width: '10%' }}></Column>
            </DataTable>
        </div>
    );
}
