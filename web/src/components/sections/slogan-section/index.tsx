import { Card, Slogan } from '~/components/sections/slogan-section/components';
import { Logo, Product, Project } from '~/components/icons';
import { Dictionary } from '~/lib/dictionary';
import { categoryService } from '~/services';

type Props = {
  dictionary: Dictionary;
};

async function SloganSection({ dictionary }: Props) {
  const categories = await categoryService.get();

  const category = categories[0];

  return (
    <section className='max-h-60 sm:max-h-72 md:max-h-92 lg:max-h-130 xl:max-h-150 2xl:max-h-170 relative bg-secondary-2'>
      <div className='absolute size-full overflow-hidden'>
        <div className='absolute bottom-0 left-0 size-100 bg-[#0066B4] rounded-full blur-[20rem] will-change-transform pointer-events-none' />
        <div className='absolute top-0 right-0 size-100 bg-[#0066B4] rounded-full blur-[20rem] will-change-transform pointer-events-none' />
      </div>
      <div className='container -translate-y-[30%]'>
        <div className='flex justify-between xl:gap-6 md:gap-3 gap-2'>
          {dictionary.box.map((item, index) => {
            return (
              <Card
                key={item.id}
                icon={ICONS[index]}
                title={item.title}
                description={item.description}
                link={
                  item.link.href === '/categories'
                    ? {
                        ...item.link,
                        href: `${item.link.href}?tab=${category?.slug}`
                      }
                    : item.link
                }
                variant={index === 0 ? 'primary' : 'default'}
              />
            );
          })}
        </div>
        <Slogan />
      </div>
    </section>
  );
}

export default SloganSection;

const ICONS = [Logo, Product, Project];
