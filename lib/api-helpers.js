import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

/**
 * Buat Supabase client untuk API routes
 */
export async function createApiSupabase() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Ignore
          }
        },
      },
    }
  );
}

/**
 * Ambil user yang sedang login dari Supabase Auth.
 * Untuk API routes, kita terima auth token dari header Authorization.
 */
export async function getAuthUser(request) {
  const authHeader = request.headers.get("Authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return { user: null, error: "Missing or invalid Authorization header" };
  }

  const token = authHeader.replace("Bearer ", "");

  const { createClient } = await import("@supabase/supabase-js");
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    }
  );

  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    return { user: null, error: error?.message || "Not authenticated" };
  }

  return { user, error: null, supabase };
}

/**
 * Response helper: 401 Unauthorized
 */
export function unauthorized(message = "Unauthorized") {
  return NextResponse.json({ error: message }, { status: 401 });
}

/**
 * Response helper: 400 Bad Request
 */
export function badRequest(message = "Bad request") {
  return NextResponse.json({ error: message }, { status: 400 });
}

/**
 * Response helper: 500 Internal Server Error
 */
export function serverError(message = "Internal server error") {
  return NextResponse.json({ error: message }, { status: 500 });
}
