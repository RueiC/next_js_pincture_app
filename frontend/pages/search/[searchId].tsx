import { GetServerSideProps, NextPage } from 'next';
import { Session } from 'next-auth/core/types';
import { getSession } from 'next-auth/react';
import { PinItem, Redirect } from '../../types';
import MasonryLayout from '../../components/MasonryLayout';
import { client } from '../../utils/client';
import { searchQuery } from '../../utils/queries';
import { NoResult } from '../../components';

interface ServerSideProps {
  props: {
    pins: PinItem[] | null;
  };
}

interface Props {
  pins: PinItem[] | null;
}

export const getServerSideProps: GetServerSideProps = async (
  context,
): Promise<Redirect | ServerSideProps> => {
  const session: Session | null = await getSession(context);
  const searchId = context.query.searchId as string;

  if (!session) {
    return {
      redirect: {
        destination: '/login',
      },
      props: {},
    };
  } else {
    const query: string = searchQuery(searchId.toLowerCase());
    const response = await client.fetch(query);

    const pins: PinItem[] | null =
      !response?.length || response === null ? null : response;

    return {
      props: { pins },
    };
  }
};

const Search: NextPage<Props> = ({ pins }) => {
  return <>{pins ? <MasonryLayout pins={pins} /> : <NoResult />}</>;
};

export default Search;
