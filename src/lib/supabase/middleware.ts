import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isManagerRoute } from "@/lib/auth-helpers";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isAuthPage =
    pathname.startsWith("/login") || pathname.startsWith("/signup");
  const isPublicPage = pathname === "/";
  const isOnboardingWaitingPage = pathname.startsWith("/onboarding/waiting");
  const isOnboardingPage = pathname.startsWith("/onboarding");

  // Not logged in: allow auth pages and the public page through, block everything else
  if (!user && !isAuthPage && !isPublicPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (user) {
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("role, company_id, is_active")
      .eq("id", user.id)
      .single();

    const isInactive = error || !profile?.is_active;

    // Send inactive users to the waiting page — but don't redirect
    // them again if they're already there, or you get a loop.
    if (isInactive && !isOnboardingWaitingPage) {
      const url = request.nextUrl.clone();
      url.pathname = "/onboarding/waiting";
      return NextResponse.redirect(url);
    }

    // Active users shouldn't sit on login/signup/public/onboarding pages
    if (!isInactive && (isAuthPage || isPublicPage || isOnboardingPage)) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}