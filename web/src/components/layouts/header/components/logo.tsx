import Image from 'next/image';
import { Link } from '~/components/ui';
import { env } from '~/config';

function Logo() {
  return (
    <Link href='/' className='inline-flex w-32 lg:w-48 2xl:w-60'>
      <Image
        src='/logo_header.png'
        width={1305}
        height={530}
        alt={env.APP_NAME}
        className='object-contain'
      />
    </Link>
  );
}

export default Logo;
