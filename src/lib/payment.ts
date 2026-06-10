/**
 * CLIP payment stub — [CONFIRMAR] replace with real CLIP API once credentials arrive.
 * CLIP docs: https://developer.clip.mx
 *
 * Today this just logs and returns a pending intent shape so the rest of the
 * checkout flow has a typed interface to depend on.
 */

export interface ClipPaymentParams {
  amountMXN: number;
  description: string;
  email?: string;
}

export interface ClipPaymentResult {
  status: "pending" | "success" | "error";
  message: string;
}

export async function initiateClipPayment(
  params: ClipPaymentParams
): Promise<ClipPaymentResult> {
  // [CONFIRMAR] Replace body with real CLIP checkout/payment-link API call.
  // Options: CLIP payment link API, CLIP terminal push (if using physical terminal),
  // or CLIP hosted checkout redirect.
  console.info("[CLIP stub] Payment initiated", params);
  return {
    status: "pending",
    message:
      "Pasarela CLIP pendiente de configuración. Integrar con credenciales de producción. [CONFIRMAR]",
  };
}
