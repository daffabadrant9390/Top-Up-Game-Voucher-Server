module.exports = {
  index: async (req, res) => {
    try {
      const { name } = req.session.user || {};
      res.render('index', {
        title: 'Dashboard Page',
        name: name || '',
      });
    } catch (e) {
      console.error(e);
    }
  },
};
