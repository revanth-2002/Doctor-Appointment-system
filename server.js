const express=require('express')
const colors=require('colors')
const morgan=require('morgan')
const dotenv=require('dotenv')
const connectDB = require('./config/db')


//rest object
const app=express()

//middlewares
app.use(express.json())
app.use(morgan('dev'))

dotenv.config()

// mongodb connection
connectDB();

//routes
app.use("/api/v1/user",require("./routes/userRoutes"));
app.use('/api/v1/admin',require("./routes/adminRoutes"));
app.use('/api/v1/doctor',require("./routes/doctorRoutes"));

//static files
app.use(express.static(path.join(__dirname,'./client/build')))

app.get("*", function(req,res){
    res.sendFile(path.join(__dirname,"./client/build/index.html"))
})

//listen port
const port = process.env.PORT || 8080
app.listen(port,()=>{
    console.log(`Server Running in ${process.env.NODE_MODE} Mode on port ${process.env.PORT} `)
})