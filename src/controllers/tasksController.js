const { connection } = require('../connection')

exports.getAll = (req, res) => {
    let sql = `SELECT * FROM tasks`
    
    connection.query(sql, (err, result) => {
        if(err) return console.log("ERRO", err)
        
        res.status(200).json({
            status: 'success',
            message: 'successo ao buscar tarefas',
            data: result.rows
        })
    })
}

exports.create = (req, res) => {
    const { title, description, completed_at, created_at, updated_at } = req.body

    let sql = `INSERT INTO tasks (title, description, completed_at, created_at, updated_at) VALUES ($1, $2, $3, $4, $5) RETURNING *`
    let values = [title, description, completed_at, created_at, updated_at]

    connection.query(sql, values, (err, result) => {
        if(err) return console.log("ERRO", err)

        res.status(201).json({
            status: 'success',
            message: 'Sucesso ao realizar criação de tarefa',
            data: result.rows
        })
    })
}
