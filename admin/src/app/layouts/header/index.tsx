import { Link } from 'react-router-dom';
import { useMeta } from '~/hooks';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '~/components/ui/breadcrumb';
import { Separator } from '~/components/ui/separator';
import { SidebarTrigger } from '~/components/ui/sidebar';

function Header() {
  const { breadcrumbs } = useMeta();

  return (
    <header className='flex h-12 shrink-0 justify-between items-center gap-2 border-b px-3'>
      <div className='flex items-center gap-2'>
        <SidebarTrigger />
        <Separator
          orientation='vertical'
          className='mr-2 data-[orientation=vertical]:h-4'
        />
        {breadcrumbs.map((breadcrumb, index) => (
          <Breadcrumb key={index}>
            <BreadcrumbList>
              {breadcrumb.href ? (
                <BreadcrumbItem className='hidden md:block'>
                  <BreadcrumbLink asChild>
                    <Link to={breadcrumb.href}>{breadcrumb.title}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              ) : (
                <BreadcrumbItem>
                  <BreadcrumbPage>{breadcrumb.title}</BreadcrumbPage>
                </BreadcrumbItem>
              )}
              {!breadcrumb.isLast && (
                <BreadcrumbSeparator className='hidden md:block' />
              )}
            </BreadcrumbList>
          </Breadcrumb>
        ))}
      </div>
    </header>
  );
}
export default Header;
