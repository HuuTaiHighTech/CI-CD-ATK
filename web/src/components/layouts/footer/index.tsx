import NextLink from 'next/link';
import Image from 'next/image';
import { Link } from '~/components/ui';
import { categoryService, socialService } from '~/services';
import { Dictionary } from '~/lib/dictionary';
import { LetterSolid, LocationSolid, PhoneSolid } from '~/components/icons';
import FooterSocials from '~/components/layouts/footer/footer-socials';
import { env } from '~/config';

type Props = {
  dictionary: Dictionary;
  year: number;
};

async function Footer({ year, dictionary }: Props) {
  const [socials, categories] = await Promise.all([
    socialService.get(),
    categoryService.get()
  ]);

  return (
    <footer className='relative bg-primary'>
      <div className='container mx-auto md:py-10 py-5'>
        <div className='flex flex-col lg:flex-row justify-between items-center gap-5 lg:gap-0'>
          <Link href='/' className='inline-flex w-52 lg:w-80'>
            <Image
              src='/logo_footer.png'
              width={1625}
              height={650}
              alt={env.APP_NAME}
              className='object-contain'
            />
          </Link>
          <FooterSocials socials={socials} />
        </div>
        <div className='h-px bg-linear-to-r from-transparent via-gray-200 to-transparent bg-opacity-20 lg:bg-[#cccccc] my-5' />
        <div className='flex flex-col lg:flex-row justify-between lg:gap-2.5 gap-5'>
          <div className='text-center lg:text-left'>
            <h3 className='text-base md:text-lg text-white font-semibold uppercase'>
              {dictionary.footer.about.title}
            </h3>
            <ul className='flex flex-wrap flex-row lg:flex-col justify-center gap-3 lg:gap-1.5 mt-3'>
              {dictionary.footer.about.items.map((item) => (
                <li key={item.id} className='text-xs md:text-sm lg:text-base'>
                  <Link
                    href={item.href}
                    className='text-white hover:text-secondary'
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className='h-px bg-linear-to-r from-transparent via-gray-200 to-transparent bg-opacity-20 lg:hidden' />
          <div className='text-center lg:text-left'>
            <h3 className='text-base md:text-lg text-white font-semibold uppercase'>
              {dictionary.nav.products}
            </h3>
            <ul className='flex flex-wrap flex-row lg:flex-col justify-center gap-3 lg:gap-1.5 mt-3'>
              {categories.map((item) => (
                <li
                  key={item.id}
                  className='text-xs md:text-sm lg:text-base text-white'
                >
                  <Link
                    href={`/categories?tab=${item.slug}`}
                    className='text-white hover:text-secondary'
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className='h-px bg-linear-to-r from-transparent via-gray-200 to-transparent bg-opacity-20 lg:hidden' />
          <div className='text-center lg:text-left'>
            <h3 className='text-base md:text-lg text-white font-semibold uppercase'>
              {dictionary.nav.insights}
            </h3>
            <ul className='flex flex-wrap flex-row lg:flex-col justify-center gap-3 lg:gap-1.5 mt-3'>
              <li className='text-xs md:text-sm lg:text-base text-white'>
                <Link
                  href='/insights?tab=always-take-care'
                  className='text-white hover:text-secondary'
                >
                  Always Take Care
                </Link>
              </li>
              <li className='text-xs md:text-sm lg:text-base text-white'>
                <Link
                  href='/insights?tab=trust-in-mind'
                  className='text-white hover:text-secondary'
                >
                  Trust In Mind
                </Link>
              </li>
              <li className='text-xs md:text-sm lg:text-base text-white'>
                <Link
                  href='/insights?tab=keep-promise'
                  className='text-white hover:text-secondary'
                >
                  Keep Promise
                </Link>
              </li>
            </ul>
          </div>
          <div className='h-px bg-linear-to-r from-transparent via-gray-200 to-transparent bg-opacity-20 lg:hidden' />
          <div className='text-center lg:text-left'>
            <h3 className='text-base md:text-lg text-white font-semibold uppercase'>
              {dictionary.nav.contact}
            </h3>
            <ul className='space-y-1.5 mt-3'>
              <li className='hidden lg:flex justify-center lg:justify-start'>
                <NextLink
                  href='tel:0764644245'
                  className='inline-flex items-center justify-center text-xs md:text-sm lg:text-base text-white hover:text-secondary gap-1.5'
                >
                  <PhoneSolid className='size-3 lg:size-4 shrink-0' />
                  <span>076 464 4245</span>
                </NextLink>
              </li>
              <li className='hidden lg:flex justify-center lg:justify-start'>
                <NextLink
                  href='mailto:support@anthaikhang.com'
                  className='inline-flex items-center justify-center text-xs md:text-sm lg:text-base text-white hover:text-secondary gap-1.5'
                >
                  <LetterSolid className='size-3 lg:size-4 shrink-0' />
                  <span>support@anthaikhang.com</span>
                </NextLink>
              </li>
              <li className='flex justify-center lg:justify-start'>
                <NextLink
                  href={dictionary.address.mapUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='inline-flex items-center justify-center text-xs md:text-sm lg:text-base text-white hover:text-secondary gap-1.5'
                >
                  <LocationSolid className='size-3 lg:size-4 shrink-0' />
                  <span>{dictionary.address.text}</span>
                </NextLink>
              </li>
              <li className='lg:hidden flex justify-center gap-2.5'>
                <NextLink
                  href='tel:0764644245'
                  className='inline-flex items-center justify-center text-xs md:text-sm lg:text-base text-white hover:text-secondary gap-1.5'
                >
                  <PhoneSolid className='size-3 lg:size-4 shrink-0' />
                  <span>076 464 4245</span>
                </NextLink>
                <NextLink
                  href='mailto:support@anthaikhang.com'
                  className='inline-flex items-center justify-center text-xs md:text-sm lg:text-base text-white hover:text-secondary gap-1.5'
                >
                  <LetterSolid className='size-3 lg:size-4 shrink-0' />
                  <span>support@anthaikhang.com</span>
                </NextLink>
              </li>
              <li className='hidden lg:block'>
                <NextLink
                  href='http://online.gov.vn/Home/WebDetails/15926?AspxAutoDetectCookieSupport=1'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='inline-block transition-opacity hover:opacity-80'
                >
                  <Image
                    src='/bo-cong-thuong.svg'
                    alt={dictionary.badge.gov}
                    width={191}
                    height={72}
                  />
                </NextLink>
              </li>
            </ul>
          </div>
        </div>
        <div className='h-px bg-linear-to-r from-transparent via-gray-200 to-transparent bg-opacity-20 lg:bg-[#cccccc] my-5' />
        <div className='flex flex-col-reverse lg:flex-row justify-between lg:gap-0 gap-5'>
          <p className='text-sm text-neutral-300 text-center lg:text-left'>
            © {year} {dictionary.footer.copyright}
          </p>
          <ul className='flex flex-row justify-center items-center gap-5'>
            <li className='text-xs lg:text-sm text-neutral-300'>
              {dictionary.footer.privacy_policy}
            </li>
            <li className='text-xs lg:text-sm text-neutral-300'>
              {dictionary.footer.terms_of_service}
            </li>
          </ul>
          <div className='lg:hidden text-center'>
            <NextLink
              href='http://online.gov.vn/Home/WebDetails/15926?AspxAutoDetectCookieSupport=1'
              target='_blank'
              rel='noopener noreferrer'
              className='inline-block w-40 transition-opacity hover:opacity-80'
            >
              <Image
                src='/bo-cong-thuong.svg'
                alt={dictionary.badge.gov}
                width={191}
                height={72}
                className='object-contain'
              />
            </NextLink>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
