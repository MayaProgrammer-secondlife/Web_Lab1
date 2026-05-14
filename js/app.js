(function () {
  "use strict";
  var THEME_KEY = "atelier_theme";
  var DRAFT_KEY = "atelier_draft";
  function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (_) {}
  }
  function loadTheme() {
    var saved = null;
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
    var btn = document.getElementById("theme-toggle");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var isDark = document.documentElement.getAttribute("data-theme") === "dark";
      setTheme(isDark ? "light" : "dark");
    });
  }
  function setNavCurrent() {
    var path = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav a").forEach(function (link) {
      var href = link.getAttribute("href");
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
    var titleEl = document.getElementById("draft-title");
    var bodyEl = document.getElementById("draft-body");
    var statusEl = document.getElementById("draft-status");
    if (!titleEl || !bodyEl) return;
    var raw = null;
    try {
      raw = localStorage.getItem(DRAFT_KEY);
    } catch (_) {}
    if (!raw) {
      safeSetText(statusEl, "Черновик не сохранён.");
      return;
    }
    try {
      var data = JSON.parse(raw);
      if (data && typeof data === "object") {
        titleEl.value = typeof data.title === "string" ? data.title : "";
        bodyEl.value = typeof data.body === "string" ? data.body : "";
        safeSetText(statusEl, "Загружен сохранённый черновик.");
      }
    } catch (_) {
      safeSetText(statusEl, "Не удалось прочитать черновик.");
    }
  }
  function wireDraftForm() {
    var form = document.getElementById("draft-form");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var titleEl = document.getElementById("draft-title");
      var bodyEl = document.getElementById("draft-body");
      var statusEl = document.getElementById("draft-status");
      var payload = {
        title: titleEl ? titleEl.value : "",
        body: bodyEl ? bodyEl.value : "",
      };
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(payload));
        safeSetText(statusEl, "Черновик сохранён локально.");
      } catch (err) {
        safeSetText(statusEl, "Ошибка сохранения: " + (err && err.message ? err.message : "unknown"));
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