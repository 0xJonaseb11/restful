"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validate_1 = require("../middleware/validate");
const tasks_1 = require("../controllers/tasks");
const router = (0, express_1.Router)();
router
    .route("/")
    .get((0, validate_1.validate)(tasks_1.getTasksSchema), tasks_1.getAllTasks)
    .post((0, validate_1.validate)(tasks_1.createTaskSchema), tasks_1.createTask);
router
    .route("/:id")
    .get((0, validate_1.validate)(tasks_1.getTaskSchema), tasks_1.getTaskById)
    .patch((0, validate_1.validate)(tasks_1.updateTaskSchema), tasks_1.updateTask)
    .delete((0, validate_1.validate)(tasks_1.getTaskSchema), tasks_1.deleteTask);
exports.default = router;
