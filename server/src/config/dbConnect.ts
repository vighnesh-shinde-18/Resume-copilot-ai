import mongoose from 'mongoose';
import envVariables from '../constants/constants.js'
import ApiError from '../utils/ApiError.js'

class Database{ 
    private isConnected= false;
    private databaseUrl= `${envVariables.database_url}${envVariables.database_name}`;
    
    public async connectDB(){

        if(this.isConnected){
            console.log('Already Connected To Databse')
            return;
        } 
        if(!this.databaseUrl){
            throw new ApiError(404,'Database URL is missing')
        }

        try{ 
            const connectionInstance = await mongoose.connect(this.databaseUrl,{
                maxPoolSize:10,
                serverSelectionTimeoutMS:5000
            })
            console.log("Database Connected Successfully")
        }catch(error){
            console.log("Database Connection Error ",error)
        }
    }
}
 
const database = new Database()
export default database;