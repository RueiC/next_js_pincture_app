import { Session } from 'next-auth/core/types';
import { useEffect, useState } from 'react';
import { useStateContext } from '../store/stateContext';
import { PinItem } from '../types';
import { client } from '../utils/client';
import { categoryQuery } from '../utils/queries';

interface Props {
  session: Session;
  categoryId: string;
}

const useCategoriesFilter = ({ categoryId, session }: Props) => {
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

  return { isLoading, pins };
};

export default useCategoriesFilter;
