import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { readDb, writeDb, UserSchema } from "./db";
import { randomUUID } from "crypto";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "SUPER_SECRET_FALLBACK_KEY_2026";

// Register
router.post("/register", async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const db = readDb();
    if (db.users.find(u => u.email === email)) {
      return res.status(400).json({ error: "User already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = {
      id: randomUUID(),
      email,
      passwordHash,
      name,
      authProvider: "local" as const,
      createdAt: new Date().toISOString(),
      isPremium: false
    };

    db.users.push(newUser);
    writeDb(db);

    const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, { expiresIn: "7d" });
    
    res.cookie("auth_token", token, {
       httpOnly: true,
       secure: true,
       sameSite: "none",
       maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({ user: { id: newUser.id, email: newUser.email, name: newUser.name } });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password required" });

    const db = readDb();
    const user = db.users.find(u => u.email === email);
    if (!user || !user.passwordHash) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });
    res.cookie("auth_token", token, {
       httpOnly: true,
       secure: true,
       sameSite: "none",
       maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({ user: { id: user.id, email: user.email, name: user.name } });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Me
router.get("/me", (req, res) => {
  const token = req.cookies?.auth_token;
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const db = readDb();
    const user = db.users.find(u => u.id === decoded.userId);
    if (!user) return res.status(401).json({ error: "User not found" });

    res.json({ user: { id: user.id, email: user.email, name: user.name } });
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
});

// Logout
router.post("/logout", (req, res) => {
  res.cookie("auth_token", "", { 
     httpOnly: true, 
     secure: true,
     sameSite: "none",
     expires: new Date(0) 
  });
  res.json({ success: true });
});

// OAuth Mock
router.get("/oauth/url", (req, res) => {
  const redirectUri = req.query.redirectUri || `${req.protocol}://${req.get("host")}/auth/callback`;
  const params = new URLSearchParams({
    client_id: "mock_client",
    redirect_uri: redirectUri as string,
    response_type: "code",
    scope: "email profile"
  });
  
  const authUrl = `/api/auth/oauth/mockAuthorize?${params}`;
  res.json({ url: authUrl });
});

// Render mock authorization page
router.get("/oauth/mockAuthorize", (req, res) => {
  const { redirect_uri } = req.query;
  res.send(`
    <html>
      <body style="font-family: sans-serif; background: #0A0A0A; color: #fff; display: flex; align-items: center; justify-content: center; height: 100vh;">
        <div style="background: #1A1A1A; padding: 40px; border-radius: 20px; text-align: center;">
          <h2>Mock Google OAuth</h2>
          <p>Login as a demo user?</p>
          <button onclick="window.location.href='${redirect_uri}?code=MOCK_AUTH_CODE'" style="padding: 10px 20px; background: #4F46E5; color: white; border: none; border-radius: 8px; cursor: pointer;">
            Authorize Applet
          </button>
        </div>
      </body>
    </html>
  `);
});

export default router;
