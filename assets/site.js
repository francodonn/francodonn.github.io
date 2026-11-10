/* Content + rendering for francodonn.github.io.
   To add a blog post: drop the HTML file in /blog and add an entry to SITE.posts (newest first). */
const SITE = {
  name: "Franco Donnangelo",
  linkedin: "https://www.linkedin.com/in/franco-donnangelo-3a5b5812a/",
  github: "https://github.com/francodonn",
  publications: [
    {
      venue: "IEEE",
      title: "Predicting loss in optical transport segments: A GNN-GRU approach for a nationwide optical network",
      summary: "Laid the basis for adopting statistical analysis and predictive capabilities at Uruguay's only provider of optical network infrastructure.",
      links: [{ label: "Read the paper", href: "https://ieeexplore.ieee.org/document/10207281" }],
      tags: ["Graph neural networks", "Time series", "Telecom"]
    }
  ],
  repos: [
    { name: "ML-for-quantum-annealing-penalties", href: "https://github.com/francodonn/ML-for-quantum-annealing-penalties",
      summary: "Thesis code: an architecture that learns the ideal penalties for QUBO problem constraints with ML, applied to green hydrogen production.",
      tags: ["Quantum annealing", "ML"] },
    { name: "Q_basics", href: "https://github.com/francodonn/Q_basics",
      summary: "Basic quantum computing algorithms for getting into the field.",
      tags: ["Quantum computing"] },
    { name: "digits-gen-ea", href: "https://github.com/francodonn/digits-gen-ea",
      summary: "Evolves an image of random pixels into a digit using a genetic algorithm, with an MNIST classifier as the judge.",
      tags: ["Genetic algorithms", "MNIST"] },
    { name: "ea-routing-optimization", href: "https://github.com/francodonn/ea-routing-optimization",
      summary: "Genetic algorithms applied to the Capacitated Vehicle Routing Problem with Time Windows.",
      tags: ["Genetic algorithms", "Optimization"] }
  ],
  posts: [
    { date: "2026-11-10", href: "data-storytelling-genai.html",
      title: "The chart isn't dead. Its job got sharper.",
      summary: "An interactive reading of MIT Sloan Management Review's piece on data storytelling in the GenAI era: the 2×2 decision framework, the tools for each quadrant, why semantic layers matter, and what changed by 2026.",
      tags: ["Data storytelling", "GenAI", "Semantic layers", "D3.js"] }
  ]
};

const ICONS = {
  linkedin: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"/></svg>',
  github: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.4-4-1.4-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 0-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.7 18.3 5 18.3 5c.7 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3"/></svg>'
};

/* ---------- helpers (textContent only, never innerHTML with content) ---------- */
function el(tag, attrs = {}, ...children) {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") n.className = v; else if (k === "text") n.textContent = v; else n.setAttribute(k, v);
  }
  children.flat().forEach(c => c && n.append(c));
  return n;
}
const tags = list => el("div", { class: "tags" }, (list || []).map(t => el("span", { class: "tag", text: t })));
const fmtDate = iso => new Date(iso + "T12:00:00").toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

/* ---------- theme (shared with blog articles via localStorage) ---------- */
function currentTheme() {
  const r = document.documentElement;
  return r.dataset.theme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
}
function themeButton() {
  const b = el("button", { class: "icon-btn", type: "button", "aria-label": "Toggle dark mode", title: "Toggle dark mode" });
  const paint = () => { b.textContent = currentTheme() === "dark" ? "☀" : "☾"; };
  b.addEventListener("click", () => {
    const next = currentTheme() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch (e) {}
    paint();
  });
  paint();
  return b;
}

