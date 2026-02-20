const express = require("express");
const bodyParser = require("body-parser");
const pool = require("./db");
const path = require("path");

const app = express();
app.use(bodyParser.json());
app.use(express.static("public"));

const PORT = process.env.PORT || 3000;

app.get("/health", (req, res) => {
  res.send("App is healthy");
});

// Create table if not exists
pool.query(`
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100)
);
`);

app.post("/users", async (req, res) => {
  const { name, email } = req.body;

  try {
    await pool.query(
      "INSERT INTO users (name, email) VALUES ($1, $2)",
      [name, email]
    );
    res.send("User added successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error inserting user");
  }
});

app.get("/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (err) {
    res.status(500).send("Error fetching users");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

