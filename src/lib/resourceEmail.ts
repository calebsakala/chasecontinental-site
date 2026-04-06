import { supabase } from "@/integrations/supabase/client";

type QueueResourceEmailInput = {
  assetKey: string;
  leadId: string;
  name: string;
  email: string;
  company?: string | null;
  filePath?: string | null;
  allowResend?: boolean;
};

export type QueueResourceEmailResult = {
  success: boolean;
  skipped?: boolean;
  unsubscribed?: boolean;
  resent?: boolean;
  message?: string;
  deliveryId?: string | null;
  providerMessageId?: string | null;
  downloadUrl?: string | null;
  status?: string | null;
  sentAt?: string | null;
  errorMessage?: string | null;
};

export const queueResourceEmail = ({
  assetKey,
  leadId,
  name,
  email,
  company,
  filePath,
  allowResend,
}: QueueResourceEmailInput) => {
  return supabase.functions
    .invoke("send-resource-email", {
      body: {
        asset_key: assetKey,
        lead_id: leadId,
        name,
        email,
        company: company ?? null,
        file_path: filePath ?? undefined,
        allow_resend: allowResend ?? false,
      },
    })
    .then(({ data, error }) => {
      if (error) {
        throw error;
      }

      return (data ?? null) as QueueResourceEmailResult | null;
    })
    .catch((error) => {
      console.error("Resource email trigger failed:", {
        assetKey,
        leadId,
        email,
        filePath,
        error,
      });
      return null;
    });
};
