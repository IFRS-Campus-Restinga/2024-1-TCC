import { Menubar } from "primereact/menubar";
import NavBar from "../ui/NavBar";
import { Toaster } from "react-hot-toast";
import { GUARDS } from "meutcc/core/constants";
import { useAuth } from "meutcc/core/context/AuthContext";
import { useRouter } from "next/router";
import Link from "next/link";
import ConfiguracoesService from "meutcc/services/ConfiguracoesService";
import React, { useState } from "react";
import Image from "next/image";
import NotificacoesService from "meutcc/services/NotificacoesService";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export const AppLayout = ({ children, guards }) => {

    const { user } = useAuth();
    const [unreadNotifications, setUnreadNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [coordenadorNome, setCoordenadorNome] = useState('');

    const menuItemTemplate = (item) => {
        return <Link href={item.url} className="p-menuitem-link" aria-hidden="true">
            <span className={'p-menuitem-icon ' + item.icon || ''}></span>
            <span className="p-menuitem-text">{item.label}</span>
        </Link>;

    };

    const typesMenu = {
        Todos: [
            { label: 'Inicio', icon: 'pi pi-fw pi-home', url: '/', },
            { label: 'Meus TCCs', icon: 'pi pi-fw pi-book', url: '/meus-tccs' },
        ],
        Estudante: [
            { label: 'Sugestões de Tema', icon: 'pi pi-fw pi-list', url: '/sugestoes-temas-tcc' },
        ],
        Coordenador: [
            {
                label: 'Validar', icon: 'pi pi-fw pi-check', url: '',
                items: [
                    { label: 'Validar Cadastros', icon: 'pi pi-fw pi-users', url: '/atualizar-permissoes' },
                    { label: 'Validar Propostas', icon: 'pi pi-fw pi-book', url: '/proposta-pendente' },
                    { label: 'Validar Sessões', icon: 'pi pi-fw pi-calendar', url: '/sessoes-futuras' },
                ]
            },
            { label: 'Semestres', icon: 'pi pi-fw pi-calendar', url: '/painel-configuracoes' },
            { label: 'Lista de Usuários', icon:'pi pi-fw pi-users', url: '/lista-usuarios'},
            {
                label: 'Sugestões de Tema', icon: 'pi pi-fw pi-list', url: '',
                items: [
                    { label: 'Listar Sugestões', icon: 'pi pi-fw pi-list', url: '/sugestoes-temas-tcc' },
                    { label: 'Minhas Sugestões', icon: 'pi pi-fw pi-plus', url: '/minhas-sugestoes' },
                ]
            }
        ],
        Professor: [
            { label: 'Propostas Pendentes', icon: 'pi pi-fw pi-thumbs-up', url: '/proposta-pendente' },
            { label: 'Validar Sessões', icon: 'pi pi-fw pi-calendar', url: '/sessoes-futuras-orientador' },
            {
                label: 'Sugestões de Tema', icon: 'pi pi-fw pi-list', url: '',
                items: [
                    { label: 'Listar Sugestões', icon: 'pi pi-fw pi-list', url: '/sugestoes-temas-tcc' },
                    { label: 'Minhas Sugestões', icon: 'pi pi-fw pi-plus', url: '/minhas-sugestoes' },
                ]
            }
        ],
        ProfessorInterno: [],
        ProfessorExterno: [],
    };
    const items = typesMenu.Todos.concat(['ProfessorInterno', 'ProfessorExterno'].includes(user?.resourcetype) ? typesMenu.Professor : []).concat(typesMenu[user?.resourcetype] || []).map((item) => ({ ...item, template: menuItemTemplate }));

    const isUserAuth = !!user || false;

    const loadNotifications = async () => {
        try {
            const data = await NotificacoesService.getNotificacoesNaoLidas();
            setUnreadNotifications(data.data.notifications);
            setUnreadCount(data.data.unread_count);
        } catch (error) {
            console.error('Erro ao carregar notificações:', error);
        }
    };

    const fetchConfigs = async () => {
        try {
            const data = await ConfiguracoesService.getCoordenador();
            setCoordenadorNome(data.coordenador_nome);
        } catch (error) {
            console.error('Erro ao buscar as configurações', error);
        }
    };

    React.useEffect(() => {
        if (isUserAuth) {
        loadNotifications();
        }
        fetchConfigs();
    }, [])


    return (
        <div className='bg-gray-100 min-h-screen'>
            <ToastContainer />
            <Toaster
                position="top-center"
                reverseOrder={false}
            />
            <NavBar auth={isUserAuth} notifications={unreadNotifications} unreadCount={unreadCount}/>

            <div style={{ backgroundColor: '#f9fafb' }}>
                {
                    isUserAuth &&
                    <Menubar model={items} style={{ borderWidth: 0 }} className='max-w-screen-lg mx-auto' />
                    ||
                    <div>
                        <div className='max-w-screen-lg mx-auto text-gray-600 text-2xl p-6 ps-10'>Meu TCC IFRS Campus Restinga</div>
                    </div>
                }
            </div>

            <div style={{ minHeight: '500px' }}>
                {children}
            </div>

            <footer className='bg-green-900 text-white' style={{ background: 'rgb(0 49 21)' }}>
                <div className="max-w-screen-lg mx-auto flex flex-col-reverse md:flex-row items-center justify-between">
                    <div className="md:max-w-80 p-10 text-xs border-0 border-r-2 border-dashed text-gray-300 bg-black/20 border-black/20">
                        <Image src="/if.png" width={70} height={95} />
                        <p>
                            <b>Desenvolvido por:</b>
                        </p>
                        <p>
                            Alunos: Bruno Padilha, Carlos Eduardo, Cid Monza, Matheus Machado e Matheus Costa Krenn
                        </p>
                        <p>
                            Professores: Ricardo dos Santos e Eliana Pereira
                        </p>
                    </div>
                    <div className='py-10 px-10'>
                        <p>
                            <b>Instituto Federal do Rio Grande do Sul – Campus Restinga</b>
                        </p>
                        <p>Rua Alberto Hoffmann, 285 | Bairro Restinga | CEP: 91791-508 | Porto Alegre/RS</p>
                        <p>
                            Coordenador: {coordenadorNome} - <a href="mailto:ads@restinga.ifrs.edu.br" className="anchor-link">ads@restinga.ifrs.edu.br</a>
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};