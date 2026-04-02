import express from "express";

const routes = express.Router();

routes.get("/hello", (req, res) => {
  res.send({ message: "Hi from hello route" });
});

routes.post("/hello", (req, res) => {
  res.send({ message: "Post Route working" });
});

routes.put("/hello", (req, res) => {
  res.send({ message: "Update route also working" });
});

routes.delete("/hello", (req, res) => {
  res.send({ message: "Delete also working" });
});

export default routes;
