/**
 * loginUser.js
 * @description :: middleware that verifies user's JWT token
 */

const jwt = require('jsonwebtoken');
const desktopSecret = require('../constants/authConstant').JWT.DESKTOP_SECRET;

/**
 * @description : middleware for authenticate user with JWT token
 * @param {obj} req : request of route.
 * @param {obj} res : response of route.
 * @param {callback} next : executes the next middleware succeeding the current middleware.
 */
const authenticateJWT = () =>  (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.unAuthorized();
  }
  const token = authHeader.split(' ')[1];
  let secret = desktopSecret;
  jwt.verify(token,secret, (error, user) => {
    if (error) {
      return res.unAuthorized();
    }
    req.user = user;
    next();
  });

};
module.exports = authenticateJWT;
