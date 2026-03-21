import { http } from '~/lib/http';
import { type Sheet } from '~/schemas';

const sheetService = {
  create: async (form: Sheet) => http.post('/sheets', form)
};

export default sheetService;
