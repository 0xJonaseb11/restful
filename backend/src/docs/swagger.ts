import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "TaskFlow REST API",
      version: "1.0.0",
      description: "Full-stack RESTful API template powering the TaskFlow task management application.",
      contact: {
        name: "0xJonaseb11",
        url: "https://github.com/0xJonaseb11",
      },
    },
    servers: [
      {
        url: "http://localhost:5001",
        description: "Development Server",
      },
    ],
    tags: [
      {
        name: "Tasks",
        description: "Task management endpoints",
      },
    ],
    components: {
      schemas: {
        Task: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
              example: "123e4567-e89b-12d3-a456-426614174000",
            },
            title: {
              type: "string",
              example: "Implement authentication",
            },
            description: {
              type: "string",
              nullable: true,
              example: "Add JWT-based auth flow to the backend.",
            },
            status: {
              type: "string",
              enum: ["backlog", "todo", "in_progress", "completed"],
              example: "todo",
            },
            priority: {
              type: "string",
              enum: ["low", "medium", "high"],
              example: "high",
            },
            dueDate: {
              type: "string",
              format: "date-time",
              nullable: true,
              example: "2026-06-01T00:00:00.000Z",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2026-05-26T10:00:00.000Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2026-05-26T10:30:00.000Z",
            },
          },
        },
        CreateTaskBody: {
          type: "object",
          required: ["title"],
          properties: {
            title: {
              type: "string",
              example: "Implement authentication",
            },
            description: {
              type: "string",
              nullable: true,
              example: "Add JWT-based auth flow to the backend.",
            },
            status: {
              type: "string",
              enum: ["backlog", "todo", "in_progress", "completed"],
              default: "todo",
            },
            priority: {
              type: "string",
              enum: ["low", "medium", "high"],
              default: "medium",
            },
            dueDate: {
              type: "string",
              format: "date-time",
              nullable: true,
              example: "2026-06-01T00:00:00.000Z",
            },
          },
        },
        UpdateTaskBody: {
          type: "object",
          properties: {
            title: {
              type: "string",
              example: "Updated task title",
            },
            description: {
              type: "string",
              nullable: true,
            },
            status: {
              type: "string",
              enum: ["backlog", "todo", "in_progress", "completed"],
            },
            priority: {
              type: "string",
              enum: ["low", "medium", "high"],
            },
            dueDate: {
              type: "string",
              format: "date-time",
              nullable: true,
            },
          },
        },
        SuccessListResponse: {
          type: "object",
          properties: {
            status: { type: "string", example: "success" },
            results: { type: "integer", example: 3 },
            data: {
              type: "array",
              items: { $ref: "#/components/schemas/Task" },
            },
          },
        },
        SuccessSingleResponse: {
          type: "object",
          properties: {
            status: { type: "string", example: "success" },
            data: { $ref: "#/components/schemas/Task" },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            status: { type: "string", example: "error" },
            message: { type: "string", example: "Task not found" },
          },
        },
        ValidationErrorResponse: {
          type: "object",
          properties: {
            status: { type: "string", example: "fail" },
            errors: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  path: { type: "string", example: "body.title" },
                  message: { type: "string", example: "Title is required" },
                },
              },
            },
          },
        },
      },
    },
    paths: {
      "/api/tasks": {
        get: {
          tags: ["Tasks"],
          summary: "Get all tasks",
          description: "Returns a list of all tasks. Supports filtering by status and priority.",
          parameters: [
            {
              in: "query",
              name: "status",
              schema: {
                type: "string",
                enum: ["backlog", "todo", "in_progress", "completed"],
              },
              description: "Filter tasks by status",
            },
            {
              in: "query",
              name: "priority",
              schema: {
                type: "string",
                enum: ["low", "medium", "high"],
              },
              description: "Filter tasks by priority",
            },
          ],
          responses: {
            200: {
              description: "List of tasks retrieved successfully",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/SuccessListResponse" },
                },
              },
            },
            500: {
              description: "Internal server error",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
          },
        },
        post: {
          tags: ["Tasks"],
          summary: "Create a task",
          description: "Creates a new task with the provided data.",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CreateTaskBody" },
              },
            },
          },
          responses: {
            201: {
              description: "Task created successfully",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/SuccessSingleResponse" },
                },
              },
            },
            400: {
              description: "Validation error",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ValidationErrorResponse" },
                },
              },
            },
            500: {
              description: "Internal server error",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
          },
        },
      },
      "/api/tasks/{id}": {
        get: {
          tags: ["Tasks"],
          summary: "Get a task by ID",
          description: "Retrieves a single task by its UUID.",
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string", format: "uuid" },
              description: "Task UUID",
            },
          ],
          responses: {
            200: {
              description: "Task retrieved successfully",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/SuccessSingleResponse" },
                },
              },
            },
            400: {
              description: "Invalid UUID format",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ValidationErrorResponse" },
                },
              },
            },
            404: {
              description: "Task not found",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
          },
        },
        patch: {
          tags: ["Tasks"],
          summary: "Update a task",
          description: "Partially updates an existing task by its UUID.",
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string", format: "uuid" },
              description: "Task UUID",
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UpdateTaskBody" },
              },
            },
          },
          responses: {
            200: {
              description: "Task updated successfully",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/SuccessSingleResponse" },
                },
              },
            },
            400: {
              description: "Validation error",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ValidationErrorResponse" },
                },
              },
            },
            404: {
              description: "Task not found",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
          },
        },
        delete: {
          tags: ["Tasks"],
          summary: "Delete a task",
          description: "Permanently deletes a task by its UUID.",
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string", format: "uuid" },
              description: "Task UUID",
            },
          ],
          responses: {
            204: {
              description: "Task deleted successfully (no content)",
            },
            400: {
              description: "Invalid UUID format",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ValidationErrorResponse" },
                },
              },
            },
            404: {
              description: "Task not found",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);
