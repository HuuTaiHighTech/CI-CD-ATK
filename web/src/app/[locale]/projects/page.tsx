import { type Metadata } from 'next';
import Image from 'next/image';
import { getDictionary } from '~/lib/dictionary';
import { Pagination } from '~/components/ui';
import { projectService } from '~/services';

type Props = Readonly<{
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string }>;
}>;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);

  return {
    title: dictionary.featured_projects.title,
    description: dictionary.featured_projects.description
  };
}

async function Projects({ searchParams }: Props) {
  const { page } = await searchParams;
  const currentPage = Number(page) > 0 ? Number(page) : 1;
  const { items, pagination } = await projectService.get(currentPage);

  return (
    <div className='relative container space-y-6 py-6 lg:py-16'>
      {items.map((project) => (
        <div
          key={project.id}
          className='bg-white flex flex-col-reverse lg:flex-row rounded-xl p-3 lg:px-6 lg:py-5 gap-3.5 lg:gap-6'
        >
          <div className='flex-1 space-y-3 lg:space-y-4'>
            <h3 className='text-2xl md:text-4xl text-accent font-semibold'>
              {project.name}
            </h3>
            <ul className='text-sm lg:text-base'>
              {project.details.map((item, index) => (
                <li key={index}>
                  <strong>{item.key}: </strong>
                  <span>{item.value}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className='flex-1 relative aspect-3/2 rounded-xl overflow-hidden'>
            <Image
              src={project.thumbnail}
              alt={project.name}
              fill
              sizes='(max-width: 1023px) 100vw, 640px'
              className='object-cover'
            />
          </div>
        </div>
      ))}
      <Pagination
        page={pagination.page}
        totalPages={pagination.totalPages}
        scrollToTop
      />
    </div>
  );
}

export default Projects;
