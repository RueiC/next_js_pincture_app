import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { RiDeleteBin6Fill } from 'react-icons/ri';
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs';
import { IoMdCloudDownload } from 'react-icons/io';
import { useRouter } from 'next/router';

import { urlFor } from '../utils/client';
import type { PinItem, SessionUser } from '../types';
import useCheckSaved from '../hooks/useCheckSaved';
import { useStateContext } from '../store/stateContext';

interface Props {
  pin: PinItem;
  session: SessionUser;
}

const Pin = ({ pin, session }: Props) => {
  const router = useRouter();
  const { toggleSavedBtn, setDeletedItem } = useStateContext();
  const [pinItem, setPinItem] = useState<PinItem | null>(pin);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [submitState, setSubmitState] = useState({
    style: 'bg-red-500',
    text: '儲存',
    state: 'default',
  });

  const isSaved = useCheckSaved({
    pinItem: pinItem,
    session,
    setSubmitState,
  });

  return (
    <>
      {session && pinItem ? (
        <div className='w-full hover:-translate-y-1 transition-all duration-300 ease-in-out mb-[3rem] sm:mb-[1.8rem]'>
          <div
            className='relative flex items-center justify-center object-contain w-full h-full shadow-md hover:shadow-xl'
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={(): Promise<boolean> =>
              router.push(`/pin-detail/${pinItem._id}`)
            }
          >
            <Image
              className='!relative rounded-lg !w-full '
              src={urlFor(pinItem.image).url()}
              blurDataURL={urlFor(pinItem.image).url()}
              alt='picture'
              placeholder='blur'
              fill
            />

            {isHovered && (
              <div className='absolute flex flex-col justify-between top-0 w-full h-full p-[1rem] transition-all opacity-0 hover:opacity-100 cursor-pointer'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center justify-center bg-white h-[2.5rem] w-[2.5rem] rounded-full text-black text-[1.2rem] opacity-70 hover:opacity-80'>
                    <Link
                      href={`${pinItem?.image?.asset?.url}?dl=`}
                      legacyBehavior
                    >
                      <a download onClick={(e) => e.stopPropagation()}>
                        <IoMdCloudDownload />
                      </a>
                    </Link>
                  </div>
                  {session.id !== pinItem.userId ? (
                    <button
                      className={`${submitState.style} flex items-center justify-center opacity-80 hover:opacity-100 rounded-full text-white py-[0.5rem] px-[1rem] font-bold`}
                      disabled={submitState.state === 'handling' ? true : false}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSavedBtn(
                          pinItem,
                          isSaved,
                          session,
                          setPinItem,
                          setSubmitState,
                        );
                      }}
                    >
                      {submitState.text}
                    </button>
                  ) : null}
                </div>

                <div className='flex justify-between w-full'>
                  <Link
                    href={pinItem.destination}
                    className='flex items-center justify-start bg-white opacity-70 hover:opacity-80 rounded-full text-black py-[0.5rem] px-[1rem]'
                  >
                    <BsFillArrowUpRightCircleFill className='mr-[0.5rem]' />
                    {pinItem.destination.slice(8, 17)}...
                  </Link>

                  {session.id === pinItem.userId ? (
                    <div
                      className='flex items-center justify-center text-[1.2rem] bg-white opacity-70 hover:opacity-80 rounded-full text-black h-[2.5rem] w-[2.5rem]'
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeletedItem({
                          type: 'pin',
                          id: pin._id,
                          comment: null,
                        });
                      }}
                    >
                      <RiDeleteBin6Fill />
                    </div>
                  ) : null}
                </div>
              </div>
            )}
          </div>

          {router.pathname.startsWith('pin-detail') ? (
            <Link href={`/user-profile/${pinItem?.postedBy?._id}`}>
              <div className='flex items-center justify-start gap-[1rem] mt-[0.8rem] h-full w-full cursor-pointer'>
                <Image
                  className='rounded-full'
                  src={pinItem?.postedBy?.image}
                  alt='user image'
                  width={35}
                  height={35}
                />

                <p className='font-semibold sm:text-[0.8rem]'>
                  {pinItem?.postedBy?.userName}
                </p>
              </div>
            </Link>
          ) : null}
        </div>
      ) : null}
    </>
  );
};

export default Pin;
