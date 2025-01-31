import React from 'react';
import { Button } from 'primereact/button';
import { Steps } from 'primereact/steps';

const TipoCadastroStep = ({ onTipoCadastroChange, setActiveIndex, activeIndex }) => {
    const steps = [
        { label: 'Dados Pessoais' },
        { label: 'Escolha o Tipo' },
        { label: 'Detalhes Adicionais' }
    ];

    return (
        <div className='py-6 px-9'>
            <div className='max-w-screen-md mx-auto bg-white m-3 mt-6 flex flex-col py-6 px-9'>
               <div className='py-3 border-0 border-b border-dashed border-gray-200'>
                <Steps model={steps} activeIndex={activeIndex} onSelect={(e) => setActiveIndex(e.index)} readOnly={true} />
                <h1 className='heading-1 text-center text-gray-700'>Escolha o Tipo de Cadastro</h1>
               </div>
                   <Button className='w-full mb-2' label="Estudante" onClick={() => {onTipoCadastroChange(false); setActiveIndex(2)}} />
                   <Button className='w-full mb-2' label="Professor" onClick={() => {onTipoCadastroChange(true); setActiveIndex(2)}} />
               </div>
        </div>
    );
};

export default TipoCadastroStep;
