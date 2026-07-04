// routes/tasks.js

const express = require('express')
const router = express.Router()

let tasks = []
let nextId = 1

const toInt = v => Number.parseInt(v, 10)
const notFound = res => res.status(404).json({ error: 'Task not found.' })

router.post('/', async (req, res) => {
    console.log(req.body)
    const title = typeof req.body.title === 'string' ? req.body.title.trim(): ''

    if (!title) {
        return res.status(400).json({ error: 'Title is required.'})
    }

    const task = {
        id: nextId++,
        title,
        completed: false
    }

    tasks.push(task)
    
    return res.status(201).json(task)
})

router.get('/', async (req, res) => {
    const { completed, q } = req.query
    let result = tasks

    if (completed === 'true' || completed === 'false') {
        const flag = completed === 'true'

        result = result.filter(t => t.completed === flag)
    }

    if (typeof q === 'string' && q.trim()) {
        const needle = q.trim().toLowerCase()

        result = result.filter(t => t.title.toLowerCase().includes(needle))
    }

    return res.json(result)
})

router.get('/:id', async (req, res) => {
    const id = Number(req.params.id)
    const task = tasks.find(t => t.id === id)

    if (!task) {
        return notFound(res)
    }

    return res.status(200).json(task)
})

router.put('/:id', async (req, res) => {
    const id = Number(req.params.id)
    const task = tasks.find(t => t.id === id)

    if (!tasks) {
        return notFound(res)
    }

    const { title, completed } = req.body

    if (title !== undefined) {
        const newTitle = typeof title === 'string' ? title.trim(): ''

        if (!newTitle) {
            return res.status(400).json({ error: 'Title cannot be empty' })
        }
        task.title = newTitle
    }

    if (completed !== undefined) {
        if (typeof completed !== 'boolean') {
            return res.status(400).json({ error: 'Completed must be boolean.' })
        }

        task.completed = completed
    }
    return res.status(200).json(task)
})

router.delete('/:id', async (req, res) => {
    const id = Number(req.params.id)
    const before = tasks.length

    tasks = tasks.filter(t => t.id !== id) 

    if (tasks.length === before) {
        return notFound(res)
    }

    return res.status(204).end()

})

module.exports = router