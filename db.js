require("dotenv").config();
const mysql = require("mysql2");

const dbConfig = {
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
};

const db = mysql.createConnection(dbConfig);

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to database");
});

function createTable(tableName, schema) {
  let query = `CREATE TABLE IF NOT EXISTS ${tableName} (`;
  query += schema.map((field) => `${field.name} ${field.type}`).join(", ");
  query += ")";
  db.query(query, (err, result) => {
    if (err) throw err;
    console.log(`Table ${tableName} created`);
  });
}

let schema = require("./schema.json");
for (let tableName in schema) {
  createTable(tableName, schema[tableName]);
}

module.exports = db;
