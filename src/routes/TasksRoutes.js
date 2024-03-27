const express = require('express')
const TasksController = require('../controllers/tasksController')

const router = express.Router()

router
    .route('/api/tasks')
    .get(TasksController.getAll)

module.exports = router;