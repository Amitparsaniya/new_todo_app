const mongoose =require("mongoose")
const bcrypt = require("bcrypt")

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true
    },
    email:{
        type:String,
        required: true
    },
    password:{
        type:String,
        required:true
    },
    token:{
        type:String,
        default:null
    },
    otp:{
        type:String,
        default:null
        
    },
    otpCounter:{
        type:Number,
        default:1
    },
    isVerified:{
        type:Boolean,
        required:true,
        default:false
    }
    
},{timestamps:true})


userSchema.pre("save",async function(next){
    const user =this
    if(user.isModified("password")){
        user.password  = await  bcrypt.hash(user.password,10)
    }
    next()
})

userSchema.methods.comparepassword = async function(password){
    const user =this
    const result = await bcrypt.compare(password,user.password)
    return result
}

userSchema.pre("save",async function(next){
    const user =this
    if(user.isModified('token')){
        if(user.token!==null){
            user.token =await bcrypt.hash(user.token,10)
        }
    }
    next()
})
userSchema.methods.comparetoken = async function(token){
   const user =this
       const result =await bcrypt.compare(token,user.token)
       return result
}

userSchema.pre("save",async function(next){
    const user =this
    if(user.isModified('otp')){
        if(user.otp!==null){
            user.otp =await bcrypt.hash(user.otp,10)
        }
    }
    next()
})

userSchema.methods.compareotp = async function(otp){
    const user =this
        const result =await bcrypt.compare(otp,user.otp)
        return result
 }



const user=mongoose.model("User",userSchema)
module.exports = user


