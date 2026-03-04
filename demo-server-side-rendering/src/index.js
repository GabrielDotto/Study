const express = require("express");
const path = require("path");

const app = express();
const PORT = 3001;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", async (req, res) => {
  const pikachuRequest = await fetch(
    "https://pokeapi.co/api/v2/pokemon/pikachu",
  );
  const pikachuData = await pikachuRequest.json();

  res.render("index", {
    message: `Hello from server-side rendering! You are seeing ${pikachuData.name}`,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
