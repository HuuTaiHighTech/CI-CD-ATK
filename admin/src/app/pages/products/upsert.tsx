import { useLoaderData } from 'react-router-dom';
import { ProductForm } from '~/components/form';

function ProductUpsert() {
   const product = useLoaderData();
   const title = product ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới';
   return (
      <section>
         <div className='mb-6'>
            <h1 className='text-2xl font-bold mb-2'>{title}</h1>
            <p className='text-muted-foreground'>
               {title} với thông tin đa ngôn ngữ và hình ảnh
            </p>
         </div>
         <ProductForm product={product} />
      </section>
   );
}

export default ProductUpsert;
