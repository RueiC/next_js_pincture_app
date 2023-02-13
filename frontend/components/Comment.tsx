import { Dispatch, SetStateAction } from 'react';
import Image from 'next/image';
import { AiFillDelete } from 'react-icons/ai';

import { CommentType, DeletedItem, SessionUser } from '../types';

interface CommentProps {
  pinId: string;
  comment: CommentType;
  session: SessionUser;
  setDeletedItem: Dispatch<SetStateAction<DeletedItem | null>>;
}

const Comment = ({ pinId, comment, session, setDeletedItem }: CommentProps) => {
  return (
    <>
      {comment ? (
        <div
          className='flex items-center justify-between gap-[1rem] bg-white rounded-[0.5rem]'
          key={comment._key}
        >
          <div className='flex items-center gap-[1rem]'>
            <Image
              src={comment.postedBy.image}
              className='rounded-full cursor-pointer'
              alt='user image'
              width={40}
              height={40}
            />
            <div className='flex flex-col'>
              <p className='font-medium cursor-pointer text-[1rem] text-text-2'>
                {comment.postedBy.userName}
              </p>
              <p className='text-[1rem] text-text-2'>{comment.comment}</p>
            </div>
          </div>
          {session.id === comment.postedBy._id ? (
            <div
              className='flex items-center justify-center bg-red-500 p-[0.5rem] opacity-80 rounded-full hover:scale-105 hover:opacity-100 duration-200 ease-linear cursor-pointer'
              onClick={() =>
                setDeletedItem({ type: 'comment', id: pinId, comment })
              }
            >
              <AiFillDelete className='text-white' />
            </div>
          ) : null}
        </div>
      ) : null}
    </>
  );
};

export default Comment;
