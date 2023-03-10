import { useEffect, useState } from 'react';
import Masonry from 'react-masonry-css';
import { useSession } from 'next-auth/react';
import { ConfirmModal } from './index';
import Pin from './Pin';
import { PinItem, SessionUser } from '../types';

import { useStateContext } from '../store/stateContext';

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

const MasonryLayout = ({ pins }: Props) => {
  const { toggleDeleteWindow } = useStateContext();
  const { data: session }: { data: SessionUser | null } = useSession();
  const [newPins, setNewPins] = useState<PinItem[]>([]);

  useEffect(() => {
    if (!pins) return;

    setNewPins(pins);
  }, [pins]);

  return (
    <>
      {toggleDeleteWindow ? <ConfirmModal /> : null}

      <div className='w-full h-full px-[3rem] md:px-[6rem] xl:px-[10rem] pt-[2rem]'>
        {newPins?.length > 0 && session ? (
          <Masonry
            className='flex gap-[3rem] sm:gap-[1.8rem]'
            breakpointCols={breakpointColumnsObj}
          >
            {newPins.map((pin) => (
              <Pin pin={pin} key={pin._id} session={session} />
            ))}
          </Masonry>
        ) : null}
      </div>
    </>
  );
};

export default MasonryLayout;
