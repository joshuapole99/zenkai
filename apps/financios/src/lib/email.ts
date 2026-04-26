export async function sendLoginEmail(to: string, loginUrl: string): Promise<void> {
  await brevoSend({
    sender: { name: "Financios", email: "noreply@financios.nl" },
    to: [{ email: to }],
    subject: "Inloglink voor Financios",
    htmlContent: `
<!DOCTYPE html>
<html lang="nl">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0B0F14;font-family:Inter,system-ui,sans-serif;color:#F9FAFB;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0B0F14;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:480px;background:#111827;border-radius:16px;border:1px solid #1F2937;overflow:hidden;">
        <tr><td style="background:#6366F1;padding:24px 32px;">
          <p style="margin:0;font-size:13px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#E0E7FF;">Financios</p>
          <h1 style="margin:6px 0 0;font-size:22px;font-weight:700;color:#fff;line-height:1.3;">Jouw inloglink</h1>
        </td></tr>
        <tr><td style="padding:32px;">
          <p style="margin:0 0 16px;font-size:15px;color:#D1D5DB;line-height:1.6;">
            Klik op de knop hieronder om in te loggen bij Financios. De link is 15 minuten geldig.
          </p>
          <table cellpadding="0" cellspacing="0" style="margin:0 auto 28px;">
            <tr><td style="background:#6366F1;border-radius:12px;">
              <a href="${loginUrl}" style="display:block;padding:14px 32px;font-size:15px;font-weight:700;color:#fff;text-decoration:none;letter-spacing:0.02em;">
                Inloggen bij Financios →
              </a>
            </td></tr>
          </table>
          <p style="margin:0 0 8px;font-size:12px;color:#6B7280;">Of kopieer deze link in je browser:</p>
          <p style="margin:0;font-size:11px;color:#4B5563;word-break:break-all;">${loginUrl}</p>
        </td></tr>
        <tr><td style="padding:20px 32px;border-top:1px solid #1F2937;">
          <p style="margin:0;font-size:12px;color:#4B5563;line-height:1.5;">
            Heb je dit niet aangevraagd? Dan kun je deze email negeren.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
    `.trim(),
  });
}

async function brevoSend(payload: object): Promise<void> {
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": process.env.BREVO_API_KEY!,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Brevo error ${res.status}: ${text}`);
  }
}

export async function sendMagicLink(to: string, planUrl: string): Promise<void> {
  await brevoSend({
    sender: { name: "Financios", email: "noreply@financios.nl" },
    to: [{ email: to }],
    subject: "Jouw persoonlijk spaarplan staat klaar",
    htmlContent: `
<!DOCTYPE html>
<html lang="nl">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0B0F14;font-family:Inter,system-ui,sans-serif;color:#F9FAFB;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0B0F14;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:480px;background:#111827;border-radius:16px;border:1px solid #1F2937;overflow:hidden;">
        <tr><td style="background:#6366F1;padding:24px 32px;">
          <p style="margin:0;font-size:13px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#E0E7FF;">Financios</p>
          <h1 style="margin:6px 0 0;font-size:22px;font-weight:700;color:#fff;line-height:1.3;">Jouw spaarplan staat klaar</h1>
        </td></tr>
        <tr><td style="padding:32px;">
          <p style="margin:0 0 16px;font-size:15px;color:#D1D5DB;line-height:1.6;">
            Bedankt voor je aankoop! Je persoonlijk spaarfix plan is aangemaakt op basis van jouw ingevoerde gegevens.
          </p>
          <p style="margin:0 0 28px;font-size:15px;color:#D1D5DB;line-height:1.6;">
            Klik op de knop hieronder om je plan te openen. Deze link werkt altijd — sla hem op in je bookmarks.
          </p>
          <table cellpadding="0" cellspacing="0" style="margin:0 auto 28px;">
            <tr><td style="background:#6366F1;border-radius:12px;">
              <a href="${planUrl}" style="display:block;padding:14px 32px;font-size:15px;font-weight:700;color:#fff;text-decoration:none;letter-spacing:0.02em;">
                Bekijk mijn spaarplan →
              </a>
            </td></tr>
          </table>
          <p style="margin:0 0 8px;font-size:12px;color:#6B7280;">Of kopieer deze link in je browser:</p>
          <p style="margin:0;font-size:11px;color:#4B5563;word-break:break-all;">${planUrl}</p>
        </td></tr>
        <tr><td style="padding:20px 32px;border-top:1px solid #1F2937;">
          <p style="margin:0;font-size:12px;color:#4B5563;line-height:1.5;">
            Eenmalige aankoop · Geen abonnement · <a href="https://financios.nl/disclaimer" style="color:#6B7280;">Disclaimer</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
    `.trim(),
  });
}
