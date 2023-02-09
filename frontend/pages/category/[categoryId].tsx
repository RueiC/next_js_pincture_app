import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';
import { Session } from 'next-auth';
import { Feeds, NoResult, Spinner } from '../../components';

import { PageId, Redirect } from '../../types';
import useCategoriesFilter from '../../hooks/useCategoriesFilter';

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
  const { pins, isLoading } = useCategoriesFilter({ categoryId, session });

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
