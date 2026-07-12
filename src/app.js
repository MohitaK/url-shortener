import express from "express";

export const app = express();

// Needed up front: POST /shorten (added later) will read a JSON body.
app.use(express.json());

// Proves the server is up and wired correctly before any real routes exist.
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});
