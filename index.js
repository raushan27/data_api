const express = require("express");
const bodyParser = require("body-parser");
const routes = require("./routes");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());

app.post("/:collection", routes.create);
app.get("/:collection/:id", routes.read);
app.post("/:collection/:id", routes.update);
app.delete("/:collection/:id", routes.delete);

app.get("/:collection/", routes.all);

const port = process.env.PORT || 3000;
app.set("port", port);
if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => console.log(`Server running on port ${port}`));
}

module.exports = app;
