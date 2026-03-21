import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import useDebounce from '~/hooks/use-debounce';
import type { QueryParams } from '~/types';

const RESERVED_KEYS = new Set(['page', 'limit', 'search']);

const parseNumber = (val: string | null, fallback: number) =>
  val && !isNaN(Number(val)) && Number(val) > 0 ? Number(val) : fallback;

const useQueryParams = (
  defaults: Partial<QueryParams> = { page: 1, limit: 10 },
  debounceDelay = 300
) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialState = useMemo(() => {
    const custom: Record<string, string> = {};

    for (const [key, value] of searchParams.entries()) {
      if (!RESERVED_KEYS.has(key)) {
        custom[key] = value;
      }
    }

    return {
      page: parseNumber(searchParams.get('page'), defaults.page ?? 1),
      limit: parseNumber(searchParams.get('limit'), defaults.limit ?? 10),
      search: searchParams.get('search') ?? '',
      custom
    };
  }, []);

  const [page, setPage] = useState(initialState.page);
  const [limit, setLimit] = useState(initialState.limit);
  const [search, setSearch] = useState(initialState.search);
  const [custom, setCustom] = useState(initialState.custom);

  const stableSearch = useDebounce(search, debounceDelay);

  useEffect(() => {
    const params: Record<string, string> = {};

    if (page >= 1) params.page = String(page);
    if (limit > 0) params.limit = String(limit);
    if (stableSearch.trim()) params.search = stableSearch.trim();

    for (const [key, value] of Object.entries(custom)) {
      if (value != null && value !== '') {
        params[key] = String(value);
      }
    }

    setSearchParams(params, { replace: true });
  }, [page, limit, stableSearch, custom, setSearchParams]);

  const update = useCallback((params: Partial<QueryParams>) => {
    if (params.page !== undefined) setPage(params.page);
    if (params.limit !== undefined) setLimit(params.limit);
    if (params.search !== undefined) setSearch(params.search);

    const customKeys = Object.keys(params).filter((k) => !RESERVED_KEYS.has(k));

    if (customKeys.length > 0) {
      setCustom((prev) => {
        const next = { ...prev };

        for (const key of customKeys) {
          const value = params[key];
          if (value == null || value === '') {
            delete next[key];
          } else {
            next[key] = value;
          }
        }

        return next;
      });
    }
  }, []);

  const reset = useCallback(() => {
    setPage(defaults.page ?? 1);
    setLimit(defaults.limit ?? 10);
    setSearch('');
    setCustom({});
  }, [defaults]);

  const resetPage = useCallback(() => setPage(1), []);

  const get = useCallback((key: string): string => custom[key], [custom]);

  const set = useCallback((key: string, value: string) => {
    setCustom((prev) => {
      if (value == null || value === '') {
        const { [key]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [key]: value };
    });
  }, []);

  return {
    // State
    page,
    limit,
    search,
    stableSearch,
    custom,

    // Setters
    setPage,
    setLimit,
    setSearch,

    // Actions
    update,
    reset,
    resetPage,
    get,
    set
  };
};

export default useQueryParams;
