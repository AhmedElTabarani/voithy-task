const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');
const { sendSuccess } = require('../utils/sendResponse');
const isPasswordChangeAfterJWTTimestamp = require('../utils/isPasswordChangeAfterJWTTimestamp');
const isCorrectPassword = require('../utils/isCorrectPassword');
const asyncHandler = require('../utils/asyncHandler');

const generateToken = (id) => {
  return jwt.sign({ _id: id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });
};

const createAndSendToken = (user, statusCode, res) => {
  const token = generateToken(user._id);

  user.password = undefined;
  sendSuccess(user, statusCode, res, { token });
};

class AuthController {
  getMe(req, res, next) {
    req.params.id = req.user._id;
    next();
  }
  auth = (model) =>
    asyncHandler(async (req, res, next) => {
      let token;
      const { authorization } = req.headers;

      if (authorization && authorization.startsWith('Bearer'))
        token = authorization.split(' ')[1];
      else
        return next(
          new AppError('Access denied, No token provided', 401)
        );

      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

      // check if user not exists
      const checkUser = await model.findById(decoded._id);

      if (!checkUser)
        return next(
          new AppError(
            `There is no ${model.modelName} with this token, Please login as ${model.modelName}`,
            403
          )
        );

      // check if user change his password after token created
      if (
        isPasswordChangeAfterJWTTimestamp(
          checkUser.passwordChangedAt,
          decoded.iat
        )
      ) {
        return next(
          new AppError(
            'This user changed his password, Please login again',
            401
          )
        );
      }

      req.user = checkUser;
      next();
    });

  login = (Model) =>
    asyncHandler(async (req, res, next) => {
      const { email, password } = req.body;
      const user = await Model.findOne({ email }).select('+password');
      if (
        !user ||
        !(await isCorrectPassword(password, user.password))
      ) {
        return next(
          new AppError('Email or password is incorrect', 401)
        );
      }

      createAndSendToken(user, 200, res);
    });

  signup = (Model) =>
    asyncHandler(async (req, res, next) => {
      const user = await Model.create(req.body);
      createAndSendToken(user, 200, res);
    });

  updatePassword = (Model) =>
    asyncHandler(async (req, res, next) => {
      const user = await Model.findById(req.user._id).select(
        '+password'
      );
      if (
        !user ||
        !(await isCorrectPassword(
          req.body.oldPassword,
          user.password
        ))
      )
        return next(new AppError('Incorrect password', 401));

      const doc = await Model.findByIdAndUpdate(
        req.user._id,
        {
          password: req.body.newPassword,
        },
        {
          new: true,
        }
      );

      sendSuccess(doc, 200, res);
    });
}

module.exports = new AuthController();
