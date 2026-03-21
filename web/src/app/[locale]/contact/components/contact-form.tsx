'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocale } from '~/context/locale-context';
import { LetterLine, PhoneLine, UserOutline } from '~/components/icons';
import { sheetService } from '~/services';
import { useDialog } from '~/context/dialog-context';
import { type Sheet, sheetSchema } from '~/schemas';

function ContactForm() {
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
      await alert({
        title: dictionary.contact.form.success,
        type: 'success'
      });
      reset();
    } catch {
      await alert({
        title: dictionary.contact.form.error,
        type: 'error'
      });
    }
  };

  const digitsOnly = (e: React.FormEvent<HTMLInputElement>) =>
    (e.currentTarget.value = e.currentTarget.value.replace(/\D/g, ''));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex-1 space-y-4'>
      <div className='w-full flex bg-white text-accent rounded-xl gap-2 p-3'>
        <input
          type='text'
          {...register('name')}
          className='flex-1 text-lg placeholder:text-accent/70 outline-none'
          placeholder={dictionary.contact.form.name}
        />
        <UserOutline />
      </div>
      <div className='w-full flex bg-white text-accent rounded-xl gap-2 p-3'>
        <input
          type='tel'
          inputMode='numeric'
          {...register('phone')}
          onInput={digitsOnly}
          placeholder={dictionary.contact.form.phone}
          className='flex-1 text-lg placeholder:text-accent/70 outline-none'
        />
        <PhoneLine />
      </div>
      <div className='w-full flex bg-white text-accent rounded-xl gap-2 p-3'>
        <input
          type='text'
          {...register('email')}
          className='flex-1 text-lg placeholder:text-accent/70 outline-none'
          placeholder={dictionary.contact.form.email}
        />
        <LetterLine />
      </div>
      <div className='w-full bg-white flex rounded-xl px-3'>
        <select
          id='need'
          {...register('need')}
          className='flex-1 text-lg text-accent invalid:text-accent/70 py-3 outline-none'
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
      <div className='w-full flex bg-white text-accent rounded-xl gap-2 p-3'>
        <textarea
          {...register('others')}
          placeholder={dictionary.contact.form.others}
          rows={5}
          className='flex-1 text-lg placeholder:text-accent/70 outline-none resize-none'
        />
      </div>
      <div className='text-center lg:text-left'>
        <button
          type='submit'
          disabled={isSubmitting}
          className='group text-base font-semibold text-secondary bg-[linear-gradient(275.65deg,#0066B4_0%,#1C2A45_100%)] rounded-xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden px-5 py-3'
        >
          <span
            data-text={dictionary.contact.form.submit_now}
            className='inline-flex relative group-hover:-translate-y-[150%] after:absolute after:content-[attr(data-text)] after:size-full after:top-[150%] after:left-0 transition-transform duration-300'
          >
            {dictionary.contact.form.submit_now}
          </span>
        </button>
      </div>
    </form>
  );
}

export default ContactForm;
