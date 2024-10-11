// This handler having two methods.
// First method: In this function we make handler function using try and catch method which is not that much useful.
// Second method: In this function we make handler function using promises and this method is adopted by many dev companies and other programmers.

// 1) try and catch method:
/*
const asyncHandler = (func) => {
    async (req, res, next) => {
        try {
            await func(req, res, next);
        } catch (error) {
            res.status(error.code || 500).json({
                success: false,
                message: error.message,
            });
        }
    };
};
export { asyncHandler };
*/

// 2) Promise method:

// Define an asyncHandler function that takes a request handler as an argument
const asyncHandler = (requesthandler) => {
    // Return a new function that accepts req (request), res (response), and next (for middleware)
    return (req, res, next) => {
      // Promise.resolve ensures that the requestHandler is executed as a promise.
      // If the handler resolves successfully, it continues as normal.
      // If an error occurs, it is caught by .catch and passed to the next() function, 
      // which passes it to any error-handling middleware.
      Promise.resolve(requesthandler(req, res, next)).catch((err) => next(err));
    };
  };
  
  // Export the asyncHandler function so it can be used in other modules
  export { asyncHandler };
  
