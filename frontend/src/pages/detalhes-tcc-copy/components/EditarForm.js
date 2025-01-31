import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Checkbox } from 'primereact/checkbox';
import { useTccContext } from '../context/TccContext';
import DropdownProfessores from '../../../components/ui/DropdownProfessores';
import TccService from '../services/TccService';
import toast from 'react-hot-toast';

const EditarForm = ({ buttonLabel = "Editar TCC", buttonClassName = "p-button-rounded p-button-success", isCoordenador }) => {
    const { tccData, fetchTccDetails, updateTccDetails } = useTccContext();
    const [isDialogVisible, setIsDialogVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    // Estado do formulário
    const [formData, setFormData] = useState({
        tema: '',
        resumo: '',
        orientador: null,
        coorientador: null,
        temCoorientador: false,
    });

    const [erros, setErros] = useState({
        tema: '',
        resumo: '',
        orientador: '',
        coorientador: '',
    });

    // Sincroniza dados do TCC no formulário ao abrir
    useEffect(() => {
        if (tccData) {
            setFormData({
                tema: tccData.tema || '',
                resumo: tccData.resumo || '',
                orientador: tccData.orientador?.id || null,
                coorientador: tccData.coorientador?.id || null,
                temCoorientador: !!tccData.coorientador,
            });
        }
    }, [tccData]);

    // Validação do formulário
    const validarFormulario = () => {
        let valido = true;
        const novosErros = { tema: '', resumo: '', orientador: '', coorientador: '' };

        if (!formData.tema) {
            valido = false;
            novosErros.tema = 'O campo tema é obrigatório.';
        }
        if (!formData.resumo) {
            valido = false;
            novosErros.resumo = 'O campo resumo é obrigatório.';
        }
        if (isCoordenador && !formData.orientador) {
            valido = false;
            novosErros.orientador = 'Selecione um orientador.';
        }
        if (isCoordenador && formData.temCoorientador && !formData.coorientador) {
            valido = false;
            novosErros.coorientador = 'Selecione um coorientador.';
        }
        setErros(novosErros);
        return valido;
    };

    // Submissão do formulário
    const handleSave = async () => {
        if (!validarFormulario()) return;

        setLoading(true);
        try {
            let payload = {};

            if (isCoordenador) {
                // Coordenador pode atualizar todos os campos
                payload = {
                    tema: formData.tema,
                    resumo: formData.resumo,
                    orientador: formData.orientador,
                    coorientador: formData.temCoorientador ? formData.coorientador : null,
                };
            } else {
                // Autor e Orientador podem atualizar apenas tema e resumo
                payload = {
                    tema: formData.tema,
                    resumo: formData.resumo,
                };
            }
            await updateTccDetails(payload); // Chama o contexto para atualizar o TCC
            toast.success('Dados do TCC atualizados com sucesso!');
            setIsDialogVisible(false); // Fecha o modal
        } catch (error) {
            const mensagemErro = typeof error === 'object' && error !== null
                ? Object.values(error).flat().join(' | ') // Combina todas as mensagens do erro
                : 'Erro desconhecido'; // Caso o erro não seja um objeto esperado
            toast.error(`Erro ao Atualizar TCC: ${mensagemErro}`);
        } finally {
            setLoading(false);
        }
    };



    // Manipulação de alterações no formulário
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    return (
        <div>
            <Button
                label={buttonLabel}
                icon="pi pi-pencil"
                className={buttonClassName}
                onClick={() => setIsDialogVisible(true)}
            />

            <Dialog
                header="Editar Detalhes do TCC"
                visible={isDialogVisible}
                style={{ width: '50vw' }}
                onHide={() => setIsDialogVisible(false)}
            >
                <div className="p-fluid">
                    {/* Campo Tema */}
                    <div className="p-field mb-4">
                        <label htmlFor="tema">Tema</label>
                        <InputText
                            id="tema"
                            name="tema"
                            value={formData.tema}
                            onChange={handleInputChange}
                            className={erros.tema ? 'p-invalid' : ''}
                        />
                        {erros.tema && <small className="p-error">{erros.tema}</small>}
                    </div>

                    {/* Campo Resumo */}
                    <div className="p-field mb-4">
                        <label htmlFor="resumo">Resumo</label>
                        <InputTextarea
                            id="resumo"
                            name="resumo"
                            value={formData.resumo}
                            onChange={handleInputChange}
                            rows={4}
                            className={erros.resumo ? 'p-invalid' : ''}
                        />
                        {erros.resumo && <small className="p-error">{erros.resumo}</small>}
                    </div>

                    {/* Orientador e Coorientador - Apenas para Coordenadores */}
                    {isCoordenador && (
                        <>
                            <div className="p-field mb-4">
                                <label htmlFor="orientador">Orientador</label>
                                <DropdownProfessores
                                    id="orientador"
                                    value={formData.orientador}
                                    onChange={(e) => setFormData({ ...formData, orientador: e.value })}
                                    placeholder="Selecione um orientador"
                                    className={erros.orientador ? 'p-invalid' : ''}
                                />
                                {erros.orientador && <small className="p-error">{erros.orientador}</small>}
                            </div>
                            <div className="p-field mb-4">
                                <Checkbox
                                    inputId="temCoorientador"
                                    checked={formData.temCoorientador}
                                    onChange={(e) =>
                                        setFormData({ ...formData, temCoorientador: e.checked, coorientador: null })
                                    }
                                />
                                <label htmlFor="temCoorientador" className="ml-2">Tem coorientador</label>
                                {formData.temCoorientador && (
                                    <DropdownProfessores
                                        id="coorientador"
                                        value={formData.coorientador}
                                        onChange={(e) => setFormData({ ...formData, coorientador: e.value })}
                                        placeholder="Selecione um coorientador"
                                        filterOptions={(options) =>
                                            options.filter((opt) => opt.value !== formData.orientador)
                                        }
                                        className={erros.coorientador ? 'p-invalid' : ''}
                                    />
                                )}
                                {erros.coorientador && <small className="p-error">{erros.coorientador}</small>}
                            </div>
                        </>
                    )}
                </div>

                {/* Botões do Modal */}
                <div className="p-dialog-footer">
                    <Button
                        label="Cancelar"
                        icon="pi pi-times"
                        className="p-button-text"
                        onClick={() => setIsDialogVisible(false)}
                    />
                    <Button
                        label="Salvar"
                        icon="pi pi-check"
                        className="p-button-text"
                        loading={loading}
                        onClick={handleSave}
                    />
                </div>
            </Dialog>
        </div>
    );
};

export default EditarForm;
