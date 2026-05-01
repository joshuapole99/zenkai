import { createHmac, timingSafeEqual } from "crypto";
import { supabaseAdmin } from "@/lib/supabase";

const PLAN_MAP: Record<string, string> = {
  "1592277": "starter",
  "1592303": "pro",
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
  if (!valid) {
    return new Response("Unauthorized", { status: 401 });
  }

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
    return new Response("OK", { status: 200 });
  }

  const email      = attributes.user_email as string;
  const variantId  = attributes.variant_id as string | number;
  const subId      = data.id as string;
  const customerId = attributes.customer_id as string | number;
  const status     = attributes.status as string;

  if (!email) return new Response("OK", { status: 200 });

  switch (eventName) {
    case "subscription_created":
    case "subscription_updated": {
      const plan = planFromVariant(variantId);
      await supabaseAdmin
        .from("users")
        .upsert(
          {
            email,
            plan,
            ls_subscription_id: subId,
            ls_customer_id: String(customerId),
          },
          { onConflict: "email" }
        );
      break;
    }

    case "subscription_cancelled":
    case "subscription_expired":
    case "subscription_paused": {
      // Downgrade to free on cancel/expire
      const plan = status === "cancelled" || status === "expired" ? "free" : "free";
      await supabaseAdmin
        .from("users")
        .update({ plan, ls_subscription_id: null })
        .eq("email", email);
      break;
    }

    default:
      break;
  }

  return new Response("OK", { status: 200 });
}
