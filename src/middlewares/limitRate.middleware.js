import rateLimit from "express-rate-limit";

const loginLimit = rateLimit({
  windoeMs: 15 * 60 * 1000, // 15 minutes.
  max: 100, // limit each IP to 100 requests per windowMs.
  message: {
    status: 429,
    message: "Too many login attempts, please try again later.",
  },
});

export default loginLimit;
