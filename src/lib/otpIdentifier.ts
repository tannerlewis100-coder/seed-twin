// Helpers for parsing/formatting OTP identifiers (email or US phone).
export type OtpChannel = "email" | "phone";

export const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Extract digits, strip leading US country code, return 10-digit phone or null. */
export function normalizeUsPhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) return digits.slice(1);
  if (digits.length === 10) return digits;
  return null;
}

export function formatUsPhone(tenDigits: string): string {
  if (tenDigits.length !== 10) return tenDigits;
  return `(${tenDigits.slice(0, 3)}) ${tenDigits.slice(3, 6)}-${tenDigits.slice(6)}`;
}

export type ParsedIdentifier =
  | { channel: "email"; email: string; display: string }
  | { channel: "phone"; phone: string; display: string }
  | { channel: null; error: string };

export function parseIdentifier(raw: string): ParsedIdentifier {
  const trimmed = raw.trim();
  if (!trimmed) return { channel: null, error: "Enter your email or phone number." };
  if (EMAIL_RX.test(trimmed)) {
    return { channel: "email", email: trimmed, display: trimmed };
  }
  const phone = normalizeUsPhone(trimmed);
  if (phone) {
    return { channel: "phone", phone, display: formatUsPhone(phone) };
  }
  // If it contains letters/@ but failed email regex, treat as bad email.
  if (/[a-zA-Z@]/.test(trimmed)) {
    return { channel: null, error: "Enter a valid email address." };
  }
  return { channel: null, error: "Enter a valid 10-digit US phone number." };
}

/** Build the payload for /otp/send and /otp/verify. */
export function otpPayload(id: ParsedIdentifier, code?: string): Record<string, string> {
  const base: Record<string, string> =
    id.channel === "email" ? { email: id.email } : id.channel === "phone" ? { phone: id.phone } : {};
  if (code) base.code = code;
  return base;
}
