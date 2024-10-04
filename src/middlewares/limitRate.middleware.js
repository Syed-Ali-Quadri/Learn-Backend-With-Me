// Importing the express-rate-limit module.
import rateLimit from "express-rate-limit";

// Define rate limiting rules for login attempts.
const loginLimit = rateLimit({
  // The time window in which the limit applies, in this case, 15 minutes (15 * 60 * 1000 milliseconds).
  windowMs: 15 * 60 * 1000, // 15 minutes.

  // Maximum number of login attempts allowed per IP address within the window (100 requests).
  max: 100, 

  // Custom message to send when the rate limit is exceeded.
  message: {
    status: 429, // HTTP status code for "Too Many Requests."
    message: "Too many login attempts, please try again later.", // Friendly message indicating the user has to wait.
  },
});

// Exporting the loginLimit middleware for use in the login route.
export default loginLimit;
