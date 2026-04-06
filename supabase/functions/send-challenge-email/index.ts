import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY =
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
const DEFAULT_SITE_URL = "https://chasecontinental.com";
const DEFAULT_BOOKING_URL =
  "https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ1o2TpvcYyg1qefQEEKyjUuWOO0v2yFYEkm81VtpFRYwn6uCnyZVk-Ju549TbW3wOjkHd9up7_6";
const DEFAULT_WEBSITE_CTA_URL = "https://chaseagents.com/";
const DEFAULT_FROM_EMAIL = "Charles@keywordautopilot.com";
const DEFAULT_FROM_NAME = "CHASE CONTINENTAL";
const FOLLOW_UP_DAY = 6;
const FOLLOW_UP_ASSET_KEY = "5-day-pilot-challenge-follow-up";

const siteUrl = (
  Deno.env.get("RESOURCE_EMAIL_SITE_URL") ?? DEFAULT_SITE_URL
).replace(/\/$/, "");
const bookingUrl = Deno.env.get("BOOKING_URL") ?? DEFAULT_BOOKING_URL;
const websiteCtaUrl =
  Deno.env.get("RESOURCE_EMAIL_WEBSITE_CTA_URL") ?? DEFAULT_WEBSITE_CTA_URL;
const fromEmail = Deno.env.get("RESOURCE_EMAIL_FROM") ?? DEFAULT_FROM_EMAIL;
const fromName = Deno.env.get("RESOURCE_EMAIL_FROM_NAME") ?? DEFAULT_FROM_NAME;
const replyTo = Deno.env.get("RESOURCE_EMAIL_REPLY_TO") ?? fromEmail;

type RequestBody = {
  signupId?: string;
  leadId?: string;
  email?: string;
  name?: string;
  source?: string;
  day?: number;
};

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const json = (status: number, payload: unknown) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;

const buildUnsubscribeUrl = (accessToken: string) =>
  `${SUPABASE_URL}/functions/v1/unsubscribe-email?token=${encodeURIComponent(accessToken)}`;

const generateAccessToken = () =>
  `${crypto.randomUUID().replaceAll("-", "")}${crypto.randomUUID().replaceAll("-", "")}`;
