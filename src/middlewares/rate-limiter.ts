import rateLimit from 'express-rate-limit';

export default rateLimit({
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  windowMs: 15 * 60 * 1000, // 15 minutes
  message: "You can't make any more requests at the moment. Try again later",
});
