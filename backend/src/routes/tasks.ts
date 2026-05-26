import { Router } from "express";

import { validate } from "../middleware/validate.js";
import {
  createTask,
  createTaskSchema,
  deleteTask,
  getAllTasks,
  getTasksSchema,
  getTaskById,
  getTaskSchema,
  updateTask,
  updateTaskSchema,
} from "../controllers/tasks.js";


const router = Router();


router
  .route("/")

  .get(
    validate(getTasksSchema), 
    getAllTasks
  )

  .post(
    validate(createTaskSchema), 
    createTask
  );


router
  .route("/:id")

  .get(
    validate(getTaskSchema), 
    getTaskById
  )

  .patch(
    validate(updateTaskSchema), 
    updateTask
  )

  .delete(
    validate(getTaskSchema), 
    deleteTask
  );


export default router;
