import { useEffect, useMemo } from 'react';
import { useMatches, type UIMatch } from 'react-router-dom';
import { APP_NAME } from '~/config/env';

interface RouteHandle {
  title?: string | ((data: unknown) => string);
  breadcrumb?: string | ((data: unknown) => string);
  requiresAuth?: boolean;
  hideFromBreadcrumb?: boolean;
}

type MatchWithHandle = UIMatch<unknown, RouteHandle>;

const useMeta = () => {
  const matches = useMatches() as MatchWithHandle[];

  const getTitle = useMemo(() => {
    return (match: MatchWithHandle): string => {
      if (!match.handle?.title) return 'Không xác định';

      try {
        if (typeof match.handle.title === 'function') {
          return match.handle.title(match.data) || 'Đang tải...';
        }
        return match.handle.title;
      } catch {
        return 'Không xác định';
      }
    };
  }, []);

  const breadcrumbs = useMemo(() => {
    return matches
      .filter((match) => match.handle?.title)
      .map((match, index, array) => {
        const isLast = index === array.length - 1;
        return {
          href: isLast ? undefined : match.pathname,
          title: getTitle(match),
          isLast
        };
      });
  }, [matches, getTitle]);

  useEffect(() => {
    let documentTitle = 'Administrator';
    const appName = APP_NAME || '';

    if (breadcrumbs && breadcrumbs.length > 0) {
      documentTitle = breadcrumbs[breadcrumbs.length - 1].title;
    }

    document.title = documentTitle + ' | ' + appName;
  }, [breadcrumbs]);

  return { breadcrumbs };
};

export default useMeta;
