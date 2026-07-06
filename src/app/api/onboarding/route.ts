import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAuthProfile } from "@/lib/auth-helpers";
import { NextResponse } from "next/server";

const DEFAULT_TEMPLATES = [
  {
    name: "Standard Inspection",
    description: "Full 15-step vehicle inspection covering all systems",
    is_default: true,
    template_data: { steps: 15 },
  },
  {
    name: "Quick Pre-Purchase",
    description: "Exterior, engine, and road test focused inspection",
    is_default: false,
    template_data: { steps: 8 },
  },
  {
    name: "Insurance Assessment",
    description: "Damage-focused inspection for insurance claims",
    is_default: false,
    template_data: { steps: 6 },
  },
];

const DEFAULT_PRICING = [
  {
    name: "Standard Inspection",
    base_price: 350,
    description: "Full 15-step comprehensive inspection",
    is_active: true,
  },
  {
    name: "Quick Inspection",
    base_price: 200,
    description: "Exterior and basic mechanical check",
    is_active: true,
  },
  {
    name: "Premium Inspection",
    base_price: 500,
    description: "Full inspection with OBD scan and road test",
    is_active: true,
  },
];

export async function POST(request: Request) {
  const supabase = await createClient();
  const auth = await getAuthProfile(supabase);

  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (auth.profile.company_id) {
    return NextResponse.json({ companyId: auth.profile.company_id });
  }

  if (auth.profile.role !== "manager") {
    return NextResponse.json(
      { error: "Only managers can create a company. Ask your manager for an invite." },
      { status: 403 }
    );
  }

  const body = await request.json();
  const companyName = body.companyName?.trim() || "Zoom Car Inspection";

  const admin = createAdminClient();

  const { data: company, error: companyError } = await admin
    .from("companies")
    .insert({
      name: companyName,
      email: auth.profile.email,
      settings: { reportFooter: "" },
    })
    .select()
    .single();

  if (companyError) {
    return NextResponse.json({ error: companyError.message }, { status: 500 });
  }

  const { error: profileError } = await admin
    .from("profiles")
    .update({ company_id: company.id, updated_at: new Date().toISOString() })
    .eq("id", auth.user.id);

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }

  await admin.from("inspection_templates").insert(
    DEFAULT_TEMPLATES.map((t) => ({ ...t, company_id: company.id }))
  );

  await admin.from("pricing").insert(
    DEFAULT_PRICING.map((p) => ({ ...p, company_id: company.id }))
  );

  return NextResponse.json({ companyId: company.id, company }, { status: 201 });
}

export async function GET() {
  const supabase = await createClient();
  const auth = await getAuthProfile(supabase);

  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!auth.profile.company_id) {
    return NextResponse.json({ setupComplete: false });
  }

  const { data: company } = await supabase
    .from("companies")
    .select("*")
    .eq("id", auth.profile.company_id)
    .single();

  return NextResponse.json({ setupComplete: true, company });
}
