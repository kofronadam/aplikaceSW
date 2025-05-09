const express = require("express");
const app = express();
const port = 3001

const trackerController = require("./controller/tracker");
const categoryController = require("./controller/category");

app.use(express.json()); // podpora pro application/json
app.use(express.urlencoded({ extended: true })); 

app.get("/", (req, res) => {
  res.send("Server is running!"); 
});

app.use("/tracker", trackerController);
app.use("/category", categoryController);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});