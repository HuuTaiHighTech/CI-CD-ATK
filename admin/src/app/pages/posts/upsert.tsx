import { useLoaderData } from 'react-router-dom';
import { PostForm } from '~/components/form';

function PostUpsert() {
   const post = useLoaderData();
   const title = post ? 'Chỉnh sửa bài viết' : 'Thêm bài viết mới';
   return (
      <section>
         <div className='mb-6'>
            <h1 className='text-2xl font-bold mb-2'>{title}</h1>
            <p className='text-muted-foreground'>
               {title} với thông tin đa ngôn ngữ và hình ảnh
            </p>
         </div>
         <PostForm post={post} />
      </section>
   );
}

export default PostUpsert;
