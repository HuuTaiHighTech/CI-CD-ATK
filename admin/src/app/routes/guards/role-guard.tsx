import { Outlet } from 'react-router-dom';
import useAuth from '~/hooks/use-auth';
import type { Role } from '~/types';
import { ForbiddenResponse } from '~/utils';

interface Props {
  allowedRoles?: Role[];
}

function RoleGuard({ allowedRoles }: Props) {
  const { user, hasRole, isLoading } = useAuth();

  if (isLoading || !user) return null;

  if (allowedRoles && allowedRoles.length > 0 && !hasRole(...allowedRoles)) {
    ForbiddenResponse();
  }

  return <Outlet />;
}

export default RoleGuard;
