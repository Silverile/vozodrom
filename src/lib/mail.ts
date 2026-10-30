import "server-only";

export interface Mail {
  to: string;
  subject: string;
  text: string;
}

// No mail provider is chosen yet (see CHECKLIST.md). Until then messages are only logged, which
// is enough locally: the verification and reset links appear in the `next dev` / wrangler output.
// In production this means e-mail verification cannot complete, so pick a provider before launch.
export async function sendMail(mail: Mail): Promise<void> {
  console.log(`[mail] to=${mail.to} subject="${mail.subject}"\n${mail.text}`);
}
