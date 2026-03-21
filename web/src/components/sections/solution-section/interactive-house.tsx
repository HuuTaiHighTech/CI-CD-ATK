import Image from 'next/image';
import { Link } from '~/components/ui';
import type { ProductPin } from '~/types';

type Props = {
  products: ProductPin[];
};

function InteractiveHouse({ products }: Props) {
  const size = 120;
  const offset = size / 2;

  return (
    <div className='relative w-full hidden sm:block mt-20 2xl:mt-28'>
      <Image
        src='/house_diagram.png'
        width={1164}
        height={496}
        alt='house diagram'
        className='w-full h-auto object-contain'
      />
      <svg
        viewBox='0 0 1164 496'
        className='absolute size-full inset-0 overflow-visible'
      >
        {products.slice(0, HOUSE_POSITIONS.length).map((product, index) => {
          const pos = HOUSE_POSITIONS[index];

          return (
            <Link key={product.id} href={`/products/${product.slug}`}>
              <g>
                <title>{product.name}</title>
                <image
                  href={product.image}
                  width={size}
                  height={size}
                  x={pos.x - offset}
                  y={pos.y - offset}
                  className='origin-center transform-fill hover:scale-125 transition-transform'
                  preserveAspectRatio='xMidYMid slice'
                />
              </g>
            </Link>
          );
        })}
      </svg>
    </div>
  );
}

export default InteractiveHouse;

const HOUSE_POSITIONS = [
  { x: 6, y: -10 },
  { x: 200, y: -10 },
  { x: 390, y: -10 },
  { x: 581.5, y: -10 },
  { x: 774, y: -10 },
  { x: 971, y: -10 },
  { x: 1158.5, y: -10 }
];
