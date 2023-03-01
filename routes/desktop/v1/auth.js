/**
 * auth.js
 * @description :: express routes of authentication APIs
 */

const express =  require('express');
const router  =  express.Router();
const authController =  require('../../../controller/desktop/v1/authController');
const auth = require('../../../middleware/auth');
router.route('/register').post(authController.register);
router.post('/login',authController.login);
router.route('/forgot-password').post(authController.forgotPassword);
router.route('/validate-otp').post(authController.validateResetPasswordOtp);
router.route('/reset-password').put(authController.resetPassword);
router.route('/logout').post(auth(), authController.logout);

module.exports = router;