// routes/notificationRoutes.js
import express from "express";
import { getNotifications } from "../controllers/notificationController.js";
import secureRoute from "../middleware/secureRoute.js";

const router = express.Router();

router.get("/", secureRoute, getNotifications);

export default router;
