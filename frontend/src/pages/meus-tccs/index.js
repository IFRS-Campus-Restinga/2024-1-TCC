import { Button } from 'primereact/button';
import { Menubar } from 'primereact/menubar';
import Image from 'next/image';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Message } from 'primereact/message';
import { useState } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { Checkbox } from 'primereact/checkbox';

import RootLayout from './Layout'

const MeusTccsPage = () => {

    const items = [
        { label: 'Inicio', icon: 'pi pi-fw pi-home' },
        { label: 'Meus TCCs', icon: 'pi pi-fw pi-book' },
        { label: 'Configurações', icon: 'pi pi-fw pi-cog' },
    ];

    const orientadores = [
        {name: 'Gleison', code: 1},
        {name: 'Rome', code: 2},
        {name: 'London', code: 3},
    ];

    const [selectedOrientador, setSelectedOrientador] = useState(null);

    const coorientadores = [
        {name: 'Gleison', code: 1},
        {name: 'Rome', code: 2},
        {name: 'London', code: 3},
    ];

    const [selectedCoorientador, setSelectedCoorientador] = useState(null);

    const [temCoorientador, setTemCoorientador] = useState(false);

    const [afirmoQueConversei, setAfirmoQueConversei] = useState(false);

    return (
    <RootLayout>
        
        <div>
        {/*
        <div style={{backgroundColor: '#2f9e41'}}>
            <div className='max-w-screen-lg mx-auto flex justify-between items-center p-3'>
                <Image
                src="/ifrs.png"
                alt="IFRS Logo"
                className="dark:invert"
                height={40}
                width={151}
                />

                <div className='flex justify-around text-white'>
                    <div className='px-3'> 
                        <span className='pi pi-fw pi-user me-2'></span>
                        Bem vindo, <b>Aluno</b>
                    </div>
                    <div className='px-2'>Sair</div>
                </div>
            </div>
        </div>
        */}

        <div style={{backgroundColor: '#f9fafb'}}>
            <Menubar model={items} style={{borderWidth: 0}} className='max-w-screen-lg mx-auto' />
        </div>

        <div className='max-w-screen-lg mx-auto bg-white m-3 mt-6 flex flex-col p-4'>
            <div>
                <h1 className='heading-1 text-center text-gray-800'>Submeter Proposta de TCC</h1>
            </div>

            <div className="flex flex-wrap align-items-center mb-3 gap-2">
                {/* <label htmlFor="username" className="p-sr-only">Username</label> */}
                <InputText id="tema" placeholder="Tema" className='w-full' />
                {/* <Message severity="error" text="Username is required" /> */}
            </div>

            <div className="flex flex-wrap align-items-center mb-3 gap-2">
                <InputTextarea id="tema" placeholder="Escreva um resumo sobre o que será abordado em seu TCC" className='w-full' />
            </div>

            <div className="flex flex-row align-items-center mb-3 gap-2">
                <div className='w-1/2'>
                    <Dropdown value={selectedOrientador} onChange={(e) => setSelectedOrientador(e.value)} options={orientadores} optionLabel="name" placeholder="Selecione o orientador" className="w-full md:w-14rem" />
                </div>
                <div className='w-1/2'>
                    <Dropdown value={selectedCoorientador} disabled={!temCoorientador} onChange={(e) => setSelectedCoorientador(e.value)} options={coorientadores} optionLabel="name" placeholder="Selecione o coorientador" className="w-full md:w-14rem" />
                    <div className="flex align-items-center py-3">
                        <Checkbox inputId="temCoorientador" name="temCoorientador" value="temCoorientador" onChange={(e) => setTemCoorientador(!temCoorientador)} checked={temCoorientador} />
                        <label htmlFor="temCoorientador" className="ml-2">Tem coorientador</label>
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap align-items-center mb-3 gap-2">
                <Checkbox inputId="afirmoQueConversei" name="pizza" value="Cheese" onChange={(e) => setAfirmoQueConversei(!afirmoQueConversei)} checked={afirmoQueConversei} />
                <label htmlFor="afirmoQueConversei" className="ml-2">Afirmo que conversei presencialmente com o professor sobre minha proposta de TCC</label>
            </div>

            <div className="flex flex-wrap align-items-center mb-3 gap-2">
                <Button label="Submeter" className='w-full' />
            </div>

        </div>

        
    </div>

    </RootLayout>
    );
};

export default MeusTccsPage;