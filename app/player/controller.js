const PlayerModel = require('./model');
const VoucherModel = require('../voucher/model');
const CategoryModel = require('../category/model');
const NominalModel = require('../nominal/model');
const BankModel = require('../bank/model');
const PaymentModel = require('../payment/model');
const TransactionModel = require('../transaction/model');
const path = require('path');
const fs = require('fs');
const config = require('../../config');

module.exports = {
  landingPage: async (req, res) => {
    try {
      const voucherData = await VoucherModel.find()
        .select('_id gameName status categoryData imageThumbnail')
        .populate('categoryData');
      console.log('Hello World from Landing Page');

      if (!!voucherData && !!voucherData.length) {
        res.status(200).json({
          data: voucherData,
          message: 'Vouchers data found successfully.!',
        });
      } else {
        res.json(404).json({
          message: 'Vouchers data is not found!',
        });
      }
    } catch (error) {
      res.status(500).json({
        message: error.message || 'Internal server error',
      });
    }
  },
  detailPage: async (req, res) => {
    try {
      // Get the id from req.params
      const { id } = req.params || {};
      /*
        Get the voucherData based on the ID on req.params
          - populate the categoryData
          - populate the nominalsData
          - populate the userData, and only return _id, name, and phoneNumber fields as the API response
      */
      const voucherData = await VoucherModel.findOne({ _id: id })
        .populate('categoryData')
        .populate('nominalsData')
        .populate('userData', '_id name phoneNumber');

      if (!!voucherData) {
        res.status(200).json({
          data: voucherData,
          message: 'Voucher data found successfully.!',
        });
      } else {
        res.status(404).json({
          message: 'Voucher data is not found!',
        });
      }
    } catch (error) {
      res.status(500).json({
        message: error.message || 'Internal server error',
      });
    }
  },
  getAllCategory: async (req, res, next) => {
    try {
      const categoryData = await CategoryModel.find();

      if (!!categoryData) {
        res.status(200).json({
          message: 'Category data found',
          data: categoryData,
        });
      } else {
        res.status(404).json({
          message: 'Category data not found!',
        });
      }
    } catch (err) {
      if (!!err && err.name === 'validationError') {
        res.status(422).json({
          error: 1,
          message: err.message || 'Error occurred',
          fields: err.errors,
        });
      }
      next();
    }
  },
  checkout: async (req, res, next) => {
    try {
      // const {
      //   name: buyerName,
      //   accountUser,
      //   nominal,
      //   voucher,
      //   payment,
      //   bank,
      // } = req.body || {};
      const {
        name: buyerName,
        voucher,
        nominal,
        payment,
        accountUser,
        bank,
      } = req.body || {};

      // Get voucher based on id from req.body
      const voucherData = await VoucherModel.findOne({ _id: voucher })
        .select('_id gameName categoryData userData imageThumbnail')
        .populate('userData')
        .populate('categoryData');
      if (!voucherData)
        return res.status(404).json({ message: 'Voucher not found!' });
      // Get nominal based on id from req.body
      const nominalData = await NominalModel.findOne({ _id: nominal });
      if (!nominalData)
        return res.status(404).json({ message: 'Nominal not found!' });
      // Get bank based on id from req.body
      const bankData = await BankModel.findOne({ _id: bank });
      if (!bankData)
        return res.status(404).json({ message: 'Bank not found!' });
      // Get payment based on id from req.body
      const paymentData = await PaymentModel.findOne({ _id: payment });
      if (!paymentData)
        return res.status(404).json({ message: 'Payment not found!' });

      const tax = nominalData._doc.price * 0.1; // Tax : 10% from price
      const priceAfterTax = nominalData._doc.price - tax;

      // Prepare the payload to create new Transaction based on the data above
      const transactionPayload = {
        historyVoucherTopup: {
          gameName: voucherData._doc.gameName,
          category: voucherData._doc.categoryData
            ? voucherData._doc.categoryData.name
            : '',
          imageThumbnail: voucherData._doc.imageThumbnail,
          coinName: nominalData._doc.coinType,
          cointQuantity: nominalData._doc.coinQuantity,
          price: nominalData._doc.price,
        },
        historyPayment: {
          name: bankData._doc.cardHolderName,
          type: paymentData._doc.paymentType,
          bankName: bankData._doc.bankName,
          accountNumber: bankData._doc.cardNumber,
        },
        buyerName: buyerName ?? '',
        accountUser: accountUser,
        tax: tax,
        finalPrice: priceAfterTax,
        playerData: req.player._id,
        historyUser: {
          name: voucherData._doc.userData?.name,
          phoneNumber: voucherData._doc.userData?.phoneNumber,
        },
        categoryData: voucherData._doc.categoryData?._id,
        userData: voucherData._doc.userData?._id,
      };

      const newTransaction = new TransactionModel(transactionPayload);
      await newTransaction.save();

      res.status(200).json({
        message: 'Success create new transaction!',
        data: transactionPayload,
      });
    } catch (err) {
      if (!!err && err.name === 'validationError') {
        res.status(422).json({
          error: 1,
          message: err.message || 'Error occurred',
          fields: err.errors,
        });
      }
      next();
    }
  },
  getHistoryTransactionByStatus: async (req, res) => {
    try {
      // Get status from req.body. If not sent, set the default value as empty string
      const { status = '' } = req.query || {};
      const loginPlayerId = req.player?._id || '';

      let transactionCriteria = {};

      if (!!status) {
        transactionCriteria = {
          ...transactionCriteria,
          transactionStatus: {
            $regex: `${(status || '').toUpperCase()}`,
            $options: 'i',
          },
        };
      }

      if (!!loginPlayerId) {
        transactionCriteria = {
          ...transactionCriteria,
          playerData: loginPlayerId,
        };
      }

      const historyTransactionPlayer = await TransactionModel.find(
        transactionCriteria
      );

      // Get total price from SUM of finalPrice field of all transaction data that match with transactionCriteria
      const totalFinalPrice = await TransactionModel.aggregate([
        { $match: transactionCriteria },
        {
          $group: {
            _id: null,
            finalPrice: { $sum: '$finalPrice' },
          },
        },
      ]);

      res.status(200).json({
        message:
          !!historyTransactionPlayer && !!historyTransactionPlayer.length
            ? 'Transaction data found!'
            : 'Transaction data not found!',
        data: historyTransactionPlayer,
        totalPrice:
          !!totalFinalPrice && !!totalFinalPrice.length
            ? totalFinalPrice[0]?.finalPrice || 0
            : 0,
      });
    } catch (err) {
      res.status(500).json({
        error: err.message || 'Internal server error!',
      });
    }
  },
  getDetailHistoryTransactionById: async (req, res) => {
    try {
      const { id } = req.params || {};
      const transactionData = await TransactionModel.findOne({ _id: id });

      if (!transactionData)
        return res
          .status(404)
          .json({ message: 'Transaction data is not found!' });
      res.status(200).json({
        message: 'Transacation data is found!',
        data: transactionData,
      });
    } catch (err) {
      res.status(500).json({
        error: err.message || 'Internal server error',
      });
    }
  },
  getPlayerOverview: async (req, res) => {
    try {
      const loginPlayerId = req.player?._id || '';

      /* 
        Top up categories section
          - Get the total finalPrice per each category from transactionModel
          - Get all Category data. Check if the _id inside totalFinalPricePerCategory same as Category _id, ass "name" field inside totalFinalPricePerCategory  
      */
      const totalFinalPricePerCategory = await TransactionModel.aggregate([
        { $match: { playerData: loginPlayerId } },
        {
          $group: {
            _id: '$categoryData',
            totalFinalPrice: { $sum: '$finalPrice' },
          },
        },
      ]);
      const categoryData = await CategoryModel.find();
      (categoryData || []).forEach((category) => {
        (totalFinalPricePerCategory || []).forEach((data) => {
          if ((data._id || '').toString() === (category._id || '').toString()) {
            // Add "name" field indicating as category name
            data.name = category.name || '';
          }
        });
      });

      // Latest Transaction section
      const latestHistoryTransactions = await TransactionModel.find({
        playerData: loginPlayerId,
      })
        .populate('categoryData')
        .sort({ updatedAt: -1 }); // Sort descending to get the latest transaction history

      if (
        !totalFinalPricePerCategory.length &&
        !latestHistoryTransactions.length
      ) {
        return res.status(404).json({
          message: 'Data overview not found!',
        });
      } else {
        res.status(200).json({
          data: latestHistoryTransactions,
          totalFinalPricePerCategory,
        });
      }
    } catch (err) {
      res.status(500).json({
        error: err.message || 'Internal server error',
      });
    }
  },
  getPlayerProfile: async (req, res) => {
    try {
      // Get the playerData from req.player
      const {
        _id: playerId,
        email,
        phoneNumber,
        username,
        name,
        avatar,
      } = req.player || {};
      const player = {
        id: playerId || '',
        email: email || '',
        phoneNumber: phoneNumber || '',
        username: username || '',
        name: name || '',
        avatar: avatar || '',
      };

      res.status(200).json({
        data: player,
      });
    } catch (err) {
      res.status(500).json({
        error: err.message || 'Internal server error',
      });
    }
  },
  editPlayerProfile: async (req, res, next) => {
    try {
      const { name, email, phoneNumber } = req.body || {};
      const loginPlayerId = req.player?._id || '';

      const editProfilePayload = {
        ...(name ? { name } : {}),
        ...(email ? { email } : {}),
        ...(phoneNumber ? { phoneNumber } : {}),
      };

      if (!!req.file) {
        let tmp_path = req.file.path;
        let originalFileExtension =
          req.file.originalname.split('.')[
            req.file.originalname.split('.').length - 1
          ];
        let finalFilename = req.file.filename + '.' + originalFileExtension;

        // Define the path where we will save the uploaded file by user
        let target_path = path.resolve(
          config.rootPath,
          `public/uploads/${finalFilename}`
        );

        const src = fs.createReadStream(tmp_path);
        const destination = fs.createWriteStream(target_path);
        src.pipe(destination);

        src.on('end', async () => {
          let playerData = await PlayerModel.findOne({ _id: loginPlayerId });

          //* If the updated image is already exist on our local, remove the existed one and replace with the new one
          const voucherCurrentImagePath = `${config.rootPath}/public/uploads/${playerData.avatar}`;
          if (fs.existsSync(voucherCurrentImagePath)) {
            fs.unlinkSync(voucherCurrentImagePath);
          }

          playerData = await PlayerModel.findOneAndUpdate(
            {
              _id: loginPlayerId,
            },
            {
              ...editProfilePayload,
              avatar: finalFilename,
            },
            {
              new: true,
            }
          );
          res.status(200).json({
            message: 'Update data successfully',
            data: {
              id: playerData._id,
              name: playerData.name,
              email: playerData.email,
              phoneNumber: playerData.phoneNumber,
              avatar: playerData.avatar,
            },
          });
        });

        src.on('err', async () => {
          next(err);
        });
      } else {
        const updatedPlayerData = await PlayerModel.findOneAndUpdate(
          { _id: loginPlayerId },
          editProfilePayload
          //TODO: Currently commented because lead to 404 error
          // { runValidators: true }
        );

        if (!!updatedPlayerData) {
          res.status(200).json({
            message: 'Update data successfully',
            data: {
              id: updatedPlayerData._id,
              name: updatedPlayerData.name,
              email: updatedPlayerData.email,
              phoneNumber: updatedPlayerData.phoneNumber,
              avatar: updatedPlayerData.avatar,
            },
          });
        } else {
          res.status(422).json({
            message: 'Failed update player data',
          });
        }
      }
    } catch (err) {
      if (!!err && err.name === 'validationError') {
        return res.status(422).json({
          error: 1,
          message: err.message || 'Error occurred',
          fields: err.errors,
        });
      }
      next();
    }
  },
  //? Commented first until it used
  // index: async (req, res) => {
  //   try {
  //     const { name } = req.session.user || '';

  //     const playerData = await PlayerModel.find();

  //     const alertMessage = req.flash('alertMessage');
  //     const alertStatus = req.flash('alertStatus');
  //     const alertData = {
  //       message: alertMessage,
  //       status: alertStatus,
  //     };

  //     res.render('admin/player/view_player', {
  //       title: 'Player Page',
  //       name,
  //       alertData,
  //       playerData,
  //     });
  //   } catch (error) {
  //     req.flash('alertMessage', `Error Occurred: ${error.message}`);
  //     req.flash('alertStatus', 'danger');
  //     console.log(error);

  //     res.redirect('/player');
  //   }
  // },
  // updateStatus: async (req, res) => {
  //   try {
  //     const { id } = req.params || {};
  //     const { status } = req.query || {};

  //     const updatedPlayerData = await PlayerModel.findOneAndUpdate(
  //       {
  //         _id: id,
  //       },
  //       {
  //         status: status === 'enabled' ? 'ACTIVE' : 'NON_ACTIVE',
  //       }
  //     );

  //     if (!!updatedPlayerData) {
  //       req.flash('alertMessage', `Successfully update the player status`);
  //       req.flash('alertStatus', 'success');

  //       res.redirect('/player');
  //     } else {
  //       req.flash('alertMessage', `Failed update the player status`);
  //       req.flash('alertStatus', 'danger');

  //       res.redirect('/player');
  //     }
  //   } catch (error) {
  //     req.flash('alertMessage', `Error Occurred: ${error.message}`);
  //     req.flash('alertStatus', 'danger');
  //     console.log(error);

  //     res.redirect('/player');
  //   }
  // },
};
