import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchDetalhesTCC, updateDetalhesTCC } from '../services/TccService'; // Importa o serviço de edição
import { useAuth } from '../../../core/context/AuthContext'; // Importa o AuthContext

const TccContext = createContext();

export const TccProvider = ({ tccId, children }) => {
    const [tccData, setTccData] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth(); // Obtém o usuário diretamente do AuthContext

    // Busca os detalhes do TCC
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchDetalhesTCC(tccId);
                setTccData(data);
            } catch (error) {
                console.error('Erro ao buscar detalhes do TCC:', error);
            } finally {
                setLoading(false);
            }
        };

        if (tccId) {
            fetchData();
        }
    }, [tccId]);

    /**
     * Atualiza os detalhes de um TCC no backend e no estado local.
     * @param {Object} updatedData - Dados atualizados do TCC.
     */
    const updateTccDetails = async (updatedData) => {
        setLoading(true);
        try {
            await updateDetalhesTCC(tccId, updatedData); // Atualiza no backend
            const updatedTccData = await fetchDetalhesTCC(tccId); // Recarrega os dados atualizados
            setTccData(updatedTccData); // Atualiza o estado local
        } catch (error) {
            throw error; // Propaga o erro para o componente que chamou a função
        } finally {
            setLoading(false);
        }
    };

    return (
        <TccContext.Provider value={{ tccData, user, loading, updateTccDetails }}>
            {children}
        </TccContext.Provider>
    );
};

export const useTccContext = () => useContext(TccContext);
