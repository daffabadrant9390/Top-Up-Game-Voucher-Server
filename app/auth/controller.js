const PlayerModel = require('../player/model');

// Adding image filename purposes
const path = require('path');
const fs = require('fs');
const config = require('../../config');
const os = require('os');
const bcrypt = require('bcryptjs');
const jwtToken = require('jsonwebtoken');

module.exports = {
  signUp: async (req, res, next) => {
    try {
      // Get all the payload which user fills from the req.body
      const payload = req.body || {};
      console.log('payload: ', payload);
      console.log('req file: ', req.file);
      console.log('temp dir : ', os.tmpdir());

      if (!!req.file) {
        console.log('HELLO WORLD');
        let tmp_path = req.file.path;
        let originalFileExtension =
          req.file.originalname.split('.')[
            req.file.originalname.split('.').length - 1
          ];
        let finalFileName = req.file.filename + '.' + originalFileExtension;

        // Define the path where we will save the uploaded file by user
        let target_path = path.resolve(
          config.rootPath,
          `public/uploads/${finalFileName}`
        );

        const src = fs.createReadStream(tmp_path);
        const destination = fs.createWriteStream(target_path);
        src.pipe(destination);

        src.on('end', async () => {
          try {
            // add new player into players collection with the payload sent by the user. but overwrite the avatar with the formatted fileName
            const newPlayer = new PlayerModel({
              ...payload,
              avatar: finalFileName,
            });
            await newPlayer.save();

            delete newPlayer._doc.password;

            if (!!newPlayer) {
              res.status(201).json({
                message: ' Successfully add new player',
                data: newPlayer,
              });
            } else {
              res.status(422).json({
                message: 'Failed add new player',
              });
            }
          } catch (err) {
            if (!!err && err.name === 'validationError') {
              return res.status(422).json({
                error: 1,
                message: err.message || 'Error occurred',
                fields: err.errors,
              });
            }
            next(err);
          }
        });
      } else {
        // Add new auth without file
        // const newPlayer = await PlayerModel.create(payload);
        const newPlayer = new PlayerModel(payload);
        await newPlayer.save();

        // Delete the password from response to avoid user see their password
        delete newPlayer._doc.password;

        if (!!newPlayer) {
          res.status(201).json({
            message: ' Successfully add new player',
            data: newPlayer,
          });
        } else {
          res.status(422).json({
            message: 'Failed add new player',
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
      next(err);
    }
  },
  signIn: async (req, res, next) => {
    try {
      // Get the inputted email and password from the user
      const { email, password } = req.body || {};
      console.log('req body sign in : ', req.body);

      // Check if the email already exist or not
      PlayerModel.findOne({ email: email })
        .then((player) => {
          const {
            id,
            name,
            username,
            phoneNumber,
            avatar,
            password: playerPassword,
          } = player || {};

          // Check if the password is correct or not using bcryptjs
          const validatePassword = bcrypt.compareSync(password, playerPassword);

          if (validatePassword) {
            // Create jwt token from the player data
            const token = jwtToken.sign(
              {
                player: {
                  id,
                  name,
                  username,
                  phoneNumber,
                  avatar,
                },
              },
              config.jwtKey
            );

            res.status(200).json({
              data: { token },
              message: 'Sign in success!',
            });
          } else {
            res.status(404).json({
              message:
                'Wrong password, please try again with different password!',
            });
          }
        })
        .catch((err) => {
          res.status(404).json({
            message: err.message || 'Email not registered!',
          });
        });
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
};
