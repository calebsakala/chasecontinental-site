import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { ArrowRight, Download, RefreshCcw } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const assetRoutes: Record<string, { resourcePath: string; title: string }> = {
  "transformation-playbook": {
    resourcePath: "/resources/transformation-playbook",
    title: "AI Transformation Playbook",
  },
};

const ResourceDownloadRedirect = () => {
  const { assetKey = "" } = useParams();
  const [searchParams] = useSearchParams();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const assetRoute = assetRoutes[assetKey] ?? {
    resourcePath: "/resources",
    title: "resource",
  };

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setErrorMessage("This download link is missing the required token.");
      return;
    }

    let cancelled = false;

    const resolveDownload = async () => {
      const { data, error } = await supabase.functions.invoke(
        "resolve-resource-download",
        {
          body: { token, assetKey },
        },
      );

      if (cancelled) {
        return;
      }

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      if (!data?.signedUrl) {
        setErrorMessage("We could not prepare your download link.");
        return;
      }

      window.location.replace(data.signedUrl);
    };

    void resolveDownload();

    return () => {
      cancelled = true;
    };
  }, [assetKey, searchParams]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="px-6 pt-32 pb-24">
        <div className="mx-auto max-w-3xl">
          <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-card/80 p-8 shadow-xl backdrop-blur md:p-12">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-400" />

            <div className="mb-8 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500">
              {errorMessage ? (
                <RefreshCcw className="h-7 w-7" />
              ) : (
                <Download className="h-7 w-7" />
              )}
            </div>

            <h1 className="mb-3 text-3xl font-bold font-heading md:text-4xl">
              {errorMessage
                ? "We couldn't open your download yet"
                : `Preparing your ${assetRoute.title}`}
            </h1>

            <p className="max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
              {errorMessage
                ? errorMessage
                : "We are generating a fresh private access link now. This should only take a moment."}
            </p>

            <div className="mt-10 rounded-2xl border border-border/50 bg-muted/30 p-6">
              {errorMessage ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    You can return to the resource page and request a new
                    delivery if needed.
                  </p>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button
                      asChild
                      className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600"
                    >
                      <Link to={assetRoute.resourcePath}>
                        Return to the resource page
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link to="/resources">Browse resources</Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-500" />
                    Verifying your link and preparing a new signed download URL.
                  </div>
                  <p className="text-sm text-muted-foreground">
                    If the redirect does not start automatically, stay on this
                    page for a few seconds or return to the resource page and
                    request a fresh email.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ResourceDownloadRedirect;
