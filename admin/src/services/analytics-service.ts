import { format } from 'date-fns';
import { api } from '~/utils';
import type {
  AnalyticsOverview,
  TopLocation,
  TopPage,
  TrafficSource
} from '~/types';
import { type DateRange } from 'react-day-picker';

function formatLocalDate(date: Date) {
  return format(date, 'yyyy-MM-dd');
}

function buildDateParams(date?: DateRange) {
  if (!date?.from) return undefined;

  return {
    startDate: formatLocalDate(date.from),
    endDate: date.to ? formatLocalDate(date.to) : undefined
  };
}

const analyticsService = {
  getOverview: async (
    date: DateRange | undefined
  ): Promise<AnalyticsOverview | null> => {
    try {
      const { data } = await api.get<AnalyticsOverview>(
        '/analytics/overview',
        buildDateParams(date)
      );
      return data || null;
    } catch {
      return null;
    }
  },

  getTopPages: async (date: DateRange | undefined): Promise<TopPage[]> => {
    try {
      const { data } = await api.get<TopPage[]>(
        '/analytics/top-pages',
        buildDateParams(date)
      );
      return (data || []).map((page) => ({
        ...page,
        title: page.title.replace(/\s*\|.*$/, '').trim()
      }));
    } catch {
      return [];
    }
  },

  getTopLocations: async (
    date: DateRange | undefined
  ): Promise<TopLocation[]> => {
    try {
      const { data } = await api.get<TopLocation[]>(
        '/analytics/locations',
        buildDateParams(date)
      );
      return (data || []).map((item) => ({
        ...item,
        users: Number(item.users) || 0
      }));
    } catch {
      return [];
    }
  },

  getTrafficSources: async (
    date: DateRange | undefined
  ): Promise<TrafficSource[]> => {
    try {
      const { data } = await api.get<TrafficSource[]>(
        '/analytics/traffic-sources',
        buildDateParams(date)
      );
      return data || [];
    } catch {
      return [];
    }
  }
};

export default analyticsService;
