const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const userRouter = require('./routers/userRouter')

app.use(morgan('dev'))
app.use(cors())
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

app.use('/api/users',userRouter)

app.get("/",(req,res)=>{
    res.json({
        message:"Welcome to our application"
    })
})


const PORT = process.env.PORT || 4000
app.listen(PORT,()=>{
    console.log(`Server is running on PORT ${PORT}`)

    mongoose.connect('mongodb+srv://mern:mern@cluster0.ujhuxyr.mongodb.net/?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Database Connected.");
    })
    .catch(error => {
        console.error("Error connecting to database:", error);
    });
})