import dotenv from 'dotenv'
import type { envConfig } from '../types/env.types.js';
dotenv.config()

const envVariables:envConfig = {
    database_name : String(process.env.DATABASE_NAME),
    database_url : String(process.env.DATABASE_URL),
    port : Number(process.env.PORT) || 8000,
    access_token_secret : String(process.env.ACCESS_TOKEN_SECRET),
    access_token_expire: Number(process.env.ACCESS_TOKEN_EXPIRY),
    ai_service_url: String(process.env.AI_SERVICE_URL),
    ai_service_timeout:Number(process.env.AI_SERVICE_TIMEOUT)
}
export default envVariables;