import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

import dbConnection from './Config/dbConfig.js'
import router from './Routes/userRoutes.js'
import todoRouter from './Routes/todoRoutes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(express.json())

app.use(
  cors({
    origin: ['http://localhost:5173', 'https://your-frontend-domain.onrender.com'],
    credentials: true
  })
)

// DB
dbConnection()

// Routes
app.use('/user', router)
app.use('/', todoRouter)

app.get('/processing', (req, res) => {
  res.json({ message: 'Server running successfully 🚀' })
})

// Server start
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
