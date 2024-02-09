const limiter = require('express-rate-limit');
const chat = require('../chat/statusCode');

const limitingRequests = limiter.rateLimit({
  windowMs: 60 * 1000,
  max: 150,
  message: chat.error429
});

module.exports = limitingRequests;
