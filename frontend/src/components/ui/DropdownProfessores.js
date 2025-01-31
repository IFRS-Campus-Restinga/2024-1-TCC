import React from 'react';
import { useRouter } from 'next/router';
import { Dropdown } from 'primereact/dropdown';
import ProfessorService from 'meutcc/services/ProfessorService';
import CustomAvatar from './CustomAvatar';

export default function DropdownProfessores({ ...props }) {
    const [selectedProfessor, setSelectedProfessor] = React.useState(null);
    const [professores, setProfessores] = React.useState(null);
    const router = useRouter();

    React.useEffect(() => {
        const fetchProfessores = async () => {
            try {
                const data = await ProfessorService.getProfessores();
                const professores = data.map((professor) => ({ ...professor, name: professor.nome, value: professor.id }));

                setProfessores(professores);

            } catch (error) {
                console.error('Erro ao buscar professores', error);
            }
        };
        fetchProfessores();
    }, []);

    const selectedAvaliadorTemplate = (option, props) => {
        if (option) {
            return (
                <div className="flex items-center">
                    <CustomAvatar image={option.avatar} fullname={option.nome} size={30} />
                    <div className='ps-3'>{option.name}</div>
                </div>
            );
        }

        return <span>{props.placeholder}</span>;
    };

    const avaliadorOptionTemplate = (option) => {
        return (
            <div className="flex items-center">
                <CustomAvatar image={option.avatar} fullname={option.nome} size={30} />
                <div className='ps-3'>{option.name}</div>
            </div>
        );
    };


    return (<Dropdown
        placeholder='Selecione um Professor'
        name='avaliador'
        options={professores}
        optionLabel="name"
        className="w-full md:w-14rem"
        valueTemplate={selectedAvaliadorTemplate}
        itemTemplate={avaliadorOptionTemplate}
        {...props}
    />);

}
