import { Session } from 'next-auth/core/types';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { categories } from '../utils/data';

const Categories = () => {
  const [activeCategory, setActiveCategory] = useState<string | string[]>(
    '全部',
  );
  const [hoverCategory, setHoverCategory] = useState<string | null>(null);
  const router = useRouter();
  const { data: session }: { data: Session | null } = useSession();
  const { categoryId } = router.query;

  useEffect(() => {
    if (!categoryId) return;

    setActiveCategory(categoryId);
  }, [categoryId]);

  const navigateCategory = (category: string): void => {
    if (category === '全部') {
      setActiveCategory('全部');
      router.push(`/`);
    } else {
      setActiveCategory(category);
      router.push(`/category/${category}`);
    }
  };

  return (
    <>
      {session ? (
        <div className='flex items-center w-full px-[3rem] md:px-[6rem] xl:px-[10rem]'>
          <div className='flex items-center gap-[1rem] overflow-scroll scrollbar-hide pt-[1.5rem] sm:py-[0.5rem]'>
            {categories.map((category) => (
              <div
                className={`${
                  activeCategory === category.name ||
                  hoverCategory === category.name
                    ? 'opacity-100'
                    : 'opacity-80'
                } bg-red-500 text-white rounded-full px-[1rem] py-[0.5rem] font-medium text-base outline-none cursor-pointer hover:scale-105 transition-all duration-200 ease-in-out min-w-[4.5rem] text-center`}
                key={category.name}
                onClick={() => navigateCategory(category.name)}
                onMouseEnter={() => setHoverCategory(category.name)}
                onMouseLeave={() => setHoverCategory(null)}
              >
                {category.name}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Categories;
