import { generateVisionWithFallback } from '@/lib/gemini';
import { getAuthUser, unauthorized } from "@/lib/api-helpers";

export async function POST(req) {
  try {
    const { user, error } = await getAuthUser(req);
    if (!user) return unauthorized(error);

    const body = await req.json();
    const { imageBase64 } = body; // format: data:image/jpeg;base64,...

    if (!imageBase64) {
      return Response.json({ error: 'Image is required' }, { status: 400 });
    }

    // Extract base64 payload
    const base64Data = imageBase64.split(',')[1];
    if (!base64Data) {
      return Response.json({ error: 'Invalid image format' }, { status: 400 });
    }

    // Convert base64 string to buffer, then to Uint8Array as expected by ai-sdk image input
    const imageBuffer = Buffer.from(base64Data, 'base64');
    const imageUint8Array = new Uint8Array(imageBuffer);

    const systemPrompt = `
Kamu adalah asisten pengatur budget makanan yang sangat pintar dalam menebak harga makanan kaki lima maupun restoran di Indonesia.
Diberikan sebuah foto makanan, tugasmu adalah mengenali makanannya dan memberikan prediksi harga serta kalori.

Keluarkan hasil berupa objek JSON MURNI tanpa markdown (tanpa \`\`\`json) dengan format berikut:
{
  "namaMakanan": "Nama Makanan (Singkat & Jelas)",
  "prediksiHarga": 15000, 
  "prediksiKalori": 450,
  "emoji": "🍛"
}

Keterangan:
- prediksiHarga dalam nominal angka rupiah murni (integer). Usahakan estimasi harga anak kos / standar Jakarta pinggiran.
- prediksiKalori dalam nominal angka kkal murni (integer).
- Jika foto bukan makanan, prediksiMakanan jadi "Bukan Makanan", harga 0, kalori 0.
`;

    const text = await generateVisionWithFallback({
      system: systemPrompt,
      prompt: "Tolong identifikasi foto makanan ini, beri prediksi harga pasaran, kalori, dan emojinya.",
      images: [imageUint8Array],
    });

    let jsonResult;
    try {
      jsonResult = JSON.parse(text);
    } catch (parseErr) {
      // Clean up markdown if model incorrectly outputs markdown
      const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
      jsonResult = JSON.parse(cleaned);
    }

    return Response.json({ result: jsonResult });
  } catch (error) {
    console.error("Vision API Error:", error);
    return Response.json({ error: 'Failed to process vision request' }, { status: 500 });
  }
}
