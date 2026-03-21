'use client';

import Image from 'next/image';
import Marquee from 'react-fast-marquee';
import type { Partner } from '~/types';

type Props = {
  partners: Partner[];
};

function PartnerSection({ partners }: Props) {
  if (partners.length < 1) return null;

  return (
    <section className='bg-white'>
      <div className='container py-2.5 lg:py-5'>
        <Marquee speed={100} autoFill={true}>
          {partners.map((item) => (
            <div
              key={item.id}
              className='relative w-20 xl:w-32 h-auto mr-10 lg:mr-20'
            >
              <Image
                src={item.logo}
                alt={`Logo ${item.name}`}
                width={100}
                height={100}
                className='size-full object-contain'
              />
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
}

export default PartnerSection;
