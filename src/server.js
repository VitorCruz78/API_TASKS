const express = require('express')
const TasksRouter = require('./routes/TasksRoutes')
// const { connect } = require('./connection')

const app = express()
app.use(express.json())
app.use(TasksRouter)

app.listen(3000, () => {
    console.log("Server is runnig locally...")
})
