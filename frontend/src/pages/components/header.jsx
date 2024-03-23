import Image from 'next/image';

export default function Header(props) {
    return (
        <div style={{backgroundColor: '#2f9e41'}}>
            <div className='max-w-screen-lg mx-auto flex justify-between items-center p-3'>
                <Image
                    src="/ifrs.png"
                    alt="IFRS Logo"
                    className="dark:invert"
                    height={40}
                    width={151}
                />

                <div className='flex justify-around text-white'>
                    <div className='px-3'> 
                        <span className='pi pi-fw pi-user me-2'></span>
                        Bem vindo, <b>Aluno</b>
                    </div>
                    <div className='px-2'>Sair</div>
                </div>
            </div>
        </div>
    )
}