import { NextResponse } from "next/server";
import { getAuthUser, unauthorized, serverError } from "@/lib/api-helpers";
import { generateText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

export async function GET(request) {
  const { user, error } = await getAuthUser(request);
  if (!user) return unauthorized(error);

  const { searchParams } = new URL(request.url);
  const budget = parseInt(searchParams.get("budget")) || 45000;

  try {
    const { text } = await generateText({
      model: google("gemini-2.0-flash"),
      prompt: `Buatkan 5 resep makanan survival ala anak kos (sangat murah) yang harganya di bawah Rp ${budget}.
Penting: Resep harus realistis dan bahan-bahannya bisa dibeli dengan harga tersebut.
Berikan jawaban HANYA berupa JSON valid berbentuk array of objects tanpa markdown block (seperti \`\`\`json) atau teks pengantar apa pun. 

Struktur JSON yang WAJIB digunakan untuk setiap resep:
{
  "emoji": "🍳",
  "name": "Nama Resep",
  "meta": "Rp Harga | Waktu (misal: 10 menit) | ~Kalori kkal",
  "price": HargaAngkaInt,
  "ingredients": ["Bahan 1", "Bahan 2"],
  "tags": ["tag1", "tag2"],
  "steps": [
    ["Langkah pertama", "X menit"],
    ["Langkah kedua", "Y menit"]
  ]
}

Batas harga untuk SATU porsi/resep adalah maksimal Rp ${budget}. Gunakan bahan lokal Indonesia (tempe, tahu, telur, mie, dll).`,
    });

    // Remove markdown json block if AI still outputs it
    const cleanJson = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    const recipes = JSON.parse(cleanJson);
    return NextResponse.json({ recipes });
  } catch (err) {
    console.error("Gagal men-generate resep:", err);
    return serverError("Gagal men-generate resep. " + err.message);
  }
}
