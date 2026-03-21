import { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis
} from 'recharts';
import { analyticsService } from '~/services';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '~/components/ui/chart';
import type { TopPage } from '~/types';
import { Skeleton } from '~/components/ui/skeleton';
import type { DateRange } from 'react-day-picker';

type Props = {
  date: DateRange | undefined;
};

function TopPagesChart({ date }: Props) {
  const [data, setData] = useState<TopPage[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    analyticsService
      .getTopPages(date)
      .then(setData)
      .finally(() => setLoading(false));
  }, [date]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-center'>Trang được xem nhiều</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className='space-y-6'>
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className='h-10 w-3/4 mx-auto ' />
            ))}
          </div>
        ) : data.length === 0 ? (
          <div className='h-80 flex justify-center items-center text-sm text-muted-foreground'>
            Chưa có dữ liệu trong khoảng thời gian này
          </div>
        ) : (
          <ChartContainer
            config={{ views: { label: 'Lượt xem' } }}
            className='max-h-80'
          >
            <BarChart
              accessibilityLayer
              data={data}
              layout='vertical'
              margin={{ right: 16 }}
              barCategoryGap={10}
            >
              <CartesianGrid horizontal={false} />
              <YAxis
                dataKey='title'
                type='category'
                tickLine={false}
                width={120}
                axisLine={false}
                tickFormatter={(value) => value}
              />
              <XAxis dataKey='views' type='number' hide />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    indicator='line'
                    formatter={(value, _, item) => {
                      const payload = item.payload as TopPage;

                      return (
                        <div className='space-y-1'>
                          <div className='font-medium'>{payload.title}</div>
                          <div className='text-xs text-muted-foreground'>
                            {payload.path}
                          </div>
                          <div>
                            <span className='font-semibold'>{value}</span> lượt
                            xem
                          </div>
                        </div>
                      );
                    }}
                  />
                }
              />
              <Bar
                dataKey='views'
                layout='vertical'
                fill='var(--color-blue-500)'
                radius={4}
              >
                <LabelList
                  dataKey='views'
                  position='right'
                  offset={8}
                  className='fill-foreground'
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}

export default TopPagesChart;
