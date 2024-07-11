import { apiClient } from "meutcc/libs/api";

async function avaliar(sessaoId, data) {
    return apiClient.post(`/app/avaliar/${sessaoId}/`, data).then((response) => response.data);
}

async function avaliarAjustes(avaliacaoId, data) {
    return apiClient.post(`/app/avaliar-ajustes/${avaliacaoId}/`, data).then((response) => response.data);
}

async function uploadFichaAvaliacao(avaliacaoId, formData) {
    return apiClient.post(`/app/upload-ficha-avaliacao/${avaliacaoId}/`, formData).then((response) => response.data);
}

async function excluirFichaAvaliacao(avaliacaoId) {
    return apiClient.delete(`/app/excluir-ficha-avaliacao/${avaliacaoId}/`).then((response) => response.data);
}

async function downloadFichaAvaliacao(avaliacaoId) {
    return apiClient.get(`/app/download-ficha-avaliacao/${avaliacaoId}/`, { responseType: 'blob' }).then((response) => response.data);
}

async function uploadDocumentoAjuste(avaliacaoId, formData) {
    return apiClient.post(`/app/upload-documento-ajuste/${avaliacaoId}/`, formData).then((response) => response.data);
}

async function excluirDocumentoAjuste(avaliacaoId) {
    return apiClient.delete(`/app/excluir-documento-ajuste/${avaliacaoId}/`).then((response) => response.data);
}

async function downloadDocumentoAjuste(avaliacaoId) {
    return apiClient.get(`/app/download-documento-ajuste/${avaliacaoId}/`, { responseType: 'blob' }).then((response) => response.data);
}


export default {
    avaliar,
    avaliarAjustes,
    uploadFichaAvaliacao,
    excluirFichaAvaliacao,
    downloadFichaAvaliacao,
    uploadDocumentoAjuste,
    excluirDocumentoAjuste,
    downloadDocumentoAjuste
}
