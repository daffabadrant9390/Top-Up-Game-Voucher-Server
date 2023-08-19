const TransactionModel = require('./model');

module.exports = {
  index: async (req, res) => {
    try {
      const { name } = req.session.user || {};

      // Get the transactionData from Transaction collection in mongoDB
      const transactionData = await TransactionModel.find().populate(
        'playerData'
      );

      const alertMessage = req.flash('alertMessage');
      const alertStatus = req.flash('alertStatus');
      const alertData = {
        message: alertMessage,
        status: alertStatus,
      };

      res.render('admin/transaction/view_transaction', {
        transactionData,
        alertData,
        title: 'Transaction Page',
        name: name || '',
      });
    } catch (error) {
      req.flash('alertMessage', `Error Occurred: ${error.message}`);
      req.flash('alertStatus', 'danger');
      console.log(error);

      res.redirect('/transaction');
    }
  },
  updateTransactionStatus: async (req, res) => {
    try {
      // Grab the transaction ID from params
      const { id } = req.params || {};
      // Grab the status from query parameter on the URL
      const { status } = req.query || {};

      console.log('New Status: ', status);

      const updatedTransactionData = await TransactionModel.findOneAndUpdate(
        {
          _id: id,
        },
        {
          transactionStatus: status,
        }
      );
      console.log('updatedTransactionData: ', updatedTransactionData);

      if (!!updatedTransactionData) {
        req.flash('alertMessage', `Successfully update the transaction status`);
        req.flash('alertStatus', 'success');

        res.redirect('/transaction');
      } else {
        req.flash('alertMessage', `Failed update the transaction status`);
        req.flash('alertStatus', 'danger');

        res.redirect('/transaction');
      }
    } catch (error) {
      req.flash('alertMessage', `Error Occurred: ${error.message}`);
      req.flash('alertStatus', 'danger');
      console.log(error);

      res.redirect('/transaction');
    }
  },
};
