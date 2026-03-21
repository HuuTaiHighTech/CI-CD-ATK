import { Metadata } from 'next';
import { settingService } from '~/services';
import { OverviewSection } from '~/components/sections';
import { getDictionary } from '~/lib/dictionary';

type Props = Readonly<{
  params: Promise<{ locale: string }>;
}>;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);

  return {
    title: dictionary.about.title,
    description: dictionary.about.description
  };
}

async function AboutPage() {
  const images = await settingService.getAboutPage();

  return (
    <section>
      <OverviewSection images={images} />
    </section>
  );
}

export default AboutPage;
