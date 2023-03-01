/**
 * taskRoutes.js
 * @description :: CRUD API routes for task
 */

const express = require('express');
const router = express.Router();
const taskController = require('../../../controller/desktop/v1/taskController');
const auth = require('../../../middleware/auth');
router.route('/desktop/api/v1/task/create').post(auth(),taskController.addTask);
router.route('/desktop/api/v1/task/addBulk').post(auth(),taskController.bulkInsertTask);
router.route('/desktop/api/v1/task/list').post(auth(),taskController.findAllTask);
router.route('/desktop/api/v1/task/count').post(auth(),taskController.getTaskCount);
router.route('/desktop/api/v1/task/:id').get(auth(),taskController.getTask);
router.route('/desktop/api/v1/task/update/:id').put(auth(),taskController.updateTask);
router.route('/desktop/api/v1/task/partial-update/:id').put(auth(),taskController.partialUpdateTask);
router.route('/desktop/api/v1/task/updateBulk').put(auth(),taskController.bulkUpdateTask);
router.route('/desktop/api/v1/task/softDelete/:id').put(auth(),taskController.softDeleteTask);
router.route('/desktop/api/v1/task/softDeleteMany').put(auth(),taskController.softDeleteManyTask);
router.route('/desktop/api/v1/task/delete/:id').delete(auth(),taskController.deleteTask);
router.route('/desktop/api/v1/task/deleteMany').post(auth(),taskController.deleteManyTask);

module.exports = router;
