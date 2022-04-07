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
const userRouter = require('./routers/userRouter')
const globalErrorHandler = require('./controllers/errorController')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const compression = require('compression')
const CroneJobs = require('./services/CroneJobs')

// const origin = process.env.NODE_ENV === 'production' ? 'https://treatwell-clone.vercel.app' : 'http://localhost:3000'
// const origin = process.env.NODE_ENV === 'production' ? 'https://gesundo24.de' : 'http://localhost:3000'
// const origin = process.env.NODE_ENV === 'production' ? 'https://gesundo24.de' : 'http://localhost:3000'
// const origin = 'http://localhost:3000'

const origin = ['https://gesundo24.de', 'www.gesundo24.de']

// CORS
app.use(cors({ credentials: true, origin }))

// Set security HTTP headers
app.use(helmet())

// Initialize crone jobs
CroneJobs()

// Limit requests from same API
// const limiter = rateLimit({
//     max: 100,
//     windowMs: 60 * 60 * 1000,
//     message: 'Zu viele Anfragen von dieser IP-Adresse. Bitte versuchen Sie es in einer Stunde erneut!'
// });

// app.use('/api', limiter)

// Parsers
app.use(cookieParser())
app.use(express.json())
app.use(fileupload({
    useTempFiles: true,
    tempFileDir: os.tmpdir()
}));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Response compression middleware
app.use(compression())

// ROUTES
app.use('/api/v1/therapies', therapyRouter)
app.use('/api/v1/therapeuts', therapeutRouter)
app.use('/api/v1/pacients', pacientRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/reviews', reviewRouter)

app.all('*', (req, res, next) => {
    next(new AppError(`Die angeforderte URL ${req.originalUrl} konnte nicht gefunden werden.`, 404))
})

// GLOBAL ERROR HANDLING
app.use(globalErrorHandler)

module.exports = app