import { resolve } from 'path';
import api from './mock/api';

export default {
  ...api,
  async '/api/sheet'(req, res, next, { sheet2json }) {
    const filePath = resolve(__dirname, './mock/AutoFilter.xlsx');
    res.json(await sheet2json(filePath, { readAll: true }));
  },
};
