import NextLink from 'next/link';

export default function NotFound() {
  return (
    <div className='min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-6'>
      <h1 className='text-3xl font-semibold text-primary'>Page not found</h1>
      <p className='text-sm text-neutral-600'>
        The page you are looking for does not exist.
      </p>
      <NextLink
        href='/'
        className='inline-flex items-center rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white'
      >
        Go home
      </NextLink>
    </div>
  );
}
