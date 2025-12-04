const express = require("express");
const fs = require("fs");
// const mongo = require("mongoose");
// const Data = require("./MOCK_DATA.json");
const { json } = require("stream/consumers");
const userRoute = require("./routes/user");
const { connectDB } = require("./connection");

const app = express();
const port = 8000;
///Connection to mongoDB
connectDB("mongodb://127.0.0.1:27017/Practice");

app.use(express.urlencoded({ extended: false }));
///Routes
app.use("/Users", userRoute);
app.listen(port, () => console.log("Server started"));
