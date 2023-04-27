const { isValidObjectId } = require("mongoose");
const EmailVerificationtoken = require("../models/emailverificationotp");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/user");
const {generateOtp} =require("../utils/generateOtp")
const{generateRandomBytes} = require("../utils/passwordResetToken")
const {generateMailtranspoter} = require("../utils/mail");
const Passwordresettoken = require("../models/passwordresettoken");
const { sendError, sendScuccess } = require("../utils/helper");
const statusCode = require("../utils/statuscode");
const { errormessages } = require("../utils/errormessages");
const messages = require("../utils/sucessmessage");
const subject = require("../utils/emailmessages");

exports.create = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const isEmailExsist = await User.findOne({ email });
    if (isEmailExsist) {
      return sendError(
        res,
        errormessages.EMAIL_ALLREADY_EXSIST,
        statusCode.ERRORCODE
      );
    }
    const user = new User(req.body);
    await user.save();

    let otp = generateOtp();
    console.log(otp);

    const emailtoken = new EmailVerificationtoken({
      owner: user._id,
      otp: otp,
    });

    await emailtoken.save();

    var transport = generateMailtranspoter();
    transport.sendMail({
      from: process.env.VERIFICATION_EMAIL,
      to: user.email,
      subject: subject.EMAIL_VERIFICATION,
      html: `
            <p>Your Verification OTP</p>
            <h1>${otp}</h1>`,
    });
    sendScuccess(
      res,
      {
        message: messages.CREATE_NEW_USER,
        user: { _id: user._id, name: user.name, email: user.email },
      },
      statusCode.CREATE
    );
  } catch (e) {
    console.log(e);
    res.send(e);
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    if (!isValidObjectId(userId)) {
      return sendError(res, errormessages.INVALID_USER, statusCode.ERRORCODE);
    }

    const user = await User.findById(userId);

    if (!user) {
      return sendError(res, errormessages.USER_NOT_FOUND, statusCode.ERRORCODE);
    }

    if (user.isVerified) {
      return sendError(
        res,
        errormessages.USER_ALLREADY_VERIFIED,
        statusCode.ERRORCODE
      );
    }

    const token = await EmailVerificationtoken.findOne({ owner: userId });
    // console.log(/token/, token);

    if (!token) {
      return sendError(
        res,
        errormessages.TOKEN_NOT_FOUND,
        statusCode.ERRORCODE
      );
    }

    const isMatched = await token.comparetoken(otp);

    if (!isMatched) {
      return sendError(
        res,
        errormessages.OTP_NOT_MATCHED,
        statusCode.ERRORCODE
      );
    }

    user.isVerified = true;
    await user.save();

    await EmailVerificationtoken.findByIdAndDelete(token._id);

    var transport = generateMailtranspoter();

    transport.sendMail({
      from: process.env.VERIFICATION_EMAIL,
      to: user.email,
      subject: subject.WELCOME_EMAIL,
      html: ` 
            <h1>Welcome our app ${user.name}, Thanks for chossing us! </h1>`,
    });
    sendScuccess(res, messages.USER_EMAIL_VERIFIED, statusCode.SUCCESS);
    //    res.status(200).json({messgae:` ${user.name} ${res.__('USER_EMAIL_VERIFIED')}`})
  } catch (e) {
    console.log(e);
  }
};

exports.resendEmailVerificationToken = async (req, res) => {
  const { userId } = req.body;

  if (!isValidObjectId(userId)) {
    return sendError(res, errormessages.INVALID_USER, statusCode.ERRORCODE);
  }

  const user = await User.findById(userId);

  if (!user) {
    return sendError(res, errormessages.USER_NOT_FOUND, statusCode.ERRORCODE);
  }

  if (user.isVerified) {
    return sendError(
      res,
      errormessages.USER_ALLREADY_VERIFIED,
      statusCode.ERRORCODE
    );
  }

  const allreadyhastoken = await EmailVerificationtoken.findOne({
    owner: userId,
  });

  if (allreadyhastoken) {
    return sendError(
      res,
      errormessages.ALL_READY_SEND_OTP,
      statusCode.ERRORCODE
    );
  }

  let otp = generateOtp();
  console.log(otp);

  const emailtoken = new EmailVerificationtoken({
    owner: user._id,
    otp: otp,
  });

  await emailtoken.save();

  var transport = generateMailtranspoter();
  transport.sendMail({
    from: process.env.VERIFICATION_EMAIL,
    to: user.email,
    subject: subject.EMAIL_VERIFICATION,
    html: `
       <p>Your Verification OTP</p>
       <h1>${otp}</h1>`,
  });
  sendScuccess(
    res,
    { message: messages.OTP_SENT_TO_EMAIL },
    statusCode.SUCCESS
  );
  //    res.status(200).json({messgae:"verification otp sent to your emai address"})
};

