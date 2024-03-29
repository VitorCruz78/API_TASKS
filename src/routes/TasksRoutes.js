const express = require('express')
const TasksController = require('../controllers/tasksController')

const router = express.Router()

router
    .route('/api/tasks')
    .get(TasksController.getAll)

router
    .route('/api/tasks')
    .post(TasksController.create)

module.exports = router;