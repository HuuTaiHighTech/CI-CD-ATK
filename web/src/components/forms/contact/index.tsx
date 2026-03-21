'use client';

import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import { useLocale } from '~/context/locale-context';
import { sheetService } from '~/services';
import { sheetSchema, type Sheet } from '~/schemas';
import Portal from '~/components/portal';
import { LetterLine, PhoneLine, UserOutline } from '~/components/icons';
import { useDialog } from '~/context/dialog-context';
import { useScrollLock } from '~/hooks';

type Props = {
  productName?: string;
  open: boolean;
  onClose: () => void;
};

function ContactForm({ productName, open, onClose }: Props) {
  useScrollLock({ locked: open });
  const { dictionary } = useLocale();
  const { alert } = useDialog();
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting }
  } = useForm<Sheet>({
    resolver: zodResolver(sheetSchema)
  });

  const onSubmit = async (data: Sheet) => {
    if (isSubmitting) return;
    try {
      await sheetService.create(data);
      onClose?.();
      reset();
      await alert({
        title: dictionary.contact.form.success,
        type: 'success'
      });
    } catch {
      await alert({
        title: dictionary.contact.form.error,
        type: 'error'
      });
    }
  };

  const digitsOnly = (e: React.FormEvent<HTMLInputElement>) =>
    (e.currentTarget.value = e.currentTarget.value.replace(/\D/g, ''));

  if (!open) return null;
  return (
    <Portal>
      <div className='fixed inset-0 bg-black/50 z-20' onClick={onClose} />
      <div className='fixed top-1/2 left-1/2 w-full max-w-[90vw] sm:max-w-xl md:max-w-2xl lg:max-w-3xl max-h-[90vh] bg-secondary-2 flex flex-col rounded-xl -translate-1/2 overflow-hidden z-20'>
        <button
          type='button'
          className='absolute top-2 right-2 md:top-5 md:right-5 inline-flex justify-center items-center text-white cursor-pointer'
          onClick={onClose}
        >
          <X className='shrink-0' strokeWidth={2} />
        </button>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='flex-1 space-y-5 overflow-y-auto p-5 md:p-10 xl:p-14 2xl:p-20'
        >
          <div className='flex justify-center items-center'>
            <Image
              src='/logo_header.png'
              width={295}
              height={120}
              alt='logo header'
            />
          </div>
          <h3 className='text-2xl md:text-4xl font-semibold text-white text-center'>
            {dictionary.contact.form.title}
          </h3>
          <div className='w-full flex text-white border-[1.4px] border-blue-400 rounded-lg md:rounded-xl gap-2 p-2 md:p-3'>
            <input
              type='text'
              {...register('name')}
              placeholder={dictionary.contact.form.name}
              className='flex-1 text-sm md:text-base outline-none'
            />
            <UserOutline className='size-5 md:size-6 shrink-0' />
          </div>
          <div className='w-full flex text-white border-[1.4px] border-blue-400 rounded-lg md:rounded-xl gap-2 p-2 md:p-3'>
            <input
              type='tel'
              inputMode='numeric'
              {...register('phone')}
              onInput={digitsOnly}
              placeholder={dictionary.contact.form.phone}
              className='flex-1 text-sm md:text-base outline-none'
            />
            <PhoneLine className='size-5 md:size-6 shrink-0' />
          </div>
          <div className='w-full flex text-white border-[1.4px] border-blue-400 rounded-lg md:rounded-xl gap-2 p-2 md:p-3'>
            <input
              type='text'
              {...register('email')}
              placeholder={dictionary.contact.form.email}
              className='flex-1 text-sm md:text-base outline-none'
            />
            <LetterLine className='size-5 md:size-6 shrink-0' />
          </div>
          <div className='w-full flex border-[1.4px] border-blue-400 rounded-lg md:rounded-xl px-2 md:px-3'>
            <select
              id='need'
              {...register('need')}
              className='flex-1 text-sm md:text-base text-white invalid:text-white/50 py-2 md:py-3 outline-none'
              defaultValue=''
              required
            >
              <option value='' disabled hidden>
                {dictionary.contact.form.need}
              </option>
              {dictionary.contact.needs.map((item, index) => (
                <option key={index} value={item} className='text-accent'>
                  {item}
                </option>
              ))}
            </select>
          </div>
          {productName && (
            <div className='w-full flex text-white border-[1.4px] border-blue-400 rounded-lg md:rounded-xl gap-2 p-2 md:p-3'>
              <input
                type='text'
                {...register('product')}
                placeholder={dictionary.contact.form.product}
                defaultValue={productName}
                className='flex-1 text-sm md:text-base outline-none'
                readOnly
              />
            </div>
          )}
          <div className='w-full flex border-[1.4px] border-blue-400 rounded-xl gap-2 p-3'>
            <textarea
              {...register('others')}
              placeholder={dictionary.contact.form.others}
              rows={5}
              className='flex-1 text-white text-sm md:text-base outline-none resize-none'
            />
          </div>
          <div className='text-center'>
            <button
              type='submit'
              disabled={isSubmitting}
              className='text-secondary bg-primary text-sm md:text-base lg:text-lg lg:font-semibold rounded-xl md:rounded-2xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed px-10 md:px-12 py-2.5 md:py-3'
            >
              {dictionary.contact.form.submit}
            </button>
          </div>
        </form>
      </div>
    </Portal>
  );
}

export default ContactForm;
