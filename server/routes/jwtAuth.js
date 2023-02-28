const router = require("express").Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const jwtGenerator = require("../utils/jwtGenerator");

// Registering.
router.post("/register", async (req, res) => {
    try {
        // Step 1: Destructure the req.body (name, email, password).
        const { name, email, password } = req.body;

        // Step 2: Check if the user exists (if user exists then throw error).
        const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
            email
        ]);

        if (user.rows.length !== 0) { // A user exists
            return res.status(401).send("User already exists."); // Note: Status code 401 is unauthenticated. Status code 403 is unauthorized.
        }

        // Step 3: Bcrypt the user password.
        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound); // These functions take time hence await!
        const bcryptPassword = await bcrypt.hash(password, salt); // Encrypts the password.

        // Step 4: Enter the new user inside our database.
        const newUser = await pool.query("INSERT INTO users(user_name, user_email, user_password) VALUES ($1, $2, $3) RETURNING *",
            [name, email, bcryptPassword]
        );

        // Step 5: Generating our JWT token.
        const token = jwtGenerator(newUser.rows[0].user_id);
        res.json({ token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error.");
    }
})

// Login route.
router.post("/login", async (req, res) => {
    try {
        // Step 1: Destructure the req.body.
        const { email, password } = req.body;

        // Step 2: Check if user doesn't exist (if not then we throw error).
        const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
            email
        ]);

        if (user.rows.length === 0) {
            return res.status(401).json("Password or Email is incorrect.");
        }

        // Step 3: Check if the incoming password matches the database password.
        const validPassword = await bcrypt.compare(password, user.rows[0].user_password); // Returns a boolean

        if (!validPassword) {
            return res.status(401).json("Password or Email is incorrect.");
        }

        // Step 4: Give the JWT token to the user.
        const token = jwtGenerator(user.rows[0].user_id);
        res.json({ token });
    } catch (err) {
        console.error(err.message);
    }
})

module.exports = router;
