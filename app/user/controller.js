const UserModel = require('./model');
const bcrypt = require('bcrypt');

module.exports = {
  index: async (req, res) => {
    try {
      const alertMessage = req.flash('alertMessage');
      const alertStatus = req.flash('alertStatus');
      const alertData = {
        message: alertMessage,
        status: alertStatus,
      };

      // Check user session first before redirecting
      if (req.session.user === null || req.session.user === undefined) {
        res.render('admin/user/view_sign_in', {
          alertData,
        });
      } else {
        res.redirect('/dashboard');
      }
    } catch (error) {
      req.flash('alertMessage', `Error Occurred: ${error.message}`);
      req.flash('alertStatus', 'danger');
      console.log(error);

      res.redirect('/');
    }
  },
  action_sign_in: async (req, res) => {
    try {
      const { email, password } = req.body || {};
      const userDataByEmail = await UserModel.findOne({ email: email });

      if (!!userDataByEmail) {
        // Check user by password inputted by user and on databases
        const {
          _id: userIdFromDB,
          name: userNameFromDB,
          email: userEmailFromDB,
          status: userStatusFromDB,
          password: userPasswordFromDB,
        } = userDataByEmail || {};
        const checkUserDataByPassword = await bcrypt.compare(
          password,
          userPasswordFromDB
        );

        if (checkUserDataByPassword) {
          // Set user's session from middleware
          req.session.user = {
            id: userIdFromDB || '',
            name: userNameFromDB || '',
            email: userEmailFromDB || '',
            status: userStatusFromDB || '',
          };

          res.redirect('/dashboard');
        } else {
          req.flash('alertMessage', `Error Occurred: Wrong Password!`);
          req.flash('alertStatus', 'danger');

          res.redirect('/');
        }
      } else {
        req.flash('alertMessage', `Error Occurred: Email not found!`);
        req.flash('alertStatus', 'danger');

        res.redirect('/');
      }
    } catch (error) {
      req.flash('alertMessage', `Error Occurred: ${error.message}`);
      req.flash('alertStatus', 'danger');
      console.log(error);

      res.redirect('/');
    }
  },
  action_log_out: async (req, res) => {
    // remove all the session and redirect to login page
    req.session.destroy();
    res.redirect('/');
  },
};
