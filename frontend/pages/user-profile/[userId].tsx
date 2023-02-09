import { useState } from 'react';
import Image from 'next/image';
import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';
import type { Redirect, User, PageId, SessionUser } from '../../types';
import { client } from '../../utils/client';
import MasonryLayout from '../../components/MasonryLayout';
import { userQuery } from '../../utils/queries';
import { NoResult } from '../../components/index';
import usePinsToggle from '../../hooks/usePinsToggle';

interface ServerSideProps {
  props: {
    session: SessionUser;
    userId: PageId;
    user: User | null;
  };
}

interface Props {
  session: SessionUser;
  userId: string;
  user: User | null;
}

export const getServerSideProps: GetServerSideProps = async (
  context,
): Promise<Redirect | ServerSideProps> => {
  const session: SessionUser | null = await getSession(context);
  const userId = context.query.userId as string;

  if (!session) {
    return {
      redirect: {
        destination: '/login',
      },
      props: {},
    };
  } else {
    const query: string = userQuery(userId);
    const response = await client.fetch(query);

    const user: User | null =
      !response?.length || response === null ? null : response[0];

    return {
      props: { session, userId, user },
    };
  }
};

const activeBtnStyles: string =
  'bg-red-500 text-white font-medium py-2 rounded-full outline-none px-[1rem]';
const notActiveBtnStyles: string =
  'bg-primary mr-4 text-black font-medium py-2 rounded-full outline-none px-[1rem] text-text-2 opacity-90';

const UserProfile: NextPage<Props> = ({ session, userId, user }) => {
  const [activeBtn, setActiveBtn] = useState<string>('created');
  const pins = usePinsToggle({ activeBtn, userId, session });

  return (
    <>
      {user ? (
        <main className='flex flex-col items-center justify-start gap-[1.2rem] mt-[1.2rem]'>
          <Image
            className='block rounded-full mt-[2rem] sm:mt-[1rem]'
            src={user?.image}
            alt='user image'
            width={112}
            height={112}
          />

          <h1 className='font-bold text-[1.8rem] text-center text-text-1'>
            {user?.userName}
          </h1>

          {session.id === user._id ? (
            <div className='flex items-center justify-center gap-[0.5rem] mb-[2rem] text-[1rem]'>
              <button
                className={`${
                  activeBtn === 'created' ? activeBtnStyles : notActiveBtnStyles
                } font-bold hover:scale-105 transition-all duration-300 ease-in-out`}
                type='button'
                onClick={() => setActiveBtn('created')}
              >
                已創建
              </button>
              <button
                className={`${
                  activeBtn === 'saved' ? activeBtnStyles : notActiveBtnStyles
                } font-bold hover:scale-105 transition-all duration-300 ease-in-out`}
                type='button'
                onClick={() => setActiveBtn('saved')}
              >
                已儲存
              </button>
            </div>
          ) : null}

          {pins ? <MasonryLayout pins={pins} /> : <NoResult />}
        </main>
      ) : (
        <NoResult />
      )}
    </>
  );
};

export default UserProfile;
