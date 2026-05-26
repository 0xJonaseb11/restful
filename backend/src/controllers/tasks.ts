import { Request, Response, NextFunction } from "express";

import { z } from "zod";

import { db } from "../utils/db.js";

import { AppError } from "../middleware/error.js";


export const createTaskSchema = z.object({

  body: z.object({

    title: z.string().min(1, "Title is required"),

    description: z.string().optional(),

    status: z.enum(["todo", "in_progress", "completed", "backlog"]).optional(),

    priority: z.enum(["low", "medium", "high"]).optional(),

    dueDate: z.string().nullable().optional(),

  }),

});


export const updateTaskSchema = z.object({

  params: z.object({

    id: z.string().uuid("Invalid task ID format"),

  }),

  body: z.object({

    title: z.string().min(1).optional(),

    description: z.string().nullable().optional(),

    status: z.enum(["todo", "in_progress", "completed", "backlog"]).optional(),

    priority: z.enum(["low", "medium", "high"]).optional(),

    dueDate: z.string().nullable().optional(),

  }),

});


export const getTaskSchema = z.object({

  params: z.object({

    id: z.string().uuid("Invalid task ID format"),

  }),

});


export const getTasksSchema = z.object({

  query: z.object({

    status: z.enum(["todo", "in_progress", "completed", "backlog"]).optional(),

    priority: z.enum(["low", "medium", "high"]).optional(),

  }),

});


export const getAllTasks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {

    const { status, priority } = req.query;

    const filter: any = {};


    if (status) {
      filter.status = status;
    }


    if (priority) {
      filter.priority = priority;
    }


    const tasks = await db.task.findMany({

      where: filter,

      orderBy: {
        createdAt: "desc",
      },

    });


    res.status(200).json({
      status: "success",
      results: tasks.length,
      data: tasks,
    });

  } catch (error) {

    next(error);

  }

};


export const getTaskById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {

    const { id } = req.params;


    const task = await db.task.findUnique({
      where: {
        id,
      },
    });


    if (!task) {
      throw new AppError(404, "Task not found");
    }


    res.status(200).json({
      status: "success",
      data: task,
    });

  } catch (error) {

    next(error);

  }

};


export const createTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {

    const { title, description, status, priority, dueDate } = req.body;

    const parsedDate = dueDate ? new Date(dueDate) : null;


    const task = await db.task.create({

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

  } catch (error) {

    next(error);

  }

};


export const updateTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {

    const { id } = req.params;

    const { title, description, status, priority, dueDate } = req.body;


    const existingTask = await db.task.findUnique({
      where: {
        id,
      },
    });


    if (!existingTask) {
      throw new AppError(404, "Task not found");
    }


    const updatedData: any = {};


    if (title !== undefined) {
      updatedData.title = title;
    }


    if (description !== undefined) {
      updatedData.description = description;
    }


    if (status !== undefined) {
      updatedData.status = status;
    }


    if (priority !== undefined) {
      updatedData.priority = priority;
    }


    if (dueDate !== undefined) {
      updatedData.dueDate = dueDate ? new Date(dueDate) : null;
    }


    const task = await db.task.update({

      where: {
        id,
      },

      data: updatedData,

    });


    res.status(200).json({
      status: "success",
      data: task,
    });

  } catch (error) {

    next(error);

  }

};


export const deleteTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {

    const { id } = req.params;


    const existingTask = await db.task.findUnique({
      where: {
        id,
      },
    });


    if (!existingTask) {
      throw new AppError(404, "Task not found");
    }


    await db.task.delete({
      where: {
        id,
      },
    });


    res.status(204).send();

  } catch (error) {

    next(error);

  }

};
