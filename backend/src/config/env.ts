import { config } from 'dotenv';
import { cleanEnv } from 'envalid'; 
import { port, str } from 'envalid';

// Load .env first (shared defaults)
config();

// Then load environment-specific .env file (overrides)
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

//exporting the environmental variables
export default cleanEnv(process.env, {
    NODE_ENV: str(),
    MongoDB_URI: str(),
    PORT: port(),
    APP_ORIGIN: str(),
    JWT_SECRET: str(),
    JWT_REFRESH_SECRET: str(),
    RESEND_API_KEY: str(),
    EMAIL_SENDER: str(),
});