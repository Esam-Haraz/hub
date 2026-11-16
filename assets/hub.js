/* ============================================================================
   SERVICES HUB — INTERACTIVE ENGINE (REVEAL, INDEX SCROLLSPY, HEADER & FORM)
   Author: Esam Haraz
   Path: hub/assets/hub.js
   ============================================================================ */

(function () {
  "use strict";

  const CFG = window.SITE_CONFIG || {};
  const REDUCED_MOTION =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* --------------------------------------------------------------------------
     1. READING-DIRECTION WIPE REVEAL FOR H1 & H2 (ONCE PER ELEMENT)
     -------------------------------------------------------------------------- */
  function setupHeadingReveal() {
    const headings = Array.from(document.querySelectorAll(".hub-reveal"));
    if (headings.length === 0) return;

    document.documentElement.classList.add("hub-reveal-ready");

    if (REDUCED_MOTION || typeof IntersectionObserver === "undefined") {
      headings.forEach((h) => h.classList.add("is-revealed"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -30px 0px" }
    );

    headings.forEach((h) => observer.observe(h));
  }

  /* --------------------------------------------------------------------------
     2. HEADER GLASS STATE (> 24PX) & MOBILE DRAWER (< 1100PX)
     -------------------------------------------------------------------------- */
  function setupHeaderAndDrawer() {
    const header = document.getElementById("hub-header");
    const menuBtn = document.getElementById("hub-mobile-menu-btn");
    const drawer = document.getElementById("hub-mobile-drawer");

    function updateHeaderScroll() {
      if (!header) return;
      const scrolled = (window.scrollY || document.documentElement.scrollTop || 0) > 24;
      header.classList.toggle("is-scrolled", scrolled);
    }

    window.addEventListener("scroll", updateHeaderScroll, { passive: true });
    updateHeaderScroll();

    if (!menuBtn || !drawer) return;

    function setDrawerOpen(open) {
      drawer.classList.toggle("is-open", open);
      menuBtn.setAttribute("aria-expanded", String(open));
      menuBtn.textContent = open ? "✕" : "☰";
    }

    menuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const willOpen = !drawer.classList.contains("is-open");
      setDrawerOpen(willOpen);
    });

    drawer.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setDrawerOpen(false));
    });

    document.addEventListener("click", (e) => {
      if (drawer.classList.contains("is-open") && !drawer.contains(e.target) && e.target !== menuBtn) {
        setDrawerOpen(false);
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && drawer.classList.contains("is-open")) {
        setDrawerOpen(false);
        menuBtn.focus();
      }
    });
  }

  /* --------------------------------------------------------------------------
     3. STICKY SIDEBAR INDEX (APPEARS AFTER HERO EXITS) & INTERSECTION SCROLLSPY
     -------------------------------------------------------------------------- */
  function setupIndexRailAndScrollspy() {
    const hero = document.getElementById("hub-hero");
    const indexRail = document.getElementById("hub-index-rail");
    const indexLinks = Array.from(document.querySelectorAll("[data-index-target]"));
    const sectionIds = ["work", "services", "about", "contact"];
    const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);

    if (hero && indexRail && typeof IntersectionObserver !== "undefined") {
      const heroObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            indexRail.classList.toggle("is-visible", !entry.isIntersecting);
          });
        },
        { threshold: 0.12 }
      );
      heroObserver.observe(hero);
    } else if (indexRail) {
      indexRail.classList.add("is-visible");
    }

    function setActiveSection(activeId) {
      indexLinks.forEach((link) => {
        const isCurrent = link.getAttribute("data-index-target") === activeId;
        if (isCurrent) {
          link.setAttribute("aria-current", "true");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    }

    if (sections.length > 0 && typeof IntersectionObserver !== "undefined") {
      const visibleMap = new Map();

      const spyObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            visibleMap.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
          });

          let bestId = null;
          let bestRatio = 0;
          sectionIds.forEach((id) => {
            const ratio = visibleMap.get(id) || 0;
            if (ratio > bestRatio) {
              bestRatio = ratio;
              bestId = id;
            }
          });

          if (bestId) {
            setActiveSection(bestId);
          }
        },
        {
          rootMargin: "-18% 0px -45% 0px",
          threshold: [0, 0.15, 0.35, 0.6]
        }
      );

      sections.forEach((sec) => spyObserver.observe(sec));
    }
  }

  /* --------------------------------------------------------------------------
     4. CONFIG HYDRATION (AVAILABLE PILL, OPTIONAL WHATSAPP & PORTRAIT FALLBACK)
     -------------------------------------------------------------------------- */
  function hydrateConfigFeatures() {
    const availPill = document.getElementById("hub-availability-pill");
    if (availPill) {
      availPill.hidden = CFG.AVAILABLE !== true;
    }

    const email = CFG.EMAIL || CFG.email || "esamv20@gmail.com";
    const linkedin = CFG.LINKEDIN || CFG.linkedinUrl || "https://www.linkedin.com/in/esam-haraz-459925402";
    const github = CFG.GITHUB || "https://github.com/Esam-Haraz";

    const emailLink = document.getElementById("hub-channel-email");
    if (emailLink) {
      emailLink.href = `mailto:${email}`;
      const txt = emailLink.querySelector("[data-channel-value]");
      if (txt) txt.textContent = email;
    }

    const liLink = document.getElementById("hub-channel-linkedin");
    if (liLink) liLink.href = linkedin;

    const ghLink = document.getElementById("hub-channel-github");
    if (ghLink) ghLink.href = github;

    // Render optional WhatsApp channel ONLY if CFG.WHATSAPP is non-empty
    const cleanWa = String(CFG.WHATSAPP || "").replace(/[^0-9]/g, "");
    const channelsList = document.getElementById("hub-channels-list");
    if (cleanWa.length >= 8 && channelsList && !document.getElementById("hub-channel-whatsapp")) {
      const waAnchor = document.createElement("a");
      waAnchor.id = "hub-channel-whatsapp";
      waAnchor.href = `https://wa.me/${cleanWa}`;
      waAnchor.target = "_blank";
      waAnchor.rel = "noopener noreferrer";
      waAnchor.className = "hub-channel-row";
      waAnchor.innerHTML = `
        <span class="hub-channel-left">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
          </svg>
          <span class="hub-channel-text" data-i18n="chWhatsapp">WhatsApp</span>
        </span>
        <span class="ds-mono" aria-hidden="true">↗</span>
      `;
      channelsList.appendChild(waAnchor);
    }

    // Portrait fallback to clean "EH" monogram card if assets/portrait.webp is missing
    const portraitImg = document.getElementById("hub-portrait-img");
    const portraitMedia = document.getElementById("hub-portrait-media");
    if (portraitImg && portraitMedia) {
      function showMonogram() {
        if (portraitMedia.dataset.fallbackApplied === "1") return;
        portraitMedia.dataset.fallbackApplied = "1";
        portraitMedia.innerHTML = `
          <div class="hub-portrait-monogram" role="img" aria-label="Esam Haraz (EH)">
            <span class="hub-portrait-initials">EH</span>
            <span class="ds-mono" style="font-size:0.75rem;color:var(--ink-muted);">portrait.webp</span>
          </div>
        `;
      }

      if (portraitImg.complete && portraitImg.naturalWidth === 0) {
        showMonogram();
      } else {
        portraitImg.addEventListener("error", showMonogram, { once: true });
      }
    }
  }

  /* --------------------------------------------------------------------------
     5. INTERACTIVE CONTACT FORM (CHIPS, SERVICE PRE-SELECT, MAILTO, COPY & POST)
     -------------------------------------------------------------------------- */
  function setupContactForm() {
    const form = document.getElementById("hub-contact-form");
    if (!form) return;

    const scopeChips = Array.from(form.querySelectorAll(".hub-scope-chip"));
    const copyBtn = document.getElementById("hub-copy-msg-btn");
    const statusBox = document.getElementById("hub-form-status");
    const statusText = document.getElementById("hub-form-status-text");

    function getLang() {
      return (document.documentElement.lang || "en").toLowerCase().startsWith("ar") ? "ar" : "en";
    }

    function toggleChip(chipBtn, forceState) {
      const current = chipBtn.getAttribute("aria-pressed") === "true";
      const next = typeof forceState === "boolean" ? forceState : !current;
      chipBtn.setAttribute("aria-pressed", String(next));
    }

    scopeChips.forEach((chip) => {
      chip.addEventListener("click", () => toggleChip(chip));
    });

    // Pre-select chip when clicking Service 03 ("Custom tools on request")
    document.querySelectorAll("[data-select-scope]").forEach((trigger) => {
      trigger.addEventListener("click", () => {
        const targetScope = trigger.getAttribute("data-select-scope");
        scopeChips.forEach((chip) => {
          const match = chip.getAttribute("data-scope") === targetScope;
          if (match) toggleChip(chip, true);
        });
      });
    });

    function buildFormattedMessage() {
      const isAr = getLang() === "ar";
      const nameVal = (document.getElementById("hub-field-name")?.value || "").trim();
      const emailVal = (document.getElementById("hub-field-email")?.value || "").trim();
      const descVal = (document.getElementById("hub-field-desc")?.value || "").trim();

      const selectedLabels = scopeChips
        .filter((c) => c.getAttribute("aria-pressed") === "true")
        .map((c) => (c.querySelector("[data-chip-label]")?.textContent || c.textContent).trim());

      const scopeSummary =
        selectedLabels.length > 0
          ? selectedLabels.join(" + ")
          : isAr
          ? "استفسار عام"
          : "General inquiry";

      const subject = isAr
        ? `طلب مشروع جديد (${scopeSummary}) — ${nameVal || "زائر"}`
        : `New Project Inquiry (${scopeSummary}) — ${nameVal || "Website Visitor"}`;

      const bodyLines = isAr
        ? [
            `الاسم: ${nameVal || "-"}`,
            `البريد الإلكتروني: ${emailVal || "-"}`,
            `نوع المشروع: ${scopeSummary}`,
            "",
            "تفاصيل المشروع:",
            descVal || "-"
          ]
        : [
            `Name: ${nameVal || "-"}`,
            `Email: ${emailVal || "-"}`,
            `Project Type: ${scopeSummary}`,
            "",
            "Project Description:",
            descVal || "-"
          ];

      return {
        subject,
        body: bodyLines.join("\n"),
        nameVal,
        emailVal,
        descVal,
        selectedLabels
      };
    }

    function showStatus(msg) {
      if (!statusBox || !statusText) return;
      statusText.textContent = msg;
      statusBox.classList.add("is-visible");
    }

    if (copyBtn) {
      copyBtn.addEventListener("click", async () => {
        const isAr = getLang() === "ar";
        const msg = buildFormattedMessage();
        const fullText = `${msg.subject}\n\n${msg.body}`;
        try {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(fullText);
          }
          showStatus(
            isAr
              ? "تم نسخ نص الرسالة إلى الحافظة بنجاح."
              : "Message text copied to clipboard."
          );
        } catch (_) {
          showStatus(
            isAr
              ? "تعذر النسخ التلقائي — يمكنك إرسال الرسالة مباشرة عبر البريد."
              : "Clipboard unavailable — you can open your email client directly."
          );
        }
      });
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const isAr = getLang() === "ar";

      // Spam check via hidden honeypot field
      const honeypot = form.querySelector('input[name="website_url"]');
      if (honeypot && honeypot.value.trim() !== "") {
        return;
      }

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const msg = buildFormattedMessage();
      const endpoint = (CFG.FORM_ENDPOINT || "").trim();

      if (endpoint) {
        try {
          const resp = await fetch(endpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json"
            },
            body: JSON.stringify({
              name: msg.nameVal,
              email: msg.emailVal,
              scopes: msg.selectedLabels,
              message: msg.descVal
            })
          });

          if (!resp.ok) throw new Error("Submit failed");
          form.reset();
          scopeChips.forEach((c) => toggleChip(c, false));
          showStatus(
            isAr
              ? "تم إرسال رسالتك بنجاح."
              : "Your message has been sent."
          );
          return;
        } catch (_) {
          // Fall through to mailto fallback if endpoint request fails
        }
      }

      const recipient = CFG.EMAIL || CFG.email || "esamv20@gmail.com";
      const mailtoUrl = `mailto:${encodeURIComponent(recipient)}?subject=${encodeURIComponent(
        msg.subject
      )}&body=${encodeURIComponent(msg.body)}`;

      showStatus(
        isAr
          ? "تم تجهيز الرسالة وفتح تطبيق البريد الإلكتروني."
          : "Message prepared and opening your email client."
      );
      window.location.href = mailtoUrl;
    });
  }

  /* --------------------------------------------------------------------------
     6. BOOTSTRAP
     -------------------------------------------------------------------------- */
  function initHub() {
    setupHeadingReveal();
    setupHeaderAndDrawer();
    setupIndexRailAndScrollspy();
    hydrateConfigFeatures();
    setupContactForm();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initHub);
  } else {
    initHub();
  }
})();
