const express = require("express");
const app = express();
const cors = require("cors");

// middleware
app.use(express.json()); // req.body
app.use(cors());

// ROUTES//

// Register an login routes.

app.use("/auth", require("./routes/jwtAuth"));


// MacOS using port 5000 for AirPlay.
const port = 8000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})
