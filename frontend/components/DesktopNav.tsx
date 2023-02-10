import Image from 'next/image';
import Link from 'next/link';
import { AiOutlineLogin, AiFillPlusCircle } from 'react-icons/ai';

import { SessionUser } from '../types';
import Images from '../assets';
import { Dispatch, SetStateAction } from 'react';

interface Props {
  searchTerm: string;
  setSearchTerm: Dispatch<SetStateAction<string>>;
  session: SessionUser | null;
  // eslint-disable-next-line no-unused-vars
  handleSearch: (e: React.FormEvent<HTMLFormElement>, search: string) => void;
  signOut: any;
}

const DesktopNav = ({
  searchTerm,
  setSearchTerm,
  handleSearch,
  session,
  signOut,
}: Props) => {
  return (
    <nav className='hidden sm:flex items-center justify-between gap-[1.2rem] px-[3rem] md:px-[6rem] xl:px-[10rem] w-full pt-[1rem] h-[6rem]'>
      <Link href='/'>
        <Image
          className='cursor-pointer'
          src={Images.pin}
          alt='Logo'
          width={45}
          height={45}
        />
      </Link>

      <form
        className='h-full w-full py-[1.2rem]'
        onSubmit={(e) => handleSearch(e, searchTerm)}
      >
        <input
          className='w-full h-full rounded-md bg-gray-200 px-[1.5rem] outline-none'
          type='text'
          placeholder='搜尋'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>

      {session ? (
        <>
          <Link href={`/user-profile/${session.id}`}>
            <Image
              className='duration-300 ease-in-out rounded-full cursor-pointer hover:scale-110'
              src={!session ? Images.userImage : session!.user!.image!}
              alt='User Profile'
              width={42}
              height={42}
            />
          </Link>

          <Link href={'/create-pin'}>
            <AiFillPlusCircle className='h-[2.5rem] w-[2.5rem] cursor-pointer hover:scale-110 duration-300 ease-in-out text-red-400' />
          </Link>

          <AiOutlineLogin
            className='h-[2.5rem] w-[2.5rem] cursor-pointer hover:scale-110 duration-300 ease-in-out text-red-400'
            onClick={() => signOut()}
          />
        </>
      ) : null}
    </nav>
  );
};

export default DesktopNav;
