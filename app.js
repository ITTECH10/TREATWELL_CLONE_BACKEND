const express = require('express')
const app = express()
const os = require('os')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const fileupload = require('express-fileupload')
const AppError = require('./utils/appError')
const therapyRouter = require('./routers/therapyRouter')
const therapeutRouter = require('./routers/therapeutRouter')
const pacientRouter = require('./routers/pacientRouter')
const reviewRouter = require('./routers/reviewRouter')

const origin = process.env.NODE_ENV === 'production' ? 'https://treatwell-clone.vercel.app' : 'http://localhost:3000'

// CORS
app.use(cors({ credentials: true, origin }))

// Parse cookies
app.use(cookieParser())

app.use(express.json())
app.use(fileupload({
    useTempFiles: true,
    tempFileDir: os.tmpdir()
}));

// ROUTES
app.use('/api/v1/therapies', therapyRouter)
app.use('/api/v1/therapeuts', therapeutRouter)
app.use('/api/v1/pacients', pacientRouter)
app.use('/api/v1/reviews', reviewRouter)

app.all('*', (req, res, next) => {
    next(new AppError(`The requested url ${req.originalUrl} could not be found.`, 404))
})

module.exports = app