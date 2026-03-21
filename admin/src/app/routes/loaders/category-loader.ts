import { redirect, type LoaderFunctionArgs } from 'react-router-dom';
import { categoryService } from '~/services';
import { AxiosError, LoaderError, NotFoundResponse } from '~/utils';
import { ROUTES } from '~/constants';

async function categoryLoader({ params }: LoaderFunctionArgs) {
  const { id } = params;

  if (!id) NotFoundResponse();

  try {
    const { data } = await categoryService.getById(id);
    if (!data) NotFoundResponse();
    return data;
  } catch (error) {
    const { status } = AxiosError(error);
    if (status === 401) throw redirect(ROUTES.LOGIN);
    LoaderError(error);
  }
}

export default categoryLoader;
