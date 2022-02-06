const express = require("express");
const connection = require("./db");
const bodyParser = require("body-parser");
const port = 3001;

const app = express();

//database
connection();

//middleware
app.use(express.json({ limit: "20mb" }));
app.use(express.static("public"));
app.use(bodyParser.json());

//routes
app.use("/", require("./routes"));

app.listen(port, (err) => {
  if (err) throw err;
  console.log(`Server is listening on port ${port} `);
});
