import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { toast } from 'react-toastify';

import Images from '../assets/index';
import { Comment } from './index';
import { SessionUser, SubmitedComment } from '../types';
import { useStateContext } from '../store/stateContext';
import { stateMsgTemplate } from '../utils/data';

interface Props {
  session: SessionUser;
  pinId: string;
}

const CommentField = ({ session, pinId }: Props) => {
  const { comments, addComment, setDeletedItem, fetchComments } =
    useStateContext();
  const [commentInput, setCommentInput] = useState<string>('');
  const [submitState, setSubmitState] = useState({
    style: 'bg-red-500',
    text: '確定',
    state: 'default',
  });

  useEffect(() => {
    if (!pinId) return;

    fetchComments(pinId);
  }, []);

  const checkComment = async (commentInput: string): Promise<void> => {
    if (!session) {
      toast('請先登入後再繼續', { type: 'error' });
      return;
    } else if (commentInput === '') {
      toast('請輸入內容', { type: 'error' });
      return;
    }
    setSubmitState({
      style: stateMsgTemplate.style.gray,
      text: stateMsgTemplate.text.handling,
      state: stateMsgTemplate.state.handling,
    });

    const commentData: SubmitedComment = {
      comment: commentInput,
      createdAt: new Date().toISOString(),
      postedBy: {
        _type: 'postedBy',
        _ref: session.id,
      },
    };

    setCommentInput('');

    await addComment(pinId, commentData);

    setSubmitState({
      style: stateMsgTemplate.style.red,
      text: stateMsgTemplate.text.default,
      state: stateMsgTemplate.state.default,
    });
  };

  return (
    <div className='flex flex-col gap-[1.5rem] w-full'>
      <p className='block mt-[1.2rem] font-bold text-[1.7rem] text-text-1'>
        留言
      </p>

      {comments?.length > 0
        ? comments.map((comment) => (
            <Comment
              key={comment._key}
              pinId={pinId}
              comment={comment}
              session={session}
              setDeletedItem={setDeletedItem}
            />
          ))
        : null}

      <form
        className='flex items-center gap-[1rem] w-full'
        onSubmit={(e) => {
          e.preventDefault();
          checkComment(commentInput);
        }}
      >
        <Image
          className='rounded-full'
          src={!session ? Images.userImage : session!.user!.image!}
          alt='user image'
          width={40}
          height={40}
        />

        <input
          className='border-2 border-gray-100 rounded-[1rem] px-[1.2rem] py-[0.5rem] w-full flex-1 outline-none'
          value={commentInput}
          type='text'
          placeholder='新增留言'
          onChange={(e) => setCommentInput(e.target.value)}
        />
        <button
          className={`${submitState.style} text-white rounded-full px-[1.5rem] py-[0.5rem] font-semibold text-base outline-none hover:scale-105 transition-all duration-300 ease-in-out text-[1rem]`}
          type='submit'
          disabled={submitState.state === 'handling' ? true : false}
        >
          {submitState.text}
        </button>
      </form>
    </div>
  );
};

export default CommentField;
