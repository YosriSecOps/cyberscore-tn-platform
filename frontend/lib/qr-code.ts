/**
 * CyberScore TN — QR Code Generation Utility
 * Generates high-contrast, scannable QR codes for sovereign PDF reports,
 * public trust badges, and mobile camera verification.
 */
import QRCode from "qrcode";

export interface QrCodeOptions {
  width?: number;
  margin?: number;
  darkColor?: string;
  lightColor?: string;
  errorCorrectionLevel?: "L" | "M" | "Q" | "H";
}

const DEFAULT_OPTIONS: QrCodeOptions = {
  width: 180,
  margin: 1,
  darkColor: "#0A192F",
  lightColor: "#FFFFFF",
  errorCorrectionLevel: "M",
};

/**
 * Generate a Base64 PNG Data URL suitable for @react-pdf/renderer <Image />
 * and standard HTML <img /> elements.
 */
export async function generateQrCodeDataUrl(
  text: string,
  options: QrCodeOptions = {}
): Promise<string> {
  const merged = { ...DEFAULT_OPTIONS, ...options };
  try {
    return await QRCode.toDataURL(text, {
      width: merged.width,
      margin: merged.margin,
      errorCorrectionLevel: merged.errorCorrectionLevel,
      color: {
        dark: merged.darkColor,
        light: merged.lightColor,
      },
    });
  } catch (err) {
    console.error("Failed to generate QR Code Data URL:", err);
    return "";
  }
}

/**
 * Generate an SVG string representation of the QR Code.
 */
export async function generateQrCodeSvg(
  text: string,
  options: QrCodeOptions = {}
): Promise<string> {
  const merged = { ...DEFAULT_OPTIONS, ...options };
  try {
    return await QRCode.toString(text, {
      type: "svg",
      width: merged.width,
      margin: merged.margin,
      errorCorrectionLevel: merged.errorCorrectionLevel,
      color: {
        dark: merged.darkColor,
        light: merged.lightColor,
      },
    });
  } catch (err) {
    console.error("Failed to generate QR Code SVG:", err);
    return "";
  }
}

/**
 * Build the canonical verification URL for a given domain and optional audit reference.
 */
export function getVerificationUrl(domain: string, auditRef?: string): string {
  const cleanDomain = domain.replace(/^https?:\/\//, "").replace(/\/.*$/, "").toLowerCase();
  const baseUrl = typeof window !== "undefined" && window.location.origin
    ? window.location.origin
    : "https://cyberscore.tn";
  
  const query = auditRef ? `?ref=${encodeURIComponent(auditRef)}` : "";
  return `${baseUrl}/fr/verify/${cleanDomain}${query}`;
}
