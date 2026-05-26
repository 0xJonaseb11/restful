import express from "express";
import cors from "cors";
import taskRoutes from "./routes/tasks";
import { errorHandler } from "./middleware/error";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/tasks", taskRoutes);

app.use(errorHandler);

export default app;
