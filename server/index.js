const express = require("express");
const app = express();
const cors = require("cors");

// middleware
app.use(express.json()); // req.body
app.use(cors());

// ROUTES//

// Register and login routes.
app.use("/auth", require("./routes/jwtAuth"));

// Dashboard route.
app.use("/dashboard", require("./routes/dashboard"));

// MacOS using port 5000 for AirPlay.
const port = 8001;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})
