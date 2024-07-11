import React from 'react';
import { GUARDS } from 'meutcc/core/constants';
import SessoesFuturasTabela from './listaSessoesFuturas';
import { useAuth } from 'meutcc/core/context/AuthContext';


const SessoesFuturas = () => {

    const { user } = useAuth();
    
    return (

        <div>
            

            <div className='max-w-screen-xl mx-auto bg-white m-3 mt-6'>
                <div className='py-3 border-0 border-b border-dashed border-gray-200'>
                    <h1 className='heading-1 text-center text-gray-700'>Sessões Futuras</h1>
                    <div className='m-10'>
                        <SessoesFuturasTabela />
                    </div>
                </div>
                <div className="card">
            </div>

            </div>
        </div>
    );
};

SessoesFuturas.guards = [GUARDS.COORDENADOR];
SessoesFuturas.title = 'Sessões Futuras';

export default SessoesFuturas;