type RgbColor = [number, number, number];

type PdfImageProperties = {
  width: number;
  height: number;
};

type PdfDoc = {
  addImage: (
    imageData: string,
    format: string,
    x: number,
    y: number,
    width: number,
    height: number,
  ) => void;
  getImageProperties: (imageData: string) => PdfImageProperties;
  setTextColor: (r: number, g: number, b: number) => void;
  setFont: (fontFamily: string, fontStyle: string) => void;
  setFontSize: (size: number) => void;
  text: (text: string, x: number, y: number, options?: unknown) => void;
  getTextWidth: (text: string) => number;
  internal: {
    scaleFactor: number;
  };
};

type CachedLogo = {
  dataUrl: string;
  format: "PNG" | "JPEG";
};

export type BrandHeaderOptions = {
  margin: number;
  top: number;
  text?: string;
  textColor?: RgbColor;
  fontSize?: number;
  fontFamily?: string;
  fontStyle?: string;
  logoHeight?: number;
  gap?: number;
};

export type BrandHeaderResult = {
  bottomY: number;
  textStartX: number;
  textEndX: number;
  textBaselineY: number;
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";

export const DEFAULT_PDF_LOGO_URL =
  Deno.env.get("PDF_LOGO_URL") ??
  Deno.env.get("RESOURCE_EMAIL_LOGO_URL") ??
  (SUPABASE_URL
    ? `${SUPABASE_URL}/storage/v1/object/public/Assets/cc-logo-mark.png`
    : "");

let cachedLogoPromise: Promise<CachedLogo | null> | null = null;

const bytesToBase64 = (bytes: Uint8Array) => {
  let binary = "";
  const chunkSize = 0x8000;

  for (let index = 0; index < bytes.length; index += chunkSize) {
    const chunk = bytes.subarray(index, index + chunkSize);
    binary += String.fromCharCode(...chunk);
  }

  return btoa(binary);
};

const inferImageFormat = (contentType: string | null, url: string) => {
  const normalizedType = contentType?.toLowerCase() ?? "";
  const normalizedUrl = url.toLowerCase();

  if (normalizedType.includes("png") || normalizedUrl.endsWith(".png")) {
    return { mimeType: "image/png", format: "PNG" as const };
  }

  if (
    normalizedType.includes("jpeg") ||
    normalizedType.includes("jpg") ||
    normalizedUrl.endsWith(".jpeg") ||
    normalizedUrl.endsWith(".jpg")
  ) {
    return { mimeType: "image/jpeg", format: "JPEG" as const };
  }

  return null;
};

const loadBrandLogo = async (): Promise<CachedLogo | null> => {
  if (!DEFAULT_PDF_LOGO_URL) {
    return null;
  }

  if (!cachedLogoPromise) {
    cachedLogoPromise = (async () => {
      try {
        const response = await fetch(DEFAULT_PDF_LOGO_URL, {
          signal: AbortSignal.timeout(2000),
        });

        if (!response.ok) {
          console.warn("[pdf-branding] Logo fetch failed", response.status);
          return null;
        }

        const imageFormat = inferImageFormat(
          response.headers.get("content-type"),
          DEFAULT_PDF_LOGO_URL,
        );

        if (!imageFormat) {
          console.warn("[pdf-branding] Unsupported logo format");
          return null;
        }

        const bytes = new Uint8Array(await response.arrayBuffer());

        return {
          dataUrl: `data:${imageFormat.mimeType};base64,${bytesToBase64(bytes)}`,
          format: imageFormat.format,
        };
      } catch (error) {
        console.warn("[pdf-branding] Logo fetch failed", error);
        return null;
      }
    })();
  }

  return cachedLogoPromise;
};

export const drawBrandHeader = async (
  doc: PdfDoc,
  options: BrandHeaderOptions,
): Promise<BrandHeaderResult> => {
  const text = options.text ?? "CHASE CONTINENTAL";
  const textColor = options.textColor ?? [15, 23, 42];
  const fontFamily = options.fontFamily ?? "helvetica";
  const fontStyle = options.fontStyle ?? "bold";
  const fontSize = options.fontSize ?? 12;
  const fontSizeInUnits = fontSize / doc.internal.scaleFactor;
  const logoHeight = options.logoHeight ?? fontSizeInUnits * 1.4;
  const gap = options.gap ?? fontSizeInUnits * 0.7;
  const rowHeight = Math.max(logoHeight, fontSizeInUnits);
  const textBaselineY = options.top + rowHeight / 2 + fontSizeInUnits * 0.3;

  doc.setTextColor(...textColor);
  doc.setFont(fontFamily, fontStyle);
  doc.setFontSize(fontSize);

  const logo = await loadBrandLogo();
  let textStartX = options.margin;

  if (logo) {
    try {
      const image = doc.getImageProperties(logo.dataUrl);
      const logoWidth = (image.width / image.height) * logoHeight;
      const logoY = options.top + (rowHeight - logoHeight) / 2;

      doc.addImage(
        logo.dataUrl,
        logo.format,
        options.margin,
        logoY,
        logoWidth,
        logoHeight,
      );

      textStartX += logoWidth + gap;
    } catch (error) {
      console.warn("[pdf-branding] Logo render failed", error);
    }
  }

  doc.text(text, textStartX, textBaselineY);

  return {
    bottomY: options.top + rowHeight,
    textStartX,
    textEndX: textStartX + doc.getTextWidth(text),
    textBaselineY,
  };
};
