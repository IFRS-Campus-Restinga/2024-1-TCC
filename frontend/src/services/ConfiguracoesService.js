import { apiClient } from "meutcc/libs/api";

async function atualizaDataProposta(data) {
    return apiClient.put('/app/atualizar-datas-propostas', data).then((response) => response.data);
}

async function alterarCoordenador(data) {
    return apiClient.put('/app/alterar-coordenador', data).then((response) => response.data);
}

async function getCoordenador() {
    return apiClient.get('/app/coordenador').then((response) => response.data);
}

async function getSemestreAtual() {
    return apiClient.get('/app/semestre-atual').then((response) => response.data);
}

async function getHistoricoCoordenadores() {
    return apiClient.get('/app/historico-coordenadores').then((response) => response.data);
}

async function consultaPrazo() {
    return apiClient.get('/app/consulta-prazo-propostas').then((response) => response.data);
}

async function getSemestres() {
    return apiClient.get('/app/semestres').then((response) => response.data);
}

async function getSemestre(id) {
    return apiClient.get('/app/semestre/' + id).then((response) => response.data);
}

async function criarSemestre(data) {
    return apiClient.post('/app/criar-semestre', data);
}

async function getCoordenadoresSemestre(id) {
    return apiClient.get('/app/coordenadores-semestre/' + id).then((response) => response.data);
}

export default {
    atualizaDataProposta,
    alterarCoordenador,
    getCoordenador,
    getSemestreAtual,
    getHistoricoCoordenadores,
    consultaPrazo,
    getSemestres,
    criarSemestre,
    getSemestre,
    getCoordenadoresSemestre
}
