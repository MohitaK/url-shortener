import express from "express";
import { urlsRouter } from "./routes/urls.js";

export const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/", urlsRouter);