/* ---------- layout ---------- */
function topbar(page, base) {
  const items = [["Publications", base + "#publications", "publications"], ["Repositories", base + "#repositories", "repositories"], ["Blog", base + "blog/", "blog"]];
  const nav = el("nav", { class: "tabs", "aria-label": "Sections" },
    items.map(([label, href, key]) => el("a", { href, "data-key": key, class: page === key ? "active" : "", text: label })));
  return el("header", { class: "topbar" },
    el("div", { class: "wrap" }, el("a", { class: "brand", href: base || "./", text: SITE.name }), nav, themeButton()));
}
function socials() {
  const a = (cls, href, label) => {
    const link = el("a", { class: "social " + cls, href, target: "_blank", rel: "noopener" });
    link.insertAdjacentHTML("afterbegin", ICONS[cls]); // static, trusted SVG
    link.append(document.createTextNode(label));
    return link;
  };
  return el("div", { class: "socials" }, a("linkedin", SITE.linkedin, "LinkedIn"), a("github", SITE.github, "GitHub"));
}
function footer() {
  return el("footer", {}, el("div", { class: "wrap", text: `© ${new Date().getFullYear()} ${SITE.name}` }));
}

/* ---------- pages ---------- */
function home(main) {
  main.append(el("div", { class: "hero fade" }, el("div", { class: "kicker", text: "ML · Quantum · Data" }), el("h1", { text: SITE.name }), socials()));

  main.append(el("section", { id: "publications", class: "fade" },
    el("div", { class: "kicker", text: "Research" }), el("h2", { text: "Publications" }),
    el("div", { class: "stack" }, SITE.publications.map(p => el("article", { class: "card" },
      el("div", { class: "meta", text: p.venue }),
      el("h3", { text: p.title }), el("p", { text: p.summary }),
      el("div", { class: "links" }, p.links.map(l => el("a", { href: l.href, target: "_blank", rel: "noopener", text: l.label + " →" }))),
      tags(p.tags))))));

  main.append(el("section", { id: "repositories", class: "fade" },
    el("div", { class: "kicker", text: "Code" }), el("h2", { text: "Repositories" }),
    el("div", { class: "grid" }, SITE.repos.map(r => el("a", { class: "card", href: r.href, target: "_blank", rel: "noopener" },
      el("span", { class: "arrow", text: "↗" }),
      el("div", { class: "meta", text: "GitHub" }),
      el("h3", { text: r.name }), el("p", { text: r.summary }), tags(r.tags))))));

  main.append(el("section", { class: "fade" },
    el("div", { class: "kicker", text: "Writing" }), el("h2", { text: "Latest from the blog" }),
    postCard(SITE.posts[0], "blog/")));

  // highlight the tab of the section in view
  const links = [...document.querySelectorAll(".tabs a")];
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) links.forEach(a => a.classList.toggle("active", a.dataset.key === e.target.id));
  }), { rootMargin: "-40% 0px -55% 0px" });
  ["publications", "repositories"].forEach(id => io.observe(document.getElementById(id)));
}

function postCard(p, prefix = "") {
  return el("a", { class: "card feature", href: prefix + p.href },
    el("span", { class: "arrow", text: "→" }),
    el("div", { class: "meta", text: fmtDate(p.date) }),
    el("h3", { text: p.title }), el("p", { text: p.summary }), tags(p.tags),
    el("span", { class: "read", text: "Read the interactive story →" }));
}

function blog(main) {
  main.append(el("div", { class: "hero fade" },
    el("div", { class: "kicker" }, el("a", { href: "../", text: SITE.name })),
    el("h1", { text: "Blog" }),
    el("p", { class: "lede", text: "Interactive, data-driven essays on analytics, AI and the tools in between." })));
  main.append(el("section", { class: "fade" }, el("div", { class: "stack" }, SITE.posts.map(p => postCard(p)))));
}

/* ---------- boot ---------- */
(function boot() {
  const app = document.getElementById("app");
  const page = app.dataset.page, base = app.dataset.base || "";
  const main = el("main", { class: "wrap" });
  app.replaceChildren(topbar(page === "home" ? "" : page, base), main, footer());
  (page === "blog" ? blog : home)(main);
})();
