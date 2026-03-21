import { Navigate, Outlet } from 'react-router-dom';
import { ROUTES } from '~/constants';
import useAuth from '~/hooks/use-auth';

function GuestGuard() {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  if (user) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return <Outlet />;
}
export default GuestGuard;
