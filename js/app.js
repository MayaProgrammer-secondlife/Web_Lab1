(function () {
  "use strict";

  const THEME_KEY = "atelier_theme";
  const DRAFT_KEY = "atelier_draft";

  function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (_) {}
  }

  function loadTheme() {
    let saved = null;
    try {
      saved = localStorage.getItem(THEME_KEY);
    } catch (_) {}
    
    if (saved === "dark" || saved === "light") {
      setTheme(saved);
    } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  }

  function wireThemeToggle() {
    const btn = document.getElementById("theme-toggle");
    if (!btn) return;
    
    btn.addEventListener("click", function () {
      const isDark = document.documentElement.getAttribute("data-theme") === "dark";
      setTheme(isDark ? "light" : "dark");
    });
  }

  function setNavCurrent() {
    const path = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav a").forEach(function (link) {
      const href = link.getAttribute("href");
      if (href === path || (path === "" && href === "index.html")) {
        link.setAttribute("aria-current", "page");
      }
    });
  }

  function safeSetText(el, text) {
    if (!el) return;
    el.textContent = text == null ? "" : String(text);
  }

  function loadDraftForm() {
    const titleEl = document.getElementById("draft-title");
    const bodyEl = document.getElementById("draft-body");
    const statusEl = document.getElementById("draft-status");
    
    if (!titleEl || !bodyEl) return;

    let raw = null;
    try {
      raw = localStorage.getItem(DRAFT_KEY);
    } catch (_) {}

    if (!raw) {
      safeSetText(statusEl, "Черновик не сохранён.");
      return;
    }

    try {
      const data = JSON.parse(raw);
      if (data && typeof data === "object") {
        titleEl.value = typeof data.title === "string" ? data.title : "";
        bodyEl.value = typeof data.body === "string" ? data.body : "";
        safeSetText(statusEl, "✓ Загружен сохранённый черновик.");
      }
    } catch (_) {
      safeSetText(statusEl, "⚠ Не удалось прочитать черновик.");
    }
  }

  function wireDraftForm() {
    const form = document.getElementById("draft-form");
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      
      const titleEl = document.getElementById("draft-title");
      const bodyEl = document.getElementById("draft-body");
      const statusEl = document.getElementById("draft-status");
      
      const payload = {
        title: titleEl ? titleEl.value.trim() : "",
        body: bodyEl ? bodyEl.value.trim() : "",
        savedAt: new Date().toISOString()
      };
      
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(payload));
        safeSetText(statusEl, "✓ Черновик сохранён локально.");
        
        statusEl.style.color = "var(--success)";
        setTimeout(() => {
          statusEl.style.color = "";
        }, 2000);
      } catch (err) {
        safeSetText(statusEl, "✗ Ошибка: " + (err?.message || "неизвестная"));
      }
    });

    loadDraftForm();
  }

  document.addEventListener("DOMContentLoaded", function () {
    loadTheme();
    wireThemeToggle();
    setNavCurrent();
    wireDraftForm();
  });
})();