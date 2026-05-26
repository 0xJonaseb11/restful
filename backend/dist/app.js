"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const tasks_1 = __importDefault(require("./routes/tasks"));
const error_1 = require("./middleware/error");
const swagger_1 = require("./docs/swagger");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/api/tasks", tasks_1.default);
app.use("/api/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec, {
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
    res.send(swagger_1.swaggerSpec);
});
app.use(error_1.errorHandler);
exports.default = app;
