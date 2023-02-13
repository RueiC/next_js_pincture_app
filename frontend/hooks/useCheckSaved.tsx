import { useEffect, useState } from 'react';
import type { PinItem, Save, SessionUser, SubmitState } from '../types';

interface Props {
  session: SessionUser | null;
  pinItem: PinItem | null;
  setSubmitState: React.Dispatch<React.SetStateAction<SubmitState>>;
}

const useCheckSaved = ({
  pinItem,
  session,
  setSubmitState,
}: Props): boolean => {
  const [isSaved, setIsSaved] = useState<boolean>(false);

  useEffect(() => {
    if (pinItem === null || pinItem?.save === null || !session) return;

    const alreadySaved: boolean = pinItem.save.some(
      (item: Save): boolean => item.userId === session.id,
    );

    if (alreadySaved) {
      setIsSaved(true);
      setSubmitState({
        style: 'bg-red-500',
        text: '已儲存',
        state: 'saved',
      });
    } else {
      setIsSaved(false);
      setSubmitState({
        style: 'bg-red-500',
        text: '儲存',
        state: 'unSaved',
      });
    }
  }, [pinItem, session]);

  return isSaved;
};

export default useCheckSaved;
