import { useEffect, useState } from 'react';
import { SessionProvider } from 'next-auth/react';
import { ToastContainer } from 'react-toastify';
import { AppProps } from 'next/app';

import { NavBar, Categories } from '../components/index';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/globals.css';
import { StateProvider } from '../store/stateContext';

interface CustomAppProps extends AppProps {
  session: any;
}

const MyApp = ({ Component, pageProps, router, session }: CustomAppProps) => {
  const [isSSR, setIsSSR] = useState<boolean>(true);

  useEffect(() => {
    setIsSSR(false);
  }, []);

  if (isSSR) return null;

  return (
    <SessionProvider session={session}>
      <StateProvider>
        <ToastContainer
          position='top-center'
          autoClose={4000}
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme='light'
        />

        {router.route !== '/login' ? (
          <>
            <NavBar />
            <Categories />
          </>
        ) : null}

        <Component {...pageProps} />
      </StateProvider>
    </SessionProvider>
  );
};
export default MyApp;
