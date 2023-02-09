import { useEffect, useState } from 'react';
import Masonry from 'react-masonry-css';
import { ConfirmModal } from './index';
import Pin from './Pin';
import { PinItem } from '../types';
import { toast } from 'react-toastify';
import { client } from '../utils/client';

interface Props {
  pins: PinItem[];
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

  return (
    <>
      {isModalOpen.toggle ? (
        <ConfirmModal deletePin={deletePin} setIsModalOpen={setIsModalOpen} />
      ) : null}

      <div className='px-[3rem] md:px-[6rem] xl:px-[10rem] pt-[2rem]'>
        {newPins?.length > 0 ? (
          <Masonry
            className='flex gap-[3rem] sm:gap-[1.8rem]'
            breakpointCols={breakpointColumnsObj}
          >
            {newPins.map((pin) => (
              <Pin pin={pin} key={pin._id} setIsModalOpen={setIsModalOpen} />
            ))}
          </Masonry>
        ) : null}
      </div>
    </>
  );
};

export default MasonryLayout;
