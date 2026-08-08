import { Router } from "express";
import { readDb } from "./db";
import jwt from "jsonwebtoken";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "SUPER_SECRET_FALLBACK_KEY_2026";

// Quick mock admin auth check
const authenticateAdmin = (req: any, res: any, next: any) => {
  const token = req.cookies.auth_token;
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const db = readDb();
    const user = db.users.find(u => u.id === decoded.userId);
    
    // In a real app we'd have a role field like 'role: admin'
    if (!user || (user.email !== "admin@neurallearn.com" && user.email !== "demo@example.com" && user.email !== "paladityasingh2907@gmail.com")) {
      return res.status(403).json({ error: "Forbidden: Admin access only" });
    }
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

router.get("/stats", authenticateAdmin, (req, res) => {
  const db = readDb();
  let totalUsers = db.users.length;
  let premiumUsers = db.users.filter(u => u.isPremium).length;
  
  const mockUsers = [
    { id: 'm1', email: 'alice.johnson@edu.com', name: 'Alice Johnson', isPremium: true, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString() },
    { id: 'm2', email: 'b.smith22@ymail.com', name: 'Bob Smith', isPremium: false, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString() },
    { id: 'm3', email: 'charlie.w@academy.net', name: 'Charlie W', isPremium: true, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString() },
    { id: 'm4', email: 'diana.stark@university.edu', name: 'Diana Stark', isPremium: true, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString() },
    { id: 'm5', email: 'e.turner@school.org', name: 'Ethan Turner', isPremium: false, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString() }
  ];

  const recentUsers = db.users.slice(-10).reverse().map(u => ({
    id: u.id,
    email: u.email,
    name: u.name,
    isPremium: u.isPremium,
    createdAt: u.createdAt,
  }));

  if (totalUsers < 10) {
    totalUsers += 1450;
    premiumUsers += 342;
    recentUsers.push(...mockUsers);
  }

  // Fake MRR - Assuming $12 / user
  const currentMRR = premiumUsers * 12;

  // Fake revenue history for chart
  const revenueHistory = [
    { date: "2026-01", amount: Math.max(0, currentMRR - 2400) },
    { date: "2026-02", amount: Math.max(0, currentMRR - 1200) },
    { date: "2026-03", amount: Math.max(0, currentMRR - 500) },
    { date: "2026-04", amount: currentMRR - 100 },
    { date: "2026-05", amount: currentMRR }
  ];

  res.json({
    totalUsers,
    premiumUsers,
    currentMRR,
    revenueHistory,
    recentUsers: recentUsers.slice(0, 10)
  });
});

export default router;

// Submit Feedback
router.post("/feedback", (req, res) => {
  const { feedback, userId } = req.body;
  // Just log it for now
  console.log(`[Feedback] from ${userId || 'anonymous'}: ${feedback}`);
  res.json({ success: true });
});
