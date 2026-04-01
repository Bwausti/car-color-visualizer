import fs from "fs";
import path from "path";

// Vercel serverless has a read-only filesystem except /tmp
const DATA_DIR = path.join("/tmp", "car-visualizer-results");

export interface ResultData {
  id: string;
  originalImage: string;
  resultImage: string;
  targetColor: string;
  createdAt: string;
}

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function saveResult(data: ResultData): void {
  ensureDir();
  const filePath = path.join(DATA_DIR, `${data.id}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data), "utf-8");
}

export function getResult(id: string): ResultData | null {
  ensureDir();
  const filePath = path.join(DATA_DIR, `${id}.json`);
  if (!fs.existsSync(filePath)) return null;
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as ResultData;
  } catch {
    return null;
  }
}
