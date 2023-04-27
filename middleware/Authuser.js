const { isValidObjectId } = require("mongoose")
const Passwordresettoken = require("../models/passwordresettoken")
require('dotenv').config()
const jwt = require('jsonwebtoken')
const User = require("../models/user")
const { errormessages } = require("../utils/errormessages")
const { sendError } = require("../utils/helper")
const statusCode = require("../utils/statuscode")

exports.isvalipasswordresettoken = async (req, res, next) => {
   const { userId, token } = req.body


   //   token  =req.headers?.Aauthorization
   if (!isValidObjectId(userId) || !token.trim()) {
      return sendError(res,errormessages.INVALID_REQUEST,statusCode.ERRORCODE)
   }

   const resettoken = await Passwordresettoken.findOne({ owner: userId })



   if (!resettoken) {
      return sendError(res,errormessages.UNAUTHORIZED_ACCESS,statusCode.ERRORCODE)
   }

   const matched = await resettoken.comparetoken(token)

   if (!matched) {
      return sendError(res,errormessages.UNAUTHORIZED_ACCESS,statusCode.ERRORCODE)
   }

   req.resettoken = resettoken
   // console.log(resettoken, /id/);
   next()
}

exports.isAuth = async (req, res, next) => {
   try {
      const token = req.headers?.authorization
      //   console.log(req.headers.authorization);
      if (!token) {
         return sendError(res,errormessages.UNAUTHORIZED_ACCESS,statusCode.ERRORCODE)
      }

      const jwttoken = token.split('Bearer ')[1]

      const decodetoken = jwt.verify(jwttoken, process.env.SECRET_KEY)
      // console.log(/decode/,decodetoken);
      const { userId } = decodetoken

      const user = await User.findById(userId)

      if (!user) {
         return sendError(res,errormessages.UNAUTHORIZED_ACCESS,statusCode.ERRORCODE)
      }

      req.user = user
      next()
   }catch(e){
      console.log(e);
   }
}