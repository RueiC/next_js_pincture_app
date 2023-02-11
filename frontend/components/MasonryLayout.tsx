import { Dispatch, useEffect, useState } from 'react';
import Masonry from 'react-masonry-css';
import { useSession } from 'next-auth/react';
import { ConfirmModal } from './index';
import Pin from './Pin';
import { PinItem, SessionUser, SubmitState } from '../types';
import { toast } from 'react-toastify';
import { client } from '../utils/client';
import { useStateContext } from '../store/stateContext';

interface Props {
  pins: PinItem[];
}

interface ToggleSaveBtn {
  pinItem: PinItem;
  isSaved: boolean;
  setPinItem: Dispatch<React.SetStateAction<PinItem | null>>;
  setSubmitState: Dispatch<React.SetStateAction<SubmitState>>;
}

const breakpointColumnsObj = {
  default: 4,
  3000: 6,
  2000: 5,
  1200: 3,
  1000: 2,
  600: 1,
};

interface ModalInfo {
  toggle: boolean;
  id: string;
}

const MasonryLayout = ({ pins }: Props) => {
  const { savePin, unSavePin } = useStateContext();
  const { data: session }: { data: SessionUser | null } = useSession();
  const [newPins, setNewPins] = useState<PinItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<ModalInfo>({
    toggle: false,
    id: '',
  });

  useEffect(() => {
    if (!pins) return;

    setNewPins(pins);
  }, [pins]);

  const deletePin = async (): Promise<void> => {
    if (isModalOpen.id === '') return;

    await client.delete(isModalOpen.id).then(() => {
      const pins = newPins.filter((pin) => {
        return pin._id !== isModalOpen.id;
      });

      setIsModalOpen({ toggle: false, id: '' });

      setNewPins(pins);

      toast('刪除成功', { type: 'success' });
    });
  };

  const toggleSavedBtn = async ({
    pinItem,
    isSaved,
    setPinItem,
    setSubmitState,
  }: ToggleSaveBtn): Promise<void> => {
    if (!pinItem || !session) return;

    try {
      if (isSaved) {
        const res = await unSavePin(pinItem, session, setSubmitState);
        setPinItem(res);
      } else {
        const res = await savePin(pinItem, session, setSubmitState);
        setPinItem(res);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {isModalOpen.toggle ? (
        <ConfirmModal deletePin={deletePin} setIsModalOpen={setIsModalOpen} />
      ) : null}

      <div className='px-[3rem] md:px-[6rem] xl:px-[10rem] pt-[2rem]'>
        {newPins?.length > 0 && session ? (
          <Masonry
            className='flex gap-[3rem] sm:gap-[1.8rem]'
            breakpointCols={breakpointColumnsObj}
          >
            {newPins.map((pin) => (
              <Pin
                pin={pin}
                key={pin._id}
                setIsModalOpen={setIsModalOpen}
                toggleSavedBtn={toggleSavedBtn}
                session={session}
              />
            ))}
          </Masonry>
        ) : null}
      </div>
    </>
  );
};

export default MasonryLayout;
