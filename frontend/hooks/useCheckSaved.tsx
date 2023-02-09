import { useEffect, useState } from 'react';
import type {
  PinDetail,
  PinItem,
  Save,
  SessionUser,
  SubmitState,
} from '../types';

interface Props {
  session: SessionUser | null;
  pinDetail: PinDetail | PinItem | null;
  setSubmitState: React.Dispatch<React.SetStateAction<SubmitState>>;
}

const useCheckSaved = ({
  pinDetail,
  session,
  setSubmitState,
}: Props): boolean => {
  const [isSaved, setIsSaved] = useState<boolean>(false);

  useEffect(() => {
    if (pinDetail === null || pinDetail?.save === null || !session) return;

    const alreadySaved: boolean = pinDetail.save.some(
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
  }, [pinDetail, session]);

  return isSaved;
};

export default useCheckSaved;
