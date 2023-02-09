import { Dispatch, SetStateAction } from 'react';
import { GoAlert } from 'react-icons/go';

interface ModalInfo {
  toggle: boolean;
  id: string;
}

interface Props {
  deletePin: () => Promise<void>;
  setIsModalOpen: Dispatch<SetStateAction<ModalInfo>>;
}

const ConfirmModal = ({ deletePin, setIsModalOpen }: Props) => {
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
                className='bg-red-500 py-[0.8rem] w-full text-white opacity-100 hover:opacity-80 transition-all duration-200 ease-linear'
                onClick={deletePin}
              >
                刪除
              </button>
              <button
                className='bg-gray-400 py-[0.8rem] w-full text-white opacity-100 hover:opacity-80 transition-all duration-200 ease-linear'
                onClick={() =>
                  setIsModalOpen({
                    toggle: false,
                    id: '',
                  })
                }
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
