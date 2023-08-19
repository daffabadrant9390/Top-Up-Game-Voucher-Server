const PlayerModel = require('./model');

module.exports = {
  index: async (req, res) => {
    try {
      const { name } = req.session.user || '';

      const playerData = await PlayerModel.find();
      console.log('playerData: ', playerData[0].username);

      const alertMessage = req.flash('alertMessage');
      const alertStatus = req.flash('alertStatus');
      const alertData = {
        message: alertMessage,
        status: alertStatus,
      };

      res.render('admin/player/view_player', {
        title: 'Player Page',
        name,
        alertData,
        playerData,
      });
    } catch (error) {
      req.flash('alertMessage', `Error Occurred: ${error.message}`);
      req.flash('alertStatus', 'danger');
      console.log(error);

      res.redirect('/player');
    }
  },
  updateStatus: async (req, res) => {
    try {
      const { id } = req.params || {};
      const { status } = req.query || {};

      const updatedPlayerData = await PlayerModel.findOneAndUpdate(
        {
          _id: id,
        },
        {
          status: status === 'enabled' ? 'ACTIVE' : 'NON_ACTIVE',
        }
      );

      if (!!updatedPlayerData) {
        req.flash('alertMessage', `Successfully update the player status`);
        req.flash('alertStatus', 'success');

        res.redirect('/player');
      } else {
        req.flash('alertMessage', `Failed update the player status`);
        req.flash('alertStatus', 'danger');

        res.redirect('/player');
      }
    } catch (error) {
      req.flash('alertMessage', `Error Occurred: ${error.message}`);
      req.flash('alertStatus', 'danger');
      console.log(error);

      res.redirect('/player');
    }
  },
};
