import "./style.css";
import { loadWiki, saveWiki, uid } from "./logic.js";

const root = document.querySelector("#app");
let state = loadWiki();
let currentId = state.pages[0]?.id || null;
let q = "";

function current() {
  return state.pages.find((p) => p.id === currentId) || null;
}

function render() {
  const filtered = state.pages.filter((p) => !q || p.title.toLowerCase().includes(q.toLowerCase()));
  const page = current();
  root.innerHTML = `
  <div class="shell">
    <aside class="side">
      <h1 class="brand">Local Wiki</h1>
      <p class="lede">Private pages in localStorage.</p>
      <input id="q" placeholder="Search pages" value="${q.replace(/"/g, "&quot;")}" />
      <button type="button" id="new">New page</button>
      <ul class="pages">
        ${filtered.map((p) => `<li><button type="button" data-id="${p.id}" class="${p.id === currentId ? "active" : ""}">${escapeHtml(p.title)}</button></li>`).join("")}
      </ul>
    </aside>
    <section class="main">
      ${page ? `
        <input id="title" value="${escapeAttr(page.title)}" />
        <div class="row">
          <button type="button" id="save">Save</button>
          <button type="button" class="ghost" id="del">Delete</button>
        </div>
        <textarea id="body">${escapeHtml(page.body)}</textarea>
        <div class="preview">${escapeHtml(page.body)}</div>
      ` : "<p>Select or create a page.</p>"}
      <aside id="insights" class="lede" style="margin-top:1.5rem"></aside>
    </section>
  </div>`;

  root.querySelector("#q")?.addEventListener("input", (e) => { q = e.target.value; render(); });
  root.querySelector("#new")?.addEventListener("click", () => {
    const id = uid();
    state.pages.unshift({ id, title: "Untitled", body: "" });
    currentId = id; saveWiki(state); render();
  });
  root.querySelectorAll("[data-id]").forEach((btn) => {
    btn.addEventListener("click", () => { currentId = btn.getAttribute("data-id"); render(); });
  });
  root.querySelector("#save")?.addEventListener("click", () => {
    const p = current(); if (!p) return;
    p.title = root.querySelector("#title").value.trim() || "Untitled";
    p.body = root.querySelector("#body").value;
    saveWiki(state); render();
  });
  root.querySelector("#del")?.addEventListener("click", () => {
    if (!currentId) return;
    state.pages = state.pages.filter((p) => p.id !== currentId);
    currentId = state.pages[0]?.id || null;
    saveWiki(state); render();
  });
}

function escapeHtml(s) {
  return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}
function escapeAttr(s) {
  return escapeHtml(s).replace(/"/g, "&quot;");
}

render();
fetch("./insights.json", { cache: "no-store" }).then(r => r.ok ? r.json() : null).then(d => {
  if (!d) return;
  const el = document.querySelector("#insights");
  if (el) el.textContent = "Web insights: " + (d.headline || "");
}).catch(() => {});
