import { apiClient } from "meutcc/libs/api";

async function autenticar(data) {
    return apiClient.post('/app/autenticar', data).then((response) => response.data);
}

async function detalhesUsuario() {
    return apiClient.get('/app/detalhes-usuario').then((response) => response.data);
}

async function googleCallback(params) {
    return apiClient.get('/app/callback' + params).then((response) => response.data); 
}

async function detalhesUsuarioPorEmail(email) {
    return apiClient.get(`/app/detalhes-usuario?email=${encodeURIComponent(email)}`)
        .then(response => response.data);
}

export default {
    autenticar,
    detalhesUsuario,
    googleCallback,
    detalhesUsuarioPorEmail
}