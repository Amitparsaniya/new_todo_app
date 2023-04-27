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



const user=mongoose.model("User",userSchema)
module.exports = user


