import { NextResponse } from "next/server";
import { getAuthUser, unauthorized, serverError } from "@/lib/api-helpers";

// GET /api/profile — Ambil profil user
export async function GET(request) {
  const { user, error, supabase } = await getAuthUser(request);
  if (!user) return unauthorized(error);

  let { data, error: dbError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (dbError) {
    console.error("Profile dbError:", dbError);
    return serverError(dbError.message);
  }

  if (!data) {
    const defaultProfile = {
      id: user.id,
      full_name: user.user_metadata?.full_name || "Pengguna",
      saldo_makan: 420000,
      hari_ke_kiriman: 12,
      total_kiriman: 1500000,
      tanggal_kiriman: "2025-06-30",
      target_calories: 2000,
      target_protein: 60,
      notifications: { budgetWarning: true, logReminder: true, kirimanReminder: false }
    };

    const { data: newData, error: insertError } = await supabase
      .from("profiles")
      .insert(defaultProfile)
      .select()
      .single();

    if (insertError) {
      console.error("Profile insertError:", insertError);
      return serverError(insertError.message);
    }
    data = newData;
  }

  return NextResponse.json({ profile: data });
}

// PUT /api/profile — Update profil user
export async function PUT(request) {
  const { user, error, supabase } = await getAuthUser(request);
  if (!user) return unauthorized(error);

  const body = await request.json();

  // Field yang boleh diupdate
  const allowedFields = [
    "full_name", "saldo_makan", "hari_ke_kiriman",
    "total_kiriman", "tanggal_kiriman",
    "target_calories", "target_protein", "notifications"
  ];

  const updates = {};
  for (const key of allowedFields) {
    if (body[key] !== undefined) {
      updates[key] = body[key];
    }
  }
  updates.updated_at = new Date().toISOString();

  const { data, error: dbError } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", user.id)
    .select()
    .single();

  if (dbError) return serverError(dbError.message);

  return NextResponse.json({ profile: data });
}
