import express from "express";
import HelloRoutes from "./Routes/Hello.routes.js";
import { config } from "dotenv";
import { connectDB, disconnectDB } from "./config/db.js";

const app = express();
config();

const PORT = 5000;

app.use("/Hi", HelloRoutes);

const startServer = async () => {
  try {
    await connectDB();
    const server = app.listen(PORT, () => {
      console.log(`Server is running at ${PORT}`);
    });

    process.on("unhandledRejection", (err) => {
      console.log("unhandled Rejection: ", err);
      server.close(async () => {
        await disconnectDB();
        process.exit(1);
      });
    });

    process.on("uncaughtException", (err) => {
      console.log("Uncaught Exception: ", err);
      server.close(async () => {
        await disconnectDB();
        process.exit(1);
      });
    });

    process.on("SIGTERM", (err) => {
      console.log("SIGTERM recieved , Shutting down gracefully");
      server.close(async () => {
        await disconnectDB();
        process.exit(1);
      });
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
