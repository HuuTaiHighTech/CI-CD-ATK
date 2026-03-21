import Link from '~/components/ui/link';

type Props = {
  slug: string;
  children: React.ReactNode;
};

function Tag({ slug, children }: Props) {
  return (
    <Link
      href={`/tags/${slug}`}
      className='rounded-full border-[1.4px] border-[#00ADFE] text-[#252526] text-xs md:text-sm lg:text-base bg-white hover:bg-primary hover:text-secondary hover:border-primary px-3 py-2'
    >
      {children}
    </Link>
  );
}
export default Tag;
