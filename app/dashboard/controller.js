module.exports = {
  index: async (req, res) => {
    try {
      res.render('index', { title: 'Dashboard Express Js' });
    } catch (e) {
      console.error(e);
    }
  },
};
