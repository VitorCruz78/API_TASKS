const express = require('express')
const TasksController = require('../controllers/tasksController')
const multer = require('multer')
const multerConfig = require('../infra/multer.config')
const upload = multer(multerConfig)

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

router
    .route('/api/tasks/:id/complete')
    .patch(TasksController.complete)

router
    .route('/api/tasksCSV')
    .post(upload.single('file'), TasksController.readCSV)

module.exports = router;