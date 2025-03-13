const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { connectDB } = require("./connection/connection.js");
const app = express();

connectDB();

app.use(express.json());

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use(express.static(path.resolve(__dirname, `./src/public`)));


// app.use("/v1", routes);

app.get('/',(req,res)=>{
res.json("hello worldfhrfh")
})


const startServer = async () => {
    await connectDB();  // Ensure database connection is established
  app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
};

startServer();