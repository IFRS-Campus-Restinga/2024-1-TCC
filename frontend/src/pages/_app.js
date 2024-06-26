import { PrimeReactProvider } from 'primereact/api';
import '../assets/css/globals.css';
import "tailwindcss/utilities.css";
import "primereact/resources/themes/lara-light-green/theme.css";
import 'primeicons/primeicons.css';
import { AppLayout } from 'meutcc/components/layouts/AppLayout';
import { AuthProvider } from 'meutcc/core/context/AuthContext';
import Head from 'next/head';

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
