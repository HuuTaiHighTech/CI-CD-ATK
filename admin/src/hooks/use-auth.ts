import { useCallback } from 'react';
import useSWR from 'swr';
import { authService } from '~/services';
import { AUTH_KEY } from '~/config/env';
import type { Credentials, ProfileForm, User } from '~/types';

const fetcher = async (): Promise<User | null> => {
  try {
    const { data } = await authService.me();
    return data ?? null;
  } catch {
    return null;
  }
};

function useAuth() {
  const {
    data: user,
    error,
    isLoading,
    mutate
  } = useSWR<User | null>(AUTH_KEY, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    shouldRetryOnError: false,
    dedupingInterval: 5000,
    errorRetryCount: 0
  });

  const isAuthenticated = !!user && !error;

  const hasRole = useCallback(
    (...roles: User['role'][]) => {
      if (!user) return false;
      return roles.includes(user.role);
    },
    [user]
  );

  const signIn = useCallback(
    async (credentials: Credentials): Promise<void> => {
      try {
        const { data } = await authService.signIn(credentials);
        await mutate(data, false);
      } catch (error) {
        await mutate(null, false);
        throw error;
      }
    },
    [mutate]
  );

  const update = useCallback(
    async (payload: ProfileForm): Promise<void> => {
      const { data } = await authService.update(payload);
      await mutate(data, false);
    },
    [mutate]
  );

  const signOut = useCallback(async (): Promise<void> => {
    try {
      await authService.signOut();
    } finally {
      await mutate(null, false);
    }
  }, [mutate]);

  return {
    user,
    isLoading,
    isAuthenticated,
    hasRole,
    isError: !!error,
    error,
    signIn,
    update,
    signOut
  };
}

export default useAuth;
