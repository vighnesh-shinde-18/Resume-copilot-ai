import database from './config/dbConnect.js';
import app from './app.js'
import envVariables from './constants/constants.js'
 
const PORT = envVariables.port;
database.connectDB()
.then(()=>{
     app.listen(PORT,()=>{
        console.log('Server is running on Port',PORT)
     })
})
.catch((error:Error)=>{
    console.log("Error for connecting to Database ",error)
})



