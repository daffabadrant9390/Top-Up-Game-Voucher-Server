const BankModel = require('./model');
const bankNameConstant = require('./constant');
module.exports = {
  index: async (req, res) => {
    try {
      const alertMessage = req.flash('alertMessage');
      const alertStatus = req.flash('alertStatus');
      const alertData = { message: alertMessage, status: alertStatus };
      const bankData = await BankModel.find();
      res.render('admin/bank/view_bank', {
        alertData,
        bankData,
      });
    } catch (error) {
      req.flash('alertMessage', `Error Occurred: ${error.message}`);
      req.flash('alertStatus', 'danger');
      console.log(error);

      res.redirect('/bank');
    }
  },
  renderCreateBankPage: async (req, res) => {
    try {
      const alertMessage = req.flash('alertMessage');
      const alertStatus = req.flash('alertStatus');
      const alertData = { message: alertMessage, status: alertStatus };
      res.render('admin/bank/create_bank', {
        bankNameConstant,
        alertData,
      });
    } catch (error) {
      req.flash('alertMessage', `Error Occurred: ${error.message}`);
      req.flash('alertStatus', 'danger');
      console.log(error);

      res.redirect('/bank');
    }
  },
  createBank: async (req, res) => {
    try {
      const { card_holder_name, bank_name, card_number } = req.body;
      const isAllFieldFilled =
        !!card_holder_name && !!bank_name && !!card_number;

      console.log('req.body bank: ', req.body);

      if (isAllFieldFilled) {
        if (bankNameConstant.includes(bank_name)) {
          const newBankData = await BankModel.create({
            cardHolderName: card_holder_name,
            cardNumber: card_number,
            bankName: bank_name,
          });

          if (!!newBankData) {
            req.flash('alertMessage', `Success create new bank!`);
            req.flash('alertStatus', 'success');

            res.redirect('/bank');
          } else {
            req.flash(
              'alertMessage',
              `Error Occurred: Failed create new bank!`
            );
            req.flash('alertStatus', 'danger');

            res.redirect('/bank');
          }
        } else {
          req.flash(
            'alertMessage',
            `Error Occurred: Please select the correct bank name`
          );
          req.flash('alertStatus', 'danger');
          console.log(error);

          res.redirect('/bank');
        }
      }
    } catch (error) {
      req.flash('alertMessage', `Error Occurred: ${error.message}`);
      req.flash('alertStatus', 'danger');
      console.log(error);

      res.redirect('/bank');
    }
  },
  renderEditBankPage: async (req, res) => {
    try {
      const { id } = req.params;
      const bankData = await BankModel.findOne({
        _id: id,
      });

      const alertMessage = req.flash('alertMessage');
      const alertStatus = req.flash('alertStatus');
      const alertData = { message: alertMessage, status: alertStatus };

      if (!!bankData) {
        res.render('admin/bank/edit_bank', {
          bankData,
          bankNameConstant,
          alertData,
        });
      } else {
        req.flash('alertMessage', `Error Occurred: Bank data not found!`);
        req.flash('alertStatus', 'danger');

        res.redirect('/bank');
      }
    } catch (error) {
      req.flash('alertMessage', `Error Occurred: ${error.message}`);
      req.flash('alertStatus', 'danger');
      console.log(error);

      res.redirect('/bank');
    }
  },
  editBank: async (req, res) => {
    try {
      const { id } = req.params;
      const findBankById = await BankModel.findOne({
        _id: id,
      });

      if (!!findBankById) {
        const { card_holder_name, bank_name, card_number } = req.body;

        if (
          !!card_holder_name.trim().length &&
          !!bank_name &&
          !!card_number.trim().length
        ) {
          const updatedData = await BankModel.findOneAndUpdate(
            {
              _id: id,
            },
            {
              cardHolderName: card_holder_name,
              cardNumber: card_number,
              bankName: bank_name,
            }
          );

          if (!!updatedData) {
            req.flash('alertMessage', `Success edit bank!`);
            req.flash('alertStatus', 'success');

            res.redirect('/bank');
          } else {
            req.flash(
              'alertMessage',
              `Error Occurred: Failed to update bank data!`
            );
            req.flash('alertStatus', 'danger');
            console.log(error);

            res.redirect('/bank');
          }
        } else {
          req.flash(
            'alertMessage',
            `Error Occurred: Make sure fill all the fields!`
          );
          req.flash('alertStatus', 'danger');
          console.log(error);

          res.redirect('/bank');
        }
      } else {
        req.flash('alertMessage', `Error Occurred: Bank not found!`);
        req.flash('alertStatus', 'danger');
        console.log(error);

        res.redirect('/bank');
      }
    } catch (error) {
      req.flash('alertMessage', `Error Occurred: ${error.message}`);
      req.flash('alertStatus', 'danger');
      console.log(error);

      res.redirect('/bank');
    }
  },
  deleteBank: async (req, res) => {
    try {
      const { id } = req.params;
      const deletedBankData = await BankModel.findOneAndRemove({
        _id: id,
      });

      if (!!deletedBankData) {
        req.flash('alertMessage', `Success delete bank!`);
        req.flash('alertStatus', 'success');

        res.redirect('/bank');
      } else {
        req.flash('alertMessage', `Error Occurred: Failed delete bank data!`);
        req.flash('alertStatus', 'danger');
        console.log(error);

        res.redirect('/bank');
      }
    } catch (error) {
      req.flash('alertMessage', `Error Occurred: ${error.message}`);
      req.flash('alertStatus', 'danger');
      console.log(error);

      res.redirect('/bank');
    }
  },
};
