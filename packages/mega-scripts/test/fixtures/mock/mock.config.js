import c from './mock/c';

export default {
  ...c,
  '/a'(req, res) {
    res.end('a');
  },
  '/b': {
    data: 'b'
  },
  'POST /c'(req, res) {
    res.json(req.body);
  },
};
