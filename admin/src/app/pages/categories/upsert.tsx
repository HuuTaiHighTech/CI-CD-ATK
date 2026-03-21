import { useLoaderData } from 'react-router-dom';
import { CategoryForm } from '~/components/form';

function CategoryUpsert() {
   const category = useLoaderData();
   const title = category ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới';

   return (
      <section>
         <div className='mb-6'>
            <h1 className='text-2xl font-bold mb-2'>{title}</h1>
            <p className='text-muted-foreground'>
               {title} với thông tin đa ngôn ngữ và hình ảnh
            </p>
         </div>
         <CategoryForm category={category} />
      </section>
   );
}

export default CategoryUpsert;
