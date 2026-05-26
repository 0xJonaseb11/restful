"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.createTask = exports.getTaskById = exports.getAllTasks = exports.getTasksSchema = exports.getTaskSchema = exports.updateTaskSchema = exports.createTaskSchema = void 0;
const zod_1 = require("zod");
const db_1 = require("../utils/db");
const error_1 = require("../middleware/error");
exports.createTaskSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(1, "Title is required"),
        description: zod_1.z.string().optional(),
        status: zod_1.z.enum(["todo", "in_progress", "completed", "backlog"]).optional(),
        priority: zod_1.z.enum(["low", "medium", "high"]).optional(),
        dueDate: zod_1.z.string().nullable().optional(),
    }),
});
exports.updateTaskSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid("Invalid task ID format"),
    }),
    body: zod_1.z.object({
        title: zod_1.z.string().min(1).optional(),
        description: zod_1.z.string().nullable().optional(),
        status: zod_1.z.enum(["todo", "in_progress", "completed", "backlog"]).optional(),
        priority: zod_1.z.enum(["low", "medium", "high"]).optional(),
        dueDate: zod_1.z.string().nullable().optional(),
    }),
});
exports.getTaskSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid("Invalid task ID format"),
    }),
});
exports.getTasksSchema = zod_1.z.object({
    query: zod_1.z.object({
        status: zod_1.z.enum(["todo", "in_progress", "completed", "backlog"]).optional(),
        priority: zod_1.z.enum(["low", "medium", "high"]).optional(),
    }),
});
const getAllTasks = async (req, res, next) => {
    try {
        const { status, priority } = req.query;
        const filter = {};
        if (status)
            filter.status = status;
        if (priority)
            filter.priority = priority;
        const tasks = await db_1.db.task.findMany({
            where: filter,
            orderBy: { createdAt: "desc" },
        });
        res.status(200).json({
            status: "success",
            results: tasks.length,
            data: tasks,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllTasks = getAllTasks;
const getTaskById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const task = await db_1.db.task.findUnique({ where: { id } });
        if (!task) {
            throw new error_1.AppError(404, "Task not found");
        }
        res.status(200).json({
            status: "success",
            data: task,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getTaskById = getTaskById;
const createTask = async (req, res, next) => {
    try {
        const { title, description, status, priority, dueDate } = req.body;
        const parsedDate = dueDate ? new Date(dueDate) : null;
        const task = await db_1.db.task.create({
            data: {
                title,
                description,
                status,
                priority,
                dueDate: parsedDate,
            },
        });
        res.status(201).json({
            status: "success",
            data: task,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createTask = createTask;
const updateTask = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, description, status, priority, dueDate } = req.body;
        const existingTask = await db_1.db.task.findUnique({ where: { id } });
        if (!existingTask) {
            throw new error_1.AppError(404, "Task not found");
        }
        const updatedData = {};
        if (title !== undefined)
            updatedData.title = title;
        if (description !== undefined)
            updatedData.description = description;
        if (status !== undefined)
            updatedData.status = status;
        if (priority !== undefined)
            updatedData.priority = priority;
        if (dueDate !== undefined) {
            updatedData.dueDate = dueDate ? new Date(dueDate) : null;
        }
        const task = await db_1.db.task.update({
            where: { id },
            data: updatedData,
        });
        res.status(200).json({
            status: "success",
            data: task,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateTask = updateTask;
const deleteTask = async (req, res, next) => {
    try {
        const { id } = req.params;
        const existingTask = await db_1.db.task.findUnique({ where: { id } });
        if (!existingTask) {
            throw new error_1.AppError(404, "Task not found");
        }
        await db_1.db.task.delete({ where: { id } });
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
};
exports.deleteTask = deleteTask;
