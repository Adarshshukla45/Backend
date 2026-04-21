class ApiError extends Error {
  constructor(
    statusCode,
    message = "something went wrong",
    errors = [],
    stack = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.data = null;
    this.message = message;
    this.success = false;
    
    if(stack){
        this.stack=stack;  

    }
    else{
        Error.captureStackTrace(this, this.constructor);
    }

  }
}
export  {ApiError};

//is file ka matlab hai ki humne ek custom error class banaya hai jiska naam ApiError hai, 
// jo ki JavaScript ke built-in Error class ko extend karta hai.