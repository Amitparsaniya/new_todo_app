
exports.sendScuccess = (res=null,success,statuscode =401)=> res.status(statuscode).json({success})

exports.sendError = (res=null,error,statusCode =401)=>res.status(statusCode).json({error})

exports.emailSubject =(subject=null)=>subject