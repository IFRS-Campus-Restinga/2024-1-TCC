/**
 * Serviço para operações relacionadas ao SuperAdmin.
 *
 * Este serviço contém funções para acessar a API de login e outras operações relacionadas ao SuperAdmin.
 *
 * @file SuperAdminService.js
 * @module services/SuperAdminService
 */

import { apiClient } from "meutcc/libs/api"; // Importa a configuração global da API (baseURL configurada)

/**
 * Salva tokens no localStorage específico do SuperAdmin.
 * @param {Object} data - Dados recebidos da API.
 */
const saveSuperAdminTokens = (data) => {
  // Salva o token no localStorage
  localStorage.setItem("token", data.token);
};

/**
 * Realiza o login do SuperAdmin.
 *
 * @param {Object} credentials - As credenciais do SuperAdmin.
 * @param {string} credentials.email - O email do SuperAdmin.
 * @param {string} credentials.password - A senha do SuperAdmin.
 * @returns {Promise<Object>} Resposta da API com o token ou erro.
 */
const login = async (credentials) => {
  try {
    const response = await apiClient.post("/superadmin/login/", credentials);
    console.info("Resposta do backend:", response.data);
    saveSuperAdminTokens(response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Erro ao realizar login do SuperAdmin:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export default {
  login,
};
