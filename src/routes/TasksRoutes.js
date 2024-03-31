const express = require('express')
const TasksController = require('../controllers/tasksController')

const router = express.Router()

router
    .route('/api/tasks')
    .post(TasksController.create)

router
    .route('/api/tasks')
    .get(TasksController.read)

router
    .route('/api/tasks/:id')
    .put(TasksController.update)

router
    .route('/api/tasks/:id')
    .delete(TasksController.delete)

module.exports = router;