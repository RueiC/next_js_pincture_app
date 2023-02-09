import React, { useState, Dispatch, SetStateAction } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { RiDeleteBin6Fill } from 'react-icons/ri';
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs';
import { IoMdCloudDownload } from 'react-icons/io';
import { useRouter } from 'next/router';

import { urlFor } from '../utils/client';
import type { PinItem, SessionUser, SubmitState } from '../types';
import { useSession } from 'next-auth/react';
import useCheckSaved from '../hooks/useCheckSaved';
import { useStateContext } from '../store/stateContext';

interface ModalInfo {
  toggle: boolean;
  id: string;
}

interface Props {
  pin: PinItem;
  setIsModalOpen: Dispatch<SetStateAction<ModalInfo>>;
}

const Pin = ({ pin, setIsModalOpen }: Props) => {
  const router = useRouter();
  const { savePin, unSavePin } = useStateContext();
  const { data: session }: { data: SessionUser | null } = useSession();
  const [pinItem, setPinItem] = useState<PinItem | null>(pin);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [submitState, setSubmitState] = useState<SubmitState>({
    style: 'bg-red-500',
    text: '儲存',
    state: 'unSaved',
  });
  const isSaved = useCheckSaved({
    pinDetail: pinItem,
    session,
    setSubmitState,
  });

  const toggleSavedBtn = async (pinItem: PinItem) => {
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
                      disabled={
                        submitState.state === 'uploading' ? true : false
                      }
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSavedBtn(pinItem);
                      }}
                    >
                      {submitState.text}
                    </button>
                  ) : null}
                </div>

                <div className='flex justify-between w-full'>
                  <Link
                    href={`/pin-detail/${pinItem._id}`}
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
                        setIsModalOpen({ toggle: true, id: pin._id });
                      }}
                    >
                      <RiDeleteBin6Fill />
                    </div>
                  ) : null}
                </div>
              </div>
            )}
          </div>

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
        </div>
      ) : null}
    </>
  );
};

export default Pin;
