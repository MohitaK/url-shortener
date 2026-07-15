import { Router } from "express";
import { createShortUrl } from "../controllers/urls.js";

export const urlsRouter = Router();

urlsRouter.post("/shorten", createShortUrl);
