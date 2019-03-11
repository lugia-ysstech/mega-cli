import { resolve } from 'path';
import random from './mock/random';

export default {
  ...random,
  '/api/array': [
    { name: 'apple', value: 1.2 },
    { name: 'orange', value: 0.95 },
  ],
  '/api/object': {
    shop: {
      taxPercent: 8,
      items: [{ name: 'apple', value: 1.2 }, { name: 'orange', value: 0.95 }],
    },
  },
  '/api/function': function(req, res) {
    res.end('Mock Function.');
  },
  '/api/sheet': async function(req, res, next, { sheet2json }) {
    const filePath = resolve(__dirname, './mock/AutoFilter.xlsx');
    res.json(await sheet2json(filePath, { readAll: true }));
  },
};
