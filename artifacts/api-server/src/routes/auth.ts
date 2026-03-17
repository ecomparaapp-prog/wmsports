import { Router } from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

const router = Router();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;

const domain = process.env.REPLIT_DOMAINS?.split(",")[0] || "localhost";
const protocol = domain.includes("localhost") ? "http" : "https";
const CALLBACK_URL = `${protocol}://${domain}/api/auth/google/callback`;

if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: CALLBACK_URL,
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value ?? "";
          const avatar = profile.photos?.[0]?.value ?? null;
          const existing = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.googleId, profile.id))
            .limit(1);

          if (existing.length > 0) {
            const updated = await db
              .update(usersTable)
              .set({ name: profile.displayName, avatar })
              .where(eq(usersTable.googleId, profile.id))
              .returning();
            return done(null, updated[0]);
          }

          const created = await db
            .insert(usersTable)
            .values({ googleId: profile.id, email, name: profile.displayName, avatar })
            .returning();
          return done(null, created[0]);
        } catch (err) {
          return done(err as Error);
        }
      }
    )
  );

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, id))
        .limit(1);
      done(null, user[0] ?? null);
    } catch (err) {
      done(err);
    }
  });
}

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    const base = process.env.FRONTEND_BASE_PATH || "/";
    res.redirect(`${base}profile`);
  }
);

router.post("/auth/logout", (req, res) => {
  req.logout(() => {
    req.session?.destroy(() => {
      res.clearCookie("wm.sid");
      res.json({ ok: true });
    });
  });
});

router.get("/auth/me", (req, res) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({ user: null });
  }
  res.json({ user: req.user });
});

router.put("/auth/profile", async (req, res) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const { fullName, address, phone } = req.body as {
    fullName?: string;
    address?: string;
    phone?: string;
  };
  const userId = (req.user as any).id;
  const updated = await db
    .update(usersTable)
    .set({ fullName, address, phone, updatedAt: new Date() })
    .where(eq(usersTable.id, userId))
    .returning();
  res.json({ user: updated[0] });
});

export default router;
