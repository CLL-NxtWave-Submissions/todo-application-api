const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const app = express();
app.use(express.json());

const todoApplicationDatabaseFilePath = path.join(
  __dirname,
  "todoApplication.db"
);
const sqliteDriver = sqlite3.Database;

let todoApplicationDBConnectionObj = null;

const initializeDBAndServer = async () => {
  try {
    todoApplicationDBConnectionObj = await open({
      filename: todoApplicationDatabaseFilePath,
      driver: sqliteDriver,
    });

    app.listen(3000, () => {
      console.log("Server running and listening on port 3000 !");
    });
  } catch (exception) {
    console.log(`Error initializing DB and Server: ${exception.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

module.exports = app;
