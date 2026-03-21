'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Portal from '~/components/portal';
import { PhoneSolid } from '~/components/icons';
import type { Zalo } from '~/types';
import { settingService } from '~/services';
import { X } from 'lucide-react';

function ContactButton() {
  const [isOpen, setOpen] = useState<boolean>(false);
  const [zalo, setZalo] = useState<Zalo | null>(null);

  const isMobile = () =>
    typeof window !== 'undefined' &&
    window.matchMedia('(max-width: 1023px)').matches;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    settingService.getZalo().then(setZalo);
  }, []);

  if (!zalo || !zalo.qr || !zalo.phone) return null;

  return (
    <>
      <div className='relative flex items-center'>
        {zalo?.phone && (
          <>
            <div className='absolute inset-0 rounded-md bg-secondary-2 blur-md opacity-40' />
            <div className='bg-primary text-white text-sm font-semibold rounded-md translate-x-3 pl-2 pr-3 p-1'>
              {zalo.phone}
            </div>
          </>
        )}
        <button
          type='button'
          className='size-10 relative inline-flex justify-center items-center bg-primary text-white rounded-full cursor-pointer shadow before:absolute before:inset-0 before:rounded-full before:bg-secondary-2 before:blur-lg before:opacity-40 before:-z-1 hover:before:opacity-80 transition'
          onClick={() => {
            if (isMobile()) {
              window.location.href = `tel:${zalo.phone}`;
            } else {
              setOpen(true);
            }
          }}
        >
          <motion.div
            animate={{ rotate: [0, 8, -8, 8, -8, 0] }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              repeatDelay: 2,
              ease: 'easeInOut'
            }}
          >
            <PhoneSolid className='size-4' fill='white' />
          </motion.div>
        </button>
      </div>
      {isOpen ? (
        <Portal>
          <div
            className='fixed inset-0 bg-black/50 z-20'
            onClick={() => setOpen(false)}
          />
          <div className='fixed top-1/2 left-1/2 w-full max-w-xs md:max-w-md bg-white rounded-xl -translate-1/2 p-5 md:p-14 z-20'>
            <button
              className='absolute top-3 right-3 md:top-4 md:right-4 inline-flex justify-center items-center text-neutral-800 cursor-pointer'
              onClick={() => setOpen(false)}
            >
              <X className='size-5 lg:size-6 shrink-0' strokeWidth={2.5} />
            </button>
            <div className='space-y-3 md:space-y-4'>
              <h3 className='text-xl md:text-3xl font-semibold text-accent text-center'>
                Quét mã QR bằng điện thoại để liên hệ
              </h3>
              {zalo?.qr && (
                <div className='relative w-full aspect-square border border-[#00ADFE] rounded-xl overflow-hidden'>
                  <Image
                    src={zalo.qr}
                    alt='Qr Zalo'
                    fill
                    sizes='(max-width: 768px) 90vw, 450px'
                    className='object-cover'
                  />
                </div>
              )}
              {zalo?.phone && (
                <p className='text-lg md:text-xl lg:text-2xl font-semibold text-center'>
                  {zalo.phone}
                </p>
              )}
            </div>
          </div>
        </Portal>
      ) : (
        <></>
      )}
    </>
  );
}

export default ContactButton;
