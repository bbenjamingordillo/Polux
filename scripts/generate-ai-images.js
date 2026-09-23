/**
 * Optional: replace the free Openverse stock photos with bespoke
 * AI-generated images using your own OpenAI key.
 *
 * Usage:
 *   1. npm install openai   (run inside this scripts/ folder, or add to server/package.json)
 *   2. set OPENAI_API_KEY as an environment variable (never hardcode it here)
 *   3. node generate-ai-images.js
 *
 * This never runs automatically — it's a one-off tool you run yourself
 * when you want custom, on-brand imagery for a specific client site.
 */

const fs = require("fs");
const path = require("path");

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OUT_DIR = path.join(__dirname, "..", "assets", "images");

// Edit these prompts to match your client's brand, niche and color palette.
const PROMPTS = {
  "hero.jpg": "Premium modern gym interior, dramatic lighting, athlete mid-lift, cinematic photo, dark tones with lime green accent lighting, ultra realistic, 4k",
  "classes.jpg": "Group fitness class in a boutique gym, energetic diverse group, motion blur, premium branding photography style",
  "trainer.jpg": "Professional personal trainer portrait, confident pose, gym background softly blurred, editorial photography",
  "gallery-1.jpg": "Close up of dumbbells and gym equipment, moody dramatic lighting, premium fitness brand photography",
  "gallery-2.jpg": "Yoga and mobility studio, calm natural light, minimalist premium interior design",
  "gallery-3.jpg": "Person running on a treadmill in a high-end gym, cardio zone, dynamic angle, premium photography"
};

async function generateImage(filename, prompt) {
  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + OPENAI_API_KEY
    },
    body: JSON.stringify({
      model: "gpt-image-1",
      prompt,
      size: "1024x1024"
    })
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error("OpenAI error for " + filename + ": " + err);
  }

  const data = await res.json();
  const b64 = data.data[0].b64_json;
  fs.writeFileSync(path.join(OUT_DIR, filename), Buffer.from(b64, "base64"));
  console.log("Saved " + filename);
}

async function main() {
  if (!OPENAI_API_KEY) {
    console.error("Set OPENAI_API_KEY before running this script.");
    process.exit(1);
  }
  for (const [filename, prompt] of Object.entries(PROMPTS)) {
    await generateImage(filename, prompt);
  }
  console.log("Done. Re-check the site — you may want to also update ATTRIBUTION.json / remove the Openverse credit line in the footer once all images are AI-generated.");
}

main();
