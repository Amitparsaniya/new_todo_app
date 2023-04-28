const { isValidObjectId } = require("mongoose");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { errormessages } = require("../utils/errormessages");
const { sendError } = require("../utils/helper");
const statusCode = require("../utils/statuscode");

exports.isvalipasswordresettoken = async (req, res, next) => {
  const { userId, token } = req.body;

  if (!isValidObjectId(userId) || !token.trim()) {
    return sendError(res, errormessages.INVALID_REQUEST, statusCode.ERRORCODE);
  }

  const user = await User.findById(userId);

  if (!user) {
    return sendError(
      res,
      errormessages.UNAUTHORIZED_ACCESS,
      statusCode.ERRORCODE
    );
  }

  const matched = await user.comparetoken(token);

  if (!matched) {
    return sendError(
      res,
      errormessages.UNAUTHORIZED_ACCESS,
      statusCode.ERRORCODE
    );
  }

  req.resettoken = user;
  next();
};

exports.isAuth = async (req, res, next) => {
  try {
    const token = req.headers?.authorization;
    if (!token) {
      return sendError(
        res,
        errormessages.UNAUTHORIZED_ACCESS,
        statusCode.ERRORCODE
      );
    }

    const jwttoken = token.split("Bearer ")[1];

    const decodetoken = jwt.verify(jwttoken, process.env.SECRET_KEY);
    const { userId } = decodetoken;

    const user = await User.findById(userId);

    if (!user) {
      return sendError(
        res,
        errormessages.UNAUTHORIZED_ACCESS,
        statusCode.ERRORCODE
      );
    }

    req.user = user;
    next();
  } catch (e) {
    console.log(e);
  }
};
