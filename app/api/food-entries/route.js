import { NextResponse } from "next/server";
import { getAuthUser, unauthorized, badRequest, serverError } from "@/lib/api-helpers";

// GET /api/food-entries?date=2025-06-23&limit=20&offset=0
export async function GET(request) {
  const { user, error, supabase } = await getAuthUser(request);
  if (!user) return unauthorized(error);

  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date"); // filter by specific date
  const limit = parseInt(searchParams.get("limit") || "20");
  const offset = parseInt(searchParams.get("offset") || "0");

  let query = supabase
    .from("food_entries")
    .select("*", { count: "exact" })
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (date) {
    query = query.eq("entry_date", date);
  }

  const { data, count, error: dbError } = await query;

  if (dbError) return serverError(dbError.message);

  return NextResponse.json({ entries: data, total: count });
}

// POST /api/food-entries — Tambah log makanan baru
export async function POST(request) {
  const { user, error, supabase } = await getAuthUser(request);
  if (!user) return unauthorized(error);

  const body = await request.json();

  if (!body.name || !body.meal) {
    return badRequest("Field 'name' dan 'meal' wajib diisi");
  }

  const entry = {
    user_id: user.id,
    emoji: body.emoji || "🍛",
    name: body.name,
    meal: body.meal,
    calories: body.calories || 0,
    price: body.price || 0,
    entry_date: body.entry_date || new Date().toISOString().split("T")[0],
  };

  const { data, error: dbError } = await supabase
    .from("food_entries")
    .insert(entry)
    .select()
    .single();

  if (dbError) return serverError(dbError.message);

  return NextResponse.json({ entry: data }, { status: 201 });
}

// DELETE /api/food-entries?id=uuid — Hapus log makanan
export async function DELETE(request) {
  const { user, error, supabase } = await getAuthUser(request);
  if (!user) return unauthorized(error);

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) return badRequest("Parameter 'id' wajib diisi");

  const { error: dbError } = await supabase
    .from("food_entries")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (dbError) return serverError(dbError.message);

  return NextResponse.json({ success: true });
}
