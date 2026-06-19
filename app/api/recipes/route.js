import { NextResponse } from "next/server";
import { getAuthUser, unauthorized, serverError } from "@/lib/api-helpers";

// GET /api/recipes?filter=semua&maxPrice=10000&tag=telur
export async function GET(request) {
  const { user, error, supabase } = await getAuthUser(request);
  if (!user) return unauthorized(error);

  const { searchParams } = new URL(request.url);
  const maxPrice = searchParams.get("maxPrice");
  const tag = searchParams.get("tag");

  let query = supabase
    .from("recipes")
    .select("*")
    .order("price", { ascending: true });

  if (maxPrice) {
    query = query.lte("price", parseInt(maxPrice));
  }

  if (tag) {
    query = query.contains("tags", [tag.toLowerCase()]);
  }

  const { data, error: dbError } = await query;

  if (dbError) return serverError(dbError.message);

  return NextResponse.json({ recipes: data });
}
