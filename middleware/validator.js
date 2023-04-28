const {check, validationResult} =require("express-validator")
const {  validation } = require("../utils/errormessages")
exports.uservalidator =[
    check("name").trim().not().isEmpty().withMessage(validation.NAME_IS_MISSING),
    check("email").normalizeEmail().isEmail().withMessage(validation.INVALID_EMAIL),
    check("password").trim().not().isEmpty().withMessage(validation.PASSWORD_MISSING).isLength({min:5,max:20}).withMessage(validation.PASSWORD_LENGTH)

]

exports.passwordvalidator =[
    check("newpassword").trim().not().isEmpty().withMessage(validation.PASSWORD_MISSING).isLength({min:5,max:20}).withMessage(validation.PASSWORD_LENGTH)
]

exports.signValidator =[
    check("email").trim().not().isEmpty().withMessage(validation.ENTER_EMAIL),
    check("email").normalizeEmail().isEmail().withMessage(validation.INVALID_EMAIL),
    check("password").trim().not().isEmpty().withMessage(validation.PASSWORD_MISSING).isLength({min:5,max:20}).withMessage(validation.PASSWORD_LENGTH)
]

exports.todoValidator=[
    check("task").trim().not().isEmpty().withMessage(validation.TASK_IS_MISSING)
]
exports.emailverification=[
    check("otp").trim().not().isEmpty().withMessage(validation.OTP_MISSING).isLength({min:6,max:6}).withMessage(validation.OTP_LENGTH),
    check("userId").trim().not().isEmpty().withMessage(validation.USERID_NOT_FOUND)
]
exports.forgetpassword =[
    check("email").trim().not().isEmpty().withMessage(validation.ENTER_EMAIL),
    check("email").normalizeEmail().isEmail().withMessage(validation.INVALID_EMAIL)
]

exports.validte =(req,res,next)=>{
    const error =validationResult(req).array()
    if(error.length){
        return res.status(400).json({error:error[0].msg})
    }
    next()
}