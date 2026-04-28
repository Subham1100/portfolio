/* Subham Singh Chauhan — Portfolio interactions */

const $ = (sel, parent = document) => parent.querySelector(sel);
const $$ = (sel, parent = document) => Array.from(parent.querySelectorAll(sel));

function setupYear() {
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
}

function setupHeaderScroll() {
  const header = document.querySelector("[data-header]");
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

function setupMobileNav() {
  const toggle = document.querySelector("[data-nav-toggle]");
  const menu = document.querySelector("[data-nav-menu]");
  if (!toggle || !menu) return;

  const setOpen = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    menu.classList.toggle("is-open", open);
  };

  toggle.addEventListener("click", () => {
    setOpen(toggle.getAttribute("aria-expanded") !== "true");
  });

  menu.addEventListener("click", (e) => {
    if (e.target.closest("a")) setOpen(false);
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setOpen(false);
  });
}

function setupResumeFallback() {
  const resume = document.querySelector("[data-resume-link]");
  if (!resume) return;

  resume.addEventListener("click", (e) => {
    const href = resume.getAttribute("href");
    if (!href) return;

    fetch(href, { method: "HEAD" })
      .then((res) => {
        if (res.ok) return;
        e.preventDefault();
        showToast("Resume PDF not found yet — add it to /assets");
      })
      .catch(() => {});
  });
}

/* ---------- Toast ---------- */

function ensureToastEl() {
  let toast = document.querySelector("[data-toast-root]");
  if (toast) return toast;

  toast = document.createElement("div");
  toast.setAttribute("data-toast-root", "");
  toast.setAttribute("role", "status");
  toast.setAttribute("aria-live", "polite");
  toast.className = "toast";
  document.body.appendChild(toast);
  return toast;
}

function showToast(message) {
  const toast = ensureToastEl();
  toast.textContent = message;
  toast.classList.add("is-visible");

  window.clearTimeout(showToast._t);
  showToast._t = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 1700);
}

async function copyText(text) {
  const value = String(text ?? "");
  if (!value) return false;

  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(value);
    return true;
  }

  const ta = document.createElement("textarea");
  ta.value = value;
  ta.setAttribute("readonly", "");
  ta.style.position = "fixed";
  ta.style.left = "-9999px";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.select();
  const ok = document.execCommand("copy");
  ta.remove();
  return ok;
}

function setupCopyButtons() {
  document.addEventListener("click", async (e) => {
    const el = e.target.closest("[data-copy]");
    if (!el) return;

    e.preventDefault();
    const text = el.getAttribute("data-copy") || "";
    const toastMsg = el.getAttribute("data-toast") || "Copied to clipboard";

    try {
      const ok = await copyText(text);
      showToast(ok ? toastMsg : "Copy failed");
    } catch {
      showToast("Copy failed");
    }
  });
}

/* ---------- Reveal animations ---------- */

function setupRevealAnimations() {
  const items = $$("[data-reveal]");
  if (!items.length) return;

  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  items.forEach((el) => observer.observe(el));
}

/* ---------- Active nav highlight on scroll ---------- */

function setupActiveNav() {
  const links = $$(".nav-link[href^='#']");
  if (!links.length || !("IntersectionObserver" in window)) return;

  const linkById = new Map();
  const sections = [];

  for (const link of links) {
    const id = link.getAttribute("href")?.slice(1);
    if (!id) continue;
    const section = document.getElementById(id);
    if (!section) continue;
    linkById.set(id, link);
    sections.push(section);
  }

  if (!sections.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      links.forEach((l) => l.classList.remove("is-active"));
      const active = linkById.get(visible.target.id);
      if (active) active.classList.add("is-active");
    },
    {
      rootMargin: "-30% 0px -55% 0px",
      threshold: [0, 0.1, 0.25, 0.5],
    }
  );

  sections.forEach((s) => observer.observe(s));
}

/* ---------- Project hover light follow ---------- */

function setupProjectHover() {
  const projects = $$(".project");
  if (!projects.length) return;

  projects.forEach((p) => {
    p.addEventListener("pointermove", (e) => {
      const rect = p.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      p.style.setProperty("--mx", `${x}%`);
    });
  });
}

/* ---------- Init ---------- */

setupYear();
setupHeaderScroll();
setupMobileNav();
setupResumeFallback();
setupCopyButtons();
setupRevealAnimations();
setupActiveNav();
setupProjectHover();
