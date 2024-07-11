import { apiClient } from "meutcc/libs/api"

async function getPrazoEnvioProposta() {
    return apiClient.get('/app/semestre-datas').then((response) => response.data);
}

export default {
    getPrazoEnvioProposta,
}