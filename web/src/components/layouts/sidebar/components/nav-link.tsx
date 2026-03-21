'use client';

import { ChevronDown } from 'lucide-react';
import { usePathname } from 'next/navigation';
// import { useState } from 'react';
import { Link } from '~/components/ui';
import { cn } from '~/lib/utils';

type Props = {
  label: string;
  href: string;
  isOpen?: boolean;
  clickable?: boolean;
  relative?: boolean;
  items?: Props[];
  setOpen?: () => void;
  onNavigate?: () => void;
};

function NavLink({
  label,
  href,
  isOpen,
  clickable = true,
  relative,
  items,
  setOpen,
  onNavigate
}: Props) {
  // const [isOpen, setOpen] = useState<boolean>(false);
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  return (
    <li
      className={cn(
        items && 'relative inline-flex flex-col',
        'text-sm font-medium',
        href.includes(segments[1])
          ? 'text-secondary'
          : 'text-white hover:text-secondary'
      )}
    >
      {clickable ? (
        <Link href={href} onClick={onNavigate}>
          {label}
        </Link>
      ) : (
        <button
          type='button'
          className='inline-flex justify-between items-center gap-2'
          // onClick={() => setOpen((o) => !o)}
          onClick={setOpen}
        >
          {label}
          <ChevronDown
            className={cn(
              isOpen && 'rotate-180',
              'shrink-0 transition-transform'
            )}
            size={17}
            strokeWidth={2.5}
          />
        </button>
      )}

      {items && items.length > 0 && (
        <div
          className={cn(
            'grid grid-rows-[0fr] transition-all duration-150 invisible overflow-hidden px-3',
            isOpen && 'visible grid-rows-[1fr] mt-3'
          )}
        >
          <ul className='min-h-0 space-y-3'>
            {items.map((item, index) => {
              const to = relative
                ? `${href.replace(/\/$/, '')}/${item.href.replace(/^\//, '')}`
                : item.href;

              return (
                <li
                  key={index}
                  className='text-sm text-white rounded-md hover:text-secondary'
                >
                  <Link href={to} onClick={onNavigate}>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </li>
  );
}

export default NavLink;
