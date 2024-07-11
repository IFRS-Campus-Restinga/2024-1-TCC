import { PrimeReactProvider, addLocale } from 'primereact/api';
import '../assets/css/globals.css';
import "tailwindcss/utilities.css";
import "primereact/resources/themes/lara-light-green/theme.css";
import 'primeicons/primeicons.css';
import { AppLayout } from 'meutcc/components/layouts/AppLayout';
import { AuthProvider } from 'meutcc/core/context/AuthContext';
import Head from 'next/head';

addLocale('ptbr', {
    today: 'Hoje', clear: 'Limpar', monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'], monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'], dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'], dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'], dayNamesMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'], weekHeader: 'Semana', firstDay: 0, isRTL: false, showMonthAfterYear: false, yearSuffix: '', timeOnlyTitle: 'Só Horas', timeText: 'Tempo', hourText: 'Hora', minuteText: 'Minuto', secondText: 'Segundo', ampm: false, month: 'Mês', week: 'Semana', day: 'Dia', allDayText: 'Todo o Dia'
});

export default function MyApp({ Component, pageProps }) {

    const guards = Component.guards || [];
    const getLayout = page => <AppLayout guards={guards} showMenu={Component.showMenu || false}>{page}</AppLayout>;
    const pageTitle = Component.title ? `${Component.title} | Meu TCC` : 'Meu TCC';

    return (
        <>
            <Head>
                <title>{pageTitle}</title>
            </Head>
            <PrimeReactProvider>
                <AuthProvider guards={guards}>
                    {getLayout(<Component {...pageProps} />)}
                </AuthProvider>
            </PrimeReactProvider>
        </>
    );
}
