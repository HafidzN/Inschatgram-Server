require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
const httpError = require('./middlewares/httpError')

const app = express()

mongoose.connect(process.env.MONGODB_URL, 
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify : false
    }
).then(()=>{
    app.listen(5000, 'localhost', ()=>{
        console.log('listening to port 5000')
    })
}).catch( error => {
    console.log(error)
    console.log('Fail to connect mongoDB')
})



app.use(bodyParser.json())

app.use(cors())

app.use('/api/auth', require('./routes/authRoutes'))
app.use('/api/post', require('./routes/postRoutes'))
app.use('/api/user', require('./routes/userRoutes'))
app.use('/api/story',require('./routes/storyRoutes'))

app.use((req, res, next)=>{
    const error = new httpError(`couldn't find the route`, 404)
    throw error
})

app.use((error, req, res, next)=>{
    if (res.headerSent){
        next (error)
    }
    res.status(error.code||500)
    res.json({message: error.message ||'a unknown server error occured' })
})
