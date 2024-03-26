const express = require('express')
const router = express.Router()

const TasksController = require('./controllers/tasksController')

const app = express()
app.use(router)

router
    .route('/api/tasks')
    .get(TasksController.getAll)

app.listen(3000)