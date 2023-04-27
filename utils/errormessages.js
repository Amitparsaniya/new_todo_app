const errormessages={
    EMAIL_ALLREADY_EXSIST :"Email is allready exsist!",
    INVALID_USER:"Invalid user!",
    INVALID_REQUEST:"Invalid request!",
    USER_NOT_FOUND:"user not found!",
    USER_ALLREADY_VERIFIED:"user is allready verified!",
    TOKEN_NOT_FOUND:"token not found!",
    OTP_NOT_MATCHED:"please submit a valid otp!",
    ALL_READY_SEND_OTP:"Only after one hour you can send request for another OTP!",
    EMAIL_IS_MISSING:"email is missing!",
    PASSWORD_MATCH_WITH_OLDPASSWORD:"New password can not same with oldpassword, plz choose different password!",
    INVALID_LOGIN_CREDENTIALS:"Email or password is invalid",
    TASKID_NOT_FOUND:"Task id not found!",
    PAGE_NOT_FOUND:"Page not found!",
    UNAUTHORIZED_ACCESS:"Unauthorized access,Invalid token!",
    TASKID_NOT_FOUND_ON_SERCH_DATE:"Task not found on serch date!",
    SUPPORTED_ONLY_IMAGE_FILE:'supported only image file!'
}

const validation={
      NAME_IS_MISSING:"Name is missing!",
      INVALID_EMAIL:"Email is invalid!",
      PASSWORD_MISSING:"Password is Missing",
      PASSWORD_LENGTH:"Password must be 5 to 20 charactors long!",
      ENTER_EMAIL:"plz enter a emailId!",
      TASK_IS_MISSING:"plz add a new Task!",
      OTP_MISSING:"plz enter valid OTP!",
      OTP_LENGTH:"OTP should be 6 charactors long",
      USERID_NOT_FOUND:"userId not found!"
}

module.exports ={errormessages,validation}