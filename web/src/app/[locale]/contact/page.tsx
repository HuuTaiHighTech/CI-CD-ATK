import { type Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { bannerService, benefitService, settingService } from '~/services';
import { getDictionary } from '~/lib/dictionary';
import { ContactForm } from '~/app/[locale]/contact/components';
import { AccordionGroup } from '~/components/ui';
import { LocationSolid, PhoneSolid } from '~/components/icons';

type Props = Readonly<{
  params: Promise<{ locale: string }>;
}>;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);

  return {
    title: dictionary.contact.title,
    description: dictionary.contact.description
  };
}

async function Contact({ params }: Props) {
  const { locale } = await params;

  const [dictionary, images, benefits, image] = await Promise.all([
    getDictionary(locale),
    bannerService.get('contact'),
    benefitService.get(),
    settingService.getAddressImage()
  ]);

  return (
    <section className='bg-background'>
      <div
        className='w-full aspect-4/1 bg-cover bg-center'
        style={{
          backgroundImage: images?.[0] ? `url(${images[0]})` : undefined
        }}
      />
      <div className='relative overflow-hidden py-10'>
        <div className='absolute bottom-0 right-0 size-100 bg-[#0066B4] rounded-full blur-[20rem] will-change-transform pointer-events-none' />
        <div className='absolute bottom-1/12 left-0 size-100 bg-[#0066B4] rounded-full blur-[20rem] will-change-transform pointer-events-none' />
        <Image
          src='/logo_deco.png'
          width={584}
          height={480}
          alt='Logo deco'
          loading='lazy'
          className='absolute top-[30%] right-5 opacity-0 md:opacity-25 pointer-events-none select-none translate-x-1/2'
        />
        <div className='relative container z-1'>
          <h2 className='text-2xl lg:text-4xl xl:text-5xl font-bold text-[#0366B3] lg:text-secondary text-center'>
            {dictionary.contact.heading}
          </h2>
          <div className='space-y-3 mt-4'>
            <div className='text-center'>
              <Link
                href='tel:0764644245'
                className='inline-block text-white hover:text-accent text-base md:text-2xl font-semibold text-center'
              >
                <PhoneSolid
                  className='inline-block size-5 md:size-6 align-middle mr-1 md:mr-2'
                  aria-hidden
                />
                <span className='align-middle'>076 464 4245</span>
              </Link>
            </div>
            <div className='text-center'>
              <Link
                href={dictionary.address.mapUrl}
                className='inline-block text-white hover:text-accent text-base md:text-2xl font-semibold text-center'
              >
                <LocationSolid
                  className='inline-block size-5 md:size-6 align-middle mr-1 md:mr-2'
                  aria-hidden
                />
                <span className='align-middle'>{dictionary.address.text}</span>
              </Link>
            </div>
          </div>
          <div className='flex flex-col-reverse lg:flex-row mt-10 2xl:gap-12 gap-10'>
            <ContactForm />
            <div className='flex-1 space-y-5'>
              <AccordionGroup accordions={benefits} />
            </div>
          </div>
          {image && (
            <div className='relative mt-10'>
              <img
                src={image}
                alt='Address image'
                className='w-full h-auto object-contain'
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Contact;
