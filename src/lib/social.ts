// Vozodrom on social networks, linked from the footer with their icons (public/social/). An entry
// without an address is not shown, so a network is listed only once its group or account exists.
export const SOCIAL: { name: string; href: string; icon: string }[] = [
  { name: "Facebook", href: "https://www.facebook.com/groups/4797962477193565/", icon: "/social/facebook.svg" },
  { name: "Instagram", href: "https://www.instagram.com/vozodrom/", icon: "/social/instagram.png" },
  { name: "Telegram", href: "https://t.me/vozodrom", icon: "/social/telegram.png" },
].filter((s) => s.href);
