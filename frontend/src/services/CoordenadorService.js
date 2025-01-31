import { apiClient } from "meutcc/libs/api";

const CoordenadorService = {
    listarCoordenadores: () => {
        return apiClient.get('/superadmin/coordenadores/listar/')
            .then(response => response.data)
            .catch(error => {
                console.error('Erro ao listar coordenadores:', error);
                throw error;
            });
    },
    adicionarCurso: (coordenadorId, cursoId) => {
        return apiClient.post(`/superadmin/coordenadores/${coordenadorId}/adicionar-curso/`, { curso_id: cursoId })
            .then(response => response.data)
            .catch(error => {
                console.error('Erro ao adicionar curso ao coordenador:', error);
                throw error;
            });
    },
    limparCurso: (coordenadorId) => {
        return apiClient.post(`/superadmin/coordenadores/${coordenadorId}/limpar-curso/`)
            .then(response => response.data)
            .catch(error => {
                console.error('Erro ao limpar curso do coordenador:', error);
                throw error;
            });
    },
};

export default CoordenadorService;
