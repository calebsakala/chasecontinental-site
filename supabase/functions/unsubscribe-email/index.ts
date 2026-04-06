import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY =
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const DEFAULT_SITE_URL = "https://chasecontinental.com";

const siteUrl = (
  Deno.env.get("RESOURCE_EMAIL_SITE_URL") ?? DEFAULT_SITE_URL
).replace(/\/$/, "");

const html = (status: number, title: string, body: string) =>
  new Response(
    `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f0;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;background:#f4f4f0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e5e0;">
          <tr>
            <td style="background:#f8f8f5;padding:28px 36px;text-align:center;border-bottom:1px solid #e5e5e0;">
              <a href="${siteUrl}" style="display:inline-block;text-decoration:none;color:#0f6e56;font-size:28px;line-height:1.1;font-weight:800;letter-spacing:0.12em;text-transform:uppercase;">CHASE CONTINENTAL</a>
            </td>
          </tr>
          <tr>
            <td style="padding:36px;">
              <h1 style="margin:0 0 16px;font-size:24px;line-height:1.2;color:#1a1a18;">${title}</h1>
              <p style="margin:0;font-size:15px;line-height:1.7;color:#5f5e5a;">${body}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
    {
      status,
      headers: {
        ...corsHeaders,
        "Content-Type": "text/html; charset=utf-8",
      },
    },
  );

const json = (status: number, payload: unknown) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "GET") {
    return json(405, { error: "Method not allowed" });
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return html(
      500,
      "Something went wrong",
      "We could not process your request because the unsubscribe service is not configured correctly.",
    );
  }

  const token = new URL(req.url).searchParams.get("token")?.trim() ?? "";

  if (!token) {
    return html(
      400,
      "Missing unsubscribe link",
      "This unsubscribe link is incomplete. Please use the link from the email you received.",
    );
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  try {
    const { data: delivery, error: deliveryError } = await supabase
      .from("email_deliveries")
      .select("id, email, asset_key")
      .eq("access_token", token)
      .maybeSingle();

    if (deliveryError) {
      throw deliveryError;
    }

    if (!delivery?.email) {
      return html(
        404,
        "Link not found",
        "This unsubscribe link is no longer valid or could not be found.",
      );
    }

    const normalizedEmail = delivery.email.trim().toLowerCase();
    const unsubscribedAt = new Date().toISOString();
    const source = delivery.asset_key.startsWith("5-day-pilot-challenge")
      ? "challenge-email"
      : "resource-email";

    const { error: upsertError } = await supabase
      .from("email_preferences")
      .upsert(
        {
          email: normalizedEmail,
          unsubscribed_at: unsubscribedAt,
          updated_at: unsubscribedAt,
          source,
          reason: "one-click-unsubscribe",
          metadata: {
            delivery_id: delivery.id,
            asset_key: delivery.asset_key,
          },
        },
        { onConflict: "email" },
      );

    if (upsertError) {
      throw upsertError;
    }

    return html(
      200,
      "You have been unsubscribed",
      `The address <strong>${normalizedEmail}</strong> will no longer receive future emails from Chase Continental.`,
    );
  } catch (error) {
    console.error("[unsubscribe-email]", error);

    return html(
      500,
      "Something went wrong",
      "We could not complete your unsubscribe request right now. Please try again later.",
    );
  }
});
