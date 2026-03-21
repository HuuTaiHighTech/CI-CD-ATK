import { useCallback, useMemo, useState } from 'react';
import type { Paginated, Pagination } from '~/types';

type Matcher<T> = ((item: T) => boolean) | string | number;

const DEFAULT_PAGINATION: Pagination = {
   page: 1,
   limit: 10,
   total: 0,
   totalPages: 1
};

const usePaginated = <T>(initialState?: Paginated<T>) => {
   const [state, setState] = useState<Paginated<T>>(() => ({
      items: initialState?.items ?? [],
      pagination: initialState?.pagination ?? DEFAULT_PAGINATION
   }));

   const set = useCallback((data: Paginated<T>) => {
      setState(data);
   }, []);

   const setItems = useCallback((items: T[] | ((prev: T[]) => T[])) => {
      setState((prev) => ({
         ...prev,
         items: typeof items === 'function' ? items(prev.items) : items
      }));
   }, []);

   const setItem = useCallback(
      (matcher: Matcher<T>, updater: (item: T) => T) => {
         setState((prev) => ({
            ...prev,
            items: prev.items.map((item: any) => {
               const matched =
                  typeof matcher === 'function'
                     ? matcher(item)
                     : item.id === matcher;
               return matched ? updater(item) : item;
            })
         }));
      },
      []
   );

   const removeItem = useCallback((matcher: Matcher<T>) => {
      setState((prev) => ({
         ...prev,
         items: prev.items.filter((item: any) => {
            const matched =
               typeof matcher === 'function'
                  ? matcher(item)
                  : item.id === matcher;
            return !matched;
         })
      }));
   }, []);

   const setPagination = useCallback(
      (pagination: Pagination | ((prev: Pagination) => Pagination)) => {
         setState((prev) => ({
            ...prev,
            pagination:
               typeof pagination === 'function'
                  ? pagination(prev.pagination)
                  : pagination
         }));
      },
      []
   );

   const size = useMemo(() => state.items.length, [state.items.length]);

   const isEmpty = useMemo(
      () => state.items.length === 0,
      [state.items.length]
   );

   const reset = useCallback(() => {
      setState({
         items: initialState?.items ?? [],
         pagination: initialState?.pagination ?? DEFAULT_PAGINATION
      });
   }, [initialState]);

   return {
      ...state,
      set,
      setItems,
      setItem,
      removeItem,
      setPagination,
      size,
      isEmpty,
      reset
   };
};

export default usePaginated;
