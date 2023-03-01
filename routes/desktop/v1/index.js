/**
 * index route file of desktop platform.
 * @description: exports all routes of desktop platform.
 */
const express =  require('express');
const router =  express.Router();
router.use('/desktop/auth',require('./auth'));
router.use(require('./taskRoutes'));
router.use(require('./userRoutes'));

module.exports = router;
