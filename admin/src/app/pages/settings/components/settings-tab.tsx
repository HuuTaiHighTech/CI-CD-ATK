import { useMemo, useState } from 'react';
import { SearchIcon } from 'lucide-react';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput
} from '~/components/ui/input-group';
import AboutPageCard from '~/app/pages/settings/components/about-page-card';
import AddressImageCard from '~/app/pages/settings/components/address-image-card';
import AdsCard from '~/app/pages/settings/components/ads-card';
import ZaloCard from '~/app/pages/settings/components/zalo-card';
import { normalize } from '~/utils';
import { useDebounce } from '~/hooks';

const cards = [
  { title: 'Ảnh quảng cáo', component: AdsCard },
  { title: 'Zalo', component: ZaloCard },
  { title: 'Hình ảnh địa chỉ', component: AddressImageCard },
  { title: 'Hình ảnh giới thiệu', component: AboutPageCard }
];

function useSearchVisible(query: string, delay = 300) {
  const debounced = useDebounce(query, delay);

  const normalizedSearch = useMemo(() => normalize(debounced), [debounced]);

  const isVisible = (title: string) => {
    return normalize(title).includes(normalizedSearch);
  };

  return { search: debounced, isVisible };
}

function SettingsTab() {
  const [search, setSearch] = useState<string>('');

  const { isVisible } = useSearchVisible(search, 300);

  return (
    <div className='space-y-3'>
      {/* Search input */}
      <InputGroup>
        <InputGroupInput
          placeholder='Tìm kiếm...'
          autoFocus
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
      </InputGroup>

      {/* Render cards */}
      {cards.map((c, i) => {
        const Comp = c.component;
        const visible = isVisible(c.title);
        return (
          <div key={i} style={{ display: visible ? undefined : 'none' }}>
            <Comp />
          </div>
        );
      })}
    </div>
  );
}
export default SettingsTab;
