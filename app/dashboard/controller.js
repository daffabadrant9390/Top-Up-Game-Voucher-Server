const TransactionModel = require('../transaction/model');
const VoucherModel = require('../voucher/model');
const PlayerModel = require('../player/model');
const CategoryModel = require('../category/model');

module.exports = {
  index: async (req, res) => {
    try {
      const { name } = req.session.user || {};

      const totalTransaction = await TransactionModel.countDocuments();
      const totalVoucher = await VoucherModel.countDocuments();
      const totalPlayer = await PlayerModel.countDocuments();
      const totalCategory = await CategoryModel.countDocuments();

      res.render('admin/dashboard/view_dashboard', {
        title: 'Dashboard Page',
        name: name || '',
        totalData: {
          totalTransaction,
          totalVoucher,
          totalPlayer,
          totalCategory,
        },
      });
    } catch (e) {
      console.error(e);
    }
  },
};
