const VoucherModel = require('./model');
const CategoryModel = require('../category/model');
const NominalModel = require('../nominal/model');
const path = require('path');
const fs = require('fs');
const config = require('../../config');
const voucherStatusEnum = require('./constant');

module.exports = {
  index: async (req, res) => {
    try {
      const { name } = req.session.user || {};
      const alertMessage = req.flash('alertMessage');
      const alertStatus = req.flash('alertStatus');
      const alertData = { message: alertMessage, status: alertStatus };

      const voucherData = await VoucherModel.find()
        .populate('nominals')
        .populate('category');

      res.render('admin/voucher/view_voucher', {
        alertData,
        voucherData,
        title: 'Voucher Page',
        name: name || '',
      });
    } catch (error) {
      req.flash('alertMessage', `Error Occurred: ${error.message}`);
      req.flash('alertStatus', 'danger');
      console.log(error);

      res.redirect('/voucher');
    }
  },
  renderCreateVoucherPage: async (req, res) => {
    try {
      const { name } = req.session.user || {};

      const categoryData = await CategoryModel.find();
      const nominalData = await NominalModel.find();
      res.render('admin/voucher/create_voucher', {
        categoryData,
        nominalData,
        voucherStatusEnum,
        title: 'Create Voucher Page',
        name: name || '',
      });
    } catch (error) {
      req.flash('alertMessage', `Error Occurred: ${error.message}`);
      req.flash('alertStatus', 'danger');
      console.log(error);

      res.redirect('/voucher');
    }
  },
  createVoucher: async (req, res) => {
    try {
      const {
        game_name,
        category_name,
        nominal_data,
        voucher_status,
        img_thumbnail,
      } = req.body;
      console.log('req.body: ', req.body);

      // If there is file changed inside req
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
          try {
            const newVoucher = await VoucherModel.create({
              gameName: game_name,
              category: category_name,
              nominals: nominal_data,
              voucherStatus: voucher_status,
              imageThumbnail: finalFilename,
            });

            if (!!newVoucher) {
              req.flash('alertMessage', 'Success create new voucher!');
              req.flash('alertStatus', 'success');
              res.redirect('/voucher');
            } else {
              req.flash(
                'alertMessage',
                `Error Occurred: Failed create new voucher!`
              );
              req.flash('alertStatus', 'danger');
              console.log(error);

              res.redirect('/voucher');
            }
          } catch (error) {
            req.flash('alertMessage', `Error Occurred: ${error.message}`);
            req.flash('alertStatus', 'danger');
            console.log(error);

            res.redirect('/voucher');
          }
        });
      } else {
        // If there is no file changed inside req (not change the image thumbnail)
        const newVoucher = await VoucherModel.create({
          gameName: game_name,
          category: category_name,
          nominals: nominal_data,
          voucherStatus: voucher_status,
        });

        if (!!newVoucher) {
          req.flash('alertMessage', 'Success create new voucher!');
          req.flash('alertStatus', 'success');
          res.redirect('/voucher');
        } else {
          req.flash(
            'alertMessage',
            `Error Occurred: Failed create new voucher!`
          );
          req.flash('alertStatus', 'danger');
          console.log(error);

          res.redirect('/voucher');
        }
      }
    } catch (error) {
      req.flash('alertMessage', `Error Occurred: ${error.message}`);
      req.flash('alertStatus', 'danger');
      console.log(error);

      res.redirect('/voucher');
    }
  },
  renderEditVoucherPage: async (req, res) => {
    try {
      const { name } = req.session.user || {};

      const { id } = req.params;

      const nominalData = await NominalModel.find();
      const categoryData = await CategoryModel.find();
      const voucherData = await VoucherModel.findOne({
        _id: id,
      })
        .populate('nominals')
        .populate('category');

      console.log('voucherData edit: ', voucherData);
      if (!!voucherData) {
        res.render('admin/voucher/edit_voucher', {
          nominalData,
          categoryData,
          voucherData,
          voucherStatusEnum,
          title: 'Edit Voucher Page',
          name: name || '',
        });
      } else {
        req.flash(
          'alertMessage',
          `Error Occurred: Voucher with id is not found!`
        );
        req.flash('alertStatus', 'danger');
        console.log(error);

        res.redirect('/voucher');
      }
    } catch (error) {
      req.flash('alertMessage', `Error Occurred: ${error.message}`);
      req.flash('alertStatus', 'danger');
      console.log(error);

      res.redirect('/voucher');
    }
  },
  editVoucher: async (req, res) => {
    try {
      const { id } = req.params;
      const {
        game_name,
        category_name,
        nominal_data,
        img_thumbnail,
        voucher_status,
      } = req.body;
      const isVoucherExistById = await VoucherModel.findOne({
        _id: id,
      });

      if (isVoucherExistById) {
        // If there is file changed inside req
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
            try {
              //* If the updated image is already exist on our local, remove the existed one and replace with the new one
              const voucherCurrentImagePath = `${config.rootPath}/public/uploads/${isVoucherExistById.imageThumbnail}`;
              if (fs.existsSync(voucherCurrentImagePath)) {
                fs.unlinkSync(voucherCurrentImagePath);
              }

              const updatedVoucher = await VoucherModel.findOneAndUpdate(
                {
                  _id: id,
                },
                {
                  gameName: game_name,
                  category: category_name,
                  nominals: nominal_data,
                  voucherStatus: voucher_status,
                  imageThumbnail: finalFilename,
                }
              );

              if (!!updatedVoucher) {
                req.flash('alertMessage', 'Success edit voucher!');
                req.flash('alertStatus', 'success');
                res.redirect('/voucher');
              } else {
                req.flash(
                  'alertMessage',
                  `Error Occurred: Failed edit voucher voucher!`
                );
                req.flash('alertStatus', 'danger');
                console.log(error);

                res.redirect('/voucher');
              }
            } catch (error) {
              req.flash('alertMessage', `Error Occurred: ${error.message}`);
              req.flash('alertStatus', 'danger');
              console.log(error);

              res.redirect('/voucher');
            }
          });
        } else {
          // If there is no file changed inside req (not change the image thumbnail)
          const updatedVoucher = await VoucherModel.findOneAndUpdate(
            {
              _id: id,
            },
            {
              gameName: game_name,
              category: category_name,
              nominals: nominal_data,
              voucherStatus: voucher_status,
            }
          );

          if (!!updatedVoucher) {
            req.flash('alertMessage', 'Success edit voucher!');
            req.flash('alertStatus', 'success');
            res.redirect('/voucher');
          } else {
            req.flash('alertMessage', `Error Occurred: Failed edit voucher!`);
            req.flash('alertStatus', 'danger');
            console.log(error);

            res.redirect('/voucher');
          }
        }
      } else {
        req.flash(
          'alertMessage',
          `Error Occurred: Voucher with that id is not found`
        );
        req.flash('alertStatus', 'danger');
        console.log(error);

        res.redirect('/voucher');
      }
    } catch (error) {
      req.flash('alertMessage', `Error Occurred: ${error.message}`);
      req.flash('alertStatus', 'danger');
      console.log(error);

      res.redirect('/voucher');
    }
  },
  deleteVoucher: async (req, res) => {
    try {
      const { id } = req.params;
      const deletedVoucherData = await VoucherModel.findOneAndDelete({
        _id: id,
      });

      if (!!deletedVoucherData) {
        req.flash('alertMessage', 'Success delete voucher!');
        req.flash('alertStatus', 'success');
        res.redirect('/voucher');
      } else {
        req.flash('alertMessage', `Error Occurred: Failed delete voucher!`);
        req.flash('alertStatus', 'danger');
        console.log(error);

        res.redirect('/voucher');
      }
    } catch (error) {
      req.flash('alertMessage', `Error Occurred: ${error.message}`);
      req.flash('alertStatus', 'danger');
      console.log(error);

      res.redirect('/voucher');
    }
  },
};
