class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong.",
    error = [],
    stack = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.data = null;
    this.success = false;
    this.error = error;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };


// 1. If a user provides an invalid password.

/* const error = new ApiError("Password is incorrect", 401, ["Password must be at least 8 characters"]);

// error will look like:
{
  message: "Password is incorrect",
  statusCode: 401,
  data: null,
  success: false,
  error: ["Password must be at least 8 characters"],
  stack: "..." // tells where in the code this happened
} */


// 2. If the server has an internal problem.

/*  const error = new ApiError("Internal Server Error", 500);

  // error will look like:
  {
    message: "Internal Server Error",
    statusCode: 500,
    data: null,
    success: false,
    error: [],
    stack: "..." // the exact place where the error happened
  } */
  