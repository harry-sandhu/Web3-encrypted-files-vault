import express, { Request, Response } from "express";
import multer from "multer";
import cors from "cors";
import path from "path";
import fs from "fs";

const app = express();
app.use(cors());

const uploadDir = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// ✅ ROOT TEST ROUTE
app.get("/", (req: Request, res: Response) => {
  res.send("✅ DCIM Upload Server is running!");
});

// ✅ LIST FILES (optional but useful)
app.get("/files", (req: Request, res: Response) => {
  const files = fs.readdirSync(uploadDir);
  res.json({ files });
});

// ✅ DOWNLOAD FILE
app.get("/file/:name", (req: Request, res: Response) => {
  const name = Array.isArray(req.params.name)
    ? req.params.name[0]
    : req.params.name;

  const filePath = path.join(uploadDir, name);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "File not found" });
  }

  res.sendFile(filePath);
});
// ✅ MULTER STORAGE
const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, uploadDir);
  },
  filename: (_, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// ✅ UPLOAD ROUTE
app.post("/upload", upload.single("file"), (req: Request, res: Response) => {
  res.json({ success: true, file: req.file?.filename });
});

const PORT = 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://10.214.172.9:${PORT}`);
});