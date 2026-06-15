import { Router } from "express";
import jwt from "jsonwebtoken";
import { getUserMaterials, saveUserMaterial, deleteUserMaterial, getUserUploads, saveUserUpload, getUserUploadData } from "./sqliteDb";
import { readDb } from "./db";
import multer from "multer";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "SUPER_SECRET_FALLBACK_KEY_2026";

const requireAuth = (req: any, res: any, next: any) => {
  const token = req.cookies?.auth_token;
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    req.userId = decoded.userId;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};

// Get profile basic details from json db
router.get("/me", requireAuth, (req: any, res: any) => {
  const db = readDb();
  const user = db.users.find(u => u.id === req.userId);
  if (!user) return res.status(404).json({ error: "User not found" });

  res.json({ id: user.id, email: user.email, name: user.name, isPremium: user.isPremium });
});

// Materials
router.get("/materials", requireAuth, (req: any, res: any) => {
  const materials = getUserMaterials(req.userId);
  res.json(materials);
});

router.post("/materials", requireAuth, (req: any, res: any) => {
  const material = req.body;
  if (!material.topic) return res.status(400).json({ error: "Material must have a topic" });
  saveUserMaterial(req.userId, material);
  res.json({ success: true });
});

router.delete("/materials/:id", requireAuth, (req: any, res: any) => {
  deleteUserMaterial(req.userId, req.params.id);
  res.json({ success: true });
});

// Uploads
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB default

router.get("/uploads", requireAuth, (req: any, res: any) => {
  const uploads = getUserUploads(req.userId);
  res.json(uploads);
});

router.post("/uploads", requireAuth, upload.single("file"), (req: any, res: any) => {
  if (!req.file) return res.status(400).json({ error: "No file provided" });

  const uploadType = req.body.upload_type || "document";
  const dataString = "data:" + req.file.mimetype + ";base64," + req.file.buffer.toString("base64");

  saveUserUpload(req.userId, {
    filename: req.file.originalname,
    mime_type: req.file.mimetype,
    data: dataString,
    upload_type: uploadType
  });

  res.json({ success: true });
});

router.get("/uploads/:id", requireAuth, (req: any, res: any) => {
  const file = getUserUploadData(req.userId, req.params.id);
  if (!file) return res.status(404).json({ error: "File not found" });
  res.json({ data: file.data });
});

export default router;
