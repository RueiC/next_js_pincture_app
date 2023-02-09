import { signIn, getSession } from 'next-auth/react';
import { FcGoogle } from 'react-icons/fc';
import { GetServerSideProps, NextPage } from 'next';
import { Session } from 'next-auth/core/types';

import { Redirect } from '../../types';
import images from '../../assets/index';

interface ServerSideProps {
  props: {
    session: null;
  };
}

interface Props {
  session: null;
}

export const getServerSideProps: GetServerSideProps = async (
  context,
): Promise<Redirect | ServerSideProps> => {
  const session: Session | null = await getSession(context);

  if (session) {
    return {
      redirect: {
        destination: '/',
      },
      props: {},
    };
  } else {
    return {
      props: { session },
    };
  }
};

const Login: NextPage<Props> = () => {
  return (
    <main className='relative flex items-center justify-center bg-black'>
      <video
        className='w-screen h-screen object-cover blur-[6px] opacity-60'
        src='/background_video.mp4'
        loop
        controls={false}
        muted
        autoPlay
      />

      <div className='absolute flex flex-col items-center justify-center gap-[1.5rem] w-screen h-screen'>
        <img className='w-[6rem] h-[6rem]' src={images.pin} alt='logo' />
        <h1 className='text-white font-bold text-[3rem] mb-[2rem] opacity-100 text-center px-[2rem] sm:text-[4rem]'>
          盡情地收集你的靈感
        </h1>

        <div>
          <button
            className='flex items-center justify-center gap-[5px] bg-white text-black px-[1.5rem] py-[0.5rem] rounded-[0.5rem] opacity-90'
            onClick={() => signIn()}
          >
            <FcGoogle />
            使用Google帳號登入
          </button>
        </div>
      </div>
    </main>
  );
};

export default Login;
