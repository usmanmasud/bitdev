import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import reputationRouter from "./routes/reputation.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet());
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 30,
    message: { error: "Too many requests, slow down." },
  })
);

app.use("/api/reputation", reputationRouter);

app.get("/api/health", (_, res) => res.json({ status: "ok", oracle: "BitOracle v1.0" }));

app.listen(PORT, () => console.log(`BitOracle running on http://localhost:${PORT}`));
