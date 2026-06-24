import { generateText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

// Daftar model yang akan dicoba berurutan jika terjadi error (limit/high demand)
const FALLBACK_MODELS = [
  "gemini-2.5-flash-lite",
  "gemini-3.1-flash-lite", // Punya limit 500 RPD di free tier
  "gemini-3-flash",
  "gemini-3.5-flash",
  "gemini-2.5-flash",
];

export async function generateTextWithFallback({ system, prompt }) {
  let lastError;

  for (const modelName of FALLBACK_MODELS) {
    try {
      console.log(`Mencoba model: ${modelName}...`);
      const { text } = await generateText({
        model: google(modelName),
        system,
        prompt,
      });
      console.log(`Berhasil menggunakan model: ${modelName}`);
      return text;
    } catch (error) {
      console.warn(`Gagal menggunakan model ${modelName}:`, error.message);
      lastError = error;
      // Jika error bukan karena limit/kuota, mungkin kita harus stop.
      // Tapi untuk aman, kita lanjut coba model berikutnya saja.
    }
  }

  // Jika semua model gagal
  throw new Error("Semua model AI sedang over limit atau sibuk. Error terakhir: " + lastError?.message);
}

export async function generateVisionWithFallback({ system, prompt, images }) {
  let lastError;

  for (const modelName of FALLBACK_MODELS) {
    try {
      console.log(`Mencoba model vision: ${modelName}...`);
      const messages = [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            ...images.map(img => ({ type: "image", image: img }))
          ]
        }
      ];

      const { text } = await generateText({
        model: google(modelName),
        system,
        messages,
      });
      console.log(`Berhasil menggunakan model vision: ${modelName}`);
      return text;
    } catch (error) {
      console.warn(`Gagal menggunakan model vision ${modelName}:`, error.message);
      lastError = error;
    }
  }

  throw new Error("Semua model AI sedang over limit atau sibuk. Error terakhir: " + lastError?.message);
}
