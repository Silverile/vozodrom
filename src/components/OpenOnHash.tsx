"use client";

import { useEffect } from "react";

// Opens a folded <details> when the page's address points at it (#g3 from a generation card or a
// shared link), then scrolls it into view. Renders nothing.
export function OpenOnHash() {
  useEffect(() => {
    function open() {
      const target = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (!(target instanceof HTMLDetailsElement)) return;
      target.open = true;
      target.scrollIntoView({ block: "start" });
    }
    open();
    window.addEventListener("hashchange", open);
    return () => window.removeEventListener("hashchange", open);
  }, []);
  return null;
}
