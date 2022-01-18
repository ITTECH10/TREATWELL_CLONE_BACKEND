const express = require('express')
const app = express()
const cors = require('cors')
const AppError = require('./utils/appError')
const categoryRouter = require('./routers/categoryRouter')
const therapyRouter = require('./routers/therapyRouter')
const therapeutRouter = require('./routers/therapeutRouter')
const pacientRouter = require('./routers/pacientRouter')

// CORS
app.use(cors())

app.use(express.json())

// ROUTES
app.use('/api/v1/categories', categoryRouter)
app.use('/api/v1/therapies', therapyRouter)
app.use('/api/v1/therapeuts', therapeutRouter)
app.use('/api/v1/pacients', pacientRouter)

app.all('*', (req, res, next) => {
    next(new AppError(`The requested url ${req.originalUrl} could not be found.`, 404))
})

module.exports = app