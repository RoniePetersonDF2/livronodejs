const express = require('express')
const morgan = require('morgan')
const taskRouter = require('./routes/tasks')

const app = express()

app.use(express.json())
app.use(morgan('dev'))
app.use('/tasks', taskRouter)


app.get('/', (req, res) => {
    res.send('To-Do API is running.')
})


const PORT = process.env.PORT || 3000

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}  🏆`)
    })
}

module.exports = app