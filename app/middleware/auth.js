module.exports = {
  isLogin: (req, res, next) => {
    try {
      /*
        Middleware to check whether user is login or not
          - if user session already expired, redirect user to login page and show alert message
          - if user session still valid and login, skip the middleware using next()
      */
      if (req.session.user === null || req.session.user === undefined) {
        req.flash(
          'alertMessage',
          `Error Occurred: Your session is expired, please log in!`
        );
        req.flash('alertStatus', 'danger');

        res.redirect('/');
      } else {
        next();
      }
    } catch (error) {
      console.log(`Error occurred : ${error.message || ''}`);
    }
  },
};
