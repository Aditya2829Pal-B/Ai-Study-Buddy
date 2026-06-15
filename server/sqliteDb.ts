import Database from 'better-sqlite3';
import path from 'path';
import crypto from 'crypto';

const dbPath = path.join(process.cwd(), 'collab.db');
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS rooms (
    id TEXT PRIMARY KEY,
    text TEXT,
    lines TEXT,
    chat TEXT
  );

  CREATE TABLE IF NOT EXISTS user_materials (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    topic TEXT,
    roadmap TEXT,
    flashcards TEXT,
    practiceQuestions TEXT,
    sources TEXT,
    created_at TEXT
  );

  CREATE TABLE IF NOT EXISTS user_uploads (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    filename TEXT,
    mime_type TEXT,
    data TEXT,
    upload_type TEXT,
    created_at TEXT
  );
`);

export function getRoomStateFromDb(roomId: string) {
  const row = db.prepare('SELECT * FROM rooms WHERE id = ?').get(roomId) as any;
  if (row) {
    return {
      text: row.text || '',
      lines: JSON.parse(row.lines || '[]'),
      chat: JSON.parse(row.chat || '[]')
    };
  }
  return null;
}

export function saveRoomStateToDb(roomId: string, state: { text: string, lines: any[], chat?: any[] }) {
  const stmt = db.prepare(`
    INSERT INTO rooms (id, text, lines, chat) 
    VALUES (?, ?, ?, ?) 
    ON CONFLICT(id) DO UPDATE SET 
      text = excluded.text,
      lines = excluded.lines,
      chat = excluded.chat
  `);
  stmt.run(roomId, state.text, JSON.stringify(state.lines || []), JSON.stringify(state.chat || []));
}

export function saveUserMaterial(userId: string, material: any) {
  const stmt = db.prepare(`
    INSERT INTO user_materials (id, user_id, topic, roadmap, flashcards, practiceQuestions, sources, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(
    crypto.randomUUID ? crypto.randomUUID() : (Math.random().toString(36).substring(2) + Date.now().toString(36)),
    userId,
    material.topic,
    JSON.stringify(material.roadmap || []),
    JSON.stringify(material.flashcards || []),
    JSON.stringify(material.practiceQuestions || []),
    JSON.stringify(material.sources || []),
    new Date().toISOString()
  );
}

export function getUserMaterials(userId: string) {
  return db.prepare('SELECT * FROM user_materials WHERE user_id = ? ORDER BY created_at DESC').all(userId).map((row: any) => ({
    id: row.id,
    topic: row.topic,
    roadmap: JSON.parse(row.roadmap),
    flashcards: JSON.parse(row.flashcards),
    practiceQuestions: JSON.parse(row.practiceQuestions),
    sources: JSON.parse(row.sources),
    createdAt: row.created_at
  }));
}

export function deleteUserMaterial(userId: string, materialId: string) {
  return db.prepare('DELETE FROM user_materials WHERE id = ? AND user_id = ?').run(materialId, userId);
}

export function saveUserUpload(userId: string, file: { filename: string, mime_type: string, data: string, upload_type: string }) {
  const stmt = db.prepare(`
    INSERT INTO user_uploads (id, user_id, filename, mime_type, data, upload_type, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(
    crypto.randomUUID ? crypto.randomUUID() : (Math.random().toString(36).substring(2) + Date.now().toString(36)),
    userId,
    file.filename,
    file.mime_type,
    file.data, // Could be large
    file.upload_type,
    new Date().toISOString()
  );
}

export function getUserUploads(userId: string) {
  return db.prepare('SELECT id, filename, mime_type, upload_type, created_at FROM user_uploads WHERE user_id = ? ORDER BY created_at DESC').all(userId);
}

export function getUserUploadData(userId: string, fileId: string) {
  return db.prepare('SELECT data FROM user_uploads WHERE id = ? AND user_id = ?').get(fileId, userId) as { data: string } | undefined;
}

