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
const FOLLOW_UP_DAY = 5;

const json = (status: number, payload: unknown) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

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

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  try {
    const nowIso = new Date().toISOString();
    const { data: dueRows, error: dueError } = await supabase
      .from("lm08_challenge_progress")
      .select("signup_id, last_sent_day, status, next_send_at")
      .eq("status", "active")
      .eq("last_sent_day", 0)
      .lte("next_send_at", nowIso)
      .order("next_send_at", { ascending: true })
      .limit(100);

    if (dueError) {
      throw dueError;
    }

    const processed: Array<Record<string, unknown>> = [];

    for (const row of dueRows ?? []) {
      const response = await fetch(
        `${SUPABASE_URL}/functions/v1/send-challenge-email`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            apikey: SUPABASE_SERVICE_ROLE_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            signupId: row.signup_id,
            day: FOLLOW_UP_DAY,
            source: "scheduler",
          }),
        },
      );

      const payload = await response.json().catch(async () => ({
        error: await response.text(),
      }));

      processed.push({
        signupId: row.signup_id,
        day: FOLLOW_UP_DAY,
        ok: response.ok,
        payload,
      });
    }

    return json(200, {
      success: true,
      processedCount: processed.length,
      processed,
    });
  } catch (error) {
    console.error("[process-challenge-schedule]", error);
    return json(500, {
      error: error instanceof Error ? error.message : "Unexpected error",
    });
  }
});
