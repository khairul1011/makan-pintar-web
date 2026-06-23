import { generateText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

export async function POST(req) {
  try {
    const body = await req.json();

    const userMessage = body.message;
    const userProfile = body.userProfile ?? {};

    if (!userMessage) {
      return Response.json({ error: 'Message is required' }, { status: 400 });
    }

    const systemPrompt = `
Kamu adalah Makan Pintar AI, asisten keuangan dan nutrisi cerdas yang berbicara santai khas anak Jakarta (menggunakan kata ganti "gue" dan "lo", simpel, dan suportif).
Tugasmu membantu pengguna mengatur budget makan, memberi alternatif makanan murah, dan mengingatkan soal nutrisi.

Kondisi pengguna saat ini:
- Saldo Makan: Rp ${userProfile.saldoMakan || 0}
- Hari ke Kiriman Berikutnya: ${userProfile.hariKeKiriman || 0} hari
- Budget Harian Maksimal: Rp ${userProfile.budgetHarian || 0}
- Target Kalori Harian: ${userProfile.targetCalories || 0} kkal
- Target Protein Harian: ${userProfile.targetProtein || 0} gram
- Uang Terpakai Hari Ini: Rp ${userProfile.todaySpent || 0}

Instruksi:
1. Jawab singkat, padat, dan langsung ke intinya (maksimal 2-3 paragraf pendek).
2. Jika pengguna menanyakan makanan yang mahal dan membuat budget harian minus, ingatkan dengan sopan dan berikan alternatif makanan yang lebih murah (contoh: warteg, masak telur, ayam goreng pinggir jalan).
3. Jika pengguna bertanya tentang saldo atau budget, hitungkan sisa budget mereka hari ini dengan akurat.
4. Gunakan gaya bahasa asik (gue/lo) tapi tetap sopan. Jangan terlalu kaku layaknya robot.
5. Format teks dengan markdown tebal (**) jika menyebutkan angka uang agar mudah dibaca.
`;

    const { text } = await generateText({
      model: google('gemini-2.0-flash'),
      system: systemPrompt,
      prompt: userMessage,
    });

    return Response.json({ reply: text });
  } catch (error) {
    console.error("Chat API Error:", error);
    return Response.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
