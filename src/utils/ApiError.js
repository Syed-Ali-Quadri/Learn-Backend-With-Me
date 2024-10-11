// Custom error class that extends the built-in Error class
class ApiError extends Error {
  constructor(
    statusCode, // HTTP status code to represent the type of error (e.g., 401, 500)
    message = "Something went wrong.", // Default message, can be overridden
    error = [], // An array of additional error details (optional)
    stack = "" // Stack trace to track where the error occurred (optional)
  ) {
    super(message); // Call the parent Error constructor with the message
    this.statusCode = statusCode; // Store the provided status code
    this.message = message; // Store the error message
    this.data = null; // No data is returned in case of an error
    this.success = false; // Success is set to false as it's an error
    this.error = error; // Additional error details (if provided)
    
    // Stack trace helps identify where the error occurred
    // If a stack trace is provided, use it; otherwise, generate one
    if (stack) {
      this.stack = stack;
    } else {
      // Capture the stack trace specific to this error instance
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
  