const buildFollowUpEmailHtml = (name: string, unsubscribeUrl: string) => {
  const safeName = escapeHtml(name);
  const safeUnsubscribeUrl = escapeHtml(unsubscribeUrl);
  const safeSiteUrl = escapeHtml(siteUrl);
  const safeWebsiteCtaUrl = escapeHtml(websiteCtaUrl);
  const safeBookingUrl = escapeHtml(bookingUrl);

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background:#f4f4f0;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;background:#f4f4f0;">
    <tr>
      <td align="center">
        <table width="580" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e5e0;">
          <tr>
            <td style="background:#f8f8f5;padding:24px 40px;border-bottom:1px solid #e5e5e0;">
              <div style="font-size:11px;letter-spacing:0.16em;font-weight:700;color:#0f6e56;text-transform:uppercase;margin-bottom:10px;">5-Day Pilot Guide Follow-Up</div>
              <a href="${safeSiteUrl}" style="text-decoration:none;color:#1a1a18;">
                <div style="font-size:28px;line-height:1.1;font-weight:700;letter-spacing:0.1em;color:#0f6e56;text-transform:uppercase;">Chase Continental</div>
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding:36px 40px;">
              <p style="font-size:15px;font-weight:500;color:#1a1a18;margin:0 0 20px;">Hi ${safeName},</p>
              <p style="font-size:14px;color:#5f5e5a;line-height:1.7;margin:0 0 14px;">You downloaded the 5-Day Automation Pilot Guide a few days ago, so this is the right moment to turn that planning work into a concrete pilot decision.</p>
              <p style="font-size:14px;color:#5f5e5a;line-height:1.7;margin:0 0 14px;">By now, you should have a clearer view of which workflow deserves attention first, where the real handoffs and exceptions sit, and which success metrics will tell you whether the pilot is worth scaling.</p>
              <p style="font-size:14px;color:#5f5e5a;line-height:1.7;margin:0 0 14px;">If the plan is still sitting unfinished in a document or open tab, use this note as the prompt to tighten the scope and decide what happens next.</p>
              <div style="background:#f8f8f5;border-radius:10px;padding:18px 20px;margin:20px 0;">
                <p style="font-size:13px;font-weight:700;color:#1a1a18;margin:0 0 10px;">Before you move on, check three things</p>
                <ul style="padding-left:18px;margin:0;font-size:14px;line-height:1.7;color:#5f5e5a;">
                  <li style="margin:0 0 10px;">Have you chosen the exact workflow that is worth piloting first?</li>
                  <li style="margin:0 0 10px;">Have you written down the real exceptions, approvals, and owners?</li>
                  <li style="margin:0;">Do you have a small pilot scope and a metric you can defend after rollout?</li>
                </ul>
              </div>
              <p style="font-size:14px;color:#5f5e5a;line-height:1.7;margin:0 0 24px;">If you want to pressure-test the pilot plan before your team commits time to it, the two best next steps are simple: review more examples on the site, or book a direct call and we can walk through the workflow with you.</p>
              <div style="text-align:center;margin:28px 0;">
                <a href="${safeWebsiteCtaUrl}" style="display:inline-block;background:#1D9E75;color:#ffffff;padding:12px 28px;border-radius:8px;font-size:14px;font-weight:500;text-decoration:none;margin:0 6px 8px;">Visit our website</a>
                <a href="${safeBookingUrl}" style="display:inline-block;background:transparent;color:#0F6E56;padding:11px 28px;border-radius:8px;font-size:14px;font-weight:500;text-decoration:none;border:1.5px solid #1D9E75;margin:0 6px 8px;">Book a free call</a>
              </div>
              <p style="font-size:14px;color:#5f5e5a;line-height:1.7;margin:0 0 16px;">Speak soon,<br /><strong style="color:#1a1a18;">Charles</strong><br />CHASE CONTINENTAL</p>
              <div style="text-align:center;margin-top:24px;">
                <a href="${safeUnsubscribeUrl}" style="display:inline-block;background:transparent;color:#6c6b66;padding:9px 18px;border-radius:999px;font-size:12px;font-weight:600;text-decoration:none;border:1px solid #d8d7d1;">Unsubscribe</a>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return json(405, { error: "Method not allowed" });
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return json(500, { error: "Supabase environment variables are missing." });
  }

  if (!RESEND_API_KEY) {
    return json(500, { error: "RESEND_API_KEY is not configured." });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  let deliveryId: string | null = null;
  let requestBody: RequestBody = {};
  let logAttemptCount = 1;

  try {
    const body = (await req.json()) as RequestBody;
    requestBody = body;
    const signupId = body.signupId?.trim() ?? "";
    const requestedLeadId = body.leadId?.trim() ?? "";
    const day = Number.isInteger(body.day) ? Number(body.day) : FOLLOW_UP_DAY;

    if (!signupId) {
      return json(400, { error: "signupId is required." });
    }

    if (day !== FOLLOW_UP_DAY) {
      return json(400, {
        error: `Unsupported challenge day: ${day}. Only follow-up day ${FOLLOW_UP_DAY} is allowed.`,
      });
    }

    const { data: signup, error: signupError } = await supabase
      .from("lm08_challenge_signups")
      .select("id, lead_id, email, first_name, last_name, company, signup_date")
      .eq("id", signupId)
      .maybeSingle();

    if (signupError) {
      throw signupError;
    }

    if (!signup?.email) {
      return json(404, { error: "Challenge signup not found." });
    }

    const name =
      body.name?.trim() ||
      `${signup.first_name} ${signup.last_name}`.trim() ||
      signup.first_name ||
      "there";
    const email =
      body.email?.trim().toLowerCase() || signup.email.trim().toLowerCase();

    let leadId = requestedLeadId || signup.lead_id || "";

    if (!leadId) {
      const { data: lead, error: leadError } = await supabase
        .from("leads")
        .select("id")
        .eq("email", email)
        .maybeSingle();

      if (leadError) {
        throw leadError;
      }

      if (lead?.id) {
        leadId = lead.id;

        await supabase
          .from("lm08_challenge_signups")
          .update({
            lead_id: lead.id,
            updated_at: new Date().toISOString(),
          })
          .eq("id", signupId);

        await supabase
          .from("lm08_challenge_progress")
          .update({
            lead_id: lead.id,
            updated_at: new Date().toISOString(),
          })
          .eq("signup_id", signupId);
      }
    }

    if (!leadId) {
      return json(400, { error: "leadId is required for challenge delivery." });
    }

    if (!emailPattern.test(email)) {
      return json(400, { error: "A valid email address is required." });
    }

    const { data: preference, error: preferenceError } = await supabase
      .from("email_preferences")
      .select("email, unsubscribed_at")
      .eq("email", email)
      .maybeSingle();

    if (preferenceError) {
      throw preferenceError;
    }

    if (preference?.unsubscribed_at) {
      await supabase
        .from("lm08_challenge_progress")
        .update({
          status: "unsubscribed",
          next_send_at: null,
          last_error: null,
          updated_at: new Date().toISOString(),
        })
        .eq("signup_id", signupId);

      await supabase.from("lm08_challenge_email_log").upsert(
        {
          signup_id: signupId,
          lead_id: leadId,
          day,
          email,
          status: "skipped",
          last_attempt_at: new Date().toISOString(),
          attempt_count: 1,
          metadata: {
            source: body.source ?? "manual",
            reason: "unsubscribed",
          },
        },
        { onConflict: "signup_id,day" },
      );

      return json(200, {
        success: true,
        skipped: true,
        unsubscribed: true,
      });
    }

    const { data: existingLog, error: existingLogError } = await supabase
      .from("lm08_challenge_email_log")
      .select("id, status, attempt_count, provider_message_id, delivery_id")
      .eq("signup_id", signupId)
      .eq("day", day)
      .maybeSingle();

    if (existingLogError) {
      throw existingLogError;
    }

    if (existingLog?.status === "sent") {
      return json(200, {
        success: true,
        skipped: true,
        alreadySent: true,
        day,
        email,
      });
    }

    logAttemptCount = (existingLog?.attempt_count ?? 0) + 1;
    const accessToken = generateAccessToken();

    const { data: existingDelivery, error: existingDeliveryError } =
      await supabase
        .from("email_deliveries")
        .select("id, access_token, status, provider_message_id")
        .eq("lead_id", leadId)
        .eq("asset_key", FOLLOW_UP_ASSET_KEY)
        .maybeSingle();

    if (existingDeliveryError) {
      throw existingDeliveryError;
    }

    if (existingDelivery?.status === "sent") {
      await supabase.from("lm08_challenge_email_log").upsert(
        {
          signup_id: signupId,
          lead_id: leadId,
          day,
          email,
          status: "sent",
          sent_at: new Date().toISOString(),
          last_attempt_at: new Date().toISOString(),
          attempt_count: logAttemptCount,
          provider_message_id: existingDelivery.provider_message_id,
          delivery_id: existingDelivery.id,
          error_message: null,
          metadata: {
            source: body.source ?? "manual",
            reused_delivery: true,
          },
        },
        { onConflict: "signup_id,day" },
      );

      await supabase
        .from("lm08_challenge_progress")
        .update({
          current_day: FOLLOW_UP_DAY,
          last_sent_day: FOLLOW_UP_DAY,
          status: "completed",
          next_send_at: null,
          completed_at: new Date().toISOString(),
          last_error: null,
          updated_at: new Date().toISOString(),
        })
        .eq("signup_id", signupId);

      return json(200, {
        success: true,
        skipped: true,
        alreadySent: true,
        day,
        email,
        deliveryId: existingDelivery.id,
      });
    }

    const accessTokenToUse = existingDelivery?.access_token ?? accessToken;

    if (!existingDelivery) {
      const { data: insertedDelivery, error: insertDeliveryError } =
        await supabase
          .from("email_deliveries")
          .insert({
            lead_id: leadId,
            asset_key: FOLLOW_UP_ASSET_KEY,
            email,
            status: "pending",
            access_token: accessTokenToUse,
            metadata: {
              campaign: "5-day-pilot-challenge-follow-up",
              signup_id: signupId,
              day: FOLLOW_UP_DAY,
              signup_date: signup.signup_date ?? null,
              company: signup.company ?? null,
            },
          })
          .select("id")
          .single();

      if (insertDeliveryError) {
        throw insertDeliveryError;
      }

      deliveryId = insertedDelivery.id;
    } else {
      deliveryId = existingDelivery.id;
    }

    const unsubscribeUrl = buildUnsubscribeUrl(accessTokenToUse);

    await supabase.from("lm08_challenge_email_log").upsert(
      {
        signup_id: signupId,
        lead_id: leadId,
        day,
        email,
        status: "pending",
        last_attempt_at: new Date().toISOString(),
        attempt_count: logAttemptCount,
        delivery_id: deliveryId,
        metadata: {
          source: body.source ?? "manual",
        },
      },
      { onConflict: "signup_id,day" },
    );

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `${fromName} <${fromEmail}>`,
        to: [email],
        subject: "Your 5-Day Automation Pilot Guide follow-up",
        html: buildFollowUpEmailHtml(name, unsubscribeUrl),
        reply_to: replyTo,
      }),
    });

    const resendPayload = await resendResponse.json().catch(async () => ({
      message: await resendResponse.text(),
    }));

    if (!resendResponse.ok) {
      const resendMessage =
        typeof resendPayload?.message === "string"
          ? resendPayload.message
          : "Failed to send challenge email.";
      throw new Error(resendMessage);
    }

    const providerMessageId =
      typeof resendPayload?.id === "string" ? resendPayload.id : null;
    const sentAt = new Date().toISOString();

    await supabase
      .from("email_deliveries")
      .update({
        status: "sent",
        provider_message_id: providerMessageId,
        sent_at: sentAt,
        error_message: null,
      })
      .eq("id", deliveryId);

    await supabase
      .from("lm08_challenge_email_log")
      .update({
        status: "sent",
        sent_at: sentAt,
        provider_message_id: providerMessageId,
        error_message: null,
        delivery_id: deliveryId,
        metadata: {
          source: body.source ?? "manual",
        },
      })
      .eq("signup_id", signupId)
      .eq("day", day);

    await supabase.from("lm08_challenge_progress").upsert(
      {
        signup_id: signupId,
        lead_id: leadId,
        current_day: FOLLOW_UP_DAY,
        last_sent_day: FOLLOW_UP_DAY,
        status: "completed",
        next_send_at: null,
        completed_at: sentAt,
        last_error: null,
        updated_at: sentAt,
      },
      { onConflict: "signup_id" },
    );

    await supabase.from("lm08_events").insert({
      signup_id: signupId,
      event_type: "challenge_followup_sent",
      event_payload: {
        day: FOLLOW_UP_DAY,
        delivery_id: deliveryId,
        source: body.source ?? "manual",
      },
    });

    await supabase.from("events").insert({
      lead_id: leadId,
      event_name: "challenge_followup_sent",
      event_payload: {
        day: FOLLOW_UP_DAY,
        signup_id: signupId,
      },
    });

    return json(200, {
      success: true,
      day: FOLLOW_UP_DAY,
      email,
      subject: "Your 5-Day Automation Pilot Guide follow-up",
      deliveryId,
      providerMessageId,
    });
  } catch (error) {
    console.error("[send-challenge-email]", error);

    const body = requestBody;
    const signupId = body.signupId?.trim();
    const leadId = body.leadId?.trim();
    const day = Number.isInteger(body.day) ? Number(body.day) : FOLLOW_UP_DAY;
    const errorMessage =
      error instanceof Error ? error.message : "Unexpected error";

    if (deliveryId) {
      await supabase
        .from("email_deliveries")
        .update({
          status: "failed",
          error_message: errorMessage,
        })
        .eq("id", deliveryId);
    }

    if (signupId) {
      await supabase.from("lm08_challenge_email_log").upsert(
        {
          signup_id: signupId,
          lead_id: leadId || null,
          day,
          email: body.email?.trim().toLowerCase() || "unknown",
          status: "failed",
          last_attempt_at: new Date().toISOString(),
          attempt_count: logAttemptCount,
          delivery_id: deliveryId,
          error_message: errorMessage,
          metadata: {
            source: body.source ?? "manual",
          },
        },
        { onConflict: "signup_id,day" },
      );

      await supabase
        .from("lm08_challenge_progress")
        .update({
          status: "failed",
          last_error: errorMessage,
          updated_at: new Date().toISOString(),
        })
        .eq("signup_id", signupId);
    }

    return json(500, { error: errorMessage });
  }
});
