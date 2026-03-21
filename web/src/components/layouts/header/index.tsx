import {
  Logo,
  NavList,
  SearchBox
} from '~/components/layouts/header/components';
import LocaleSwitcher from '~/components/locale-switcher';
import Sidebar from '~/components/layouts/sidebar';
import { type Dictionary } from '~/lib/dictionary';
import { categoryService } from '~/services';

type Props = {
  dictionary: Dictionary;
};

async function Header({ dictionary }: Props) {
  const categories = await categoryService.get();

  return (
    <header className='fixed top-0 lg:top-5 xl:top-10 left-0 lg:left-1/2 w-full lg:w-max lg:max-w-full bg-primary lg:bg-[#1C2A45]/40 lg:border-b lg:border-white/10 lg:backdrop-blur-xl lg:backdrop-saturate-150 lg:rounded-4xl shadow-xl lg:-translate-x-1/2 px-4 lg:px-5 xl:px-8 2xl:px-10 z-10'>
      <div className='flex justify-between items-center gap-3 lg:gap-5 xl:gap-10'>
        <div className='flex items-center gap-2'>
          <Sidebar categories={categories} dictionary={dictionary} />
          <Logo />
        </div>
        <NavList categories={categories} dictionary={dictionary} />
        <div className='flex items-center gap-3'>
          <SearchBox />
          <LocaleSwitcher />
        </div>
      </div>
    </header>
  );
}

export default Header;
