require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 4000;
const { logger, logEvents } = require("./middleware/logger");
const cookieParser = require('cookie-parser');
const cors = require('cors');
const corsOption = require("./config/corsOption");
const mongoose = require("mongoose");
const connectDb = require("./config/dbConnect");
const errorHandler = require("./middleware/errorHandler");



// Connect to Mongodb
connectDb();

// Middlewares
app.use(logger);
app.use(cookieParser());
app.use(cors(corsOption))
app.use(express.json());


// Api Routes
app.use("/auth", require("./routes/authRoutes"));
app.use("/users", require("./routes/userRoutes"));
app.use("/posts", require("./routes/postsRoutes"));


app.use(errorHandler);


// Start the server
mongoose.connection.once('open', () => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  });

 mongoose.connection.on('error', (error) => {
    console.log(error);
    logEvents(
      `${error.no}\t${error.code}\t${error.syscall}\t${error.hostname}`,
      "mongoErrLog.log"
    );
  });
  