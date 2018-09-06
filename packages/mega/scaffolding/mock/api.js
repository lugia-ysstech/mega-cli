export default {
  '/api/hello': function(req, res) {
    res.end(`hello ${Math.random()}`);
  },
};
