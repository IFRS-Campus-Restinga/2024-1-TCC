import React, { useState, useEffect } from 'react';
import DadosPessoaisStep from './DadosPessoaisStep';
import TipoCadastroStep from './TipoCadastro';
import DetalhesAdicionaisStep from './DetalhesAdicionaisStep';
import UsuarioService from 'meutcc/services/UsuarioService';
import { useRouter } from 'next/router';


const CadastroPage = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const router = useRouter();
    const [userData, setUserData] = useState({
        nome: '',
        cpf: '',
        matricula: '',
        area_atuacao: '',
        titulo: '',
        area_interesse: '',
        identidade: null,
        diploma: null,
        isProfessor: false,
        IsInterno: false,
        avatar: ''
    });

    React.useEffect(() => {
        const token = localStorage.getItem('data');
        if (token) {
            const decodedData = JSON.parse(atob(token));
            const { name, email, picture } = decodedData;
            setUserData({
                ...userData,
                nome: name,
                email: email,
                IsInterno: email.endsWith('@restinga.ifrs.edu.br') || email.endsWith('@aluno.restinga.ifrs.edu.br'),
                avatar: picture
            });
        }

    }, []);

    const nextStep = () => {
        if (activeIndex === 0) {
            setActiveIndex(userData.IsInterno ? 1 : 2);
        } else {
            setActiveIndex(activeIndex + 1);
        }
    };

    const submitCadastro = async () => {
        console.log('Dados enviados:', userData);
        await UsuarioService.criarUsuario(userData);
    };


    const steps = [
        { label: 'Dados Pessoais' },
        { label: 'Escolha o Tipo' },
        { label: 'Detalhes Adicionais' }
    ];

    return (
        <div>
            {activeIndex === 0 && <DadosPessoaisStep userData={userData} setUserData={setUserData} nome={userData.nome} email={userData.email} activeIndex={activeIndex} setActiveIndex={setActiveIndex} nextStep={nextStep} />}
            {activeIndex === 1 && <TipoCadastroStep onTipoCadastroChange={(tipo) => setUserData({ ...userData, isProfessor: tipo })} setActiveIndex={setActiveIndex} activeIndex={activeIndex} />}
            {activeIndex === 2 && <DetalhesAdicionaisStep IsInterno={userData.IsInterno} userData={userData} setUserData={setUserData} grausAcademicos={[
                { label: 'Técnico', value: 'TECNICO' },
                { label: 'Graduação', value: 'GRADUACAO' },
                { label: 'Pós-Graduação', value: 'POSGRADUACAO' },
                { label: 'Mestrado', value: 'MESTRADO' },
                { label: 'Doutorado', value: 'DOUTORADO' },
                { label: 'Pós-Doutorado', value: 'POSDOUTORADO' }               
            ]} areaAtuacao={[
                { label: 'Matemática', value: 'MATEMATICA' },
                { label: 'Probabilidade e Estatística', value: 'PROBABILIDADE_E_ESTATISTICA' },
                { label: 'Ciência da Computação', value: 'CIENCIA_DA_COMPUTACAO' },
                { label: 'Astronomia', value: 'ASTRONOMIA' },
                { label: 'Física', value: 'FISICA' },
                { label: 'Química', value: 'QUIMICA' },
                { label: 'Geociências', value: 'GEOCIENCIAS' },
                { label: 'Biologia Geral', value: 'BIOLOGIA_GERAL' },
                { label: 'Bioquímica', value: 'BIOQUIMICA' },
                { label: 'Fisiologia', value: 'FISIOLOGIA' },
                { label: 'Genética', value: 'GENETICA' },
                { label: 'Botânica', value: 'BOTANICA' },
                { label: 'Zoologia', value: 'ZOOLOGIA' },
                { label: 'Ecologia', value: 'ECOLOGIA' },
                { label: 'Morfologia', value: 'MORFOLOGIA' },
                { label: 'Parasitologia', value: 'PARASITOLOGIA' },
                { label: 'Microbiologia', value: 'MICROBIOLOGIA' },
                { label: 'Imunologia', value: 'IMUNOLOGIA' },
                { label: 'Farmacologia', value: 'FARMACOLOGIA' },
                { label: 'Odontologia', value: 'ODONTOLOGIA' },
                { label: 'Medicina', value: 'MEDICINA' },
                { label: 'Biofísica', value: 'BIOFISICA' },
                { label: 'Psicobiologia', value: 'PSICOBIOLOGIA' },
                { label: 'Engenharia Civil', value: 'ENGENHARIA_CIVIL' },
                { label: 'Engenharia de Minas', value: 'ENGENHARIA_DE_MINAS' },
                { label: 'Engenharia de Materiais e Metalúrgica', value: 'ENGENHARIA_DE_MATERIAIS_E_METALURGICA' },
                { label: 'Engenharia Elétrica', value: 'ENGENHARIA_ELETRICA' },
                { label: 'Engenharia Mecânica', value: 'ENGENHARIA_MECANICA' },
                { label: 'Engenharia Química', value: 'ENGENHARIA_QUIMICA' },
                { label: 'Engenharia Sanitária', value: 'ENGENHARIA_SANITARIA' },
                { label: 'Engenharia de Produção', value: 'ENGENHARIA_DE_PRODUCAO' },
                { label: 'Engenharia Nuclear', value: 'ENGENHARIA_NUCLEAR' },
                { label: 'Engenharia de Transportes', value: 'ENGENHARIA_DE_TRANSPORTES' },
                { label: 'Engenharia Naval', value: 'ENGENHARIA_NAVAL' },
                { label: 'Engenharia Aeroespacial', value: 'ENGENHARIA_AEROESPACIAL' },
                { label: 'Engenharia Biomédica', value: 'ENGENHARIA_BIOMEDICA' },
                { label: 'Engenharia de Pesca', value: 'ENGENHARIA_DE_PESCA' },
                { label: 'Oceanografia', value: 'OCEANOGRAFIA' },
                { label: 'Ciência e Tecnologia de Alimentos', value: 'CIENCIA_E_TECNOLOGIA_DE_ALIMENTOS' },
                { label: 'Nutrição', value: 'NUTRICAO' },
                { label: 'Saúde Coletiva', value: 'SAUDE_COLETIVA' },
                { label: 'Enfermagem', value: 'ENFERMAGEM' },
                { label: 'Farmácia', value: 'FARMACIA' },
                { label: 'Veterinária', value: 'VETERINARIA' },
                { label: 'Agronomia', value: 'AGRONOMIA' },
                { label: 'Recursos Florestais e Engenharia Florestal', value: 'RECURSOS_FLORESTAIS_E_ENGENHARIA_FLORESTAL' },
                { label: 'Engenharia Agrícola', value: 'ENGENHARIA_AGRICOLA' },
                { label: 'Zootecnia', value: 'ZOOTECNIA' },
                { label: 'Economia Doméstica', value: 'ECONOMIA_DOMESTICA' },
                { label: 'Desenho Industrial', value: 'DESENHO_INDUSTRIAL' },
                { label: 'Arquitetura e Urbanismo', value: 'ARQUITETURA_E_URBANISMO' },
                { label: 'Planejamento Urbano e Regional', value: 'PLANEJAMENTO_URBANO_E_REGIONAL' },
                { label: 'Demografia', value: 'DEMOGRAFIA' },
                { label: 'Ciência da Informação', value: 'CIENCIA_DA_INFORMACAO' },
                { label: 'Museologia', value: 'MUSEOLOGIA' },
                { label: 'Comunicação', value: 'COMUNICACAO' },
                { label: 'Serviço Social', value: 'SERVICO_SOCIAL' },
                { label: 'Economia', value: 'ECONOMIA' },
                { label: 'Administração', value: 'ADMINISTRACAO' },
                { label: 'Ciência Contábeis', value: 'CIENCIA_CONTABEIS' },
                { label: 'Turismo', value: 'TURISMO' },
                { label: 'Direito', value: 'DIREITO' },
                { label: 'Educação', value: 'EDUCACAO' },
                { label: 'Filosofia', value: 'FILOSOFIA' },
                { label: 'Sociologia', value: 'SOCIOLOGIA' },
                { label: 'Antropologia', value: 'ANTROPOLOGIA' },
                { label: 'Ciência Política', value: 'CIENCIA_POLITICA' },
                { label: 'Teologia', value: 'TEOLOGIA' },
                { label: 'História', value: 'HISTORIA' },
                { label: 'Geografia', value: 'GEOGRAFIA' },
                { label: 'Psicologia', value: 'PSICOLOGIA' },
                { label: 'Artes', value: 'ARTES' },
                { label: 'Letras', value: 'LETRAS' },
                { label: 'Linguística', value: 'LINGUISTICA' }
            ].sort((a, b) => a.label.localeCompare(b.label))} submitCadastro={submitCadastro} setActiveIndex={setActiveIndex} activeIndex={activeIndex} />}
        </div>

    );
};

CadastroPage.title = 'Cadastro de Usuários';
export default CadastroPage;
