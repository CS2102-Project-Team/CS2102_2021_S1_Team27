const jwt = require('jsonwebtoken');

/**
 * Middleware for authenticating JWT tokens
 * @param {Request} req - request
 * @param {Response} res - response
 * @param {RequestHandler} next - next middleware to be called // import type!
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    res.sendStatus(401);
    return;
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      res.sendStatus(403);
      return;
    }
    req.user = user;
    next();
  });
}

/**
 * Middleware for authenticating JWT tokens for admin
 * @param {Request} req - request
 * @param {Response} res - response
 * @param {RequestHandler} next - next middleware to be called // import type!
 */
function authenticateAdminToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    res.sendStatus(401);
    return;
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err || !user.isAdmin) {
      res.sendStatus(403);
      return;
    }
    req.user = user;
    next();
  });
}

module.exports = { authenticateToken, authenticateAdminToken };
