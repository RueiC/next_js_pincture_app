import { useEffect, useState } from 'react';
import { userCreatedPinsQuery, userSavedPinsQuery } from '../utils/queries';
import { client } from '../utils/client';
import type { PinItem, SessionUser } from '../types';

interface Props {
  session: SessionUser;
  activeBtn: string;
  userId: string;
}

const usePinsToggle = ({ activeBtn, userId, session }: Props) => {
  const [pins, setPins] = useState<PinItem[] | null>(null);

  const getPins = async (query: string): Promise<void> => {
    try {
      const res = await client.fetch(query);

      if (res.length > 0) {
        setPins(res);
      } else {
        setPins(null);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handlePins = (): void => {
    if (session.id === userId) {
      if (activeBtn === 'created') {
        const createdPinsQuery: string = userCreatedPinsQuery(session.id);
        getPins(createdPinsQuery);
      }

      if (activeBtn === 'saved') {
        const savedPinsQuery: string = userSavedPinsQuery(session.id);
        getPins(savedPinsQuery);
      }
    } else {
      const createdPinsQuery: string = userCreatedPinsQuery(userId);
      getPins(createdPinsQuery);
    }
  };

  useEffect(() => {
    if (!activeBtn || !userId || !session) return;

    handlePins();
  }, [activeBtn, userId, session]);

  return pins;
};

export default usePinsToggle;
