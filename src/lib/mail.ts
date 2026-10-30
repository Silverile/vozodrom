import "server-only";

import { getCloudflareContext } from "@opennextjs/cloudflare";

export interface Mail {
  to: string;
  subject: string;
  text: string;
}

// Sent through Cloudflare Email Service (the EMAIL binding) when MAIL_FROM is set, i.e. in
// production. Locally MAIL_FROM is unset and messages are only logged, so the verification and
// reset links appear in the `next dev` / wrangler output instead of reaching real inboxes.
export async function sendMail(mail: Mail): Promise<void> {
  const { env } = getCloudflareContext();
  if (!env.MAIL_FROM) {
    console.log(`[mail] to=${mail.to} subject="${mail.subject}"\n${mail.text}`);
    return;
  }
  try {
    await env.EMAIL.send({ from: env.MAIL_FROM, to: mail.to, subject: mail.subject, text: mail.text });
  } catch (error) {
    const { code, message } = error as { code?: string; message?: string };
    console.error(`[mail] sending to ${mail.to} failed: ${code ?? ""} ${message ?? error}`);
    throw error;
  }
}
