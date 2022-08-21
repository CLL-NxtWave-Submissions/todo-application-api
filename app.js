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

/*
    End-Point 1      : GET /todos
    Query Parameters : priority, status, search_q
    ----------------- 
    To handle client requests to fetch
    todo item data based on certain filters
    passed through query parameters
*/
app.get("/todos", async (req, res) => {
  const { search_q = "", priority = "", status = "" } = req.query;

  const getTodoItemDataQuery = `
  SELECT
    *
  FROM
    todo
  WHERE
    todo LIKE '%${search_q}%'
    AND
    priority LIKE '%${priority}%'
    AND
    status LIKE '%${status}%';
  `;

  const todoItemData = await todoApplicationDBConnectionObj.all(
    getTodoItemDataQuery
  );
  res.send(todoItemData);
});

module.exports = app;
