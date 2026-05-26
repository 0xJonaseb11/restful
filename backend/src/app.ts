import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import taskRoutes from "./routes/tasks";
import { errorHandler } from "./middleware/error";
import { swaggerSpec } from "./docs/swagger";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/tasks", taskRoutes);

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: "TaskFlow API Docs",
  customCss: `
    .swagger-ui .topbar { background: #0f111a; border-bottom: 1px solid rgba(255,255,255,0.08); }
    .swagger-ui .topbar-wrapper .link img { display: none; }
    .swagger-ui .topbar-wrapper .link::before { content: "⚡ TaskFlow API"; color: #8b5cf6; font-size: 1.2rem; font-weight: 700; }
    body .swagger-ui { background: #090a0f; color: #f8fafc; }
  `,
}));

app.get("/api/docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

app.use(errorHandler);

export default app;
