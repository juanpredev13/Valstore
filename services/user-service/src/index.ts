import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import userRoutes from './routes/user.routes'

dotenv.config()
const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json())
app.use('/api/users', userRoutes)

app.listen(PORT, () => {
  console.log(`user-service running on port ${PORT}`)
})
