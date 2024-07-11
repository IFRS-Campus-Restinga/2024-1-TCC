import { apiClient } from "meutcc/libs/api"

async function getSessoesPendentes() {
    return apiClient.get('/app/sessoes-futuras').then((response) => response.data);
}

async function getSessoesPendentesOrientador() {
    return apiClient.get('/app/sessoes-futuras-orientador').then((response) => response.data);
}

async function putEditarSessao(data) {
    return apiClient.put('/app/editar-sessao', data).then((response) => response.data);
}

async function putEditarSessaoOrientador(data) {
    return apiClient.put('/app/editar-sessao-orientador', data).then((response) => response.data);
}

async function postNovaSessao(data) {
    return apiClient.post('/app/nova-sessao', data).then((response) => response.data);
}

export default {
    getSessoesPendentes,
    getSessoesPendentesOrientador,
    putEditarSessao,
    putEditarSessaoOrientador,
    postNovaSessao,
}