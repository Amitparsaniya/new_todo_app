const mongoose =require("mongoose")
require('dotenv').config()

mongoose.connect("mongodb://127.0.0.1:27017/todoApp").then(()=>{
    console.log("Db is connected successfully!");
}).catch((e)=>{
    console.log(e);
})