const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const bodyParser = require("body-parser");
const { connectDB } = require("./connection/connection");
const router = require("./routes/index");
const cookieparser = require("cookie-parser");

app.use(cookieparser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

connectDB();

app.use("/v1", router);

app.get('/',(req,res)=>{
res.json("hello worldfhrfh")
})

server.listen(3000, () => {
  console.log(`server is done at port number ${3000}`);
});
