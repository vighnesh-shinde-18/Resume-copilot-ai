import express from "express";
import AuthRouter from './routes/auth.routes.js'
import errorHandler from "./middlewares/error.middleware.js";
import verifyJWT from './middlewares/auth.middleware.js'
import cookieParser from 'cookie-parser'

const app = express()
 
app.use(express.json())
app.use(cookieParser())

app.get("/",(req,res)=>{
    res.send("hi")
})
app.use('/api/v1/auth',AuthRouter)
app.get('/api/v1/auth/me',verifyJWT,(req,res)=> res.send(req.user))

app.use(errorHandler);

export default app;