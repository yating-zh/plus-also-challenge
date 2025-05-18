import 'dotenv/config';
import fs from 'fs';
import OpenAI, { toFile } from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const imageFiles = [
  "test-image.png",
];

const images = await Promise.all(
  imageFiles.map((file) =>
    toFile(fs.createReadStream(file), file, { type: "image/png" })
  )
);

const rsp = await client.images.edit({
  model: "gpt-image-1",
  image: images,
  prompt: "Create a lovely gift basket with these four items in it",
});

console.log("✅ Response:", rsp.data);

// Save image if base64 is included
if (rsp.data?.[0]?.b64_json) {
  const base64 = rsp.data[0].b64_json;
  const buffer = Buffer.from(base64, "base64");
  fs.writeFileSync("basket.png", buffer);
  console.log("✅ Image saved to basket.png");
} else if (rsp.data?.[0]?.url) {
  console.log("🌐 Image URL:", rsp.data[0].url);
} else {
  console.warn("⚠️ No image returned.");
}
