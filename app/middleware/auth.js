const config = require('../../config');
const jwtToken = require('jsonwebtoken');
const PlayerModel = require('../player/model');

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
  isLoginPlayer: async (req, res, next) => {
    try {
      // Get the token from request headers Authorization
      const token = req.headers.authorization;
      const finalToken = !!token ? token.replace('Bearer ', '') : null;

      // Verify the token with config.jwtKey
      const data = jwtToken.verify(finalToken, config.jwtKey);

      // Grab the player data using player model with the _id from data
      const playerData = await PlayerModel.findOne({
        _id: data.player.id,
      });

      if (!playerData) {
        throw new Error();
      }

      // Assign the player and accessToken to request
      req.player = playerData;
      req.accessToken = finalToken;
      next();

      console.log('verification jwt data >> ');
      console.log(data);
      console.log('player data from isLoginPlayer >> ');
      console.log(playerData);
    } catch (error) {
      res.status(401).json({
        error: 'Unauthorized to access this resources!',
      });
    }
  },
};
