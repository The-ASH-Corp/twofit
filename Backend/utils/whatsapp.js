
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;

const normalizeWhatsAppNumber = (rawNumber) => {
  const input = String(rawNumber || "").trim();
  if (!input) {
    throw new Error("Recipient phone number is missing");
  }

  // Keep leading plus only if already in E.164-ish format.
  if (input.startsWith("+")) {
    const cleaned = `+${input.slice(1).replace(/\D/g, "")}`;
    if (cleaned.length < 8) {
      throw new Error(`Invalid phone number: ${rawNumber}`);
    }
    return cleaned;
  }

  const digits = input.replace(/\D/g, "");
  if (!digits) {
    throw new Error(`Invalid phone number: ${rawNumber}`);
  }

  // Common India local mobile format: 10 digits => prepend +91.
  if (digits.length === 10) {
    return `91${digits}`;
  }

  // India with trunk prefix 0 (e.g. 09876543210) => +91XXXXXXXXXX.
  if (digits.length === 11 && digits.startsWith("0")) {
    return `91${digits.slice(1)}`;
  }

  // India without plus (e.g. 919876543210) => add plus.
  if (digits.length === 12 && digits.startsWith("91")) {
    return `${digits}`;
  }

  // International number without plus.
  if (digits.length > 10) {
    return `+${digits}`;
  }

  throw new Error(`Invalid phone number: ${rawNumber}`);
};

export const sendTemplateMessage = async ({
  to,
  templateName,
  variables = [],
  callbackData = null,
}) => {
  try {
    const normalizedTo = normalizeWhatsAppNumber(to);

    const response = await fetch(
      `https://graph.facebook.com/v25.0/${PHONE_NUMBER_ID}/messages`,
      {
        method: 'post',
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: normalizedTo,
          ...(callbackData ? { biz_opaque_callback_data: String(callbackData) } : {}),
          type: "template",
          template: {
            name: templateName,
            language: { code: "en" },
            components: [
              {
                type: "body",
                parameters: variables.map(v => ({
                  type: "text",
                  text: v
                }))
              }
            ]
          }
        })
      }
    );

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.error?.message || "Failed to send WhatsApp message");
    }

    return data;
  } catch (error) {
    console.error("WhatsApp error:", error.message);
    throw error;
  }
};
