import { type Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import { GoogleAnalytics } from '@next/third-parties/google';
import { Footer, Header } from '~/components/layouts';
import AlertDialog from '~/components/alert-dialog';
import FloatingActions from '~/components/floating-actions';
import LocaleProvider from '~/context/locale-context';
import DialogProvider from '~/context/dialog-context';
import { getDictionary } from '~/lib/dictionary';
import { isLocale } from '~/lib/locale';
import { cn } from '~/lib/utils';
import { i18n, type Locale } from '~/i18n';
import { env } from '~/config';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import 'swiper/css/free-mode';
import 'swiper/css/thumbs';
import '~/app/globals.css';
import { getSiteUrl } from '~/lib/site';

type Props = Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>;

const font = Montserrat();

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);

  return {
    title: {
      template: `%s | ${env.APP_NAME}`,
      default: env.APP_NAME
    },
    description: dictionary.description,
    metadataBase: new URL(getSiteUrl()),
    keywords: [
      'ATK',
      'An Thái Khang',
      'An Thai Khang JSC',

      // Vietnamese
      'keo dán công nghiệp',
      'keo silicone',
      'keo dán xây dựng',
      'keo dán đa năng',
      'keo dán chất lượng cao',
      'nhà sản xuất keo dán Việt Nam',
      'silicone xây dựng',
      'giải pháp kết dính',

      // English
      'adhesive manufacturer Vietnam',
      'industrial adhesives',
      'silicone sealant',
      'construction adhesive',
      'bonding solutions',
      'high quality adhesives',
      'silicone manufacturer Vietnam',
      'adhesive supplier Vietnam'
    ],
    openGraph: {
      title: env.APP_NAME,
      description: dictionary.description,
      siteName: env.APP_NAME,
      url: `/${locale}`,
      type: 'website'
    },
    robots: { index: true, follow: true },
    verification: {
      google: 'WSUfPgVx40zceoQoTmAEUinj9k5RRhfHK9mP4j2O91Y'
    },
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(i18n.locales.map((l) => [l, `/${l}`]))
    }
  };
}

async function RootLayout({ children, params }: Props) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : i18n.default;
  const dictionary = await getDictionary(locale);

  const year = new Date().getUTCFullYear();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={cn(font.className, 'antialiased')}>
        <LocaleProvider locale={locale} dictionary={dictionary}>
          <DialogProvider>
            <Header dictionary={dictionary} />
            <main className='pt-[51.98px] lg:pt-0'>{children}</main>
            <Footer year={year} dictionary={dictionary} />
            <AlertDialog />
          </DialogProvider>
        </LocaleProvider>
        <FloatingActions />
      </body>
      {env.NEXT_PUBLIC_GA_ID && (
        <GoogleAnalytics gaId={env.NEXT_PUBLIC_GA_ID} />
      )}
    </html>
  );
}

export default RootLayout;
