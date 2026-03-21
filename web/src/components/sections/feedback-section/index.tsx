'use client';

import Image from 'next/image';
import Marquee from 'react-fast-marquee';
import { Card } from '~/components/sections/feedback-section/components';
import type { Feedback } from '~/types';
import type { Dictionary } from '~/lib/dictionary';

type Props = {
  dictionary: Dictionary;
  feedbacks: Feedback[];
};

function FeedbackSection({ dictionary, feedbacks }: Props) {
  return (
    <section className='relative bg-background md:py-10 pb-16'>
      <div className='absolute top-0 left-0 size-0 md:size-100 bg-accent rounded-full blur-[20rem] will-change-transform pointer-events-none -translate-y-1/3' />
      <div className='absolute top-0 right-0 size-0 md:size-100 bg-accent rounded-full blur-[20rem] will-change-transform pointer-events-none' />
      <Image
        src='/logo_deco.png'
        width={584}
        height={480}
        alt='Logo deco'
        loading='lazy'
        className='absolute top-0 left-0 hidden md:block opacity-25 pointer-events-none select-none -translate-x-[45%] -translate-y-1/3'
      />
      <div className='container'>
        <div className='mb-5 md:mb-10'>
          <h3 className='text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold text-white text-center lg:mb-6 md:mb-3 mb-1'>
            {dictionary.feedback.title}
          </h3>
          <p className='text-white text-sm md:text-base lg:text-lg font-medium text-center'>
            {dictionary.feedback.subtitle}
          </p>
        </div>
        <div className='w-full space-y-5'>
          <Marquee speed={100} direction='right' autoFill={true}>
            {feedbacks.slice(0, Math.ceil(feedbacks.length / 2)).map((item) => (
              <Card
                key={item.id}
                star={item.star}
                content={item.content}
                avatar={item.avatar}
                name={item.name}
                position={item.position}
                className='mr-5'
              />
            ))}
          </Marquee>
          <Marquee speed={100} autoFill={true}>
            {feedbacks.slice(Math.ceil(feedbacks.length / 2)).map((item) => (
              <Card
                key={item.id}
                star={item.star}
                content={item.content}
                avatar={item.avatar}
                name={item.name}
                position={item.position}
                className='mr-5'
              />
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
}

export default FeedbackSection;
