import express, { type Express } from "express";
import cors from "cors";
import router from "./routes";

const app: Express = express();

const domain = process.env.REPLIT_DOMAINS?.split(",")[0];
const origin = domain ? `https://${domain}` : "http://localhost:3000";

app.use(cors({ origin, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

export default app;
