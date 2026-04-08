import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY =
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

type AssetConfig = {
  bucket: string;
  defaultFilePath?: string;
};

const assetConfigs = {
  "transformation-playbook": {
    bucket: "lead-magnets",
    defaultFilePath: "transformation-playbook/AI-Transformation-Playbook.pdf",
  },
  "ccid-case-study": {
    bucket: "lead-magnets",
    defaultFilePath: "ccid-case-study/ccid-case-study.pdf",
  },
  "orchestration-swipe-file": {
    bucket: "lead-magnets",
  },
  "reliability-assessment": {
    bucket: "lead-magnets",
  },
  "silo-audit-checklist": {
    bucket: "lead-magnets",
  },
  "peak-season-survival-guide": {
    bucket: "lead-magnets",
  },
  "ai-roi-calculator": {
    bucket: "lead-magnets",
  },
  "deterministic-blueprint": {
    bucket: "lead-magnets",
  },
  "neutral-vs-proprietary-scorecard": {
    bucket: "lead-magnets",
  },
  "5-day-pilot-challenge-guide": {
    bucket: "lead-magnets",
  },
} satisfies Record<string, AssetConfig>;

type AssetKey = keyof typeof assetConfigs;

type DeliveryMetadata = {
  bucket?: string;
  file_path?: string;
};

type RequestBody = {
  token?: string;
  assetKey?: string;
};

const redirect = (url: string) =>
  new Response(null, {
    status: 302,
    headers: {
      ...corsHeaders,
      Location: url,
    },
  });

const json = (status: number, payload: unknown) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const getAssetConfig = (assetKey: string) => {
  if (!(assetKey in assetConfigs)) {
    return null;
  }

  return assetConfigs[assetKey as AssetKey];
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST" && req.method !== "GET") {
    return json(405, { error: "Method not allowed" });
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return json(500, { error: "Supabase environment variables are missing." });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  try {
    const requestUrl = new URL(req.url);
    const body =
      req.method === "POST" ? ((await req.json()) as RequestBody) : null;
    const token =
      body?.token?.trim() ?? requestUrl.searchParams.get("token")?.trim() ?? "";
    const routeAssetKey =
      body?.assetKey?.trim() ??
      requestUrl.searchParams.get("assetKey")?.trim() ??
      "";

    if (!token) {
      return json(400, { error: "A download token is required." });
    }

    const { data: delivery, error: deliveryError } = await supabase
      .from("email_deliveries")
      .select("id, asset_key, status, click_count, first_clicked_at, metadata")
      .eq("access_token", token)
      .maybeSingle();

    if (deliveryError) {
      throw deliveryError;
    }

    if (!delivery) {
      return json(404, { error: "Download link not found." });
    }

    if (routeAssetKey && routeAssetKey !== delivery.asset_key) {
      return json(400, {
        error: "Download link does not match this resource.",
      });
    }

    const assetConfig = getAssetConfig(delivery.asset_key);

    if (!assetConfig) {
      return json(400, {
        error: `Unsupported asset_key: ${delivery.asset_key}`,
      });
    }

    const metadata = (delivery.metadata ?? {}) as DeliveryMetadata;
    const bucket = metadata.bucket ?? assetConfig.bucket;
    const filePath = metadata.file_path ?? assetConfig.defaultFilePath;

    if (!filePath) {
      return json(400, {
        error: "Download link is missing a file path.",
      });
    }

    const { data: signedUrlData, error: signedUrlError } =
      await supabase.storage.from(bucket).createSignedUrl(filePath, 900);

    if (signedUrlError || !signedUrlData?.signedUrl) {
      throw signedUrlError ?? new Error("Could not create a fresh signed URL.");
    }

    const clickedAt = new Date().toISOString();

    const { error: clickUpdateError } = await supabase
      .from("email_deliveries")
      .update({
        click_count: (delivery.click_count ?? 0) + 1,
        first_clicked_at: delivery.first_clicked_at ?? clickedAt,
        last_clicked_at: clickedAt,
      })
      .eq("id", delivery.id);

    if (clickUpdateError) {
      throw clickUpdateError;
    }

    if (req.method === "GET") {
      return redirect(signedUrlData.signedUrl);
    }

    return json(200, {
      success: true,
      assetKey: delivery.asset_key,
      signedUrl: signedUrlData.signedUrl,
    });
  } catch (error) {
    console.error("[resolve-resource-download]", error);

    return json(500, {
      error: error instanceof Error ? error.message : "Unexpected error",
    });
  }
});
