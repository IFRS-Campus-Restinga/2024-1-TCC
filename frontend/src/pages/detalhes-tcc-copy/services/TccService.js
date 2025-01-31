import { apiClient } from 'meutcc/libs/api';

/**
 * Busca os detalhes de um TCC com base no ID fornecido.
 * @param {string} tccId - ID do TCC a ser buscado.
 * @returns {Promise<Object>} - Dados do TCC.
 */
export async function fetchDetalhesTCC(tccId) {
    try {
        const response = await apiClient.get(`/app/detalhes-tcc/${tccId}/`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Erro ao buscar detalhes do TCC');
    }
}

/**
 * Atualiza os detalhes de um TCC específico.
 * @param {string} tccId - ID do TCC a ser atualizado.
 * @param {Object} data - Dados a serem enviados para atualização.
 * @returns {Promise<Object>} - Resposta da API após a atualização.
 */
export async function updateDetalhesTCC(tccId, data) {
    try {
        const response = await apiClient.patch(`/app/editar-tcc/${tccId}/`, data);
        return response.data; // Retorna os dados apenas em caso de sucesso
    } catch (error) {
        throw error.response?.data || error.message; // Propaga o erro
    }
}
