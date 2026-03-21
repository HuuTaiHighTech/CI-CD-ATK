'use client';

import { useState } from 'react';
import { useLocale } from '~/context/locale-context';
import { ContactForm } from '~/components/forms';

type Props = {
  productName?: string;
};

function ConsultationForm({ productName }: Props) {
  const [isOpen, setOpen] = useState<boolean>(false);
  const { dictionary } = useLocale();
  return (
    <>
      <div className='space-y-3 lg:space-y-4'>
        <div className='border-l-4 border-[#00ADFE] pl-2 mt-6 lg:mt-10'>
          <h3 className='text-lg lg:text-2xl font-semibold text-secondary-2 uppercase'>
            {dictionary.consultation.title}
          </h3>
        </div>
        <ul className='pl-1 text-sm lg:text-base'>
          {dictionary.consultation.content.map((item, index) => (
            <li key={index}>• {item}</li>
          ))}
        </ul>
        <button
          type='button'
          className='group text-sm lg:text-lg font-semibold text-secondary bg-[linear-gradient(275.65deg,#0066B4_0%,#1C2A45_100%)] rounded-xl lg:rounded-2xl shadow-md cursor-pointer overflow-hidden px-4 lg:px-5 py-3'
          onClick={() => setOpen(true)}
        >
          <span
            data-text={dictionary.consultation.button}
            className='inline-flex relative group-hover:-translate-y-[150%] after:absolute after:content-[attr(data-text)] after:size-full after:top-[150%] after:left-0 transition-transform duration-300'
          >
            {dictionary.consultation.button}
          </span>
        </button>
      </div>
      <ContactForm
        open={isOpen}
        onClose={() => setOpen(false)}
        productName={productName}
      />
    </>
  );
}

export default ConsultationForm;
