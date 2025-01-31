import React from 'react';
import { useRouter } from 'next/router';
import { TccProvider } from './context/TccContext';
import DetalhesHeader from './components/DetalhesHeader';
import DetalhesBody from './components/DetalhesBody';

const DetalhesTCCPage = () => {
    const router = useRouter();
    const { tccId } = router.query;

    if (!tccId) return <div>Carregando...</div>;

    return (
        <TccProvider tccId={tccId}>
            <div className="detalhes-tcc-page mt-6">
                <DetalhesHeader />

            </div>
        </TccProvider>
    );
};

export default DetalhesTCCPage;
