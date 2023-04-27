const mongoose =require("mongoose")
const bcrypt =require("bcrypt")
require('dotenv').config()

const passwordresettokenSchema = new mongoose.Schema({
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true
    },
    token:{
        type:String,
        required:true,    
    },
    createAt:{
        type:Date,
        expires:process.env.expiresTime ,
        default: Date.now
    },
})


passwordresettokenSchema.pre("save",async function(next){
    const user =this
    if(user.isModified('token')){
        user.token =await bcrypt.hash(user.token,10)
    }
    next()
})
passwordresettokenSchema.methods.comparetoken = async function(token){
   const user =this
   const result =await bcrypt.compare(token,user.token)
    return result
}


const Passwordresettoken = mongoose.model("PasswordresettokenSchema",passwordresettokenSchema)

module.exports =Passwordresettoken