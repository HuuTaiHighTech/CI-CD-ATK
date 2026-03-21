import { bannerService } from '~/services';

type Props = {
  tab?: string;
};

async function CategoryBanner({ tab }: Props) {
  const images = tab ? await bannerService.get(`categories-${tab}`) : null;
  return (
    <div
      className='w-full aspect-4/1 bg-cover bg-center'
      style={{
        backgroundImage: images?.[0] ? `url(${images[0]})` : undefined
      }}
    />
  );
}

export default CategoryBanner;
