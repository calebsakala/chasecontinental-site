import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY =
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";

const DEFAULT_SITE_URL = "https://chaseagents.com";
const DEFAULT_BOOKING_URL = "https://calendar.app.google/8oZYnnuHcaiH64Ky8";
const DEFAULT_WEBSITE_CTA_URL = "https://chaseagents.com/";
const DEFAULT_FROM_EMAIL = "Charles@keywordautopilot.com";
const DEFAULT_FROM_NAME = "CHASE AGENTS";
const DEFAULT_LOGO_URL =
  "https://ydjicfgyegmqfusgunko.supabase.co/storage/v1/object/public/Assets/cc-logo-mark.png";
const functionsBaseUrl = `${SUPABASE_URL}/functions/v1`;

const siteUrl = (
  Deno.env.get("RESOURCE_EMAIL_SITE_URL") ?? DEFAULT_SITE_URL
).replace(/\/$/, "");
const websiteCtaUrl =
  Deno.env.get("RESOURCE_EMAIL_WEBSITE_CTA_URL") ?? DEFAULT_WEBSITE_CTA_URL;
const bookingUrl = Deno.env.get("BOOKING_URL") ?? DEFAULT_BOOKING_URL;
const fromEmail = Deno.env.get("RESOURCE_EMAIL_FROM") ?? DEFAULT_FROM_EMAIL;
const fromName = Deno.env.get("RESOURCE_EMAIL_FROM_NAME") ?? DEFAULT_FROM_NAME;
const replyTo = Deno.env.get("RESOURCE_EMAIL_REPLY_TO") ?? fromEmail;
const logoUrl = Deno.env.get("RESOURCE_EMAIL_LOGO_URL") ?? DEFAULT_LOGO_URL;

type AssetConfig = {
  assetKey: string;
  title: string;
  subject: string;
  bucket: string;
  defaultFilePath?: string;
  routeSlug: string;
  ctaLabel: string;
  introParagraphs: string[];
  closingParagraph: string;
  postscript: string;
};

