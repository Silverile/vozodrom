/** Only same-site paths are accepted as the page to return to after signing in. */
export function safeNext(value: string | null | undefined): string {
  return value && value.startsWith("/") && !value.startsWith("//") && !value.startsWith("/\\") ? value : "/ucet/";
}
