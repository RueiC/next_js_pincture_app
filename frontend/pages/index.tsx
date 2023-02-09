import React from 'react';
import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';
import { Session } from 'next-auth/core/types';
import { Feeds, NoResult } from '../components';
import { feedQuery } from '../utils/queries';
import { client } from '../utils/client';
import type { PinItem, Redirect } from '../types';

interface ServerSideProps {
  props: { pins: PinItem[] };
}

interface Props {
  pins: PinItem[];
}

export const getServerSideProps: GetServerSideProps = async (
  context,
): Promise<Redirect | ServerSideProps> => {
  const session: Session | null = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/login',
      },
      props: {},
    };
  } else {
    const pins = await client.fetch(feedQuery);

    return {
      props: { pins },
    };
  }
};

const Home: NextPage<Props> = ({ pins }) => {
  return <>{pins?.length !== 0 ? <Feeds pins={pins} /> : <NoResult />}</>;
};

export default Home;
