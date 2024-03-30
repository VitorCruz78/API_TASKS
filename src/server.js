const express = require('express')
const app = express()
const TasksRouter = require('./routes/TasksRoutes')

app.use(express.json())
app.use(TasksRouter)

app.listen(3000, () => {
    console.log("Server is runnig locally...")
})
