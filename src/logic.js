const KEY = "nae-local-wiki";

export function loadWiki() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {
    pages: [
      { id: "home", title: "Home", body: "Welcome to your local wiki.\n\nCreate pages on the left. Everything stays in this browser." },
      { id: "ideas", title: "Ideas", body: "- Capture notes\n- Link related pages by title\n- Export later if you want" },
    ],
  };
}

export function saveWiki(state) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function uid() {
  return "p-" + Math.random().toString(36).slice(2, 9);
}
