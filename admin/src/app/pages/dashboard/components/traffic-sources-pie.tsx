import { useEffect, useMemo, useState } from 'react';
import { Pie, PieChart } from 'recharts';
import { analyticsService } from '~/services';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig
} from '~/components/ui/chart';
import { Skeleton } from '~/components/ui/skeleton';
import type { TrafficSource } from '~/types';
import { type DateRange } from 'react-day-picker';

type Props = {
  date: DateRange | undefined;
};

function TrafficSourcesPie({ date }: Props) {
  const [data, setData] = useState<TrafficSource[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    analyticsService
      .getTrafficSources(date)
      .then(setData)
      .finally(() => setLoading(false));
  }, [date]);

  const chartData = useMemo(() => {
    const map = new Map<string, number>();

    data.forEach((item) => {
      map.set(item.source, (map.get(item.source) || 0) + item.sessions);
    });

    return Array.from(map.entries()).map(([source, sessions], index) => ({
      source,
      sessions,
      fill: CHART_COLORS[index % CHART_COLORS.length]
    }));
  }, [data]);

  const chartConfig: ChartConfig = useMemo(() => {
    const config: ChartConfig = {
      sessions: { label: 'Truy cập' }
    };

    chartData.forEach((item, index) => {
      config[item.source] = {
        label: item.source,
        color: CHART_COLORS[index % CHART_COLORS.length]
      };
    });

    return config;
  }, [chartData]);

  return (
    <Card className='flex flex-col'>
      <CardHeader className='items-center pb-0'>
        <CardTitle className='text-center'>Nguồn truy cập</CardTitle>
      </CardHeader>
      <CardContent className='flex-1 pb-0'>
        {isLoading ? (
          <Skeleton className='w-80 aspect-square rounded-full mx-auto' />
        ) : data.length === 0 ? (
          <div className='h-80 flex justify-center items-center text-sm text-muted-foreground'>
            Chưa có dữ liệu trong khoảng thời gian này
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className='max-h-80 aspect-square mx-auto'
          >
            <PieChart>
              <ChartTooltip
                content={<ChartTooltipContent nameKey='source' hideLabel />}
              />
              <Pie data={chartData} dataKey='sessions' label />
              <ChartLegend
                content={<ChartLegendContent nameKey='source' />}
                className='-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center'
              />
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
export default TrafficSourcesPie;

const CHART_COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)'
];
