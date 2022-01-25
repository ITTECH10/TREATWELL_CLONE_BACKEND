const express = require('express')
const app = express()
const cors = require('cors')
const cookieParser = require('cookie-parser')
const AppError = require('./utils/appError')
const therapyRouter = require('./routers/therapyRouter')
const therapeutRouter = require('./routers/therapeutRouter')
const pacientRouter = require('./routers/pacientRouter')

const origin = process.env.NODE_ENV === 'production' ? 'https://treatwell-clone-58p8v9ghs-ittech10.vercel.app' : 'http://localhost:3000'

// CORS
app.use(cors({ credentials: true, origin }))

// Parse cookies
app.use(cookieParser())

app.use(express.json())

// ROUTES
app.use('/api/v1/therapies', therapyRouter)
app.use('/api/v1/therapeuts', therapeutRouter)
app.use('/api/v1/pacients', pacientRouter)

app.all('*', (req, res, next) => {
    next(new AppError(`The requested url ${req.originalUrl} could not be found.`, 404))
})

module.exports = app