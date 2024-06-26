const { connection } = require('../connection')
const { validate } = require('../utils/validator/schema')
const Joi = require('joi')
const csvParser = require('csv-parser')
const fs = require('fs')

exports.create = (req, res) => {
    const { title, description, completed_at, created_at } = req.body
    validate({
        title: Joi.string().required(),
        description: Joi.string().required(),
        created_at: Joi.date(),
    }, req.body)

    let sql = `INSERT INTO tasks (title, description, completed_at, created_at) VALUES ($1, $2, $3, $4) RETURNING *`
    let values = [title, description, completed_at, created_at]

    connection.query(sql, values, (err, result) => {
        if (err) return console.log("ERRO ao criar nova tarefa", err)

        res.status(201).json({
            status: 201,
            message: 'Sucesso ao realizar criação de tarefa',
            data: result.rows
        })
    })
}

exports.read = (req, res) => {
    let sql = `SELECT * FROM tasks`

    connection.query(sql, (err, result) => {
        if (err) return console.log("ERRO ao buscar tarefas", err)
        const formattedRead = result.rows.map(items => {
            return {
                ...items,
                updated_at: items.updated_at ? items.updated_at.toLocaleString('pt-br', { timezone: 'Brazil/brt' }) : "",
                completed_at: items.completed_at ? items.completed_at.toLocaleString('pt-br', { timezone: 'Brazil/brt' }) : "",
            }
        })

        res.status(200).json({
            status: 200,
            message: 'Sucesso ao buscar tarefas',
            data: formattedRead
        })
    })
}

exports.update = (req, res) => {
    const { id } = req.params
    const { title, description, completed_at, created_at } = req.body
    let idExists

    validate({
        title: Joi.string().required(),
        description: Joi.string().required(),
        completed_at: Joi.date(),
        created_at: Joi.date(),
    }, req.body)

    let sql = `
        UPDATE tasks 
        SET title = $1, description = $2, completed_at = $3, created_at = $4, updated_at = current_timestamp
        WHERE id = $5
        RETURNING *
    `
    let values = [title, description, completed_at, created_at, id]

    let validIdExists = `SELECT * FROM tasks t WHERE t.id = ${id}`

    connection.query(validIdExists, (err, result) => {
        if (result.rows.length === 0) {
            idExists = false
        } else {
            idExists = true
        }
    })

    connection.query(sql, values, (err, result) => {
        if (err) return console.log("ERRO ao atualizar tarefa", err)

        if (!idExists) {
            return res.status(400).json({
                status: 400,
                message: 'O id informado não foi encontrado no sistema'
            })
        }
        if (idExists) {
            const formattedUpdate = result.rows.map(items => {
                return {
                    ...items,
                    updated_at: items.updated_at.toLocaleString('pt-br', { timezone: 'Brazil/brt' }),
                }
            })

            return res.status(200).json({
                status: 200,
                message: 'Sucesso ao atualizar tarefa',
                data: formattedUpdate
            })
        }
    })
}

exports.delete = (req, res) => {
    const { id } = req.params
    let idExists

    let sql = `DELETE FROM tasks WHERE id = ${id}`
    let validIdExists = `SELECT * FROM tasks t WHERE t.id = ${id}`

    connection.query(validIdExists, (err, result) => {
        if (result.rows.length === 0) {
            idExists = false
        } else {
            idExists = true
        }
    })

    connection.query(sql, (err, result) => {
        if (err) return console.log("ERRO ao excluir tarefa", err)
        if (!idExists) {
            return res.status(400).json({
                status: 400,
                message: 'O id informado não foi encontrado no sistema'
            })
        }
        if (idExists) {
            return res.status(200).json({
                status: 200,
                message: 'Sucesso ao excluir tarefa'
            })
        }
    })
}

exports.complete = (req, res) => {
    const { id } = req.params
    let idExists

    let sql = `
        UPDATE TASKS
        SET completed_at = current_timestamp
        WHERE id = ${id}
        RETURNING *
    `
    let validIdExists = `SELECT * FROM tasks t WHERE t.id = ${id}`

    connection.query(validIdExists, (err, result) => {
        if (result.rows.length === 0) {
            idExists = false
        } else {
            idExists = true
        }
    })

    connection.query(sql, (err, result) => {
        if (err) return console.log("ERRO ao marcar tarefa como completa", err)

        if (!idExists) {
            return res.status(400).json({
                status: 400,
                message: 'O id informado não foi encontrado no sistema'
            })
        }
        if (idExists) {
            const formattedCompleted = result.rows.map(items => {
                return {
                    ...items,
                    completed_at: items.completed_at.toLocaleString('pt-br', { timezone: 'Brazil/brt' }),
                }
            })

            return res.status(200).json({
                status: 200,
                message: 'Sucesso ao marcar tarefa como completa',
                data: formattedCompleted
            })
        }
    })
}

exports.readCSV = async (req, res) => {
    try {
        const { file } = req

        const results = []

        fs.createReadStream(file.path)
        .pipe(csvParser())
        .on('data', (data) => {
            results.push(data)
        })
        .on('end', () => {
            const sql = 'INSERT INTO tasks (title, description, created_at) VALUES ($1, $2, $3)'
            results.forEach(row => {
                const values = [row.title, row.description, row.created_at]

                connection.query(sql, values, (err, result) => {
                    if (err) {
                        console.error('Erro ao inserir dados:', err)
                    }
                })
            })
        })

        if (file) {
            return res.status(200).json({
                status: 200,
                message: "Dados importados com sucesso"
            })
        }

        return res.json({
            error: 'Erro ao importar dados.',
            fileSaved: false,
        })
    } catch (error) {
        return res.status(500).json({ error: 'Erro interno do servidor.' })
    }
}