'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale } from '~/context/locale-context';

function Slogan() {
  const { locale, dictionary } = useLocale();
  const [index, setIndex] = useState<number>(0);

  const texts = dictionary.slogan;

  const nextText = useCallback(() => {
    setIndex((prev) => (prev + 1) % texts.length);
  }, [texts.length]);

  useEffect(() => {
    const interval = setInterval(nextText, 2000);
    return () => clearInterval(interval);
  }, [nextText]);

  switch (locale) {
    case 'vi':
      return (
        <div className='flex flex-col gap-3 md:gap-5 xl:mt-10 mt-5'>
          <div className='w-64 md:w-md lg:w-171'>
            <Image
              src='/slogan-vi-1.png'
              alt='Với An Thái Khang'
              width={681}
              height={60}
              className='object-contain'
            />
          </div>
          <motion.div
            layout
            className='flex items-center gap-2 md:gap-3 lg:gap-5'
          >
            <motion.div layout className='w-12 md:w-21 lg:w-35'>
              <Image
                src='/slogan-vi-2.png'
                alt='Làm'
                width={140}
                height={60}
                className='object-contain'
              />
            </motion.div>
            <AnimatePresence mode='popLayout'>
              <motion.h2
                key={index}
                layout
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -50, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className='text-secondary text-2xl md:text-4xl lg:text-6xl font-bold whitespace-nowrap uppercase translate-y-0.5 md:translate-y-1 lg:translate-y-2'
              >
                {texts[index]}
              </motion.h2>
            </AnimatePresence>
            <motion.div layout className='w-22 md:w-35 lg:w-56'>
              <Image
                src='/slogan-vi-3.png'
                alt='Có thể'
                width={987}
                height={265}
                className='object-contain'
              />
            </motion.div>
          </motion.div>
          <div className='w-80 md:w-130 lg:w-195'>
            <Image
              src='/slogan-vi-4.png'
              alt='Không gì là không thể'
              width={3441}
              height={265}
              className='object-contain'
            />
          </div>
        </div>
      );
    case 'en':
      return (
        <div className='flex flex-col gap-3 md:gap-5 xl:mt-10 mt-5'>
          <div className='w-64 md:w-md lg:w-170'>
            <Image
              src='/slogan-en-1.png'
              alt='With An Thai Khang'
              width={744}
              height={61}
              className='object-contain'
            />
          </div>
          <motion.div
            layout
            className='flex items-center gap-2 md:gap-3 lg:gap-5'
          >
            <motion.div layout className='w-10 md:w-15 lg:w-24'>
              <Image
                src='/slogan-en-2.png'
                alt='Do'
                width={101}
                height={49}
                className='object-contain'
              />
            </motion.div>
            <AnimatePresence mode='popLayout'>
              <motion.h2
                key={index}
                layout
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -50, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className='text-secondary text-2xl md:text-4xl lg:text-6xl font-bold whitespace-nowrap uppercase'
              >
                {texts[index]}
              </motion.h2>
            </AnimatePresence>
            <motion.div layout className='w-28 md:w-44 lg:w-68'>
              <Image
                src='/slogan-en-3.png'
                alt='You can'
                width={308}
                height={49}
                className='object-contain'
              />
            </motion.div>
          </motion.div>
          <div className='w-68 md:w-100 lg:w-160'>
            <Image
              src='/slogan-en-4.png'
              alt='Nothing impossible'
              width={741}
              height={49}
              className='object-contain'
            />
          </div>
        </div>
      );
    default:
      return null;
  }
}

export default Slogan;
