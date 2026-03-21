import { type Metadata } from 'next';
import {
  FeedbackSection,
  HeroSection,
  PartnerSection,
  SloganSection,
  SolutionSection,
  TopProducts
} from '~/components/sections';
import { feedbackService, partnerService, productService } from '~/services';
import { getDictionary } from '~/lib/dictionary';
import { env } from '~/config';

type Props = Readonly<{
  params: Promise<{ locale: string }>;
}>;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);

  return {
    title: dictionary.home.title + ' | ' + env.APP_NAME,
    description: dictionary.home.description
  };
}

async function Home({ params }: Props) {
  const { locale } = await params;

  const [dictionary, pins, partners, products, feedbacks] = await Promise.all([
    getDictionary(locale),
    productService.getPinned(),
    partnerService.get(),
    productService.getTop(),
    feedbackService.get()
  ]);

  return (
    <div className='bg-background'>
      <HeroSection />
      <SloganSection dictionary={dictionary} />
      <SolutionSection dictionary={dictionary} products={pins} />
      <PartnerSection partners={partners} />
      <TopProducts products={products} dictionary={dictionary} />
      <FeedbackSection dictionary={dictionary} feedbacks={feedbacks} />
    </div>
  );
}

export default Home;
