import { GoAlert } from 'react-icons/go';
import { useStateContext } from '../store/stateContext';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { CommentType } from '../types';
import { client } from '../utils/client';
import { stateMsgTemplate } from '../utils/data';

const ConfirmModal = () => {
  const router = useRouter();
  const { deletedItem, fetchComments, setDeletedItem, setToggleDeleteWindow } =
    useStateContext();
  const [submitState, setSubmitState] = useState({
    style: 'bg-red-500',
    text: '確定',
    state: 'default',
  });

  const deletePin = async (id: string): Promise<void> => {
    try {
      await client.delete(id).then(() => {
        toast('刪除成功', { type: 'success' });

        window.setTimeout(() => {
          router.push('/');
        }, 2000);
      });
    } catch (err) {
      console.log(err);
    }
  };

  const deleteComment = async (
    id: string,
    comment: CommentType,
  ): Promise<void> => {
    if (!comment._key || !comment) return;

    await client
      .patch(id)
      .unset([`comments[_key == "${comment._key}"]`])
      .commit()
      .then(() => {
        fetchComments(id);
        toast('留言刪除成功!', { type: 'success' });
      })
      .catch((err) => console.log(err));
  };

  const handleDelete = async (): Promise<void> => {
    if (!deletedItem) return;

    setSubmitState({
      style: stateMsgTemplate.style.gray,
      text: stateMsgTemplate.text.handling,
      state: stateMsgTemplate.state.handling,
    });

    if (deletedItem.type === 'pin') {
      const { id } = deletedItem;
      await deletePin(id);
    }

    if (deletedItem.type === 'comment') {
      const { id, comment } = deletedItem;
      if (!comment) return;
      await deleteComment(id, comment);
    }

    closeDeleteConfirmWindow();
    setSubmitState({
      style: stateMsgTemplate.style.red,
      text: stateMsgTemplate.text.default,
      state: stateMsgTemplate.state.default,
    });
  };

  const closeDeleteConfirmWindow = (): void => {
    setDeletedItem(null);
    setToggleDeleteWindow(false);
  };

  return (
    <>
      <div className='fixed top-0 left-0 bg-black/50 w-full h-[100vh] z-40' />

      <div className='hidden md:flex items-center justify-center md:fixed top-0 left-0 w-full h-[100vh] z-50'>
        <div className='relative flex items-center justify-center w-[20rem] h-[13rem]'>
          <div className='absolute -top-[2rem] flex items-center justify-center bg-white p-[1rem] rounded-full z-10'>
            <GoAlert className='text-[2.5rem] text-yellow-400' />
          </div>

          <div className='relative w-full h-full flex flex-col items-center justify-center gap-[4rem] rounded-[1rem] bg-white overflow-hidden'>
            <div className='flex flex-col items-center justify-center mb-[2.5rem]'>
              <p className='text-[1.3rem] font-normal opacity-80'>
                確定要刪除嗎?
              </p>
              <p className='text-[1rem] opacity-70'>一旦刪除後就無法復原</p>
            </div>

            <div className='absolute bottom-0 w-full flex items-center justify-between text-[1rem]'>
              <button
                className={`${submitState.style} py-[0.8rem] w-full text-white opacity-100 hover:opacity-80 transition-all duration-200 ease-linear`}
                onClick={handleDelete}
                disabled={submitState.state === 'handling' ? true : false}
              >
                {submitState.text}
              </button>
              <button
                className='bg-gray-400 py-[0.8rem] w-full text-white opacity-100 hover:opacity-80 transition-all duration-200 ease-linear'
                onClick={() => setDeletedItem(null)}
              >
                取消
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmModal;
