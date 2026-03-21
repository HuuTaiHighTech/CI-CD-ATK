import { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '~/hooks/use-auth';
import Sidebar from '~/app/layouts/sidebar';
import { SidebarInset, SidebarProvider } from '~/components/ui/sidebar';
import Header from '~/app/layouts/header';
import { ROUTES } from '~/constants';

function RootLayout() {
  const { user, isLoading } = useAuth();
  const [defaultOpen] = useState(() =>
    document.cookie.includes('sidebar_state=true')
  );

  if (isLoading) return null;

  if (!user) return <Navigate to={ROUTES.LOGIN} replace />;

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <Sidebar collapsible='icon' />
      <SidebarInset className='overflow-hidden'>
        <Header />
        <div className='p-4'>
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default RootLayout;
