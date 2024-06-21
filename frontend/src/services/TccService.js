import { apiClient } from "meutcc/libs/api";

async function submeterProposta(data) {
    return apiClient.post('/app/criar-tcc', data).then((response) => response.data);
}

async function getTccsByAluno() {
    return apiClient.get('/app/tccs-by-aluno').then((response) => response.data);
}

async function getTccsByOrientador() {
    return apiClient.get('/app/tccs-by-orientador').then((response) => response.data);
}

async function getTccsCoordenacao() {
    return apiClient.get('/app/tccs-coordenacao').then((response) => response.data);
}

async function getDetalhesTCC(tccId) {
    return apiClient.get(`/app/detalhes-tcc/${tccId}/`).then((response) => response.data);
}

async function getListarTccsPendente() {
    return apiClient.get('/app/listar-tccs-pendente').then((response) => response.data);
}

async function responderProposta(tccId, data) {
    return apiClient.post(`/app/responder-proposta/${tccId}`, data).then((response) => response.data);
}

async function getPossuiTcc() {
    return apiClient.get('/app/possui-proposta').then((response) => response.data);
}   

async function editarTCC(tccId, data) {
    return apiClient.put(`/app/editar-tcc/${tccId}/`, data).then((response) => response.data);
}

async function uploadDocumentoTCC(tccId, formData) {
    return apiClient.post(`/app/upload-documento-tcc/${tccId}/`, formData).then((response) => response.data);
}

async function uploadDocumentoSessao(sessaoId, formData) {
    return apiClient.post(`/app/upload-documento-sessao/${sessaoId}/`, formData).then((response) => response.data);
}

async function excluirDocumentoTCC(tccId) {
    return apiClient.delete(`/app/excluir-documento-tcc/${tccId}/`).then((response) => response.data);
}

async function excluirDocumentoSessao(sessaoId) {
    return apiClient.delete(`/app/excluir-documento-sessao/${sessaoId}/`).then((response) => response.data);
}

async function uploadAutorizacaoPublicacao(tccId, formData) {
    return apiClient.post(`/app/upload-autorizacao-publicacao/${tccId}/`, formData).then((response) => response.data);
}

async function downloadDocumentoTCC(tccId) {
    return apiClient.get(`/app/download-documento-tcc/${tccId}/`, { responseType: 'blob' }).then((response) => response.data);
}

async function downloadDocumentoSessao(sessaoId) {
    return apiClient.get(`/app/download-documento-sessao/${sessaoId}/`, { responseType: 'blob' }).then((response) => response.data);
}



export default {
    submeterProposta,
    getDetalhesTCC,
    responderProposta,
    getListarTccsPendente,
    getPossuiTcc,
    getTccsByAluno,
    getTccsByOrientador,
    getTccsCoordenacao,
    editarTCC,
    uploadDocumentoTCC,
    uploadAutorizacaoPublicacao,
    downloadDocumentoTCC,
    excluirDocumentoTCC,
    uploadDocumentoSessao,
    excluirDocumentoSessao,
    downloadDocumentoSessao
}
