import { useAuth, handleUserLogout } from "meutcc/core/context/AuthContext";
import React, { useRef, useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import { Menu } from "primereact/menu";
import { Badge } from 'primereact/badge';
import { formatDistanceToNow } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import NotificacoesService from "meutcc/services/NotificacoesService";
// import { useRef } from "react";
import CustomAvatar from "./CustomAvatar";


const NavBar = ({ auth = false, notifications, unreadCount }) => {

    const { user } = useAuth();
    const menuRight = useRef(null);
    const menuNotify = useRef(null);
    const [visibleUnreadBadge, setVisibleUnreadBadge] = useState(true);

    const handleNotificationClick = (notification) => {
        window.location.href = notification.description;
    };

    const menuItems = [
        {
            label: 'Notificações',
            items: notifications.slice(0, 10).map(notification => ({
                label: (
                    <div class="flex ml-4">
                        <p>{notification.verb}</p>
                        <p class='text-gray-400'>{formatDistanceToNow(new Date(notification.timestamp), { locale: ptBR })} atrás</p>
                    </div>
                ),
                icon: 'pi pi-info-circle',
                command: () => handleNotificationClick(notification)
            }))
        }
    ];

    const items = [
        {
            label: 'Perfil',
            items: [
                {
                    label: 'Configurações',
                    icon: 'pi pi-cog'
                },
                {
                    label: 'Sair',
                    icon: 'pi pi-sign-out',
                    command: () => handleUserLogout()
                }
            ]
        }
    ];

    const menuAuth = () => (
        <>
            <div className='px-3'>Bem vindo, <b>{user?.nome || 'Usuário'}</b></div>
            <div className='px-2'>
                <CustomAvatar image={user?.avatar} fullname={user?.nome} className='w-[40px] h-[40px] text-[20px]' shape="circle" onClick={(event) => menuRight.current.toggle(event)} />
                <Menu model={items} popup ref={menuRight} className='absolute z-50' popupAlignment="right" />
            </div>
            <div style={{ position: 'relative', alignItems: 'center', marginLeft: '10px' }}>
                <div onClick={async (event) => { menuNotify.current.toggle(event); await NotificacoesService.limparNotificacoes(); setVisibleUnreadBadge(false) }} style={{ cursor: "pointer", height: "20px", width: "45px", position: 'relative' }}>
                    <i className="pi pi-bell" style={{ fontSize: '1.7rem' }}></i>
                    {unreadCount !== 0 && visibleUnreadBadge && (
                        <Badge value={String(unreadCount)} style={{ position: 'absolute', top: '-10px', right: '8px', backgroundColor: 'red' }}></Badge>
                    )}
                    <Menu model={menuItems} popup ref={menuNotify} popupAlignment="left" style={{ width: '20%' }} />
                </div>
            </div>
        </>
    );

    const menuNotAuth = () => (
        <>
            <div className='px-3'>Você ainda não se identificou</div>
            <div className='px-2'>
                <Link href="/auth" className="flex p-2 font-bold border-2 border-solid rounded anchor-link align-center border-black/30">
                    <span>Acessar</span>
                    <span className='p-icon pi pi-fw pi-sign-in ms-2'></span>
                </Link>
            </div>
        </>
    );

    return (
        <div style={{ backgroundColor: '#2f9e41' }}>
            <div className='flex items-center justify-between max-w-screen-lg p-3 mx-auto'>
                <Link href="/">
                    <Image
                        src="/ifrs.png"
                        alt="IFRS Logo"
                        className="dark:invert"
                        height={40}
                        width={151}
                    />
                </Link>

                <div className='flex items-center justify-around text-white'>
                    {auth ? menuAuth() : menuNotAuth()}
                </div>
            </div>
        </div>
    );
}

export default NavBar;