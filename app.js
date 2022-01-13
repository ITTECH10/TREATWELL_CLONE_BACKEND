const express = require('express')
const app = express()
const cors = require('cors')
const AppError = require('./utils/appError')
const categoryRouter = require('./routers/categoryRouter')

// CORS
app.use(cors())

app.use(express.json())

// ROUTES
app.use('/api/v1/categories', categoryRouter)

app.all('*', (req, res, next) => {
    next(new AppError(`The requested url ${req.originalUrl} could not be found.`, 404))
})

module.exports = app