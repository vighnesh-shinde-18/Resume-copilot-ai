import express from "express";
import AuthRouter from './routes/auth.routes.js'
import errorHandler from "./middlewares/error.middleware.js";
const app = express()
 
app.use(express.json())

app.get("/",(req,res)=>{
    res.send("hi")
})
app.use('/api/v1/auth',AuthRouter)

app.use(errorHandler);

export default app;