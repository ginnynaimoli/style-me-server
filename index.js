const express = require('express')
const app = express()
const mongoose = require('mongoose')
const PORT = 4000

const cors = require('cors')

const dotenv = require('dotenv')
dotenv.config()

mongoose
.connect(process.env.DATABASE_URL)
.then(() => console.log('Database Connection successful'))
.catch((err) => console.log(err))

app.use(cors({origin: true, credentials: true}))
app.use(express.json())
app.use('/api/auth', require('./routes/auth'))
app.use('/api/users', require('./routes/users'))
app.use('/api/products', require('./routes/products'))
app.use('/api/carts', require('./routes/carts'))
app.use('/api/orders', require('./routes/orders'))
app.use('/api/checkout', require('./routes/stripe'))

app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`)
})