const Database = require("better-sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, "base_datos.db");
const db = new Database(dbPath, { verbose: console.log });

console.log("Base de datos conectada en:", dbPath);
module.exports = db;