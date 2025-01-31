import React, { useState, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Steps } from 'primereact/steps';
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
import UsuarioService from 'meutcc/services/UsuarioService';
import { MultiSelect } from 'primereact/multiselect';

const DetalhesAdicionaisStep = ({ IsInterno, userData, setUserData, grausAcademicos, areaAtuacao, setActiveIndex, activeIndex }) => {
    const toast = useRef(null);
    const [identidade, setIdentidade] = useState(null);
    const [diploma, setDiploma] = useState(null);
    const [selectedInterests, setSelectedInterests] = useState(userData.area_interesse || []);

    const onFieldChange = (e, fieldName) => {
        setUserData({ ...userData, [fieldName]: e.target.value });
    };

    const onFileSelect = (e, setFile) => {
        if (e.files && e.files.length > 0) {
            setFile(e.files[0]); // Acessando o primeiro arquivo selecionado
        }
    };

    const areasInteresse = [
        { label: 'Algoritmos, Combinatória e Otimização', value: 'ALGORITMOS_COMBINATORIA_E_OTIMIZACAO' },
        { label: 'Arquitetura de Computadores e Processamento de Alto Desempenho', value: 'ARQUITETURA_DE_COMPUTADORES_E_PROCESSAMENTO_DE_ALTO_DESEMPENHO' },
        { label: 'Banco de Dados', value: 'BANCO_DE_DADOS' },
        { label: 'Biologia Computacional', value: 'BIOLOGIA_COMPUTACIONAL' },
        { label: 'Computação Aplicada à Saúde', value: 'COMPUTACAO_APLICADA_A_SAUDE' },
        { label: 'Computação Gráfica e Processamento de Imagens', value: 'COMPUTACAO_GRAFICA_E_PROCESSAMENTO_DE_IMAGENS' },
        { label: 'Computação Musical', value: 'COMPUTACAO_MUSICAL' },
        { label: 'Computação Ubíqua e Pervasiva', value: 'COMPUTACAO_UBIQUA_E_PERVASIVA' },
        { label: 'Concepção de Circuitos Integrados', value: 'CONCEPCAO_DE_CIRCUITOS_INTEGRADOS' },
        { label: 'Engenharia de Software', value: 'ENGENHARIA_DE_SOFTWARE' },
        { label: 'Geo Informática', value: 'GEO_INFORMATICA' },
        { label: 'Informática na Educação', value: 'INFORMATICIA_NA_EDUCACAO' },
        { label: 'Inteligência Artificial', value: 'INTELIGENCIA_ARTIFICIAL' },
        { label: 'Inteligência Computacional', value: 'INTELIGENCIA_COMPUTACIONAL' },
        { label: 'Interação Humano Computador', value: 'INTERACAO_HUMANO_COMPUTADOR' },
        { label: 'International Association for Pattern Recognition (IAPR)', value: 'IAPR' },
        { label: 'Jogos e Entretenimento', value: 'JOGOS_E_ENTRETENIMENTO' },
        { label: 'Linguagens de Programação', value: 'LINGUAGENS_DE_PROGRAMACAO' },
        { label: 'Métodos Formais', value: 'METODOS_FORMAIS' },
        { label: 'Processamento de Linguagem Natural', value: 'PROCESSAMENTO_DE_LINGUAGEM_NATURAL' },
        { label: 'Realidade Virtual', value: 'REALIDADE_VIRTUAL' },
        { label: 'Redes de Computadores e Sistemas Distribuídos', value: 'REDES_DE_COMPUTADORES_E_SISTEMAS_DISTRIBUIDOS' },
        { label: 'Robótica', value: 'ROBOTICA' },
        { label: 'Segurança', value: 'SEGURANCA' },
        { label: 'Sistemas Colaborativos', value: 'SISTEMAS_COLABORATIVOS' },
        { label: 'Sistemas Distribuidos', value: 'SISTEMAS_DISTRIBUIDOS' },
        { label: 'Sistemas de Informação', value: 'SISTEMAS_DE_INFORMACAO' },
        { label: 'Sistemas Multimídia e Hipermídia', value: 'SISTEMAS_MULTIMIDIA_E_HIPERMIDIA' },
        { label: 'Sistemas Tolerantes a Falhas', value: 'SISTEMAS_TOLERANTES_A_FALHAS' }
    ];

    const validateAndSubmit = () => {
        let error = false;

        if (!IsInterno && !userData.titulo) {
            toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Título deve ser preenchido para usuários externos.', life: 3000 });
            error = true;
        }
        if (!IsInterno && !userData.area_atuacao) {
            toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Área de atuação deve ser preenchida para usuários externos.', life: 3000 });
            error = true;
        }
        if (IsInterno && userData.isProfessor && !userData.matricula) {
            toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Matrícula deve ser preenchida para professores internos.', life: 3000 });
            error = true;
        }
        if (IsInterno && userData.isProfessor && !userData.titulo) {
            toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Título deve ser preenchido para professores internos.', life: 3000 });
            error = true;
        }
        if (IsInterno && userData.isProfessor && !userData.area_atuacao) {
            toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Área de atuação deve ser preenchida para professores internos.', life: 3000 });
            error = true;
        }
        if (IsInterno && !userData.isProfessor && !userData.matricula) {
            toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Matrícula deve ser preenchida para estudantes.', life: 3000 });
            error = true;
        }

        if (!error) {
            const formData = new FormData();
            formData.append('nome', userData.nome);
            formData.append('cpf', userData.cpf);
            formData.append('email', userData.email);
            formData.append('titulo', userData.titulo);
            formData.append('avatar', userData.avatar);
            formData.append('area_atuacao', userData.area_atuacao);
            formData.append('area_interesse', JSON.stringify(userData.area_interesse)); // Certificando que area_interesse é uma string JSON

            if (userData.matricula) formData.append('matricula', userData.matricula);
            if (userData.titulo) formData.append('titulo', userData.titulo);
            if (userData.area_atuacao) formData.append('area', userData.area_atuacao);
            if (userData.area_interesse) formData.append('area_interesse', JSON.stringify(userData.area_interesse)); // Certificando que area_interesse é uma string JSON

            // Certifique-se de que 'identidade' e 'diploma' são realmente arquivos
            if (identidade) {
                formData.append('identidade', identidade, identidade.name);
            }
            if (diploma) {
                formData.append('diploma', diploma, diploma.name);
            }

            UsuarioService.criarUsuario(formData)
                .then(response => {
                    console.log('Usuário criado com sucesso:', response);
                    window.location.pathname = ('/');
                })
                .catch(error => {
                    console.error('Erro ao criar usuário:', error);
                    if (toast.current) {
                        toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Erro ao criar usuário', life: 3000 });
                    }
                });
        }
    };

    React.useEffect(() => {
        // Atualiza os interesses selecionados quando o componente recebe novos dados
        setSelectedInterests(userData.area_interesse || []);
    }, [userData.area_interesse]);

    const handleChange = (e) => {
        setSelectedInterests(e.value);
        setUserData({ ...userData, area_interesse: e.value });
    };

    const steps = [
        { label: 'Dados Pessoais' },
        { label: 'Escolha o Tipo' },
        { label: 'Detalhes Adicionais' }
    ];

    return (
        <div className='py-6 px-9'>
            <Toast ref={toast} />
            <div className='max-w-screen-md mx-auto bg-white m-3 mt-6 flex flex-col py-6 px-9'>
                <div className='py-3 border-0 border-b border-dashed border-gray-200'>
                    <Steps model={steps} activeIndex={activeIndex} onSelect={(e) => setActiveIndex(e.index)} readOnly={true} />
                    <h1 className='heading-1 text-center text-gray-700'>Dados Adicionais</h1>
                </div>
                {IsInterno === false ? (
                    <>
                        <Dropdown className='w-full mb-2' value={userData.titulo} options={grausAcademicos} onChange={(e) => onFieldChange(e, 'titulo')} placeholder="Selecione o seu título acadêmico" />
                        <Dropdown className='w-full mb-2' value={userData.area_atuacao} options={areaAtuacao} onChange={(e) => onFieldChange(e, 'area_atuacao')} placeholder="Selecione sua área de atuação" />
                        <MultiSelect className='w-full mb-2' value={selectedInterests} options={areasInteresse} onChange={handleChange} placeholder="Selecione as suas áreas de interesse" />
                        <label htmlFor='identidade' className='font-bold text-gray-700'> Documento de Identificação: </label>
                        <FileUpload name="identidade" mode="basic" auto={false} accept="application/pdf,image/png,image/jpeg" maxFileSize={5000000} label="Upload Identidade" chooseLabel="Selecionar Identificação" onSelect={(e) => onFileSelect(e, setIdentidade)} className="w-full p-button-sm p-button-outlined" style={{ marginBottom: '10px', marginTop: '5px', border: '1px solid #ccc', padding: '10px', borderRadius: '10px', justifyContent: 'space-between' }} />
                        <label htmlFor='diploma' className='font-bold text-gray-700'> Diploma: </label>
                        <FileUpload name="diploma" mode="basic" auto={false} accept="application/pdf,image/png,image/jpeg" maxFileSize={5000000} label="Upload Diploma" chooseLabel="Selecionar Diploma" onSelect={(e) => onFileSelect(e, setDiploma)} className="w-full p-button-sm p-button-outlined" style={{ marginBottom: '10px', marginTop: '5px', border: '1px solid #ccc', padding: '10px', borderRadius: '10px', justifyContent: 'space-between' }} />
                        <Button className='w-full mb-2' label="Concluir Cadastro" onClick={validateAndSubmit} />
                    </>
                ) : userData.isProfessor === false ? (
                    <>
                        <InputText className='w-full mb-2' value={userData.matricula} placeholder="Matrícula" onChange={(e) => onFieldChange(e, 'matricula')} />
                        <Button className='w-full mb-2' label="Concluir Cadastro" onClick={validateAndSubmit} />
                    </>
                ) : (
                    <>
                        <InputText className='w-full mb-2' value={userData.matricula} placeholder="Matrícula" onChange={(e) => onFieldChange(e, 'matricula')} />
                        <Dropdown className='w-full mb-2' value={userData.titulo} options={grausAcademicos} onChange={(e) => onFieldChange(e, 'titulo')} placeholder="Selecione o seu título acadêmico" />
                        <Dropdown className='w-full mb-2' value={userData.area_atuacao} options={areaAtuacao} onChange={(e) => onFieldChange(e, 'area_atuacao')} placeholder="Selecione sua área de atuação" />
                        <MultiSelect className='w-full mb-2' value={selectedInterests} options={areasInteresse} onChange={handleChange} placeholder="Selecione as suas áreas de interesse" />
                        <Button className='w-full mb-2' label="Concluir Cadastro" onClick={validateAndSubmit} />
                    </>
                )}
            </div>
        </div>
    );

};

export default DetalhesAdicionaisStep;