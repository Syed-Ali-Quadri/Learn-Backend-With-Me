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
const asyncHandler = (requesthandler) => {
  return (req, res, next) => {
    Promise.resolve(requesthandler(req, res, next)).catch((err) => next(err));
  };
};

export { asyncHandler };
