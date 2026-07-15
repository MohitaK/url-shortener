import { Router } from "express";
import { createShortUrl, redirectToLongUrl } from "../controllers/urls.js";

export const urlsRouter = Router();

urlsRouter.post("/shorten", createShortUrl);

urlsRouter.get("/:code", redirectToLongUrl);
