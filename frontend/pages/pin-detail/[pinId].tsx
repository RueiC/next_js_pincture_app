import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getSession } from 'next-auth/react';
import { GetServerSideProps, NextPage } from 'next';

import type {
  PageId,
  PinItem,
  Redirect,
  PinDetail,
  SessionUser,
} from '../../types';
import { feedQuery } from '../../utils/queries';
import MasonryLayout from '../../components/MasonryLayout';
import { client } from '../../utils/client';
import { pinDetailQuery } from '../../utils/queries';
import { CommentField, ConfirmModal, NoResult, Pin } from '../../components';
import { useStateContext } from '../../store/stateContext';

interface ServerSideProps {
  props: {
    session: SessionUser;
    pinId: PageId;
    pins: PinItem[] | null;
    pinDetail: PinDetail | null;
  };
}

interface Props {
  session: SessionUser;
  pinId: string;
  pins: PinItem[] | null;
  pinDetail: PinDetail | null;
}

export const getServerSideProps: GetServerSideProps = async (
  context,
): Promise<Redirect | ServerSideProps> => {
  const session: SessionUser | null = await getSession(context);
  const pinId = context.query.pinId as string;

  if (!session || !pinId) {
    return {
      redirect: {
        destination: '/login',
      },
      props: {},
    };
  } else {
    const query: string = pinDetailQuery(pinId);

    const pinDetailRes = await client.fetch(query);
    const pinDetail: PinDetail | null =
      !pinDetailRes.length || pinDetailRes === null ? null : pinDetailRes[0];

    const pinsRes = await client.fetch(feedQuery);
    const pins: PinItem[] | null =
      !pinsRes?.length || pinsRes === null ? null : pinsRes;

    return {
      props: { session, pinId, pins, pinDetail },
    };
  }
};

const PinDetailPage: NextPage<Props> = ({
  session,
  pinId,
  pinDetail,
  pins,
}) => {
  const { toggleDeleteWindow } = useStateContext();

  return (
    <>
      {toggleDeleteWindow ? <ConfirmModal /> : null}

      {pinDetail ? (
        <main className='flex flex-col gap-[5rem]'>
          <div className='flex flex-col md:flex-row items-center md:items-start justify-center w-full h-full px-[3rem] md:px-[6rem] xl:px-[10rem] mt-[3rem] gap-[3rem]'>
            {pinDetail ? <Pin pin={pinDetail} session={session} /> : null}

            <div className='flex flex-col gap-[1.5rem] w-full h-full'>
              <div>
                <h1 className='text-[1.7rem] font-bold break-words text-text-1'>
                  {pinDetail?.title}
                </h1>
                <p className='mt-[0.6rem] text-[1.2rem] text-text-2 font-normal opacity-90'>
                  {pinDetail?.about}
                </p>
              </div>

              <Link href={`/user-profile/${pinDetail?.postedBy._id}`}>
                <div className='flex items-center gap-[1rem]'>
                  <Image
                    className='rounded-full cursor-pointer'
                    src={pinDetail?.postedBy?.image}
                    alt='user image'
                    width={40}
                    height={40}
                  />
                  <p className='cursor-pointer font-medium text-[1rem] text-text-2'>
                    {pinDetail?.postedBy?.userName}
                  </p>
                </div>
              </Link>

              <CommentField session={session} pinId={pinId} />
            </div>
          </div>

          <div className='flex flex-col pb-[10rem]'>
            <p className='px-[3rem] md:px-[6rem] xl:px-[10rem] text-[2rem] font-bold'>
              更多內容
            </p>
            {pins ? <MasonryLayout pins={pins} /> : null}
          </div>
        </main>
      ) : (
        <NoResult />
      )}
    </>
  );
};

export default PinDetailPage;
