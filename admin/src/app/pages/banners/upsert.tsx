import { useLoaderData } from 'react-router-dom';
import { BannerForm } from '~/components/form';

function BannerUpsert() {
   const banner = useLoaderData();
   const title = banner ? 'Chỉnh sửa hình ảnh' : 'Thêm hình ảnh mới';

   return (
      <section>
         <div className='mb-6'>
            <h1 className='text-2xl font-bold mb-2'>{title}</h1>
            <p className='text-muted-foreground'>
               {title} với thông tin đa ngôn ngữ và hình ảnh
            </p>
         </div>
         <BannerForm banner={banner} />
      </section>
   );
}

export default BannerUpsert;