const assetConfigs: Record<string, AssetConfig> = {
  "transformation-playbook": {
    assetKey: "transformation-playbook",
    title: "AI Transformation Playbook",
    subject: "Your AI Transformation Playbook is ready",
    bucket: "lead-magnets",
    defaultFilePath: "transformation-playbook/AI-Transformation-Playbook.pdf",
    routeSlug: "transformation-playbook",
    ctaLabel: "Open the playbook",
    introParagraphs: [
      "Your AI Transformation Playbook is ready.",
      "This guide walks through the exact operating approach we use to help teams move from scattered AI experiments to reliable automation that survives real production conditions.",
      "Inside, you will find a practical workflow-selection lens, the exceptions-and-approvals pattern that keeps automation from breaking, and a clear way to measure ROI before the work drifts into another pilot.",
    ],
    closingParagraph:
      "If you want to see how this applies to your own operation, explore Chase Agents or book a scoping call and we can map one workflow together.",
    postscript:
      "If there is one workflow in your business that already feels overdue for automation, reply and tell me where it breaks down. I read every reply.",
  },
  "ccid-case-study": {
    assetKey: "ccid-case-study",
    title: "CCID Case Study Deep Dive",
    subject: "Your CCID case study deep dive is ready",
    bucket: "lead-magnets",
    defaultFilePath: "ccid-case-study/ccid-case-study.pdf",
    routeSlug: "ccid-case-study",
    ctaLabel: "Open the case study",
    introParagraphs: [
      "Your CCID case study deep dive is ready.",
      "Inside, you will see how CCID reduced reporting friction, tightened operational handoffs, and improved visibility by moving critical workflows onto a deterministic operating layer.",
      "Use it as a reference for how Chase Agents can stabilize execution when manual reporting, fragmented approvals, and low visibility are slowing your team down.",
    ],
    closingParagraph:
      "If you want to map the same operating pattern into your environment, explore Chase Agents or book a scoping call and we can pressure-test the workflow together.",
    postscript:
      "If there is one reporting or handoff workflow already causing drag in your operation, reply and tell me where it breaks first. I read every reply.",
  },
  "orchestration-swipe-file": {
    assetKey: "orchestration-swipe-file",
    title: "Automation Workflow Swipe File",
    subject: "Your workflow swipe file is ready",
    bucket: "lead-magnets",
    routeSlug: "orchestration-swipe-file",
    ctaLabel: "Open the swipe file",
    introParagraphs: [
      "Your automation workflow swipe file is ready.",
      "Inside are 15 proven workflow patterns across logistics, supply chain, BPO, e-commerce, and operations, including where each one usually breaks in production.",
      "Use it as a shortcut for deciding what to automate first, where handoffs need protection, and how to design around the failure modes that stall teams later.",
    ],
    closingParagraph:
      "If one of these patterns maps closely to a bottleneck in your operation, explore Chase Agents or book a scoping call and we can walk through how to adapt it to your stack.",
    postscript:
      "If you already know which workflow is slowing your team down, reply and tell me what breaks today. I read every reply.",
  },
  "reliability-assessment": {
    assetKey: "reliability-assessment",
    title: "Production Reliability Assessment Report",
    subject: "Your production reliability report is ready",
    bucket: "lead-magnets",
    routeSlug: "reliability-assessment",
    ctaLabel: "Open your report",
    introParagraphs: [
      "Your Production Reliability Assessment report is ready.",
      "Inside, you'll find your score, the risk band your current workflow falls into, and the specific reliability gaps most likely to break automation when volume and exceptions increase.",
      "Use it to prioritise the next fixes with the highest leverage instead of treating reliability as a vague follow-up item after rollout.",
    ],
    closingParagraph:
      "If you want to pressure-test one workflow in your operation, explore Chase Agents or book a scoping call and we can map the failure points together.",
    postscript:
      "If one workflow already feels fragile in production, reply and tell me where it breaks first. I read every reply.",
  },
  "silo-audit-checklist": {
    assetKey: "silo-audit-checklist",
    title: "AI Agent Silo Assessment Report",
    subject: "Your AI agent silo assessment is ready",
    bucket: "lead-magnets",
    routeSlug: "silo-audit-checklist",
    ctaLabel: "Open your assessment",
    introParagraphs: [
      "Your AI Agent Silo Assessment report is ready.",
      "Inside, you'll find your overall maturity score, the category-by-category breakdown, and the operating gaps most likely to create fragmented AI initiatives across teams.",
      "Use it to decide what needs centralisation, what should be orchestrated, and where governance needs to catch up before more agents are deployed.",
    ],
    closingParagraph:
      "If your team is already seeing duplication, blind spots, or conflicting AI outputs, explore Chase Agents or book a scoping call and we can map the root cause together.",
    postscript:
      "If one part of your AI stack already feels siloed, reply and tell me where the disconnect shows up first. I read every reply.",
  },
  "peak-season-survival-guide": {
    assetKey: "peak-season-survival-guide",
    title: "Peak Season Automation Survival Guide",
    subject: "Your peak season survival guide is ready",
    bucket: "lead-magnets",
    routeSlug: "peak-season-survival-guide",
    ctaLabel: "Open the guide",
    introParagraphs: [
      "Your Peak Season Automation Survival Guide is ready.",
      "Inside, you'll find the failure modes that usually appear first when order volume spikes, plus the practical checklist teams can use before throughput stress exposes weak points.",
      "Use it to harden your workflows before peak load turns small automation gaps into missed SLAs, stock issues, and delayed escalations.",
    ],
    closingParagraph:
      "If your operation already has one workflow that looks fragile under surge conditions, explore Chase Agents or book a scoping call and we can map the breakpoints together.",
    postscript:
      "If peak season usually reveals the same operational bottleneck every year, reply and tell me where it breaks first. I read every reply.",
  },
  "ai-roi-calculator": {
    assetKey: "ai-roi-calculator",
    title: "AI Automation ROI Executive Summary",
    subject: "Your AI automation executive summary is ready",
    bucket: "lead-magnets",
    routeSlug: "ai-roi-calculator",
    ctaLabel: "Open your executive summary",
    introParagraphs: [
      "Your AI Automation ROI executive summary is ready.",
      "Inside, you'll find the modeled ROI outlook for your current sector, size band, and operational profile, along with the assumptions driving the opportunity estimate.",
      "Use it to decide whether the next step should be a pilot, a deeper business case, or a more targeted workflow analysis.",
    ],
    closingParagraph:
      "If you want to pressure-test the assumptions behind the projected upside, explore Chase Agents or book a scoping call and we can walk through the workflow economics together.",
    postscript:
      "If one process already looks like your fastest ROI path, reply and tell me what it is. I read every reply.",
  },
  "deterministic-blueprint": {
    assetKey: "deterministic-blueprint",
    title: "Deterministic Automation Blueprint",
    subject: "Your deterministic automation blueprint is ready",
    bucket: "lead-magnets",
    routeSlug: "deterministic-blueprint",
    ctaLabel: "Open your blueprint",
    introParagraphs: [
      "Your Deterministic Automation Blueprint is ready.",
      "Inside, you'll find the blank template plus, when provided, the populated workflow draft built from the steps, exceptions, and metrics you entered.",
      "Use it to turn a messy workflow into something explicit enough to test, govern, and improve without relying on tribal knowledge.",
    ],
    closingParagraph:
      "If you want to pressure-test one workflow before you automate it further, explore Chase Agents or book a scoping call and we can map the failure points together.",
    postscript:
      "If there is one workflow in your operation that still depends too heavily on heroics, reply and tell me where it breaks. I read every reply.",
  },
  "neutral-vs-proprietary-scorecard": {
    assetKey: "neutral-vs-proprietary-scorecard",
    title: "Neutral vs Proprietary Scorecard Report",
    subject: "Your stack lock-in scorecard is ready",
    bucket: "lead-magnets",
    routeSlug: "neutral-vs-proprietary-scorecard",
    ctaLabel: "Open your audit report",
    introParagraphs: [
      "Your Neutral vs Proprietary Scorecard report is ready.",
      "Inside, you'll find your current lock-in risk band, the category-by-category breakdown, and the highest-leverage moves for reducing dependency on proprietary tooling.",
      "Use it to decide whether the next step is a targeted migration, a contract review, or a deeper architecture assessment.",
    ],
    closingParagraph:
      "If your stack already feels harder to change than it should, explore Chase Agents or book a scoping call and we can map the practical exit paths together.",
    postscript:
      "If one vendor dependency already feels expensive to unwind, reply and tell me where it is. I read every reply.",
  },
  "5-day-pilot-challenge-guide": {
    assetKey: "5-day-pilot-challenge-guide",
    title: "5-Day Automation Pilot Guide",
    subject: "Your 5-Day Automation Pilot Guide is ready",
    bucket: "lead-magnets",
    routeSlug: "5-day-pilot-challenge",
    ctaLabel: "Open the guide",
    introParagraphs: [
      "Your 5-Day Automation Pilot Guide is ready.",
      "Inside, you will find the five planning sections we use to help teams move from a vague automation idea to a pilot scope that is measurable, reviewable, and realistic to launch.",
      "Work through the guide to choose the right workflow, map the real steps, define exceptions and approvals, set success metrics, and outline the rollout sequence.",
    ],
    closingParagraph:
      "You will also get one short follow-up email in 5 days so you can decide whether to pressure-test the plan further, book a scoping call, or move ahead internally.",
    postscript:
      "If one workflow already feels like the right pilot candidate, reply and tell me what it is. I read every reply.",
  },
};

