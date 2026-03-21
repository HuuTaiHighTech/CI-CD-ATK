import { useEffect, useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '~/components/ui/chart';
import { analyticsService } from '~/services';
import type { TopLocation } from '~/types';

type Props = {
  date: DateRange | undefined;
};

function TopLocationsRadar({ date }: Props) {
  const [data, setData] = useState<TopLocation[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    analyticsService
      .getTopLocations(date)
      .then(setData)
      .finally(() => setLoading(false));
  }, [date]);

  return (
    <Card>
      <CardHeader className='items-center pb-4'>
        <CardTitle className='text-center'>
          Tỉnh, thành phố có lượt truy cập cao
        </CardTitle>
      </CardHeader>
      <CardContent className='pb-0'>
        {isLoading ? (
          <div className='flex items-center justify-center h-80 animate-pulse'>
            <div className='relative w-56 h-56 rounded-full border border-muted'>
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className='absolute inset-6 rounded-full border border-muted'
                  style={{ transform: `scale(${1 - i * 0.15})` }}
                />
              ))}
              <div className='absolute inset-10 bg-muted rounded-full opacity-30' />
            </div>
          </div>
        ) : data.length === 0 ? (
          <div className='h-80 flex justify-center items-center text-sm text-muted-foreground'>
            Chưa có dữ liệu trong khoảng thời gian này
          </div>
        ) : (
          <ChartContainer
            config={{ users: { label: 'Người dùng' } }}
            className='max-h-80 mx-auto'
          >
            <RadarChart data={data}>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator='line' />}
              />
              <PolarAngleAxis
                dataKey='city'
                tick={({ x, y, textAnchor, index, ...props }) => {
                  const payload = data[index];
                  return (
                    <text
                      x={x}
                      y={index === 0 ? y - 10 : y}
                      textAnchor={textAnchor}
                      fontSize={12}
                      fontWeight={500}
                      {...props}
                    >
                      <tspan>{payload.city}</tspan>
                      <tspan
                        x={x}
                        dy='1rem'
                        fontSize={12}
                        className='fill-muted-foreground'
                      >
                        {payload.users}
                      </tspan>
                    </text>
                  );
                }}
              />
              <PolarGrid radialLines={false} />
              <Radar
                dataKey='users'
                fill='var(--color-blue-300)'
                fillOpacity={0.2}
                stroke='var(--color-blue-500)'
                strokeWidth={2}
              />
            </RadarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
export default TopLocationsRadar;
