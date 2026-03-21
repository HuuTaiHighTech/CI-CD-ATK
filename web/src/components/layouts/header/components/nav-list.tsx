import { type Dictionary } from '~/lib/dictionary';
import NavLink from '~/components/layouts/header/components/nav-link';
import type { Category } from '~/types';

type Props = {
  categories: Category[];
  dictionary: Dictionary;
};

function NavList({ categories, dictionary }: Props) {
  return (
    <ul className='hidden lg:flex flex-wrap justify-center items-center select-none px-4 lg:gap-3 2xl:gap-10'>
      <NavLink label={dictionary.nav.about} href='/about' />

      <NavLink
        label={dictionary.nav.products}
        href={
          categories?.[0]
            ? `/categories/?tab=${categories?.[0].slug}`
            : '/categories'
        }
        items={categories.map((item) => ({
          label: item.name,
          href: `/categories?tab=${item.slug}`
        }))}
      />

      <NavLink label={dictionary.nav.featured_projects} href='/projects' />

      <NavLink
        label={dictionary.nav.insights}
        href='/insights?tab=always-take-care'
        items={[
          { label: 'Always Take Care', href: '/insights?tab=always-take-care' },
          { label: 'Trust In Mind', href: '/insights?tab=trust-in-mind' },
          { label: 'Keep Promise', href: '/insights?tab=keep-promise' }
        ]}
      />

      <NavLink
        label={dictionary.nav.activities.title}
        href='/activities?tab=company'
        items={[
          {
            label: dictionary.nav.activities.menu.company,
            href: '/activities?tab=company'
          },
          {
            label: dictionary.nav.activities.menu.community,
            href: '/activities?tab=community'
          }
        ]}
      />
      <NavLink label={dictionary.nav.contact} href='/contact' />
    </ul>
  );
}

export default NavList;