type AssetKey = keyof typeof assetConfigs;

type RequestBody = {
  asset_key?: string;
  lead_id?: string;
  name?: string;
  email?: string;
  company?: string | null;
  file_path?: string | null;
  allow_resend?: boolean;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;

const json = (status: number, payload: unknown) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const generateAccessToken = () =>
  `${crypto.randomUUID().replaceAll("-", "")}${crypto.randomUUID().replaceAll("-", "")}`;

const getAssetConfig = (assetKey: string) => {
  if (!(assetKey in assetConfigs)) {
    return null;
  }

  return assetConfigs[assetKey as AssetKey];
};

const buildDownloadUrl = (assetKey: string, accessToken: string) =>
  `${functionsBaseUrl}/resolve-resource-download?assetKey=${encodeURIComponent(assetKey)}&token=${encodeURIComponent(accessToken)}`;

const buildUnsubscribeUrl = (accessToken: string) =>
  `${functionsBaseUrl}/unsubscribe-email?token=${encodeURIComponent(accessToken)}`;

const buildResourceEmailHtml = (
  assetConfig: AssetConfig,
  name: string,
  downloadUrl: string,
  unsubscribeUrl: string,
) => {
  const safeName = escapeHtml(name);
  const safeDownloadUrl = escapeHtml(downloadUrl);
  const safeUnsubscribeUrl = escapeHtml(unsubscribeUrl);
  const safeSiteUrl = escapeHtml(siteUrl);
  const safeWebsiteCtaUrl = escapeHtml(websiteCtaUrl);
  const safeBookingUrl = escapeHtml(bookingUrl);
  const safeLogoUrl = escapeHtml(logoUrl);
  const safeCtaLabel = escapeHtml(assetConfig.ctaLabel);
  const safeClosingParagraph = escapeHtml(assetConfig.closingParagraph);
  const safePostscript = escapeHtml(assetConfig.postscript);
  const introParagraphsHtml = assetConfig.introParagraphs
    .map(
      (paragraph) =>
        `<p style="font-size:14px;color:#5f5e5a;line-height:1.7;margin:0 0 16px;">${escapeHtml(paragraph)}</p>`,
    )
    .join("");

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
            <td style="background:#f8f8f5;padding:28px 40px;text-align:center;border-bottom:1px solid #e5e5e0;">
              <a href="${safeSiteUrl}" style="display:inline-block;text-decoration:none;">
                <img src="${safeLogoUrl}" alt="Chase Agents" height="56" style="display:block;margin:0 auto 14px;height:56px;width:auto;max-width:96px;" />
                <div style="font-size:28px;line-height:1.1;font-weight:700;letter-spacing:0.1em;color:#0f6e56;text-transform:uppercase;">Chase Agents</div>
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding:36px 40px;">
              <p style="font-size:15px;font-weight:500;color:#1a1a18;margin:0 0 20px;">Hi ${safeName},</p>
              ${introParagraphsHtml}

              <div style="text-align:center;margin:28px 0 24px;">
                <a href="${safeDownloadUrl}" style="display:inline-block;background:#1D9E75;color:#ffffff;padding:13px 28px;border-radius:8px;font-size:14px;font-weight:600;text-decoration:none;">${safeCtaLabel}</a>
              </div>

              <div style="background:#f8f8f5;border-radius:8px;padding:16px 20px;margin:20px 0;">
                <p style="font-size:13px;font-weight:600;color:#1a1a18;margin:0 0 8px;">What to expect from us</p>
                <p style="font-size:13px;color:#5f5e5a;line-height:1.7;margin:0;">We send practical notes when they are worth your time: clear operating ideas, examples from live workflow automation, and occasional invitations to talk through your own bottlenecks. No filler, no generic newsletter cadence.</p>
              </div>

              <p style="font-size:14px;color:#5f5e5a;line-height:1.7;margin:0 0 24px;">${safeClosingParagraph}</p>

              <div style="text-align:center;margin:28px 0;">
                <a href="${safeWebsiteCtaUrl}" style="display:inline-block;background:#1D9E75;color:#ffffff;padding:12px 28px;border-radius:8px;font-size:14px;font-weight:500;text-decoration:none;margin:0 6px 8px;">Explore Chase Agents</a>
                <a href="${safeBookingUrl}" style="display:inline-block;background:transparent;color:#0F6E56;padding:11px 28px;border-radius:8px;font-size:14px;font-weight:500;text-decoration:none;border:1.5px solid #1D9E75;margin:0 6px 8px;">Book a scoping call</a>
              </div>

              <hr style="border:none;border-top:1px solid #e5e5e0;margin:24px 0;" />

              <p style="font-size:14px;color:#5f5e5a;line-height:1.7;margin:0 0 16px;">Speak soon,<br /><strong style="color:#1a1a18;">Charles</strong><br />CHASE AGENTS</p>
              <p style="font-size:13px;color:#5f5e5a;line-height:1.6;margin:0;"><strong>P.S.</strong> ${safePostscript}</p>

              <div style="text-align:center;margin:24px 0 8px;">
                <a href="${safeUnsubscribeUrl}" style="display:inline-block;background:transparent;color:#6c6b66;padding:9px 18px;border-radius:999px;font-size:12px;font-weight:600;text-decoration:none;border:1px solid #d8d7d1;">Unsubscribe</a>
              </div>
            </td>
          </tr>
          <tr>
            <td style="background:#f8f8f5;border-top:1px solid #e5e5e0;padding:16px 40px;text-align:center;">
              <p style="font-size:11px;color:#888780;margin:0;">© 2026 CHASE AGENTS</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};

Deno.serve(async (req: Request) => {
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
    return json(500, {
      error: "RESEND_API_KEY is not configured for this function.",
    });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  let deliveryId: string | null = null;

  try {
    const body = (await req.json()) as RequestBody;
    const assetKey = body.asset_key?.trim() ?? "";
    const leadId = body.lead_id?.trim() ?? "";
    const name = body.name?.trim() ?? "";
    const email = body.email?.trim().toLowerCase() ?? "";
    const company = body.company?.trim() || null;
    const requestedFilePath = body.file_path?.trim() || null;
    const allowResend = body.allow_resend === true;

    const assetConfig = getAssetConfig(assetKey);

    if (!assetConfig) {
      return json(400, { error: `Unsupported asset_key: ${assetKey}` });
    }

    if (!leadId || !name || !email) {
      return json(400, { error: "lead_id, name, and email are required." });
    }

    if (!emailPattern.test(email)) {
      return json(400, { error: "A valid email address is required." });
    }

    const resolvedFilePath =
      requestedFilePath ?? assetConfig.defaultFilePath ?? null;

    if (!resolvedFilePath) {
      return json(400, {
        error: `file_path is required for asset_key: ${assetKey}`,
      });
    }

    const { data: emailPreference, error: emailPreferenceError } =
      await supabase
        .from("email_preferences")
        .select("email, unsubscribed_at")
        .eq("email", email)
        .maybeSingle();

    if (emailPreferenceError) {
      throw emailPreferenceError;
    }

    if (emailPreference?.unsubscribed_at) {
      return json(200, {
        success: true,
        skipped: true,
        unsubscribed: true,
        message: "Email address has unsubscribed from future emails.",
      });
    }

    const { data: existingDelivery, error: existingError } = await supabase
      .from("email_deliveries")
      .select(
        "id, status, sent_at, access_token, provider_message_id, error_message",
      )
      .eq("lead_id", leadId)
      .eq("asset_key", assetKey)
      .maybeSingle();

    if (existingError) {
      throw existingError;
    }

    if (existingDelivery) {
      if (allowResend) {
        deliveryId = existingDelivery.id;
      } else {
        return json(200, {
          success: true,
          skipped: true,
          deliveryId: existingDelivery.id,
          status: existingDelivery.status,
          sentAt: existingDelivery.sent_at,
          providerMessageId: existingDelivery.provider_message_id,
          downloadUrl: buildDownloadUrl(
            assetConfig.assetKey,
            existingDelivery.access_token,
          ),
          errorMessage: existingDelivery.error_message,
        });
      }
    }

    let accessToken = existingDelivery?.access_token ?? generateAccessToken();
    const metadata = {
      bucket: assetConfig.bucket,
      file_path: resolvedFilePath,
      route_slug: assetConfig.routeSlug,
      company,
      title: assetConfig.title,
    };

    if (existingDelivery && deliveryId) {
      const { error: resetError } = await supabase
        .from("email_deliveries")
        .update({
          email,
          status: "pending",
          provider_message_id: null,
          sent_at: null,
          error_message: null,
          access_token: accessToken,
          metadata,
          click_count: 0,
          first_clicked_at: null,
          last_clicked_at: null,
        })
        .eq("id", deliveryId);

      if (resetError) {
        throw resetError;
      }
    }

    if (!existingDelivery) {
      const { data: insertedDelivery, error: insertError } = await supabase
        .from("email_deliveries")
        .insert({
          lead_id: leadId,
          asset_key: assetKey,
          email,
          status: "pending",
          access_token: accessToken,
          metadata,
        })
        .select("id")
        .single();

      if (insertError) {
        if (insertError.code === "23505") {
          const { data: duplicateDelivery, error: duplicateError } =
            await supabase
              .from("email_deliveries")
              .select(
                "id, status, sent_at, access_token, provider_message_id, error_message",
              )
              .eq("lead_id", leadId)
              .eq("asset_key", assetKey)
              .maybeSingle();

          if (duplicateError) {
            throw duplicateError;
          }

          if (!duplicateDelivery) {
            throw insertError;
          }

          if (!allowResend) {
            return json(200, {
              success: true,
              skipped: true,
              deliveryId: duplicateDelivery.id,
              status: duplicateDelivery.status,
              sentAt: duplicateDelivery.sent_at,
              providerMessageId: duplicateDelivery.provider_message_id,
              downloadUrl: buildDownloadUrl(
                assetConfig.assetKey,
                duplicateDelivery.access_token,
              ),
              errorMessage: duplicateDelivery.error_message,
            });
          }

          deliveryId = duplicateDelivery.id;
          accessToken = duplicateDelivery.access_token;

          const { error: retryResetError } = await supabase
            .from("email_deliveries")
            .update({
              email,
              status: "pending",
              provider_message_id: null,
              sent_at: null,
              error_message: null,
              access_token: accessToken,
              metadata,
              click_count: 0,
              first_clicked_at: null,
              last_clicked_at: null,
            })
            .eq("id", deliveryId);

          if (retryResetError) {
            throw retryResetError;
          }
        } else {
          throw insertError;
        }
      } else {
        deliveryId = insertedDelivery.id;
      }
    }

    if (!deliveryId) {
      throw new Error("Failed to create or reuse email delivery record.");
    }

    const downloadUrl = buildDownloadUrl(assetConfig.assetKey, accessToken);
    const unsubscribeUrl = buildUnsubscribeUrl(accessToken);

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `${fromName} <${fromEmail}>`,
        to: [email],
        subject: assetConfig.subject,
        html: buildResourceEmailHtml(
          assetConfig,
          name,
          downloadUrl,
          unsubscribeUrl,
        ),
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
          : "Failed to send email via Resend.";

      throw new Error(resendMessage);
    }

    const providerMessageId =
      typeof resendPayload?.id === "string" ? resendPayload.id : null;

    const { error: updateError } = await supabase
      .from("email_deliveries")
      .update({
        status: "sent",
        provider_message_id: providerMessageId,
        sent_at: new Date().toISOString(),
        error_message: null,
      })
      .eq("id", deliveryId);

    if (updateError) {
      throw updateError;
    }

    return json(200, {
      success: true,
      skipped: false,
      deliveryId,
      providerMessageId,
      downloadUrl,
      resent: allowResend && !!existingDelivery,
    });
  } catch (error) {
    console.error("[send-resource-email]", error);

    if (deliveryId) {
      await supabase
        .from("email_deliveries")
        .update({
          status: "failed",
          error_message:
            error instanceof Error ? error.message : "Unknown error",
        })
        .eq("id", deliveryId);
    }

    return json(500, {
      error: error instanceof Error ? error.message : "Unexpected error",
    });
  }
});
