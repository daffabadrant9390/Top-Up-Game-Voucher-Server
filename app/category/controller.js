module.exports = {
  index: async (req, res) => {
    try {
      res.render('index', { title: 'EXPRESS JS NEW', username: 'Daffa' });
    } catch (error) {
      console.log(error);
    }
  },
};
