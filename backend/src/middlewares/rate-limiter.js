const rateLimit = require('express-rate-limit');

// Prevent brute-force login attacks
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, 
  message: { message: 'Too many login attempts from this IP, please try again after 15 minutes.' },
});

// Prevent excessive storage ingestion
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 30, // Limit each IP to 30 uploads per hour
  message: { message: 'Upload limit reached to save Vector DB bandwidth. Please try again later.' },
});

// Standard RAG API limitation
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 300, 
  message: { message: 'Too many requests created from this IP, please try again soon.' }
});

module.exports = { loginLimiter, uploadLimiter, apiLimiter };
