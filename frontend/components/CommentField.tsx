import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { toast } from 'react-toastify';

import Images from '../assets/index';
import { Comment } from './index';
import { SessionUser, CommentType, SubmitState } from '../types';
import { client } from '../utils/client';
import { pinComments } from '../utils/queries';

interface Props {
  session: SessionUser;
  pinId: string;
}

const CommentField = ({ session, pinId }: Props) => {
  const [commentInput, setCommentInput] = useState<string>('');
  const [comments, setComments] = useState<CommentType[]>();
  const [submitState, setSubmitState] = useState<SubmitState>({
    style: 'bg-red-500',
    text: '完成',
    state: 'none',
  });

  useEffect(() => {
    if (!pinId) return;

    fetchComments();
  }, []);

  const fetchComments = async (): Promise<void> => {
    const query: string = pinComments(pinId);

    try {
      const res = await client.fetch(query);
      if (!res.length && !res[0]?.comments.length) setComments(res[0].comments);
    } catch (err) {
      console.log(err);
    }
  };

  const checkComment = (comment: string): boolean => {
    if (!session) {
      toast('請先登入後再繼續', { type: 'error' });
      return false;
    } else if (comment === '') {
      toast('請輸入內容', { type: 'error' });
      return false;
    } else {
      return true;
    }
  };

  const confirmAddComment = async (comment: string): Promise<void> => {
    setSubmitState({
      style: 'bg-gray-300',
      text: '處理中',
      state: 'uploading',
    });

    setCommentInput('');

    const commentData = {
      comment,
      createdAt: new Date().toISOString(),
      postedBy: {
        _type: 'postedBy',
        _ref: session.id,
      },
    };

    try {
      await client
        .patch(pinId)
        .setIfMissing({ comments: [] })
        .append('comments', [commentData])
        .commit({ autoGenerateArrayKeys: true })
        .then(() => {
          setSubmitState({
            style: 'bg-red-500',
            text: '完成',
            state: 'none',
          });
          fetchComments();
          toast('已新增留言', { type: 'success' });
        });
    } catch (err) {
      console.log(err);
    }
  };

  const addComment = (comment: string): void => {
    const isSuccess = checkComment(comment);
    if (!isSuccess) return;

    confirmAddComment(comment);
  };

  return (
    <div className='flex flex-col gap-[1.5rem] w-full'>
      <p className='block mt-[1.2rem] font-bold text-[1.7rem] text-text-1'>
        留言
      </p>

      {comments
        ? comments.map((comment) => (
            <Comment
              key={comment._key}
              _key={comment._key}
              comment={comment.comment}
              postedBy={comment.postedBy}
              createdAt={comment.createdAt}
              session={session}
              pinId={pinId}
            />
          ))
        : null}

      <form
        className='flex items-center gap-[1rem] w-full'
        onSubmit={(e) => {
          e.preventDefault();
          addComment(commentInput);
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
          disabled={submitState.state === 'uploading' ? true : false}
        >
          {submitState.text}
        </button>
      </form>
    </div>
  );
};

export default CommentField;
