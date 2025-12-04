/////This is for URL Shortener modal//////
// const express = require("express");
// const { connectDB } = require("./connection");
// const app = express();
// const port = 8000;
// connectDB("mongodb://localhost:27017/Practice");
// const urlRouter = require("./routes/urlRouter");
// app.use(express.urlencoded({ extended: false }));
// app.use(express.json());
// const URL = require("./models/urlModel");
// app.use("/url", urlRouter);
// //app.use("/:shortId",urlRouter);
// app.get("/:shortId", async (req, res) => {
//   const { shortId } = req.params;
//   const entry = await URL.findOneAndUpdate(
//     {
//       shortId: shortId,
//     },
//     {
//       $push: { VisitsHistory: { timeStamp: Date.now() } },
//     }
//   );
//   if (!entry) {
//     return res.status(404).json({ error: "Short URL not found" });
//   }
//   res.redirect(entry.redirectUrl);
// });

// app.listen(port, () => console.log("Server started on port " + port));

/////This is for Just Create User and Auth modal/////
require("dotenv").config();
const express = require("express");
const app = express();
const port = 8000;

////Connection to mongoDB///
const { connectDB } = require("./connection");
connectDB(process.env.MONGO_URI);

//Routes
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/auth", authRouter);
app.use("/user", userRouter);

app.listen(port, () => console.log("Server started on port " + port));
