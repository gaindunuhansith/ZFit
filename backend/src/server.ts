import app from "./app.js";
import env from "./config/env.js";
import connectToMongoDB from "./config/mongodb.js";

const startServer = async () => {
    app.listen(env.PORT, async () => {
        console.log(`Server is running http://localhost:${env.PORT}`);
        
        await connectToMongoDB();
    })
};

startServer();