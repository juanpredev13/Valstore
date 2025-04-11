import { Router } from "express";
import type { Request, Response } from "express";
import { userController } from "../di/user.di";

const router = Router();

router.get("/", (req: Request, res: Response): void => { userController.getAll(req, res); });
router.get("/:id", (req: Request, res: Response): void => { userController.getById(req, res); });
router.post("/", (req: Request, res: Response): void => { userController.create(req, res); });
router.put("/:id", (req: Request, res: Response): void => { userController.update(req, res); });
router.delete("/:id", (req: Request, res: Response): void => { userController.delete(req, res); });

export default router;
