import { useEffect, useState } from 'react';
import { Activity, Clock, Eye, Users } from 'lucide-react';
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle
} from '~/components/ui/card';
import { analyticsService } from '~/services';
import { formatDuration } from '~/utils';
import { Skeleton } from '~/components/ui/skeleton';
import type { AnalyticsOverview as IAnalyticsOverview } from '~/types';
import { type DateRange } from 'react-day-picker';

type Props = {
  date: DateRange | undefined;
};

function AnalyticsOverview({ date }: Props) {
  const [data, setData] = useState<IAnalyticsOverview | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    analyticsService
      .getOverview(date)
      .then(setData)
      .finally(() => setLoading(false));
  }, [date]);

  if (isLoading)
    return (
      <div className='grid auto-rows-min md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4'>
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className='min-h-28.5 rounded-xl' />
        ))}
      </div>
    );

  if (!data) return null;

  return (
    <div className='grid auto-rows-min md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4'>
      <Card className='@container/card'>
        <CardHeader>
          <CardDescription>Người truy cập</CardDescription>
          <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
            {data.totalUsers}
          </CardTitle>
          <CardAction>
            <Users />
          </CardAction>
        </CardHeader>
      </Card>
      <Card className='@container/card'>
        <CardHeader>
          <CardDescription>Lượt truy cập</CardDescription>
          <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
            {data.sessions}
          </CardTitle>
          <CardAction>
            <Activity />
          </CardAction>
        </CardHeader>
      </Card>
      <Card className='@container/card'>
        <CardHeader>
          <CardDescription>Lượt xem trang</CardDescription>
          <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
            {data.pageViews}
          </CardTitle>
          <CardAction>
            <Eye />
          </CardAction>
        </CardHeader>
      </Card>
      <Card className='@container/card'>
        <CardHeader>
          <CardDescription>Thời gian truy cập</CardDescription>
          <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
            {formatDuration(data.averageSessionDuration)}
          </CardTitle>
          <CardAction>
            <Clock />
          </CardAction>
        </CardHeader>
      </Card>
    </div>
  );
}

export default AnalyticsOverview;
