const NominalModel = require('./model');
const COIN_TYPE = require('./constant');

module.exports = {
  index: async (req, res) => {
    try {
      const nominalData = await NominalModel.find();

      const alertMessage = req.flash('alertMessage');
      const alertStatus = req.flash('alertStatus');
      const alertData = {
        message: alertMessage,
        status: alertStatus,
      };
      res.render('admin/nominal/view_nominal', {
        alertData,
        nominalData,
      });
    } catch (error) {
      req.flash('alertMessage', `Error Occurred: ${error.message}`);
      req.flash('alertStatus', 'danger');
      console.log(error);

      res.redirect('/nominal');
    }
  },
  renderCreateNominalPage: async (req, res) => {
    try {
      res.render('admin/nominal/create_nominal', {
        COIN_TYPE,
      });
    } catch (error) {
      req.flash('alertMessage', `Error Occurred: ${error.message}`);
      req.flash('alertStatus', 'danger');
      console.log(error);

      res.redirect('/nominal');
    }
  },
  createNominal: async (req, res) => {
    try {
      const { nominal_type, nominal_quantity, price } = req.body;
      const isNominalTypeCorrect = COIN_TYPE.includes(
        (nominal_type || '').toUpperCase()
      );

      if (
        !!nominal_type &&
        !!nominal_quantity &&
        !!price &&
        isNominalTypeCorrect
      ) {
        const createNewNominalData = await NominalModel.create({
          coinQuantity: nominal_quantity,
          coinType: nominal_type,
          price,
        });

        if (!!createNewNominalData) {
          req.flash('alertMessage', 'Success create new nominal!');
          req.flash('alertStatus', 'success');
          res.redirect('/nominal');
        } else {
          req.flash(
            'alertMessage',
            `Error Occurred: Failed create new nominal`
          );
          req.flash('alertStatus', 'danger');
        }
      } else {
        req.flash('alertMessage', `Error Occurred: Field can't be empty`);
        req.flash('alertStatus', 'danger');

        res.redirect('/nominal');
      }
    } catch (error) {
      req.flash('alertMessage', `Error Occurred: ${error.message}`);
      req.flash('alertStatus', 'danger');
      console.log(error);

      res.redirect('/nominal');
    }
  },
  renderEditNominalPage: async (req, res) => {
    try {
      const { id } = req.params;
      const nominalData = await NominalModel.findOne({
        _id: id,
      });

      if (!!nominalData) {
        res.render('admin/nominal/edit_nominal', {
          nominalData,
          COIN_TYPE,
        });
      } else {
        res.send({
          message: 'Nominal data with that id is not found!',
        });
      }
    } catch (error) {
      req.flash('alertMessage', `Error Occurred: ${error.message}`);
      req.flash('alertStatus', 'danger');
      console.log(error);

      res.redirect('/nominal');
    }
  },
  editNominal: async (req, res) => {
    try {
      const { id } = req.params;
      const { nominal_type, nominal_quantity, price } = req.body;
      const isNominalTypeCorrect =
        !!nominal_type &&
        COIN_TYPE.includes((nominal_type || '').toUpperCase());
      if (
        !!nominal_type &&
        !!nominal_quantity &&
        !!price &&
        !!isNominalTypeCorrect
      ) {
        const updatedData = await NominalModel.findOneAndUpdate(
          {
            _id: id,
          },
          {
            coinType: nominal_type,
            coinQuantity: nominal_quantity,
            price,
          }
        );
        if (!!updatedData) {
          req.flash('alertMessage', 'Success edit nominal data!');
          req.flash('alertStatus', 'success');
          res.redirect('/nominal');
        } else {
          req.flash('alertMessage', `Error Occurred: Failed edit nominal`);
          req.flash('alertStatus', 'danger');
        }
      } else {
        req.flash('alertMessage', `Error Occurred: Fields cant be empty!`);
        req.flash('alertStatus', 'danger');
        res.redirect('/nominal');
      }
    } catch (error) {
      req.flash('alertMessage', `Error Occurred: ${error.message}`);
      req.flash('alertStatus', 'danger');
      console.log(error);

      res.redirect('/nominal');
    }
  },
  deleteNominal: async (req, res) => {
    try {
      const { id } = req.params;
      const deletedData = await NominalModel.findOneAndRemove({
        _id: id,
      });

      if (!!deletedData) {
        req.flash('alertMessage', 'Success delete nominal data!');
        req.flash('alertStatus', 'success');
        res.redirect('/nominal');
      } else {
        req.flash('alertMessage', 'Failed delete nominal data!');
        req.flash('alertStatus', 'danger');
        res.redirect('/nominal');
      }
    } catch (error) {
      req.flash('alertMessage', `Error Occurred: ${error.message}`);
      req.flash('alertStatus', 'danger');
      console.log(error);

      res.redirect('/nominal');
    }
  },
};
