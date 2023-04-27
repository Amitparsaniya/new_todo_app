const express =require("express")
require("./DB/db")
const path =require("path")
require("dotenv").config()

const app =express()
const port =process.env.PORT
 
const userrouter = require("./routes/user")
const todoroutes =require("./routes/user_todo")
const { sendError } = require("./utils/helper")
const { errormessages } = require("./utils/errormessages")
const statusCode = require("./utils/statuscode")
        
app.use(express.json())

app.use('/user',userrouter)
app.use('/todo',todoroutes)

app.use("*",(req,res)=>{
    sendError(res,errormessages.PAGE_NOT_FOUND,statusCode.NOT_FOUND)
})

app.listen(port,()=>{
    console.log(`your port is up on server ${port}`);
})