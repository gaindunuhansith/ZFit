import { config } from 'dotenv';
import { cleanEnv } from 'envalid'; 
import { port, str } from 'envalid';

//using the development or production env configurations
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local`})

//exporting the environmental variables
export default cleanEnv(process.env, {
    MongoDB_URI: str(),
    PORT: port()
});