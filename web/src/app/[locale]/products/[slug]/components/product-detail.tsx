import ConsultationForm from '~/app/[locale]/products/[slug]/components/consultation-form';
import ProductGallery from '~/app/[locale]/products/[slug]/components/product-gallery';

type Props = {
  images: string[];
  name: string;
  feature: string;
  features: Array<{ key: string; value: string }>;
  summary: string;
  description: string;
};

function ProductDetail({
  images,
  name,
  feature,
  features,
  summary,
  description
}: Props) {
  return (
    <>
      <div className='flex flex-col lg:flex-row gap-3'>
        <ProductGallery name={name} images={images} />
        <div className='flex-1'>
          <h1 className='text-2xl lg:text-5xl font-bold text-accent mb-3 lg:mb-4'>
            {name}
          </h1>
          <p className='text-sm lg:text-base font-medium text-[#252526] mb-3.5 lg:mb-6'>
            {summary}
          </p>
          <div className='space-y-3'>
            <h5 className='text-base md:text-xl lg:text-2xl font-semibold text-[#252526]'>
              {feature}
            </h5>
            <ul>
              {features.map((item, index) => (
                <li
                  key={index}
                  className='flex items-center border-t border-[#CCCCCC] py-2.5 gap-5'
                >
                  <h5 className='w-1/5 text-xs md:text-base lg:text-lg font-semibold text-[#2D80BD] shrink-0'>
                    {item.key}
                  </h5>
                  <p className='flex-1 text-[0.625rem] md:text-xs lg:text-sm font-medium text-[#252526] whitespace-pre-line'>
                    {item.value}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div
        className='prose'
        dangerouslySetInnerHTML={{ __html: description }}
      />
      <ConsultationForm productName={name} />
    </>
  );
}

export default ProductDetail;
