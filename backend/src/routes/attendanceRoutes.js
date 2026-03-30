import express from "express";
import { registerAttendance } from "../controllers/attendanceController.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

// Rutas base: /api/attendance
router.post("/", protect, registerAttendance);

export default router;
