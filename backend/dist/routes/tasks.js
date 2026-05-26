"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validate_js_1 = require("../middleware/validate.js");
const tasks_js_1 = require("../controllers/tasks.js");
const router = (0, express_1.Router)();
router
    .route("/")
    .get((0, validate_js_1.validate)(tasks_js_1.getTasksSchema), tasks_js_1.getAllTasks)
    .post((0, validate_js_1.validate)(tasks_js_1.createTaskSchema), tasks_js_1.createTask);
router
    .route("/:id")
    .get((0, validate_js_1.validate)(tasks_js_1.getTaskSchema), tasks_js_1.getTaskById)
    .patch((0, validate_js_1.validate)(tasks_js_1.updateTaskSchema), tasks_js_1.updateTask)
    .delete((0, validate_js_1.validate)(tasks_js_1.getTaskSchema), tasks_js_1.deleteTask);
exports.default = router;
