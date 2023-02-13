import { useState } from 'react';
import { signOut, useSession } from 'next-auth/react';

import { useRouter } from 'next/router';
import { SessionUser } from '../types';
import { MobileNav, DesktopNav } from './index';

const NavBar = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { data: session }: { data: SessionUser | null } = useSession();

  const handleSearch = (
    e: React.FormEvent<HTMLFormElement>,
    search: string,
  ): void => {
    e.preventDefault();
    if (search !== '') {
      router.push(`/search/${search}`);
      setSearchTerm('');
    }
  };

  return (
    <>
      <DesktopNav
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleSearch={handleSearch}
        session={session}
        signOut={signOut}
      />

      <MobileNav
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleSearch={handleSearch}
        session={session}
        signOut={signOut}
      />
    </>
  );
};

export default NavBar;
