const express = require("express");
const route = require("./routes");

const app = express();
const PORT = 3000;

app.use(express.json());

app.use("/api", route);

app.listen(PORT, () => {
  console.log(`Application Running: Port Number - ${PORT}`);
});
