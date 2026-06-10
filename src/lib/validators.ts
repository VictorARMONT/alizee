/**
 * Validadores server-side para inputs del funnel.
 * LFPDPPP: validar + sanitizar en servidor.
 */

export function validateEmail(email: unknown): string {
  if (typeof email !== "string") throw new Error("email_invalid_type");
  const trimmed = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    throw new Error("email_invalid_format");
  }
  if (trimmed.length > 254) throw new Error("email_too_long");
  return trimmed;
}

export function validateBirthDate(iso: unknown): string {
  if (typeof iso !== "string") throw new Error("date_invalid_type");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) {
    throw new Error("date_invalid_format");
  }
  const date = new Date(iso + "T12:00:00Z");
  if (isNaN(date.getTime())) throw new Error("date_invalid");
  // No más de 120 años
  const age = new Date().getFullYear() - date.getFullYear();
  if (age < 10 || age > 130) throw new Error("date_out_of_range");
  return iso;
}

export function validateBirthTime(time: unknown): string {
  if (typeof time !== "string") throw new Error("time_invalid_type");
  if (!/^\d{2}:\d{2}$/.test(time)) throw new Error("time_invalid_format");
  const [hours, minutes] = time.split(":").map(Number);
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    throw new Error("time_out_of_range");
  }
  return time;
}

export function validateQuizAnswer(questionId: unknown, answer: unknown): { id: string; key: string } {
  if (typeof questionId !== "string") throw new Error("question_id_invalid");
  if (typeof answer !== "string") throw new Error("answer_invalid");
  // Longitud razonable
  if (questionId.length > 50 || answer.length > 100) {
    throw new Error("input_too_long");
  }
  return { id: questionId, key: answer };
}

export function validateCheckout(data: unknown): {
  email: string;
  street: string;
  colonia: string;
  cityState: string;
  zip: string;
} {
  if (typeof data !== "object" || !data) throw new Error("checkout_invalid");
  const obj = data as Record<string, unknown>;

  const email = validateEmail(obj.email);
  const street = sanitizeString(obj.street, 100);
  const colonia = sanitizeString(obj.colonia, 100);
  const cityState = sanitizeString(obj.cityState, 100);
  const zip = sanitizeString(obj.zip, 10);

  if (!street || !colonia || !cityState || !zip) {
    throw new Error("checkout_missing_fields");
  }

  return { email, street, colonia, cityState, zip };
}

function sanitizeString(val: unknown, maxLen: number): string {
  if (typeof val !== "string") return "";
  return val.trim().slice(0, maxLen);
}
