'use client';

import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import Portal from '~/components/portal';
import { cn } from '~/lib/utils';
import { Dictionary } from '~/lib/dictionary';
import { NavLink } from '~/components/layouts/sidebar/components';
import type { Category } from '~/types';

type Props = {
  categories: Category[];
  dictionary: Dictionary;
};

function Sidebar({ categories, dictionary }: Props) {
  const [isOpen, setOpen] = useState<boolean>(false);
  const [openKey, setOpenKey] = useState<string | null>(null);

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 1024;

      if (isOpen && isMobile) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const openSidebar = () => setOpen(true);
  const closeSidebar = () => setOpen(false);

  return (
    <>
      <button
        type='button'
        className='lg:hidden inline-flex text-white cursor-pointer'
        onClick={openSidebar}
      >
        <Menu className='size-4 md:size-5 shrink-0' />
      </button>
      <Portal>
        <>
          <div
            className={cn(
              'lg:hidden fixed inset-0 size-full bg-black/50',
              isOpen ? 'opacity-100 visible' : 'opacity-0 invisible',
              'transition-opacity z-20'
            )}
            onClick={closeSidebar}
          />
          <aside
            className={cn(
              'lg:hidden fixed top-0 left-0 w-64 h-screen flex flex-col bg-secondary-2',
              isOpen ? 'translate-x-0' : '-translate-x-full',
              'transition-transform overflow-hidden py-5 z-20'
            )}
          >
            <button
              type='button'
              className='absolute top-3 right-3 inline-flex justify-center items-center text-white cursor-pointer'
              onClick={closeSidebar}
            >
              <X className='size-5 shrink-0' />
            </button>
            <div className='flex-1 overflow-y-auto px-5 mt-5'>
              <ul className='flex flex-col gap-5'>
                <NavLink
                  href='/'
                  label={dictionary.nav.home}
                  onNavigate={closeSidebar}
                />
                <NavLink
                  href='/about'
                  label={dictionary.nav.about}
                  onNavigate={closeSidebar}
                />
                <NavLink
                  label={dictionary.nav.products}
                  href='/categories'
                  clickable={false}
                  relative={true}
                  isOpen={openKey === 'products'}
                  setOpen={() =>
                    setOpenKey((prev) =>
                      prev === 'products' ? null : 'products'
                    )
                  }
                  items={categories.map((item) => ({
                    label: item.name,
                    href: `?tab=${item.slug}`
                  }))}
                />
                <NavLink
                  href='/projects'
                  label={dictionary.nav.featured_projects}
                  onNavigate={closeSidebar}
                />
                <NavLink
                  label={dictionary.nav.insights}
                  href='/insights'
                  clickable={false}
                  relative={true}
                  isOpen={openKey === 'insights'}
                  setOpen={() =>
                    setOpenKey((prev) =>
                      prev === 'insights' ? null : 'insights'
                    )
                  }
                  items={[
                    {
                      label: 'Always Take Care',
                      href: '?tab=always-take-care'
                    },
                    {
                      label: 'Trust In Mind',
                      href: '?tab=trust-in-mind'
                    },
                    {
                      label: 'Keep Promise',
                      href: '?tab=keep-promise'
                    }
                  ]}
                />
                <NavLink
                  label={dictionary.nav.activities.title}
                  href='/activities'
                  clickable={false}
                  relative={true}
                  isOpen={openKey === 'activities'}
                  setOpen={() =>
                    setOpenKey((prev) =>
                      prev === 'activities' ? null : 'activities'
                    )
                  }
                  items={[
                    {
                      label: dictionary.nav.activities.menu.company,
                      href: '?tab=company'
                    },
                    {
                      label: dictionary.nav.activities.menu.community,
                      href: '?tab=community'
                    }
                  ]}
                />
                <NavLink
                  href='/contact'
                  label={dictionary.nav.contact}
                  onNavigate={closeSidebar}
                />
              </ul>
            </div>
          </aside>
        </>
      </Portal>
    </>
  );
}

export default Sidebar;
