/* ============================================================================
   DESIGN SYSTEM v1.1 — SHARED PIPELINE ENGINE (VANILLA JS, ZERO DEPENDENCIES)
   Author: Esam Haraz
   Path: Data-Analysis/assets/projects/ds.js
   ============================================================================ */

(function () {
  "use strict";

  /* --------------------------------------------------------------------------
     1. CONFIGURATION & ENVIRONMENT DETECTION
     -------------------------------------------------------------------------- */
  const DEFAULT_CONFIG = {
    baseUrl: "https://esam-haraz.github.io/Data-Analysis/",
    currentSiteId: "data",
    sitesGraph: [
      { id: "hub", labelEn: "Services Hub", labelAr: "المركز الرئيسي", url: "https://esam-haraz.github.io/hub/" },
      { id: "autodeploy", labelEn: "AutoDeploy", labelAr: "AutoDeploy", url: "https://esam-haraz.github.io/AutoDeploy/" },
      { id: "data", labelEn: "Data Analysis", labelAr: "تحليل البيانات", url: "./" },
      { id: "portfolio", labelEn: "Portfolio", labelAr: "معرض الأعمال", url: "https://esam-haraz.github.io/portfolio/" }
    ],
    hubContactUrl: "mailto:esamv20@gmail.com",
    email: "esamv20@gmail.com",
    linkedinUrl: "https://www.linkedin.com/in/esam-haraz-459925402"
  };

  const CFG = Object.assign({}, DEFAULT_CONFIG, window.SITE_CONFIG || {});
  const REDUCED_MOTION = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const STORAGE_LANG_KEY = "esam_ds_lang_v1";
  const STORAGE_THEME_KEY = "esam_ds_theme_v1";
  const SESSION_INTRO_KEY = "esam_data_spider_intro_v1";

  let currentLang = "en";
  let currentTheme = "light";
  let isWiping = false;
  let spiderIntroSkipped = false;

  /* --------------------------------------------------------------------------
     2. THEME MANAGEMENT (LIGHT / DARK FOLLOWING PREFERS-COLOR-SCHEME)
     -------------------------------------------------------------------------- */
  function initTheme() {
    let saved = null;
    try {
      saved = localStorage.getItem(STORAGE_THEME_KEY);
    } catch (_) {}

    if (saved === "dark" || saved === "light") {
      currentTheme = saved;
    } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      currentTheme = "dark";
    } else {
      currentTheme = "light";
    }

    applyTheme(currentTheme, false);
  }

  function applyTheme(theme, persist) {
    currentTheme = theme === "dark" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", currentTheme);

    if (persist) {
      try {
        localStorage.setItem(STORAGE_THEME_KEY, currentTheme);
      } catch (_) {}
    }

    const themeBtn = document.getElementById("ds-theme-toggle");
    if (themeBtn) {
      const isDark = currentTheme === "dark";
      themeBtn.setAttribute("aria-pressed", String(isDark));
      const labelEl = themeBtn.querySelector("[data-theme-label]");
      if (labelEl) {
        if (currentLang === "ar") {
          labelEl.textContent = isDark ? "فاتح" : "داكن";
        } else {
          labelEl.textContent = isDark ? "Light" : "Dark";
        }
      }
      themeBtn.setAttribute(
        "aria-label",
        currentLang === "ar"
          ? (isDark ? "التبديل إلى الوضع الفاتح" : "التبديل إلى الوضع الداكن")
          : (isDark ? "Switch to light mode" : "Switch to dark mode")
      );
    }
  }

  function toggleTheme() {
    applyTheme(currentTheme === "dark" ? "light" : "dark", true);
  }

  /* --------------------------------------------------------------------------
     3. MINI NODE-GRAPH NAV & MOBILE (<480px) DROPDOWN
     -------------------------------------------------------------------------- */
  function hydrateNavigation() {
    const graphNav = document.getElementById("ds-mini-graph");
    const dropdownMenu = document.getElementById("ds-nav-dropdown-menu");
    const dropdownBtn = document.getElementById("ds-nav-dropdown-btn");

    if (graphNav && Array.isArray(CFG.sitesGraph)) {
      graphNav.innerHTML = CFG.sitesGraph
        .map((site, index) => {
          const isCurrent = site.id === CFG.currentSiteId;
          const label = currentLang === "ar" ? site.labelAr : site.labelEn;
          const edge = index < CFG.sitesGraph.length - 1 ? '<span class="ds-mini-edge" aria-hidden="true"></span>' : "";
          return `
            <a href="${escapeAttr(site.url)}"
               class="ds-mini-node ${isCurrent ? "is-current" : ""}"
               ${isCurrent ? 'aria-current="page"' : ""}>
              <span class="ds-mini-dot" aria-hidden="true"></span>
              <span>${escapeHtml(label)}</span>
            </a>${edge}
          `;
        })
        .join("");
    }

    if (dropdownMenu && Array.isArray(CFG.sitesGraph)) {
      dropdownMenu.innerHTML = CFG.sitesGraph
        .map((site) => {
          const isCurrent = site.id === CFG.currentSiteId;
          const label = currentLang === "ar" ? site.labelAr : site.labelEn;
          return `
            <a href="${escapeAttr(site.url)}"
               class="${isCurrent ? "is-current" : ""}"
               ${isCurrent ? 'aria-current="page"' : ""}>
              <span>${escapeHtml(label)}</span>
              <span aria-hidden="true">${isCurrent ? "●" : "↗"}</span>
            </a>
          `;
        })
        .join("");
    }

    if (dropdownBtn && dropdownMenu) {
      const currentSite = CFG.sitesGraph.find((s) => s.id === CFG.currentSiteId);
      const shortLabel = currentLang === "ar" ? "بيانات ▾" : "Data ▾";
      if (currentSite && currentSite.id !== "data") {
        dropdownBtn.textContent = (currentLang === "ar" ? currentSite.labelAr : currentSite.labelEn) + " ▾";
      } else {
        dropdownBtn.textContent = shortLabel;
      }
    }

    document.querySelectorAll("[data-contact-cta]").forEach((el) => {
      el.setAttribute("href", CFG.hubContactUrl || ("mailto:" + CFG.email));
    });
  }

  function setupMobileNavDropdown() {
    const btn = document.getElementById("ds-nav-dropdown-btn");
    const menu = document.getElementById("ds-nav-dropdown-menu");
    if (!btn || !menu) return;

    function closeMenu() {
      menu.classList.remove("is-open");
      btn.setAttribute("aria-expanded", "false");
    }

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const willOpen = !menu.classList.contains("is-open");
      menu.classList.toggle("is-open", willOpen);
      btn.setAttribute("aria-expanded", String(willOpen));
    });

    document.addEventListener("click", (e) => {
      if (!menu.contains(e.target) && e.target !== btn) {
        closeMenu();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && menu.classList.contains("is-open")) {
        closeMenu();
        btn.focus();
      }
    });
  }

  /* --------------------------------------------------------------------------
     4. BILINGUAL DICTIONARY ENGINE & CIRCULAR WIPE TRANSITION (WIPE MOTION)
     -------------------------------------------------------------------------- */
  function initLanguage() {
    let saved = null;
    try {
      saved = localStorage.getItem(STORAGE_LANG_KEY);
    } catch (_) {}

    if (saved === "ar" || saved === "en") {
      currentLang = saved;
    } else {
      const docLang = (document.documentElement.lang || "en").toLowerCase();
      currentLang = docLang.startsWith("ar") ? "ar" : "en";
    }

    applyLanguage(currentLang, false);
  }

  function applyLanguage(lang, persist) {
    currentLang = lang === "ar" ? "ar" : "en";
    const dir = currentLang === "ar" ? "rtl" : "ltr";

    document.documentElement.lang = currentLang;
    document.documentElement.dir = dir;
    if (document.body) {
      document.body.dir = dir;
    }

    if (persist) {
      try {
        localStorage.setItem(STORAGE_LANG_KEY, currentLang);
      } catch (_) {}
    }

    const dict = (window.PAGE_I18N && window.PAGE_I18N[currentLang]) || {};

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (Object.prototype.hasOwnProperty.call(dict, key)) {
        el.textContent = dict[key];
      }
    });

    document.querySelectorAll("[data-i18n-html]").forEach((el) => {
      const key = el.getAttribute("data-i18n-html");
      if (Object.prototype.hasOwnProperty.call(dict, key)) {
        el.innerHTML = dict[key];
      }
    });

    document.querySelectorAll("[data-i18n-alt]").forEach((el) => {
      const key = el.getAttribute("data-i18n-alt");
      if (Object.prototype.hasOwnProperty.call(dict, key)) {
        el.setAttribute("alt", dict[key]);
      }
    });

    document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
      const key = el.getAttribute("data-i18n-aria");
      if (Object.prototype.hasOwnProperty.call(dict, key)) {
        el.setAttribute("aria-label", dict[key]);
      }
    });

    const langBtn = document.getElementById("ds-lang-toggle");
    if (langBtn) {
      langBtn.textContent = currentLang === "ar" ? "EN" : "عربي";
      langBtn.setAttribute(
        "aria-label",
        currentLang === "ar" ? "Switch language to English" : "التبديل إلى اللغة العربية"
      );
    }

    applyTheme(currentTheme, false);
    hydrateNavigation();

    window.requestAnimationFrame(() => {
      layoutSpiderGraph(false);
    });
  }

  function triggerLanguageWipe(triggerEl) {
    if (isWiping) return;
    const nextLang = currentLang === "ar" ? "en" : "ar";

    const curtain = document.getElementById("ds-curtain");
    const outer = document.getElementById("ds-curtain-outer");
    const inner = document.getElementById("ds-curtain-inner");
    const labelEl = document.getElementById("ds-curtain-label");
    const subEl = document.getElementById("ds-curtain-sub");

    if (REDUCED_MOTION || !curtain || !outer || !inner || typeof outer.animate !== "function") {
      applyLanguage(nextLang, true);
      return;
    }

    isWiping = true;

    const rect = (triggerEl || document.body).getBoundingClientRect();
    const startX = Math.round(((rect.left + rect.width / 2) / Math.max(window.innerWidth, 1)) * 100);
    const startY = Math.round(((rect.top + rect.height / 2) / Math.max(window.innerHeight, 1)) * 100);
    const endX = 100 - startX;
    const endY = 100;

    if (labelEl) labelEl.textContent = nextLang === "ar" ? "تحليل البيانات" : "DATA ANALYSIS";
    if (subEl) subEl.textContent = nextLang === "ar" ? "التحويل إلى العربية (RTL)" : "SWITCHING TO ENGLISH (LTR)";

    const dur = 420;
    const easing = "cubic-bezier(0.76, 0, 0.24, 1)";

    const expandOuter = outer.animate(
      [
        { clipPath: `circle(0% at ${startX}% ${startY}%)` },
        { clipPath: `circle(155% at ${startX}% ${startY}%)` }
      ],
      { duration: dur, easing, fill: "forwards" }
    );

    const expandInner = inner.animate(
      [
        { clipPath: `circle(0% at ${startX}% ${startY}%)` },
        { clipPath: `circle(155% at ${startX}% ${startY}%)` }
      ],
      { duration: dur, delay: 55, easing, fill: "forwards" }
    );

    expandInner.onfinish = () => {
      applyLanguage(nextLang, true);

      const collapseInner = inner.animate(
        [
          { clipPath: `circle(155% at ${endX}% ${endY}%)` },
          { clipPath: `circle(0% at ${endX}% ${endY}%)` }
        ],
        { duration: dur, delay: 60, easing, fill: "forwards" }
      );

      const collapseOuter = outer.animate(
        [
          { clipPath: `circle(155% at ${endX}% ${endY}%)` },
          { clipPath: `circle(0% at ${endX}% ${endY}%)` }
        ],
        { duration: dur, delay: 115, easing, fill: "forwards" }
      );

      collapseOuter.onfinish = () => {
        expandOuter.cancel();
        expandInner.cancel();
        collapseInner.cancel();
        collapseOuter.cancel();
        outer.style.clipPath = `circle(0% at ${startX}% ${startY}%)`;
        inner.style.clipPath = `circle(0% at ${startX}% ${startY}%)`;
        isWiping = false;
      };
    };
  }

  /* --------------------------------------------------------------------------
     5. RADIAL SPIDER GRAPH (SVG RINGS + CONNECTORS + PORTS + RTL MIRRORING)
     -------------------------------------------------------------------------- */
  function ensureSpiderPort(svg, edgeIdx, role) {
    let port = svg.querySelector(`.ds-spider-port[data-edge="${edgeIdx}"][data-port-role="${role}"]`);
    if (!port) {
      port = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      port.setAttribute("class", "ds-spider-port");
      port.setAttribute("data-edge", edgeIdx);
      port.setAttribute("data-port-role", role);
      port.setAttribute("r", "5");
      svg.appendChild(port);
    }
    return port;
  }

  function layoutSpiderGraph(animateConnect) {
    const canvas = document.getElementById("ds-spider-canvas");
    const svg = document.getElementById("ds-spider-svg");
    const centerNode = document.getElementById("ds-spider-center");
    if (!canvas || !svg || !centerNode) return;

    const branches = Array.from(canvas.querySelectorAll(".ds-spider-node[data-branch]"));
    if (branches.length === 0) return;

    const cRect = canvas.getBoundingClientRect();
    if (cRect.width < 10 || cRect.height < 10) return;

    svg.setAttribute("viewBox", `0 0 ${Math.round(cRect.width)} ${Math.round(cRect.height)}`);

    const centerRect = centerNode.getBoundingClientRect();
    const cx = centerRect.left - cRect.left + centerRect.width / 2;
    const cy = centerRect.top - cRect.top + centerRect.height / 2;

    const rings = svg.querySelectorAll(".ds-spider-ring");
    const maxR = Math.max(cRect.width, cRect.height) * 0.46;
    rings.forEach((ring, idx) => {
      ring.setAttribute("cx", cx.toFixed(1));
      ring.setAttribute("cy", cy.toFixed(1));
      ring.setAttribute("r", Math.round(maxR * ((idx + 1) / rings.length)));
    });

    branches.forEach((branchEl) => {
      const idx = branchEl.getAttribute("data-branch");
      const basePath = svg.querySelector(`.ds-spider-edge-base[data-edge="${idx}"]`);
      const fillPath = svg.querySelector(`.ds-spider-edge-fill[data-edge="${idx}"]`);
      if (!basePath || !fillPath) return;

      const bRect = branchEl.getBoundingClientRect();
      const bx = bRect.left - cRect.left + bRect.width / 2;
      const by = bRect.top - cRect.top + bRect.height / 2;

      let startX = cx;
      let startY = cy;
      let endX = bx;
      let endY = by;
      let d = "";

      const dx = bx - cx;
      const dy = by - cy;

      if (Math.abs(dx) > Math.abs(dy)) {
        const dirSign = dx > 0 ? 1 : -1;
        startX = cx + dirSign * (centerRect.width / 2);
        startY = cy;
        endX = bx - dirSign * (bRect.width / 2);
        endY = by;
        const midX = (startX + endX) / 2;
        d = `M ${startX.toFixed(1)} ${startY.toFixed(1)} C ${midX.toFixed(1)} ${startY.toFixed(1)}, ${midX.toFixed(1)} ${endY.toFixed(1)}, ${endX.toFixed(1)} ${endY.toFixed(1)}`;
      } else {
        startX = cx;
        startY = cy + centerRect.height / 2;
        endX = bx;
        endY = by - bRect.height / 2;
        const midY = (startY + endY) / 2;
        d = `M ${startX.toFixed(1)} ${startY.toFixed(1)} C ${startX.toFixed(1)} ${midY.toFixed(1)}, ${endX.toFixed(1)} ${midY.toFixed(1)}, ${endX.toFixed(1)} ${endY.toFixed(1)}`;
      }

      basePath.setAttribute("d", d);
      fillPath.setAttribute("d", d);

      const startPort = ensureSpiderPort(svg, idx, "start");
      const endPort = ensureSpiderPort(svg, idx, "end");
      startPort.setAttribute("cx", startX.toFixed(1));
      startPort.setAttribute("cy", startY.toFixed(1));
      endPort.setAttribute("cx", endX.toFixed(1));
      endPort.setAttribute("cy", endY.toFixed(1));

      const len = Math.ceil(fillPath.getTotalLength() || 320);
      fillPath.style.setProperty("--edge-len", String(len));

      if (!animateConnect) {
        fillPath.style.setProperty("--edge-progress", "1");
      }
    });
  }

  function setupSpiderInteractions() {
    const canvas = document.getElementById("ds-spider-canvas");
    const svg = document.getElementById("ds-spider-svg");
    if (!canvas || !svg) return;

    const branches = Array.from(canvas.querySelectorAll(".ds-spider-node[data-branch]"));

    branches.forEach((branchEl) => {
      const idx = branchEl.getAttribute("data-branch");
      const fillPath = svg.querySelector(`.ds-spider-edge-fill[data-edge="${idx}"]`);
      if (!fillPath) return;

      const activate = () => {
        fillPath.classList.add("is-active");
        svg.querySelectorAll(`.ds-spider-port[data-edge="${idx}"]`).forEach((p) => p.classList.add("is-active"));
      };
      const deactivate = () => {
        fillPath.classList.remove("is-active");
        svg.querySelectorAll(`.ds-spider-port[data-edge="${idx}"]`).forEach((p) => p.classList.remove("is-active"));
      };

      branchEl.addEventListener("mouseenter", activate);
      branchEl.addEventListener("mouseleave", deactivate);
      branchEl.addEventListener("focus", activate);
      branchEl.addEventListener("blur", deactivate);
    });

    let alreadyPlayed = false;
    try {
      alreadyPlayed = sessionStorage.getItem(SESSION_INTRO_KEY) === "1";
    } catch (_) {}

    const edges = Array.from(svg.querySelectorAll(".ds-spider-edge-fill"));

    function finishIntroImmediately() {
      spiderIntroSkipped = true;
      edges.forEach((edge) => {
        edge.style.setProperty("--edge-progress", "1");
      });
      try {
        sessionStorage.setItem(SESSION_INTRO_KEY, "1");
      } catch (_) {}
    }

    if (REDUCED_MOTION || alreadyPlayed || window.innerWidth < 900) {
      layoutSpiderGraph(false);
      finishIntroImmediately();
    } else {
      edges.forEach((edge) => edge.style.setProperty("--edge-progress", "0"));
      layoutSpiderGraph(true);

      const skipEvents = ["pointerdown", "keydown", "wheel", "touchstart"];
      const onSkip = () => {
        skipEvents.forEach((evt) => window.removeEventListener(evt, onSkip));
        finishIntroImmediately();
      };
      skipEvents.forEach((evt) => window.addEventListener(evt, onSkip, { passive: true, once: true }));

      edges.forEach((edge, i) => {
        window.setTimeout(() => {
          if (spiderIntroSkipped) return;
          edge.style.setProperty("--edge-progress", "1");
        }, 120 + i * 180);
      });

      window.setTimeout(() => {
        skipEvents.forEach((evt) => window.removeEventListener(evt, onSkip));
        finishIntroImmediately();
      }, 1250);
    }

    if (typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver(() => layoutSpiderGraph(false));
      ro.observe(canvas);
    } else {
      window.addEventListener("resize", () => layoutSpiderGraph(false), { passive: true });
    }
  }

  /* --------------------------------------------------------------------------
     6. SCROLL PROGRESS, PROJECT RAIL & STEP-TO-STEP PIPELINE CONNECTORS
     -------------------------------------------------------------------------- */
  function setupScrollTracking() {
    const railNodes = Array.from(document.querySelectorAll(".ds-rail-node[data-target]"));
    const railSections = railNodes
      .map((node) => document.getElementById(node.getAttribute("data-target")))
      .filter(Boolean);

    const scrollConnectors = Array.from(document.querySelectorAll(".ds-connector[data-scroll-fill]"));
    scrollConnectors.forEach((svgEl) => {
      const path = svgEl.querySelector(".ds-connector-fill");
      if (path && typeof path.getTotalLength === "function") {
        const len = Math.ceil(path.getTotalLength() || 100);
        path.style.setProperty("--path-len", String(len));
      }
    });

    let ticking = false;

    function updateOnScroll() {
      ticking = false;
      const docEl = document.documentElement;
      const scrollTop = window.scrollY || docEl.scrollTop || 0;
      const maxScroll = Math.max(docEl.scrollHeight - window.innerHeight, 1);
      const progress = Math.min(Math.max(scrollTop / maxScroll, 0), 1);

      docEl.style.setProperty("--scroll-progress", progress.toFixed(4));

      if (railSections.length > 0) {
        const triggerY = window.innerHeight * 0.36;
        let activeIdx = 0;

        railSections.forEach((sec, idx) => {
          const rect = sec.getBoundingClientRect();
          if (rect.top <= triggerY) {
            activeIdx = idx;
          }
        });

        railNodes.forEach((node, idx) => {
          node.classList.toggle("is-passed", idx < activeIdx);
          node.classList.toggle("is-active", idx === activeIdx);
        });
      }

      scrollConnectors.forEach((svgEl, idx) => {
        const path = svgEl.querySelector(".ds-connector-fill");
        if (!path) return;
        if (REDUCED_MOTION) {
          path.style.setProperty("--progress", "1");
          svgEl.classList.add("is-filled");
          return;
        }
        const rect = svgEl.getBoundingClientRect();
        const seqIndex = Number(svgEl.getAttribute("data-connector-index") || idx);
        const startTrigger = window.innerHeight * 0.90 - seqIndex * 32;
        const fillSpan = Math.max(window.innerHeight * 0.28, 140);
        const rawProgress = (startTrigger - rect.top) / fillSpan;
        const clamped = Math.min(Math.max(rawProgress, 0), 1);
        path.style.setProperty("--progress", clamped.toFixed(3));
        svgEl.classList.toggle("is-filled", clamped >= 0.95);
      });
    }

    function requestTick() {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(updateOnScroll);
      }
    }

    window.addEventListener("scroll", requestTick, { passive: true });
    window.addEventListener("resize", requestTick, { passive: true });
    updateOnScroll();
  }

  /* --------------------------------------------------------------------------
     7. HORIZONTAL BAR CHARTS (ZERO-BASELINE FILL ON VIEWPORT ENTRY)
     -------------------------------------------------------------------------- */
  function setupBarCharts() {
    const charts = Array.from(document.querySelectorAll(".ds-bar-chart"));
    if (charts.length === 0) return;

    if (REDUCED_MOTION || typeof IntersectionObserver === "undefined") {
      charts.forEach((c) => c.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    charts.forEach((chart) => observer.observe(chart));
  }

  /* --------------------------------------------------------------------------
     8. ACCESSIBLE IMAGE LIGHTBOX, ACCORDION INDICATORS & MISSING FALLBACK
     -------------------------------------------------------------------------- */
  function setupDetailsIndicators() {
    document.querySelectorAll(".ds-details").forEach((detailsEl) => {
      const indicator = detailsEl.querySelector(".ds-summary-indicator");
      if (!indicator) return;
      detailsEl.addEventListener("toggle", () => {
        indicator.textContent = detailsEl.open ? "−" : "+";
      });
    });
  }

  function setupLightboxAndImages() {
    document.querySelectorAll("img[data-asset-name]").forEach((img) => {
      function handleBrokenImage() {
        if (img.dataset.fallbackApplied === "1") return;
        img.dataset.fallbackApplied = "1";
        const fileName = img.getAttribute("data-asset-name") || "image.webp";
        const box = document.createElement("div");
        box.className = "ds-img-missing";
        box.setAttribute("role", "img");
        box.setAttribute("aria-label", fileName);
        box.innerHTML = `
          <span>[IMAGE ASSET]</span>
          <code>${escapeHtml(fileName)}</code>
        `;
        img.replaceWith(box);
      }

      if (img.complete && img.naturalWidth === 0) {
        handleBrokenImage();
      } else {
        img.addEventListener("error", handleBrokenImage, { once: true });
      }
    });

    const lightbox = document.getElementById("ds-lightbox");
    const lbImg = document.getElementById("ds-lightbox-img");
    const lbTitle = document.getElementById("ds-lightbox-title");
    const lbClose = document.getElementById("ds-lightbox-close");
    if (!lightbox || !lbImg || !lbClose) return;

    let lastFocusedTrigger = null;

    function openLightbox(triggerBtn) {
      const img = triggerBtn.querySelector("img");
      if (!img) return;
      lastFocusedTrigger = triggerBtn;

      const src = img.currentSrc || img.getAttribute("src");
      const alt = img.getAttribute("alt") || "";
      lbImg.setAttribute("src", src);
      lbImg.setAttribute("alt", alt);
      if (lbTitle) lbTitle.textContent = alt;

      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      lbClose.focus();
    }

    function closeLightbox() {
      lightbox.classList.remove("is-open");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      lbImg.removeAttribute("src");
      if (lastFocusedTrigger && typeof lastFocusedTrigger.focus === "function") {
        lastFocusedTrigger.focus();
      }
    }

    document.querySelectorAll(".ds-dash-trigger").forEach((btn) => {
      btn.addEventListener("click", () => openLightbox(btn));
    });

    lbClose.addEventListener("click", closeLightbox);

    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (!lightbox.classList.contains("is-open")) return;
      if (e.key === "Escape") {
        e.preventDefault();
        closeLightbox();
      } else if (e.key === "Tab") {
        e.preventDefault();
        lbClose.focus();
      }
    });
  }

  /* --------------------------------------------------------------------------
     9. HTML ESCAPE HELPERS & BOOTSTRAP
     -------------------------------------------------------------------------- */
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function escapeAttr(str) {
    return escapeHtml(str);
  }

  function init() {
    initTheme();
    initLanguage();
    setupMobileNavDropdown();
    setupSpiderInteractions();
    setupScrollTracking();
    setupBarCharts();
    setupDetailsIndicators();
    setupLightboxAndImages();

    const themeBtn = document.getElementById("ds-theme-toggle");
    if (themeBtn) {
      themeBtn.addEventListener("click", toggleTheme);
    }

    const langBtn = document.getElementById("ds-lang-toggle");
    if (langBtn) {
      langBtn.addEventListener("click", () => triggerLanguageWipe(langBtn));
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
