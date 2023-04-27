const mongoose =require("mongoose")
const bcrypt =require("bcrypt")
require('dotenv').config()

const emailverificationotpSchema = new mongoose.Schema({
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true
    },
    otp:{
        type:String,
        required:true,    
    },
    createAt:{
        type:Date,
        expires:process.env.expiresTime ,
        default: Date.now
    },
})


emailverificationotpSchema.pre("save",async function(next){
    const user =this
    if(user.isModified('otp')){
        user.otp =await bcrypt.hash(user.otp,10)
    }
    next()
})
emailverificationotpSchema.methods.comparetoken = async function(otp){
   const user =this
   const result =await bcrypt.compare(otp,user.otp)
    return result
}


const EmailVerificationtoken = mongoose.model("EmailVerificationtoken",emailverificationotpSchema)

module.exports =EmailVerificationtoken