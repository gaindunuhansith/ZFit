import express from "express";

// Create an Express application
const app = express(); 

const PORT = 5000;

app.get("/", (req, res) => {
    res.send("The server is running");
});

app.listen(PORT, () => {
    console.log("Server is running on the Port", PORT);
});
