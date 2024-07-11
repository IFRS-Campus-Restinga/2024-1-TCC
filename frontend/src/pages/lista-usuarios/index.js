import React from 'react';
import { GUARDS } from 'meutcc/core/constants';
import ListaUsuarios from './ListaUsuarios';
import { useAuth } from 'meutcc/core/context/AuthContext';

const ListaUsuariosPage = () => {
    const { user } = useAuth();

    return (
        <div className='max-w-screen-xl mx-auto bg-white m-3 mt-6'>
            <div className='py-3 border-0 border-b border-dashed border-gray-200'>
                <h1 className='heading-1 text-center text-gray-700'>Lista de Usuários</h1>
                <div className='m-10'>
                    <ListaUsuarios />
                </div>
            </div>
        </div>
    );
};

ListaUsuariosPage.guards = [GUARDS.COORDENADOR];
ListaUsuariosPage.title = 'Lista de Usuários';

export default ListaUsuariosPage;
