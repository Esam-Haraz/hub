/* ============================================================================
   SERVICES HUB — HERO INTERACTIVE 2D PIPELINE-BAR CANVAS BACKDROP
   Author: Esam Haraz
   Path: hub/assets/hub-bg.js
   ============================================================================ */

(function () {
  "use strict";

  const canvas = document.getElementById("hub-hero-canvas");
  const hero = document.getElementById("hub-hero");
  if (!canvas || !hero) return;

  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) return;

  /* --------------------------------------------------------------------------
     1. ENVIRONMENT & PERFORMANCE CAPABILITY CHECKS
     -------------------------------------------------------------------------- */
  const REDUCED_MOTION =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const IS_TOUCH =
    window.matchMedia && window.matchMedia("(pointer: coarse)").matches;

  const LOW_MEMORY =
    typeof navigator.deviceMemory === "number" && navigator.deviceMemory <= 4;
  const LOW_CORES =
    typeof navigator.hardwareConcurrency === "number" && navigator.hardwareConcurrency <= 4;

  const STATIC_ONLY = REDUCED_MOTION || LOW_MEMORY || LOW_CORES;

  const TARGET_FPS = 30;
  const FRAME_INTERVAL = 1000 / TARGET_FPS;
  const MAX_DPR = 1.5;
  const POINTER_RADIUS = 180;
  const IDLE_THRESHOLD_MS = 1500;

  let width = 0;
  let height = 0;
  let dpr = 1;
  let bars = [];

  let rafId = null;
  let lastFrameTime = 0;
  let isHeroInView = true;
  let isTabVisible = !document.hidden;
  let isHeaderScrolled = (window.scrollY || 0) > 24;

  const pointer = {
    x: -9999,
    y: -9999,
    active: false,
    lastMoveAt: 0
  };

  /* --------------------------------------------------------------------------
     2. DETERMINISTIC GRID OF ROUNDED HORIZONTAL PIPELINE BARS
     -------------------------------------------------------------------------- */
  function buildBars() {
    bars = [];
    const rowGap = width < 640 ? 34 : 38;
    const colGap = width < 640 ? 115 : 145;
    const rows = Math.ceil(height / rowGap) + 1;
    const cols = Math.ceil(width / colGap) + 1;

    for (let r = 0; r < rows; r++) {
      const y = r * rowGap + 18;
      const rowOffset = (r % 2) * (colGap * 0.45);

      for (let c = 0; c < cols; c++) {
        const seed = (r * 37 + c * 17) % 100;
        const baseX = c * colGap + rowOffset - 20;
        const baseLen = 28 + (seed % 58); // 28px to 85px rounded bars
        const baseAlpha = 0.06 + (seed % 9) * 0.008; // 0.06 to 0.124

        bars.push({
          bx: baseX,
          by: y,
          x: baseX,
          vx: 0,
          len: baseLen,
          alpha: baseAlpha,
          baseAlpha: baseAlpha,
          phase: (r * 0.55) + (c * 0.85)
        });
      }
    }
  }

  function resize() {
    const rect = hero.getBoundingClientRect();
    width = Math.max(Math.round(rect.width), 1);
    height = Math.max(Math.round(rect.height), 1);
    dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    buildBars();
    drawFrame(performance.now(), true);
  }

  /* --------------------------------------------------------------------------
     3. DRAWING & SPRING / SINE MOTION STEP
     -------------------------------------------------------------------------- */
  function getBarColorRGB() {
    const isLight = document.documentElement.getAttribute("data-theme") === "light";
    return isLight ? "13, 118, 131" : "98, 200, 211";
  }

  function drawRoundedBar(x, y, w, h, r) {
    const radius = Math.min(r, h / 2, w / 2);
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + w - radius, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
    ctx.lineTo(x + w, y + h - radius);
    ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
    ctx.lineTo(x + radius, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();
  }

  function drawFrame(now, freezeMotion) {
    ctx.clearRect(0, 0, width, height);

    const rgb = getBarColorRGB();
    const barH = 4;
    const isIdle =
      IS_TOUCH ||
      !pointer.active ||
      now - pointer.lastMoveAt > IDLE_THRESHOLD_MS;

    const timeSec = now * 0.001;

    for (let i = 0; i < bars.length; i++) {
      const b = bars[i];
      let targetX = b.bx;
      let targetAlpha = b.baseAlpha;

      if (!freezeMotion) {
        if (!isIdle && !IS_TOUCH) {
          const cx = b.x + b.len * 0.5;
          const dx = cx - pointer.x;
          const dy = b.by - pointer.y;
          const dist = Math.hypot(dx, dy);

          if (dist < POINTER_RADIUS) {
            const influence = 1 - dist / POINTER_RADIUS;
            const eased = influence * influence;
            const pushDir = dx >= 0 ? 1 : -1;
            targetX = b.bx + pushDir * eased * 18;
            targetAlpha = Math.min(0.14, b.baseAlpha + eased * 0.075);
          }
        } else {
          // Gentle autonomous sine wave when pointer is idle or on touch devices
          targetX = b.bx + Math.sin(timeSec * 0.85 + b.phase) * 7;
          targetAlpha = b.baseAlpha + (Math.sin(timeSec * 0.9 + b.phase) + 1) * 0.012;
        }

        // Critically damped spring step
        const force = (targetX - b.x) * 0.14;
        b.vx = (b.vx + force) * 0.72;
        b.x += b.vx;
        b.alpha += (targetAlpha - b.alpha) * 0.14;
      } else {
        b.x = b.bx;
        b.vx = 0;
        b.alpha = b.baseAlpha;
      }

      ctx.fillStyle = `rgba(${rgb}, ${b.alpha.toFixed(3)})`;
      drawRoundedBar(b.x, b.by - barH / 2, b.len, barH, 2);
    }
  }

  /* --------------------------------------------------------------------------
     4. LOOP LIFECYCLE (30FPS CAP, PAUSES ON SCROLL > 24PX, HIDDEN TAB, OFF-SCREEN)
     -------------------------------------------------------------------------- */
  function shouldAnimate() {
    return !STATIC_ONLY && isHeroInView && isTabVisible && !isHeaderScrolled;
  }

  function loop(now) {
    if (!shouldAnimate()) {
      rafId = null;
      return;
    }
    rafId = window.requestAnimationFrame(loop);

    if (now - lastFrameTime < FRAME_INTERVAL) return;
    lastFrameTime = now;
    drawFrame(now, false);
  }

  function syncAnimationState() {
    isHeaderScrolled = (window.scrollY || 0) > 24;

    if (shouldAnimate()) {
      if (!rafId) {
        lastFrameTime = performance.now();
        rafId = window.requestAnimationFrame(loop);
      }
    } else {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
        rafId = null;
      }
      // Render clean static bars when scrolled under glass header or reduced motion
      drawFrame(performance.now(), true);
    }
  }

  /* --------------------------------------------------------------------------
     5. EVENT LISTENERS & OBSERVERS
     -------------------------------------------------------------------------- */
  if (!IS_TOUCH && !STATIC_ONLY) {
    window.addEventListener(
      "pointermove",
      (e) => {
        if (!shouldAnimate()) return;
        const rect = hero.getBoundingClientRect();
        pointer.x = e.clientX - rect.left;
        pointer.y = e.clientY - rect.top;
        pointer.active =
          pointer.y >= 0 &&
          pointer.y <= rect.height &&
          pointer.x >= 0 &&
          pointer.x <= rect.width;
        if (pointer.active) {
          pointer.lastMoveAt = performance.now();
        }
      },
      { passive: true }
    );

    window.addEventListener(
      "pointerleave",
      () => {
        pointer.active = false;
      },
      { passive: true }
    );
  }

  window.addEventListener("scroll", syncAnimationState, { passive: true });

  document.addEventListener("visibilitychange", () => {
    isTabVisible = !document.hidden;
    syncAnimationState();
  });

  if (typeof IntersectionObserver !== "undefined") {
    const heroObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isHeroInView = entry.isIntersecting;
          syncAnimationState();
        });
      },
      { threshold: 0.02 }
    );
    heroObserver.observe(hero);
  }

  const themeObserver = new MutationObserver(() => {
    drawFrame(performance.now(), !shouldAnimate());
  });
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"]
  });

  if (typeof ResizeObserver !== "undefined") {
    const resizeObserver = new ResizeObserver(() => resize());
    resizeObserver.observe(hero);
  } else {
    window.addEventListener("resize", resize, { passive: true });
  }

  resize();
  syncAnimationState();
})();
