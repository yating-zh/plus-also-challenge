import "dotenv/config";
import express from "express";
import multer from "multer";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { OpenAI, toFile } from "openai";

// ESM workaround for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Simple login endpoint
const PASSWORD = "goodday";
app.post("/login", (req, res) => {
  const { password } = req.body;
  if (password === PASSWORD) {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, message: "incorrect password" });
  }
});

// Multer config for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// Initialize OpenAI client
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Image generation route
app.post("/generate", upload.single("image"), async (req, res) => {
  const { prompt } = req.body;
  const file = req.file;

  if (!file) return res.status(400).json({ error: "Image upload failed." });

  try {
    const filePath = path.join(__dirname, file.path);
    const fileStream = fs.createReadStream(filePath);
    const imageFile = await toFile(fileStream, file.originalname, {
      type: "image/png",
    });

    const rsp = await client.images.edit({
      model: "gpt-image-1",
      image: [imageFile],
      prompt,
    });

    if (rsp.data?.[0]?.b64_json) {
      const base64 = rsp.data[0].b64_json;
      const imageUrl = `data:image/png;base64,${base64}`;
      return res.json({ output: imageUrl });
    } else if (rsp.data?.[0]?.url) {
      return res.json({ output: rsp.data[0].url });
    } else {
      return res.status(500).json({ error: "No output returned from OpenAI." });
    }
  } catch (err) {
    console.error("❌ Error:", err.response?.data || err.message || err);
    return res.status(500).json({ error: "Image generation failed." });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
