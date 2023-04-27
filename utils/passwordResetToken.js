const cypto = require("crypto")

exports.generateRandomBytes =()=>{
    return new Promise((resolve,reject)=>{
       cypto.randomBytes(30,(error,buff)=>{
           if(error) reject(error)
           const bufferString = buff.toString("hex")
           console.log(bufferString);
           resolve(bufferString)
       })
    })
}