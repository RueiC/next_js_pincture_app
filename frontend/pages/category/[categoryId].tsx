import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';
import { Session } from 'next-auth';
import { Feeds, NoResult, Spinner } from '../../components';

import { PageId, PinItem, Redirect } from '../../types';
import { useState, useEffect } from 'react';
import { useStateContext } from '../../store/stateContext';
import { client } from '../../utils/client';
import { categoryQuery } from '../../utils/queries';

interface ServerSideProps {
  props: {
    session: Session;
    categoryId: PageId;
  };
}

interface Props {
  session: Session;
  categoryId: string;
}

export const getServerSideProps: GetServerSideProps = async (
  context,
): Promise<Redirect | ServerSideProps> => {
  const session: Session | null = await getSession(context);
  const categoryId: PageId = context.query.categoryId;

  if (!session) {
    return {
      redirect: {
        destination: '/login',
      },
      props: {},
    };
  } else {
    return {
      props: { session, categoryId },
    };
  }
};

const Category: NextPage<Props> = ({ session, categoryId }) => {
  const [pins, setPins] = useState<PinItem[] | null>(null);
  const { isLoading, setIsLoading } = useStateContext();

  const getPins = async (): Promise<void> => {
    const query: string = categoryQuery(categoryId);

    try {
      const res = await client.fetch(query);
      if (res?.length > 0) setPins(res);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!categoryId || !session) return;
    setIsLoading(true);

    getPins();
    setIsLoading(false);
  }, [categoryId, session]);

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <>{pins ? <Feeds pins={pins} /> : <NoResult />}</>
      )}
    </>
  );
};

export default Category;
