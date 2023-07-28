const PaymentModel = require('./model');
const BankModel = require('../bank/model');
const { paymentTypeConstant } = require('./constant');
const { STATUS } = require('../constant');

module.exports = {
  index: async (req, res) => {
    try {
      const { name } = req.session.user || {};

      const paymentData = await PaymentModel.find().populate('banksData');

      const alertMessage = req.flash('alertMessage');
      const alertStatus = req.flash('alertStatus');
      const alertData = {
        message: alertMessage,
        status: alertStatus,
      };

      res.render('admin/payment/view_payment', {
        paymentData,
        alertData,
        title: 'Payment Page',
        name: name || '',
      });
    } catch (error) {
      req.flash('alertMessage', `Error Occurred: ${error.message}`);
      req.flash('alertStatus', 'danger');
      console.log(error);

      res.redirect('/payment');
    }
  },
  renderCreatePaymentPage: async (req, res) => {
    try {
      const { name } = req.session.user || {};

      const banksData = await BankModel.find();
      res.render('admin/payment/create_payment', {
        banksData,
        paymentTypeConstant,
        STATUS,
        title: 'Create Payment Page',
        name: name || '',
      });
    } catch (error) {
      req.flash('alertMessage', `Error Occurred: ${error.message}`);
      req.flash('alertStatus', 'danger');
      console.log(error);

      res.redirect('/payment');
    }
  },
  createPayment: async (req, res) => {
    try {
      const { payment_type, bank_data, payment_status } = req.body;
      console.log('payment request body: ', req.body);

      if (
        !!payment_type.trim().length &&
        !!bank_data.trim().length &&
        payment_status.trim().length
      ) {
        const newPaymentData = await PaymentModel.create({
          paymentType: payment_type,
          banksData: bank_data,
          status: payment_status,
        });
        if (!!newPaymentData) {
          req.flash('alertMessage', 'Success create new payment!');
          req.flash('alertStatus', 'success');
          res.redirect('/payment');
        }
      } else {
        req.flash('alertMessage', `Error Occurred: Field cant be empty!`);
        req.flash('alertStatus', 'danger');
        console.log(error);

        res.redirect('/payment');
      }
    } catch (error) {
      req.flash('alertMessage', `Error Occurred: ${error.message}`);
      req.flash('alertStatus', 'danger');
      console.log(error);

      res.redirect('/payment');
    }
  },
  renderEditPaymentPage: async (req, res) => {
    try {
      const { name } = req.session.user || {};

      const { id } = req.params;
      const paymentData = await PaymentModel.findOne({ _id: id }).populate(
        'banksData'
      );
      const banksData = await BankModel.find();

      if (!!paymentData) {
        res.render('admin/payment/edit_payment', {
          paymentData,
          STATUS,
          banksData,
          paymentTypeConstant,
          title: 'Edit Payment Page',
          name: name || '',
        });
      } else {
        req.flash('alertMessage', `Error Occurred: Payment data is not found!`);
        req.flash('alertStatus', 'danger');
        console.log(error);

        res.redirect('/payment');
      }
    } catch (error) {
      req.flash('alertMessage', `Error Occurred: ${error.message}`);
      req.flash('alertStatus', 'danger');
      console.log(error);

      res.redirect('/payment');
    }
  },
  editPayment: async (req, res) => {
    try {
      const { id } = req.params;
      const findPaymentDataById = await PaymentModel.findOne({ _id: id });

      if (!!findPaymentDataById) {
        const { payment_type, bank_data, payment_status } = req.body;
        console.log('payment request body: ', req.body);

        if (
          !!payment_type.trim().length &&
          !!bank_data.trim().length &&
          payment_status.trim().length
        ) {
          const updatedPaymentData = await PaymentModel.findOneAndUpdate(
            {
              _id: id,
            },
            {
              paymentType: payment_type,
              banksData: bank_data,
              status: payment_status,
            }
          );

          if (!!updatedPaymentData) {
            req.flash('alertMessage', 'Success create new payment!');
            req.flash('alertStatus', 'success');
            res.redirect('/payment');
          } else {
            req.flash(
              'alertMessage',
              `Error Occurred: Failed edit payment data!`
            );
            req.flash('alertStatus', 'danger');
            console.log(error);
          }
        } else {
          req.flash('alertMessage', `Error Occurred: Field cant be empty!`);
          req.flash('alertStatus', 'danger');
          console.log(error);
        }
      } else {
        req.flash('alertMessage', `Error Occurred: Payment data is not found!`);
        req.flash('alertStatus', 'danger');
        console.log(error);

        res.redirect('/payment');
      }
    } catch (error) {
      req.flash('alertMessage', `Error Occurred: ${error.message}`);
      req.flash('alertStatus', 'danger');
      console.log(error);

      res.redirect('/payment');
    }
  },
  deletePayment: async (req, res) => {
    try {
      const { id } = req.params;
      const deletedPaymentData = await PaymentModel.findOneAndRemove({
        _id: id,
      });
      if (!!deletedPaymentData) {
        req.flash('alertMessage', 'Success delete payment!');
        req.flash('alertStatus', 'success');
        res.redirect('/payment');
      } else {
        req.flash(
          'alertMessage',
          `Error Occurred: Failed delete payment data!`
        );
        req.flash('alertStatus', 'danger');
        console.log(error);

        res.redirect('/payment');
      }
    } catch (error) {
      req.flash('alertMessage', `Error Occurred: ${error.message}`);
      req.flash('alertStatus', 'danger');
      console.log(error);

      res.redirect('/payment');
    }
  },
};
