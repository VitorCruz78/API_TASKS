const { databaseConnection } = require('../connection')

exports.getAll = (req, res) => {
    let sql = `SELECT * FROM tasks`
    
    databaseConnection.query(sql, (err, result) => {
        if(err) throw err
        
        res.status(200).json({
            status: 'success',
            data: result
        })
    })

    databaseConnection.end()
}

exports.create = (req, res) => {
    const { title, description, completed_at, created_at, updated_at } = req.body

    let sql = `INSERT INTO tasks (title, description, completed_at, created_at, updated_at) VALUES (?, ?, ?, ?, ?)`
    let values = [title, description, completed_at, created_at, updated_at]

    databaseConnection.query(sql, values, (err, result) => {
        if(err) throw err

        // console.log(result)
        res.status(201).json({
            status: 'success',
            message: 'Sucesso ao realizar criação de tarefa',
            data: result
        })
    })
}