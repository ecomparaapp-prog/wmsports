import express, { type Express } from "express";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import router from "./routes";

const app: Express = express();

const domain = process.env.REPLIT_DOMAINS?.split(",")[0];
const origin = domain ? `https://${domain}` : "http://localhost:3000";

app.use(cors({ origin, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    name: "wm.sid",
    secret: process.env.SESSION_SECRET || "wmsports-dev-secret-change-me",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: !!domain,
      sameSite: domain ? "none" : "lax",
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api", router);

export default app;
