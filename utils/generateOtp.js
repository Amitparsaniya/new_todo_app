exports.generateOtp = (otp_length =6)=>{
    let otp =""
       for(let i=1;i<=otp_length;i++){
           const randomval = Math.round(Math.random()*9)
           otp += randomval
       }
       return otp
   }