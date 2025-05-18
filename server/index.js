require("dotenv").config();

const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const { OpenAI, toFile } = require("openai");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PASSWORD = "goodday";
app.post("/login", (req, res) => {
  const { password } = req.body;
  if (password === PASSWORD) {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, message: "incorrect password" });
  }
});

// Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage: storage });
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
  console.log(`Server listening on http://localhost:${PORT}`);
});
