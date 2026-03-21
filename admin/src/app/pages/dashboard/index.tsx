import { useState } from 'react';
import {
  AnalyticsOverview,
  TopLocationsRadar,
  TopPagesChart,
  TrafficSourcesPie
} from '~/app/pages/dashboard/components';
import { DatePickerWithRange } from '~/components/ui/date-picker-with-range';
import { type DateRange } from 'react-day-picker';

function DashboardPage() {
  const [date, setDate] = useState<DateRange | undefined>();

  return (
    <section className='flex-1 flex flex-col gap-4'>
      <DatePickerWithRange value={date} onChange={setDate} />
      <AnalyticsOverview date={date} />
      <div className='grid auto-rows-min xl:grid-cols-2 2xl:grid-cols-3 gap-4'>
        <TopPagesChart date={date} />
        <TopLocationsRadar date={date} />
        <TrafficSourcesPie date={date} />
      </div>
    </section>
  );
}

export default DashboardPage;
