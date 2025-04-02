import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import inventoryRoutes from './routes/model.routes.js'

dotenv.config()
const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json())
app.use('/api/inventory', inventoryRoutes)

app.listen(PORT, () => {
  console.log('inventory-service running on port ' + PORT)
})
