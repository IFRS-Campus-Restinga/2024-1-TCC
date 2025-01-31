import { apiClient } from 'meutcc/libs/api';

const CursoService = {
    getCursosSimplificados: () => {
        return apiClient.get('/app/cursos-simplificados').then(response => response.data); // Endpoint específico
    },
};

const AdminCursoService = {
    getCursos: () => {
        return apiClient.get('/superadmin/cursos/').then(response => response.data); // Endpoint para superadmin
    },
    getCursoById: (cursoId) => {
        return apiClient.get(`/superadmin/cursos/${cursoId}/`).then(response => response.data);
    },
    updateCurso: (cursoId, cursoData) => {
        return apiClient.put(`/superadmin/cursos/${cursoId}/`, cursoData).then(response => response.data);
    },
    trocarCoordenador: (cursoId, professorId) => {
        return apiClient.put(`/superadmin/cursos/${cursoId}/trocar-coordenador/`, { professor_id: professorId })
            .then(response => response.data);
    },
    getHistoricoCoordenadores: (cursoId) => {
        return apiClient.get(`/superadmin/cursos/${cursoId}/historico-coordenadores/`)
            .then(response => response.data);
    },
    adicionarProfessor: (cursoId, professorId) => {
        return apiClient.post(`/superadmin/cursos/${cursoId}/adicionar-professor/`, { professor_id: professorId })
            .then(response => response.data)
            .catch(error => {
                console.error('Erro ao adicionar professor:', error);
                throw error;
            });
    },
    removerProfessor: (cursoId, professorId) => {
        return apiClient.delete(`/superadmin/cursos/${cursoId}/remover-professor/`, {
            data: { professor_id: professorId }
        })
            .then(response => response.data)
            .catch(error => {
                console.error('Erro ao remover professor:', error);
                throw error;
            });
    },
    atualizarVisibilidade: (cursoId, visible) => {
        return apiClient.post(`/superadmin/cursos/${cursoId}/atualizar-visibilidade/`, { visible })
            .then(response => response.data)
            .catch(error => {
                console.error('Erro ao atualizar visibilidade do curso:', error);
                throw error;
            });
    },
    criarCurso: (novoCurso) => {
        return apiClient.post('/superadmin/cursos/criar/', novoCurso)
            .then(response => response.data)
            .catch(error => {
                console.error('Erro ao criar curso:', error);
                throw error;
            });
    }    
};

export { AdminCursoService };
export default CursoService;
