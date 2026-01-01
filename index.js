import express from 'express'
import dotenv from 'dotenv'
import dbConnection from './Config/dbConfig.js'
import router from './Routes/userRoutes.js'
import todoRouter from './Routes/todoRoutes.js'


app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}))

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json())
dbConnection()

app.use('/user', router)
app.use('/', todoRouter)

app.get('/processing', (req, res) => {
  res.json({ message: 'Server running successfully 🚀' })
})

// app listening port
app.listen(PORT, () => {
  console.log(`http://localhost:${process.env.PORT}`)
})
