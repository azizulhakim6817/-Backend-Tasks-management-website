import express from "express";
import AuthoVerifyMiddleware from "../middleware/AuthVerifyMiddleware.js";
import * as UserController from "../controllers/UserController.js";
import * as TasksController from "../controllers/TaskController.js";

const router = express.Router();

// Registration, login, updateProfile ...........................................
router.post("/registration", UserController.registration);
router.post("/login", UserController.login);
router.post(
  "/profileUpdate",
  AuthoVerifyMiddleware,
  UserController.profileUpdate
);

// Task create, update, delete, listTask, TaskCount .......................
router.post("/createTask", AuthoVerifyMiddleware, TasksController.createTask);
router.get("/readTasks", AuthoVerifyMiddleware, TasksController.readTasks);
router.get(
  "/updateTask/:id/:status",
  AuthoVerifyMiddleware,
  TasksController.updateTask
);
router.get(
  "/deleteTask/:id/",
  AuthoVerifyMiddleware,
  TasksController.deleteTask
);
router.get(
  "/listTaskByStatus/:status/",
  AuthoVerifyMiddleware,
  TasksController.listTaskByStatus
);
router.get(
  "/tasksStatusCount",
  AuthoVerifyMiddleware,
  TasksController.tasksStatusCount
);

export default router;
