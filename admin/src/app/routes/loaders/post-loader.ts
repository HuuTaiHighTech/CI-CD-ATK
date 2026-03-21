import { redirect, type LoaderFunctionArgs } from 'react-router-dom';
import { postService } from '~/services';
import { AxiosError, LoaderError, NotFoundResponse } from '~/utils';
import { ROUTES } from '~/constants';

async function postLoader({ params }: LoaderFunctionArgs) {
  const { id } = params;

  if (!id) NotFoundResponse();

  try {
    const { data } = await postService.getById(id);
    if (!data) NotFoundResponse();
    return data;
  } catch (error) {
    const { status } = AxiosError(error);
    if (status === 401) throw redirect(ROUTES.LOGIN);
    LoaderError(error);
  }
}

export default postLoader;
