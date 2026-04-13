const app = require("./app");

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`API escuchando en http://localhost:${PORT}`);
});
