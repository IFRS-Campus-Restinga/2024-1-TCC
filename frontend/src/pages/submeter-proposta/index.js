import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import React from 'react';
import { Dropdown } from 'primereact/dropdown';
import { Checkbox } from 'primereact/checkbox';
import TccService from 'meutcc/services/TccService';
import ProfessorService from 'meutcc/services/ProfessorService';
import SemestreService from 'meutcc/services/SemestreService';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import { GUARDS } from 'meutcc/core/constants';
import LoadingSpinner from 'meutcc/components/ui/LoadingSpinner';
import { set } from 'date-fns';

const SubmeterPropostaPage = () => {

    const [loading, setLoading] = React.useState(false);
    const [selectedOrientador, setSelectedOrientador] = React.useState(null);
    const [selectedCoorientador, setSelectedCoorientador] = React.useState(null);
    const [temCoorientador, setTemCoorientador] = React.useState(false);
    const [afirmoQueConversei, setAfirmoQueConversei] = React.useState(false);
    const [orientadores, setOrientadores] = React.useState([]);
    const [coorientadores, setCoorientadores] = React.useState([]);
    const [temaMensagemErro, setTemaMensagemErro] = React.useState('');
    const [resumoMensagemErro, setResumoMensagemErro] = React.useState('');
    const [orientadorMensagemErro, setOrientadorMensagemErro] = React.useState('');
    const [coorientadorMensagemErro, setCoorientadorMensagemErro] = React.useState('');
    const [estaNoPrazo, setEstaNoPrazo] = React.useState(false);

    const router = useRouter();
    
    React.useEffect(() => {
        const fetchJaPossuiProposta = async () => {
            
            setLoading(true);
            try {
                const data = await TccService.getPossuiTcc();
                console.log(data.value);

                if (data.possuiProposta == true) {
                    router.push('/meus-tccs');
                }else{
                    setLoading(false);
                }
            } catch (error) {
                console.error('Erro ao buscar propostas existentes', error);
                setLoading(false);
            }
        }

        fetchJaPossuiProposta();

        const fetchProfessores = async () => {

            setLoading(true);
            try {
                const data = await ProfessorService.getProfessores();
                const professores = data.map((professor) => ({ name: professor.nome, value: professor.id }));
    
                setOrientadores(professores);
                setCoorientadores(professores);

            } catch (error) {
                console.error('Erro ao buscar professores', error);
            }
        };

        fetchProfessores();

        const verificarPrazoEnvioProposta = async () => {
            const data = await SemestreService.getPrazoEnvioProposta();
            const hoje = new Date();
            const dataAbertura = new Date(data.dataAberturaPrazoPropostas);
            const dataFechamento = new Date(data.dataFechamentoPrazoPropostas);

            if (hoje >= dataAbertura && hoje <= dataFechamento) {
                setEstaNoPrazo(true);
            } else {
                setEstaNoPrazo(false);
            }
        };

        verificarPrazoEnvioProposta();

    }, []);   

    if(loading){
        return <LoadingSpinner />;
    }

    const onSubmit = async (event) => {
        event.preventDefault();

        let isValid = true;

        setLoading(true);

        const formData = new FormData(event.currentTarget);
        const jsonData = Object.fromEntries(formData);

        if (jsonData.tema === '') {
            isValid = false;
            setTemaMensagemErro('O campo tema é obrigatório');
        } else {
            setTemaMensagemErro('');
        }

        if (jsonData.resumo === '') {
            isValid = false;
            setResumoMensagemErro('O campo resumo é obrigatório');
        } else {
            setResumoMensagemErro('');
        }

        if (!selectedOrientador) {
            isValid = false;
            setOrientadorMensagemErro('O campo orientador é obrigatório');
        } else {
            setOrientadorMensagemErro('');
        }

        if (temCoorientador && !selectedCoorientador) {
            isValid = false;
            setCoorientadorMensagemErro('O campo coorientador é obrigatório');
        } else {
            setCoorientadorMensagemErro('');
        }

        if (!isValid) {
            setLoading(false);
            return;
        }

        if(!afirmoQueConversei) {
            toast.error('Você precisa afirmar que conversou com o professor sobre a proposta de TCC');
            setLoading(false);
            return;
        }

        if (selectedOrientador === selectedCoorientador) {
            setCoorientadorMensagemErro('O orientador e coorientador não podem ser a mesma pessoa');
            setLoading(false);
            return;
        }

        const response = await TccService.submeterProposta(jsonData);

        if (response) {
            toast.success('Proposta submetida com sucesso');
        } else {
            toast.error('Erro ao submeter proposta');
        }

        setLoading(false);
        router.push('/meus-tccs');

    }

    const handleTemCoorientadorChange = (e) => {
        setTemCoorientador(!temCoorientador);
        setSelectedCoorientador(null);
    }

    if(!estaNoPrazo){
        return <div className='max-w-screen-md mx-auto bg-white m-3 mt-6 flex flex-col'>
            <div className='py-3 border-0 border-b border-dashed border-gray-200'>
                <h1 className='heading-1 text-center text-gray-700'>Submeter Proposta de TCC</h1>
            </div>
            <div className='py-6 px-9'>
                <p className="text-center">Não estamos no período de envio de propostas.</p>
            </div>
        </div>;
    }else{
        return <div className='max-w-screen-md mx-auto bg-white m-3 mt-6 flex flex-col'>
            <div className='py-3 border-0 border-b border-dashed border-gray-200'>
                <h1 className='heading-1 text-center text-gray-700'>Submeter Proposta de TCC</h1>
            </div>

            <div className='py-6 px-9'>
                <form onSubmit={onSubmit}>
                    <div className='flex flex-wrap align-items-center mb-3 gap-2'>
                        <label htmlFor='tema' className='p-sr-only'>Tema</label>
                        <InputText id='tema' name='tema' placeholder='Tema' className={'w-full ' + (temaMensagemErro ? 'p-invalid' : '')} />
                        { temaMensagemErro && <small id='tema-help' className='text-red-500 py-1 px-2'>{temaMensagemErro}</small> }
                    </div>

                    <div className='flex flex-wrap align-items-center mb-3 gap-2'>
                        <InputTextarea id='resumo' name='resumo' placeholder='Escreva um resumo sobre o que será abordado em seu TCC' rows={6} className={'w-full ' + (resumoMensagemErro ? 'p-invalid' : '')} />
                        { resumoMensagemErro && <small id='tema-help' className='text-red-500 py-1 px-2'>{resumoMensagemErro}</small> }
                    </div>

                    <div className='flex flex-row align-items-center mb-3 gap-2'>
                        <div className='w-1/2'>
                            <Dropdown value={selectedOrientador} name='orientador' onChange={(e) => setSelectedOrientador(e.value)} options={orientadores} optionLabel="name" placeholder="Selecione o orientador" className={"w-full md:w-14rem" + (orientadorMensagemErro ? 'p-invalid' : '')} />
                            { orientadorMensagemErro && <small id='tema-help' className='text-red-500 py-1 px-2'>{orientadorMensagemErro}</small> }
                        </div>
                        <div className='w-1/2'>
                            <Dropdown value={selectedCoorientador} name='coorientador' disabled={!temCoorientador} onChange={(e) => setSelectedCoorientador(e.value)} options={coorientadores} optionLabel="name" placeholder="Selecione o coorientador" className={"w-full md:w-14rem" + (coorientadorMensagemErro ? 'p-invalid' : '')} />
                            { coorientadorMensagemErro && <small id='tema-help' className='text-red-500 py-1 px-2'>{coorientadorMensagemErro}</small> }
                            <div className="flex align-items-center py-3">
                                <Checkbox inputId="temCoorientador" onChange={handleTemCoorientadorChange} checked={temCoorientador} />
                                <label htmlFor="temCoorientador" className="ml-2">Tem coorientador</label>
                            </div>
                        </div>
                    </div>


                    <div className="flex flex-wrap align-items-center mb-3 gap-1 pt-2">
                        <Checkbox inputId="afirmoQueConversei" name='afirmoQueConversei' onChange={(e) => setAfirmoQueConversei(!afirmoQueConversei)} checked={afirmoQueConversei} />
                        <label htmlFor="afirmoQueConversei" className="ml-2">Afirmo que conversei presencialmente com o professor sobre minha proposta de TCC</label>
                    </div>

                    <div className="flex flex-wrap align-items-center mb-3 gap-2">
                        <Button label={loading ? "Submetendo proposta" : "Submeter proposta"} loading={loading} className='w-full' />
                    </div>
                </form>
            </div>
    </div>;
    }

}

SubmeterPropostaPage.guards = [GUARDS.ESTUDANTE];
SubmeterPropostaPage.title = 'Submeter Proposta de TCC';

export default SubmeterPropostaPage;