exports.forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return sendError(
        res,
        errormessages.EMAIL_IS_MISSING,
        statusCode.ERRORCODE
      );
    }

    const user = await User.findOne({ email });

    if (!user) {
      return sendError(res, errormessages.USER_NOT_FOUND, statusCode.ERRORCODE);
    }

    const allreadyhastoken = await Passwordresettoken.findOne({
      owner: user._id,
    });

    if (allreadyhastoken) {
      return sendError(
        res,
        errormessages.ALL_READY_SEND_OTP,
        statusCode.ERRORCODE
      );
    }

    const token = await generateRandomBytes();
    // console.log(/t/, token)

    const passwordresettoken = new Passwordresettoken({
      owner: user._id,
      token,
    });

    await passwordresettoken.save();

    const resetpasswordurl = `http://localhost:3000/reset-password?token=${token}&id=${user._id}`;

    var transport = generateMailtranspoter();
    transport.sendMail({
      from: process.env.SECURITY_EMAIL,
      to: user.email,
      subject: subject.FORGET_PASSWORD,
      html: `
       <p>Click here to reset your password</p>      
        <a href="${resetpasswordurl}">Change Password</a>`,
    });
    sendScuccess(res, messages.FORGET_PASSWORD_LINK, statusCode.SUCCESS);
    // res.status(200).json({ message: "Link sent to your register email account!" })
  } catch (e) {
    console.log(e);
  }
};
exports.resetpassword = async (req, res) => {
  const { newpassword, userId } = req.body;
  if (!isValidObjectId(userId)) {
    return sendError(res, errormessages.INVALID_USER, statusCode.ERRORCODE);
  }

  const user = await User.findById(userId);

  if (!user) {
    return sendError(res, errormessages.USER_NOT_FOUND, statusCode.ERRORCODE);
  }

  const matched = await user.comparepassword(newpassword);

  // console.log(matched);

  if (matched) {
    return sendError(
      res,
      errormessages.PASSWORD_MATCH_WITH_OLDPASSWORD,
      statusCode.ERRORCODE
    );
  }

  user.password = newpassword;
  await user.save();

  await Passwordresettoken.findByIdAndDelete(req.resettoken._id);

  var transport = generateMailtranspoter();

  transport.sendMail({
    from: process.env.SECURITY_EMAIL,
    to: user.email,
    subject: subject.PASSWORD_RESET_SUCCESSFULLY,
    html: ` 
      <h1>${user.name} your Password Reset Successfully</h1>
      <p>Now you can use new Password</p>`,
  });
  sendScuccess(res, messages.PASWORD_RESET_SUCCESSFULLY, statusCode.SUCCESS);
};

exports.signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return sendError(
        res,
        errormessages.INVALID_LOGIN_CREDENTIALS,
        statusCode.ERRORCODE
      );
    }

    const matched = await user.comparepassword(password);

    if (!matched) {
      return sendError(
        res,
        errormessages.INVALID_LOGIN_CREDENTIALS,
        statusCode.ERRORCODE
      );
    }

    const jwttoken = jwt.sign({ userId: user._id }, process.env.SECRET_KEY);

    sendScuccess(
      res,
      {
        message: messages.SUCCESSFULLY_LOGIN,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          token: jwttoken,
        },
      },
      statusCode.SUCCESS
    );

  } catch (e) {
    console.log(e);
  }
};
