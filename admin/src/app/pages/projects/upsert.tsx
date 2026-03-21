import { useLoaderData } from 'react-router-dom';
import { ProjectForm } from '~/components/form';

function ProjectUpsert() {
   const project = useLoaderData();
   const title = project
      ? 'Chỉnh sửa dự án tiêu biểu'
      : 'Thêm dự án tiêu biểu mới';
   return (
      <section>
         <div className='mb-6'>
            <h1 className='text-2xl font-bold mb-2'>{title}</h1>
            <p className='text-muted-foreground'>
               {title} với thông tin đa ngôn ngữ và hình ảnh
            </p>
         </div>
         <ProjectForm project={project} />
      </section>
   );
}

export default ProjectUpsert;
