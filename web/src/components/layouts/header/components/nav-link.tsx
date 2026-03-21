'use client';

import { ChevronDown } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Link } from '~/components/ui';
import { cn } from '~/lib/utils';

type Props = {
  label: string;
  href: string;
  clickable?: boolean;
  relative?: boolean;
  items?: Props[];
};

function NavLink({ label, href, clickable = true, relative, items }: Props) {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);
  return (
    <li
      className={cn(
        items &&
          'group relative inline-flex items-center cursor-default lg:gap-1 2xl:gap-2',
        'text-xs lg:text-sm 2xl:text-base font-medium',
        href.includes(segments[1])
          ? 'text-secondary'
          : 'text-white hover:text-secondary'
      )}
    >
      {clickable ? (
        <Link href={href}>{label}</Link>
      ) : (
        <button type='button'>{label}</button>
      )}
      {items && (
        <>
          <ChevronDown
            className='group-hover:rotate-180 shrink-0 transition-transform'
            size={17}
            strokeWidth={2.5}
          />
          {items.length > 0 && (
            <div className='absolute top-full left-1/2 -translate-x-1/2 w-max max-w-56 bg-white invisible opacity-0 scale-95 group-hover:visible group-hover:opacity-100 group-hover:scale-100 rounded-md shadow transition-all p-2 z-15'>
              <ul>
                {items.map((item, index) => {
                  const to = relative
                    ? `${href.replace(/\/$/, '')}/${item.href.replace(
                        /^\//,
                        ''
                      )}`
                    : item.href;

                  return (
                    <li
                      key={index}
                      className='text-xs lg:text-sm text-primary rounded-md hover:bg-primary hover:text-secondary'
                    >
                      <Link href={to} className='w-full inline-flex p-2'>
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </>
      )}
    </li>
  );
}

export default NavLink;
