import dotenv from 'dotenv'
import type { Config } from '../types/env.types.js';
dotenv.config()

const envVariables:Config = {
    database_name : String(process.env.DATABASE_NAME),
    database_url : String(process.env.DATABASE_URL),
    port : Number(process.env.PORT) || 8000,
    access_token_secret : String(process.env.ACCESS_TOKEN_SECRET),
    access_token_expire: Number(process.env.ACCESS_TOKEN_EXPIRY)
}
export default envVariables;