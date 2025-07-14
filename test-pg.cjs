require("dotenv").config();
const { Pool } = require("pg");
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
pool.query("SELECT 1", (err, res) => {
  if (err) console.error(err);
  else console.log("Success!");
  pool.end();
});