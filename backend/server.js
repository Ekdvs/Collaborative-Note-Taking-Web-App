import dotenv from 'dotenv';
import express from 'express';
import ConnectDB from './config/db.js';
import cors from "cors";
import userRouter from './routers/userRouter.js';

dotenv.config();

const app =express()

app.use(
    cors({
        origin: [],
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
)

//add middleware here
app.use(express.json())
app.use(express.urlencoded({extended:true}))

//add routes here
app.use('/api/users',userRouter)

app.get('/',(req,res)=>{
    res.send('Hello World!')
})

const PORT = process.env.PORT || 8080;

ConnectDB().then(()=>{
    app.listen(PORT,()=>{
        console.log(`Server is running on port ${PORT}`);
    })}).catch((error)=>{
        console.error("Failed to connect to the database",error);
    })