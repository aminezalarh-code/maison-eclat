/* ==========================================================================
   Agadir Visite — Site behaviour
   Vanilla JS, no dependencies. Handles: mobile menu, sticky header,
   hero slider, scroll reveals, current-year, demo form submit.
   ========================================================================== */
(function () {
  "use strict";

  /* ---- Mobile navigation -------------------------------------------------- */
  var toggle = document.querySelector(".nav-toggle");
  var backdrop = document.querySelector(".menu-backdrop");
  function closeMenu() { document.body.classList.remove("menu-open"); if (toggle) toggle.setAttribute("aria-expanded", "false"); }
  if (toggle) {
    toggle.addEventListener("click", function () {
      var open = document.body.classList.toggle("menu-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }
  if (backdrop) backdrop.addEventListener("click", closeMenu);
  document.querySelectorAll(".nav-menu a").forEach(function (a) { a.addEventListener("click", closeMenu); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(); });

  /* ---- Active nav link (based on current file) --------------------------- */
  var stem = function (p) { return (p.split("/").pop() || "").replace(/\.html$/, "") || "index"; };
  var here = stem(location.pathname);
  document.querySelectorAll(".nav-menu a").forEach(function (a) {
    if (stem(a.getAttribute("href")) === here) a.classList.add("is-active");
    else a.classList.remove("is-active");
  });

  /* ---- Sticky header shadow ---------------------------------------------- */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () { header.classList.toggle("is-stuck", window.scrollY > 8); };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---- Hero slider -------------------------------------------------------- */
  var hero = document.querySelector(".hero__slides");
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero__slide"));
    var dotsWrap = document.querySelector(".hero__dots");
    var i = 0, timer = null;
    var dots = slides.map(function (_, idx) {
      var b = document.createElement("button");
      b.type = "button";
      b.setAttribute("aria-label", "Go to slide " + (idx + 1));
      b.addEventListener("click", function () { go(idx); restart(); });
      if (dotsWrap) dotsWrap.appendChild(b);
      return b;
    });
    function go(n) {
      slides[i].classList.remove("is-active");
      if (dots[i]) dots[i].classList.remove("is-active");
      i = (n + slides.length) % slides.length;
      slides[i].classList.add("is-active");
      if (dots[i]) dots[i].classList.add("is-active");
    }
    function next() { go(i + 1); }
    function restart() { if (timer) clearInterval(timer); timer = setInterval(next, 6000); }
    if (slides.length) { go(0); if (slides.length > 1) restart(); }
  }

  /* ---- Scroll reveal ------------------------------------------------------ */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---- Current year ------------------------------------------------------- */
  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---- Demo form handling (front-end only) -------------------------------
     Ready to connect to a backend / email service later. For now it shows a
     friendly confirmation and can hand off to WhatsApp.                      */
  document.querySelectorAll("form[data-demo]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var status = form.querySelector(".form-status");
      if (status) { status.classList.add("is-ok"); status.textContent = "Thank you! Your request has been received — we'll reply within a few hours."; }
      var wa = form.getAttribute("data-whatsapp");
      if (wa) {
        var data = new FormData(form);
        var msg = "Hello Agadir Visite,%0A";
        data.forEach(function (v, k) { if (v) msg += encodeURIComponent(k) + ": " + encodeURIComponent(v) + "%0A"; });
        window.open("https://wa.me/" + wa + "?text=" + msg, "_blank");
      }
      form.reset();
    });
  });
})();
