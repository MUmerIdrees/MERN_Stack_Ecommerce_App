import express from "express";
import { fetchDashboardData } from "../../controllers/admin/dashboard.controller.js";

const router = express.Router();

router.get('/get', fetchDashboardData);

export default router;