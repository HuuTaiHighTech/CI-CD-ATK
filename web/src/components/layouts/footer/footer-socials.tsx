import NextLink from 'next/link';
import Image from 'next/image';
import type { Social } from '~/types';
import { env } from '~/config';

type Props = {
  socials: Social[];
};

function FooterSocials({ socials }: Props) {
  if (!socials.length) return null;

  return (
    <div className='flex items-center gap-5'>
      {socials.map((item) => (
        <NextLink
          key={item.id}
          href={item.url}
          target='_blank'
          rel='noopener noreferrer'
          title={`${env.APP_NAME} - ${item.name}`}
          aria-label={`${env.APP_NAME} - ${item.name}`}
          className='relative size-8'
        >
          <Image
            src={item.icon}
            alt={`${env.APP_NAME} - ${item.name}`}
            fill
            sizes='32px'
            className='object-contain'
          />
        </NextLink>
      ))}
    </div>
  );
}

export default FooterSocials;
