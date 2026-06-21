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
    mindMap TEXT,
    conceptExplanations TEXT,
    glossary TEXT,
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
  // If altering an existing table in SQLite, we should ideally use ALTER TABLE or catch errors, but we rely on IF NOT EXISTS or new DB. For a dev environment, sqliteDb might fail if the table exists without these columns. Let's just catch and alter if possible, or assume it's created fresh. Wait, it's a dev applet, we should probably add try/catch alter tables just in case, but let's stick to simple insert. 
  try {
    db.exec(`ALTER TABLE user_materials ADD COLUMN mindMap TEXT`);
    db.exec(`ALTER TABLE user_materials ADD COLUMN conceptExplanations TEXT`);
    db.exec(`ALTER TABLE user_materials ADD COLUMN glossary TEXT`);
  } catch (e) {
    // Columns might already exist
  }

  const stmt = db.prepare(`
    INSERT INTO user_materials (id, user_id, topic, roadmap, flashcards, practiceQuestions, sources, mindMap, conceptExplanations, glossary, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(
    crypto.randomUUID ? crypto.randomUUID() : (Math.random().toString(36).substring(2) + Date.now().toString(36)),
    userId,
    material.topic,
    JSON.stringify(material.roadmap || []),
    JSON.stringify(material.flashcards || []),
    JSON.stringify(material.practiceQuestions || []),
    JSON.stringify(material.sources || []),
    JSON.stringify(material.mindMap || []),
    JSON.stringify(material.conceptExplanations || []),
    JSON.stringify(material.glossary || []),
    new Date().toISOString()
  );
}

export function getUserMaterials(userId: string) {
  return db.prepare('SELECT * FROM user_materials WHERE user_id = ? ORDER BY created_at DESC').all(userId).map((row: any) => {
    let mindMap = [];
    let conceptExplanations = [];
    let glossary = [];
    try { mindMap = JSON.parse(row.mindMap); } catch (e) {}
    try { conceptExplanations = JSON.parse(row.conceptExplanations); } catch (e) {}
    try { glossary = JSON.parse(row.glossary); } catch (e) {}
    
    return {
      id: row.id,
      topic: row.topic,
      roadmap: JSON.parse(row.roadmap),
      flashcards: JSON.parse(row.flashcards),
      practiceQuestions: JSON.parse(row.practiceQuestions),
      sources: JSON.parse(row.sources),
      mindMap,
      conceptExplanations,
      glossary,
      createdAt: row.created_at
    };
  });
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

