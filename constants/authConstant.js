/**
 * authConstant.js
 * @description :: constants used in authentication
 */

const JWT = {
  DESKTOP_SECRET:'myjwtdesktopsecret',
  EXPIRES_IN: 10000
};

const MAX_LOGIN_RETRY_LIMIT = 3;
const LOGIN_REACTIVE_TIME = 20;

module.exports = {
  JWT,
  MAX_LOGIN_RETRY_LIMIT,
  LOGIN_REACTIVE_TIME,
};
