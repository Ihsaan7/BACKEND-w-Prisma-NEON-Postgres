import express from "express";
import HelloRoutes from "./Routes/Hello.routes.js";

const app = express();
const PORT = 5000;

app.use("/Hi", HelloRoutes);

const server = app.listen(5000, () => {
  console.log(`Server is running at ${PORT}`);
});
