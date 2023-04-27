const fs =require("fs")

exports.deletefile = (filePath)=>{
    fs.unlink(filePath,(err)=>{
      if(err){
        console.log(err);
      }
    })
 }