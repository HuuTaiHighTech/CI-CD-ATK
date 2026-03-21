import { google } from 'googleapis';
import env from '~/config/env';

const auth = new google.auth.GoogleAuth({
  credentials: env.GOOGLE_SERVICE_ACCOUNT,
  scopes: ['https://www.googleapis.com/auth/spreadsheets']
});

const sheets = google.sheets({ version: 'v4', auth });

export default sheets;
