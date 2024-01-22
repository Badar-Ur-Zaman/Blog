import express from "express";
import { addUser } from "../controller/user.js";

const router = express.Router()

router.get("/test", addUser);

export default router;