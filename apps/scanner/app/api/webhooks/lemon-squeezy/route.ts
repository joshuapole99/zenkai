import { createHmac, timingSafeEqual } from "crypto";
import { supabaseAdmin } from "@/lib/supabase";

const PLAN_MAP: Record<string, string> = {
  "1592277": "starter",
  "1592303": "pro",
  "1599440": "pro",   // test variant (€0)
};

function planFromVariant(variantId: string | number): string {
  return PLAN_MAP[String(variantId)] ?? "free";
}

async function verifySignature(req: Request, rawBody: string): Promise<boolean> {
  const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;
  if (!secret) throw new Error("LEMON_SQUEEZY_WEBHOOK_SECRET not set");
  const sig = req.headers.get("x-signature");
  if (!sig) return false;
  const hmac = createHmac("sha256", secret).update(rawBody).digest("hex");
  try {
    return timingSafeEqual(Buffer.from(hmac), Buffer.from(sig));
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  const rawBody = await req.text();

  const valid = await verifySignature(req, rawBody);
  if (!valid) return new Response("Unauthorized", { status: 401 });

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return new Response("Bad Request", { status: 400 });
  }

  const event      = payload.meta as Record<string, unknown>;
  const eventName  = event?.event_name as string;
  const data       = payload.data as Record<string, unknown>;
  const attributes = data?.attributes as Record<string, unknown>;

  if (!eventName || !attributes) {
    return new Response(
      JSON.stringify({ debug: "missing_eventName_or_attributes", eventName, hasData: !!data, hasAttributes: !!attributes }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const email      = attributes.user_email as string;
  const variantId  = attributes.variant_id as string | number;
  const subId      = data.id as string;
  const customerId = attributes.customer_id as string | number;
  const status     = attributes.status as string;

  if (!email) {
    return new Response(
      JSON.stringify({ debug: "missing_email", eventName, variantId: String(variantId) }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  if (eventName === "subscription_created" || eventName === "subscription_updated") {
    const plan = planFromVariant(variantId);

    const { data: existing, error: selectErr } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (selectErr && selectErr.code !== "PGRST116") {
      console.error("[LS] select_failed:", JSON.stringify(selectErr));
      return new Response(JSON.stringify({ debug: "select_failed", error: selectErr }), { status: 200, headers: { "Content-Type": "application/json" } });
    }

    if (existing) {
      const { error } = await supabaseAdmin
        .from("users")
        .update({ plan, ls_subscription_id: subId, ls_customer_id: String(customerId) })
        .eq("email", email);
      if (error) {
        console.error("[LS] update_failed:", JSON.stringify(error));
        return new Response(JSON.stringify({ debug: "update_failed", error }), { status: 200, headers: { "Content-Type": "application/json" } });
      }
    } else {
      const { error } = await supabaseAdmin
        .from("users")
        .insert({ email, plan, ls_subscription_id: subId, ls_customer_id: String(customerId) });
      if (error) {
        console.error("[LS] insert_failed:", JSON.stringify(error));
        return new Response(JSON.stringify({ debug: "insert_failed", error }), { status: 200, headers: { "Content-Type": "application/json" } });
      }
    }

    return new Response(JSON.stringify({ debug: "ok", plan, email }), { status: 200, headers: { "Content-Type": "application/json" } });
  }

  if (eventName === "subscription_cancelled" || eventName === "subscription_expired" || eventName === "subscription_paused") {
    await supabaseAdmin
      .from("users")
      .update({ plan: "free", ls_subscription_id: null })
      .eq("email", email);
  }

  return new Response("OK", { status: 200 });
}
