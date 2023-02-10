import { Dispatch, SetStateAction, useState } from 'react';
import Link from 'next/link';
import {
  AiFillCloseCircle,
  AiOutlineLogin,
  AiOutlineMenu,
  AiFillPlusCircle,
} from 'react-icons/ai';

import Images from '../assets';
import { SessionUser } from '../types';

interface Props {
  searchTerm: string;
  setSearchTerm: Dispatch<SetStateAction<string>>;
  // eslint-disable-next-line no-unused-vars
  handleSearch: (e: React.FormEvent<HTMLFormElement>, search: string) => void;
  session: SessionUser | null;
  signOut: any;
}

const MobileNav = ({
  searchTerm,
  setSearchTerm,
  handleSearch,
  session,
  signOut,
}: Props) => {
  const [showNavbar, setShowNavbar] = useState<boolean>(false);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 sm:hidden flex flex-col gap-[1.5rem] w-full h-[100vh] bg-white px-[3rem] py-[2rem] translate-x-[100%] transition-all duration-500 ease-in-out z-50 ${
          showNavbar && 'translate-x-0'
        }`}
      >
        {showNavbar ? (
          <>
            <div className='flex items-center justify-between'>
              <img
                className='w-[2.5rem] h-[2.5rem] cursor-pointer'
                src={Images.pin}
                alt='Logo'
                loading='lazy'
              />
              <AiFillCloseCircle
                className='text-[2rem] hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer'
                onClick={() => setShowNavbar(false)}
              />
            </div>

            {session ? (
              <form
                className='flex flex-col gap-[2rem]'
                onSubmit={(e) => handleSearch(e, searchTerm)}
              >
                <input
                  className='w-full h-[2.5rem] rounded-md bg-gray-200 px-[1.5rem] outline-none'
                  type='text'
                  placeholder='搜尋'
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSearchTerm(e.target.value)
                  }
                />

                <div>
                  <p className='text-[1.5rem] font-medium mb-[1.5rem]'>選單</p>
                  <ul className='flex flex-col items-start justify-center gap-[1.5rem]'>
                    <li className='flex gap-[1rem] items-center hover:-translate-y-1 transition-all duration-300 ease-in-out cursor-pointer'>
                      <img
                        className='h-[1.8rem] w-[1.8rem] rounded-full'
                        src={
                          !session ? Images.userImage : session!.user!.image!
                        }
                        alt='User Profile'
                      />
                      <p>{!session ? Images.userImage : session!.user!.name}</p>
                    </li>

                    <li className='transition-all duration-300 ease-in-out cursor-pointer hover:-translate-y-1'>
                      <Link
                        className='flex gap-[1rem] items-center'
                        href='/create-pin'
                      >
                        <AiFillPlusCircle className='h-[1.8rem] w-[1.8rem] text-red-400' />
                        創建Pin
                      </Link>
                    </li>

                    <li className='flex gap-[1rem] items-center hover:-translate-y-1 transition-all duration-300 ease-in-out cursor-pointer'>
                      <AiOutlineLogin
                        className='h-[1.8rem] w-[1.8rem] text-red-400'
                        onClick={() => signOut()}
                      />
                      <p>登出</p>
                    </li>
                  </ul>
                </div>
              </form>
            ) : null}
          </>
        ) : null}
      </nav>

      {!showNavbar ? (
        <div className='flex sm:hidden justify-between items-center w-full bg-white px-[3rem] pt-[1.5rem]'>
          <img
            className='w-[2.5rem] h-[2.5rem] cursor-pointer'
            src={Images.pin}
            alt='Logo'
            loading='lazy'
          />
          <AiOutlineMenu
            className='text-[2rem] cursor-pointer hover:scale-105 transition-all duration-200 ease-in-out'
            onClick={() => setShowNavbar(true)}
          />
        </div>
      ) : null}
    </>
  );
};

export default MobileNav;
