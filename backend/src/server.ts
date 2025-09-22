import app from "./app.js";
import env from "./config/env.js";
import connectToMongoDB from "./config/mongodb.js";

console.log('Starting server...');
console.log('Port:', env.PORT);

const server = app.listen(env.PORT, '0.0.0.0', () => {
    console.log(`Server is running http://localhost:${env.PORT}`);
    console.log(`Server bound to all interfaces on port ${env.PORT}`);
});

server.on('error', (error) => {
    console.error('Server error:', error);
});

server.on('listening', () => {
    console.log('Server is listening successfully');
});

connectToMongoDB().catch(console.error);