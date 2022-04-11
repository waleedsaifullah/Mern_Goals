const path = require('path')
const express = require('express')
const dotenv = require('dotenv').config()
const colors =  require('colors')
const port = process.env.PORT || 5000

const { errorHandler } = require('./middleware/errorMiddleware')
const connectDB = require('./config/db')
const req = require('express/lib/request')

connectDB()

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/api/goals', require('./routes/goalRoutes'))
app.use('/api/users', require('./routes/userRoutes'))

// Serve Frontend
// if(process.env.NODE_ENV === 'production'){
//     app.use(express.static(path.join(__dirname, '../frontend/build')))

//     app.get('*', (req, res) => 
//         res.sendFile(
//             path.resolve(__dirname,  '../', 'frontend', 'buid', 'index.html')
//         )
//     )
// } else{
//     app.get('/', (req, res) => res.send('Please set to production'))
// }

app.use(errorHandler)

app.listen(port, () => console.log(`Server running on Port ${port}`))