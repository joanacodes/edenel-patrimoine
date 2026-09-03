/* Edenel Patrimoine & Gestion — scripts */
(function () {
  "use strict";

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Séquence d'entrée ---------- */
  const preloader = $(".preloader");
  const start = performance.now();
  // Pages sans préchargeur : on affiche dès que le HTML est prêt (sans attendre les images)
  if (!preloader) {
    const show = () => requestAnimationFrame(() => document.documentElement.classList.add("is-loaded"));
    document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", show) : show();
  }
  window.addEventListener("load", () => {
    // Laisse le temps de lire « Edenel Patrimoine & Gestion » (min. 1,6 s) avant le rideau
    const wait = preloader && !reduceMotion ? Math.max(0, 1600 - (performance.now() - start)) : 0;
    setTimeout(() => requestAnimationFrame(() => document.documentElement.classList.add("is-loaded")), wait);
  });
  // Sécurité : jamais plus de 4 s d'attente, même si une ressource bloque
  setTimeout(() => document.documentElement.classList.add("is-loaded"), 4000);

  /* ---------- Header ---------- */
  const header = $(".header");
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle("header--solid", window.scrollY > 40);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Menu mobile ---------- */
  const burger = $(".burger");
  const mobileNav = $(".mobile-nav");
  if (burger && mobileNav) {
    burger.addEventListener("click", () => {
      const open = burger.getAttribute("aria-expanded") === "true";
      burger.setAttribute("aria-expanded", String(!open));
      mobileNav.classList.toggle("is-open", !open);
      document.body.classList.toggle("nav-open", !open);
    });
    $$("a", mobileNav).forEach((a) =>
      a.addEventListener("click", () => {
        burger.setAttribute("aria-expanded", "false");
        mobileNav.classList.remove("is-open");
        document.body.classList.remove("nav-open");
      })
    );
  }

  /* ---------- Lien actif ---------- */
  const here = location.pathname.split("/").pop() || "index.html";
  $$(".nav a, .mobile-nav a").forEach((a) => {
    const target = a.getAttribute("href").split("?")[0];
    if (target === here || (here === "bien.html" && target === "biens.html")) a.setAttribute("aria-current", "page");
  });

  /* ---------- Images manquantes → placeholder ---------- */
  const guardImages = (root = document) => {
    $$("img", root).forEach((img) => {
      if (img.complete && img.naturalWidth === 0) img.classList.add("is-missing");
      img.addEventListener("error", () => img.classList.add("is-missing"), { once: true });
    });
  };
  guardImages();

  /* ---------- Révélations au défilement ---------- */
  const observe = (root = document) => {
    const els = $$(".reveal, .reveal-img", root);
    if (reduceMotion || !("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("in"));
      return;
    }
    // Un élément masqué par clip-path a une intersection nulle dans Chrome :
    // on observe donc un proxy (le parent) pour les .reveal-img.
    const map = new Map();
    els.forEach((el) => {
      const proxy = el.classList.contains("reveal-img") && el.parentElement ? el.parentElement : el;
      if (!map.has(proxy)) map.set(proxy, []);
      map.get(proxy).push(el);
    });
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (!e.isIntersecting) return;
        (map.get(e.target) || []).forEach((el, i) => setTimeout(() => el.classList.add("in"), i * 120));
        io.unobserve(e.target);
      }),
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    map.forEach((_, proxy) => io.observe(proxy));
  };
  observe();

  /* ---------- Parallaxe douce du hero ---------- */
  const heroImg = $(".hero__media img");
  if (heroImg && !reduceMotion) {
    let ticking = false;
    window.addEventListener("scroll", () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = Math.min(window.scrollY, window.innerHeight);
        heroImg.style.translate = `0 ${y * 0.18}px`;
        ticking = false;
      });
    }, { passive: true });
  }

  /* ---------- Compteurs ---------- */
  const counters = $$("[data-count]");
  if (counters.length) {
    const run = (el) => {
      const end = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || "";
      const dur = 1600;
      const start = performance.now();
      const step = (t) => {
        const p = Math.min((t - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = (p < 1 ? Math.round(end * eased) : end).toLocaleString("fr-FR") + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      if (reduceMotion) { el.textContent = end.toLocaleString("fr-FR") + suffix; return; }
      requestAnimationFrame(step);
    };
    const io = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (e.isIntersecting) { run(e.target); io.unobserve(e.target); }
    }), { threshold: 0.5 });
    counters.forEach((c) => io.observe(c));
  }

  /* ---------- Biens : utilitaires ---------- */
  const biens = window.EDENEL_BIENS || [];
  const euro = (n) => n.toLocaleString("fr-FR") + " €";
  const prix = (b) => (b.statut === "location" ? euro(b.prix) + " / mois" : euro(b.prix));

  const cardHTML = (b) => `
    <a class="card" href="bien.html?id=${b.id}">
      <div class="card__media ph" data-label="${b.type} — ${b.ville.split(" — ")[0]}">
        <img src="${b.images[0]}" alt="${b.titre}, ${b.ville}" loading="lazy">
        <span class="card__tag ${b.statut === "location" ? "card__tag--loc" : ""}">${b.statut === "location" ? "À louer" : "À vendre"}</span>
      </div>
      <div class="card__body">
        <div class="card__title">${b.titre}</div>
        <div class="card__loc">${b.ville}</div>
        <div class="card__meta">
          <span class="card__price">${prix(b)}</span>
          <span class="card__specs">${b.surface} m² · ${b.pieces} p.</span>
        </div>
      </div>
    </a>`;

  /* ---------- Accueil : sélection ---------- */
  const strip = $("[data-strip]");
  if (strip) {
    const selection = biens.filter((b) => b.coupDeCoeur).concat(biens.filter((b) => !b.coupDeCoeur)).slice(0, 6);
    strip.innerHTML = selection.map(cardHTML).join("");
    guardImages(strip);
    const scrollBy = (dir) => strip.scrollBy({ left: dir * (strip.firstElementChild.offsetWidth + 24), behavior: "smooth" });
    const prev = $("[data-strip-prev]"), next = $("[data-strip-next]");
    if (prev) prev.addEventListener("click", () => scrollBy(-1));
    if (next) next.addEventListener("click", () => scrollBy(1));
  }

  /* ---------- Page biens : liste + filtres ---------- */
  const grid = $("[data-grid]");
  if (grid) {
    const state = { statut: "tous", type: "tous", dept: "tous", tri: "recent" };
    const params = new URLSearchParams(location.search);
    if (params.get("statut")) state.statut = params.get("statut");

    const chips = $$("[data-filter-statut]");
    const typeSel = $("[data-filter-type]");
    const deptSel = $("[data-filter-dept]");
    const triSel = $("[data-sort]");
    const count = $("[data-count-results]");

    const render = () => {
      let list = biens.filter((b) =>
        (state.statut === "tous" || b.statut === state.statut) &&
        (state.type === "tous" || b.type === state.type) &&
        (state.dept === "tous" || b.dept === state.dept)
      );
      if (state.tri === "prix-asc") list.sort((a, b) => a.prix - b.prix);
      if (state.tri === "prix-desc") list.sort((a, b) => b.prix - a.prix);
      if (state.tri === "surface") list.sort((a, b) => b.surface - a.surface);

      grid.innerHTML = list.length
        ? list.map((b, i) => cardHTML(b).replace('class="card"', `class="card" style="animation-delay:${i * 60}ms"`)).join("")
        : `<div class="empty" style="grid-column:1/-1"><p>Aucun bien ne correspond à ces critères pour le moment.<br>Élargissez la recherche ou <a class="link" href="contact.html">confiez-nous votre projet</a> : nous vous préviendrons en priorité.</p></div>`;
      guardImages(grid);
      if (count) count.textContent = list.length + (list.length > 1 ? " biens" : " bien");
      chips.forEach((c) => c.classList.toggle("is-active", c.dataset.filterStatut === state.statut));
    };

    chips.forEach((c) => c.addEventListener("click", () => { state.statut = c.dataset.filterStatut; render(); }));
    if (typeSel) typeSel.addEventListener("change", () => { state.type = typeSel.value; render(); });
    if (deptSel) deptSel.addEventListener("change", () => { state.dept = deptSel.value; render(); });
    if (triSel) triSel.addEventListener("change", () => { state.tri = triSel.value; render(); });
    render();
  }

  /* ---------- Fiche bien ---------- */
  const detail = $("[data-bien]");
  if (detail) {
    const id = new URLSearchParams(location.search).get("id");
    const b = biens.find((x) => x.id === id) || biens[0];
    document.title = `${b.titre} — ${b.ville} | Edenel Patrimoine & Gestion`;
    const label = b.type + " — " + b.ville.split(" — ")[0];
    detail.innerHTML = `
      <div class="gallery">
        ${b.images.slice(0, 3).map((src, i) => `<div class="ph reveal-img" data-label="${label} · photo ${i + 1}"><img src="${src}" alt="${b.titre}, vue ${i + 1}" ${i ? 'loading="lazy"' : ""}></div>`).join("")}
      </div>
      ${b.images.length > 3 ? `
      <div class="gallery-more">
        <div class="gallery-strip" data-gallery-strip aria-label="Autres photos du bien">
          ${b.images.slice(3).map((src, i) => `<button type="button" class="ph" data-label="${label} · photo ${i + 4}" data-src="${src}" aria-label="Afficher la photo ${i + 4} en grand"><img src="${src}" alt="${b.titre}, vue ${i + 4}" loading="lazy"></button>`).join("")}
        </div>
        <div class="strip-nav gallery-strip__nav">
          <button type="button" data-gallery-prev aria-label="Photos précédentes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M15 6l-6 6 6 6"/></svg></button>
          <button type="button" data-gallery-next aria-label="Photos suivantes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M9 6l6 6-6 6"/></svg></button>
        </div>
      </div>` : ""}
      <div class="bien-head">
        <div>
          <span class="kicker">${b.statut === "location" ? "À louer" : "À vendre"} · ${b.ville}</span>
          <h1 style="font-size:clamp(2rem,4vw,3.2rem)">${b.titre}</h1>
          <div class="specs">
            <div><span>Surface</span><strong>${b.surface} m²</strong></div>
            <div><span>Pièces</span><strong>${b.pieces}</strong></div>
            <div><span>Chambres</span><strong>${b.chambres}</strong></div>
            <div><span>Niveau</span><strong style="font-size:1rem">${b.etage}</strong></div>
            <div><span>DPE</span><strong><span class="dpe dpe-${b.dpe}"><b>${b.dpe}</b></span></strong></div>
          </div>
          <p class="lead">${b.description}</p>
          <h3 style="margin-top:2rem">Ce que nous avons aimé</h3>
          <ul class="atouts">${b.atouts.map((a) => `<li>${a}</li>`).join("")}</ul>
          <p class="small muted" style="margin-top:2rem">Référence ${b.id.toUpperCase()}. ${b.statut === "location" ? "Loyer mensuel hors charges. Honoraires locataire selon barème en vigueur." : "Honoraires à la charge du vendeur. Bien soumis au statut de la copropriété le cas échéant."} Informations non contractuelles.</p>
        </div>
        <aside class="aside-card">
          <div class="bien-price">${prix(b)}</div>
          <p class="muted small">${b.statut === "location" ? "Hors charges" : "Honoraires inclus, charge vendeur"}</p>
          <a class="btn btn--solid" href="contact.html?bien=${b.id}">Demander une visite <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
          <a class="btn" href="tel:+33100000000">Appeler l'agence</a>
          <p class="small muted" style="margin:1.25rem 0 0">Votre conseiller vous rappelle sous 24 h ouvrées.</p>
        </aside>
      </div>
      <section class="section-head" style="margin-top:5rem"><h2 class="reveal">Biens similaires</h2></section>
      <div class="grid-biens">${biens.filter((x) => x.id !== b.id && x.statut === b.statut).slice(0, 3).map(cardHTML).join("")}</div>`;
    guardImages(detail);
    observe(detail);

    // Slider des photos supplémentaires : flèches + clic pour afficher en grand
    const gstrip = $("[data-gallery-strip]", detail);
    if (gstrip) {
      const step = () => gstrip.firstElementChild.offsetWidth + 12;
      $("[data-gallery-prev]", detail).addEventListener("click", () => gstrip.scrollBy({ left: -step(), behavior: "smooth" }));
      $("[data-gallery-next]", detail).addEventListener("click", () => gstrip.scrollBy({ left: step(), behavior: "smooth" }));
      const main = $(".gallery img", detail);
      gstrip.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-src]");
        if (!btn || !main) return;
        const thumb = $("img", btn);
        const prevSrc = main.src, prevAlt = main.alt;
        main.src = thumb.src; main.alt = thumb.alt;
        thumb.src = prevSrc; thumb.alt = prevAlt; btn.dataset.src = prevSrc;
        main.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "nearest" });
      });
    }
  }

  /* ---------- Formulaires (démo : pas de backend sur GitHub Pages) ---------- */
  $$("form[data-demo-form]").forEach((form) => {
    const bien = new URLSearchParams(location.search).get("bien");
    const msg = $("textarea", form);
    if (bien && msg && !msg.value) {
      const b = biens.find((x) => x.id === bien);
      if (b) msg.value = `Bonjour, je souhaite visiter le bien « ${b.titre} » (${b.ville}). Voici mes disponibilités : `;
    }
    form.addEventListener("submit", (e) => {
      if (form.getAttribute("action")) return; // un service externe (Formspree, etc.) est branché
      e.preventDefault();
      const ok = form.nextElementSibling;
      form.style.display = "none";
      if (ok) ok.classList.add("is-visible");
      window.scrollTo({ top: form.getBoundingClientRect().top + window.scrollY - 140, behavior: "smooth" });
    });
  });

  /* ---------- Diaporama du bandeau (page Nos biens) ---------- */
  const slidesBox = $("[data-hero-slides]");
  if (slidesBox && window.EDENEL_BIENS) {
    const covers = window.EDENEL_BIENS.map((b) => b.images && b.images[0]).filter(Boolean);
    covers.forEach((src, i) => {
      const img = document.createElement("img");
      img.src = src; img.alt = ""; img.decoding = "async";
      if (i > 0) img.loading = "lazy";
      slidesBox.appendChild(img);
    });
    const imgs = $$("img", slidesBox);
    let cur = 0;
    if (imgs.length) imgs[0].classList.add("is-active");
    if (imgs.length > 1 && !reduceMotion) {
      setInterval(() => {
        imgs[cur].classList.remove("is-active");
        cur = (cur + 1) % imgs.length;
        imgs[cur].classList.add("is-active");
      }, 5000);
    }
  }

  /* ---------- Estimation : résultat indicatif ---------- */
  const estim = $("[data-estimation]");
  if (estim) {
    estim.addEventListener("submit", (e) => {
      e.preventDefault();
      const f = new FormData(estim);
      const surface = parseFloat(f.get("surface")) || 0;
      const dept = f.get("dept");
      const type = f.get("type");
      const etat = f.get("etat");
      // Fourchettes indicatives €/m² (à ajuster avec vos données de marché)
      const base = { "75": 10200, "92": 7300, "78": 5200, "94": 5900, "93": 4600, "95": 3900, "91": 3600, "77": 3300 }[dept] || 5000;
      let coef = type === "Maison" ? 0.95 : 1;
      coef *= { neuf: 1.12, bon: 1, travaux: 0.86 }[etat] || 1;
      const mid = surface * base * coef;
      const out = $("[data-estimation-result]");
      const fmt = (n) => Math.round(n / 5000) * 5000;
      out.innerHTML = `
        <span class="kicker">Estimation indicative</span>
        <div class="bien-price">${euro(fmt(mid * 0.94))} – ${euro(fmt(mid * 1.06))}</div>
        <p class="muted">Cette fourchette est calculée à partir de moyennes départementales et ne remplace pas une visite. Un conseiller Edenel vous contacte sous 24 h pour affiner cette valeur et vous remettre un avis de valeur écrit, sans engagement.</p>
        <button class="btn" type="button" data-estimation-reset>Créer une nouvelle estimation</button>`;
      out.classList.add("is-visible");
      estim.style.display = "none";
      $("[data-estimation-reset]", out).addEventListener("click", () => {
        estim.reset();
        out.classList.remove("is-visible");
        out.innerHTML = "";
        estim.style.display = "";
        estim.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
        const first = $("input, select", estim);
        if (first) first.focus({ preventScroll: true });
      });
    });
  }

  /* ---------- Frise chronologique : ligne qui suit le défilement ---------- */
  const timeline = $(".timeline");
  if (timeline) {
    const bar = document.createElement("span");
    bar.className = "timeline__progress"; bar.setAttribute("aria-hidden", "true");
    timeline.prepend(bar);
    const items = $$("li", timeline);
    const update = () => {
      const r = timeline.getBoundingClientRect();
      // La ligne suit le défilement : elle atteint le bas de la frise quand celle-ci
      // arrive au milieu de l'écran, et redescend/remonte avec le visiteur.
      const anchor = window.innerHeight * 0.6;
      const p = Math.min(1, Math.max(0, (anchor - r.top) / r.height));
      bar.style.transform = `scaleY(${p})`;
      const lineY = r.top + p * r.height;
      items.forEach((li) => li.classList.toggle("is-reached", li.getBoundingClientRect().top + 8 <= lineY));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
  }

  /* ---------- Transitions entre pages ---------- */
  const root = document.documentElement;
  {
    document.addEventListener("click", (e) => {
      const a = e.target.closest("a[href]");
      if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname && url.search === location.search) return; // ancre sur la même page
      if (!/\.html$|\/$/.test(url.pathname)) return;
      e.preventDefault();
      root.classList.add("is-leaving");
      setTimeout(() => { location.href = url.href; }, 200);
    });
    // Retour arrière (bfcache) : réaffiche la page
    window.addEventListener("pageshow", (e) => { if (e.persisted) root.classList.remove("is-leaving"); });
  }

  /* ---------- Année du footer ---------- */
  $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
})();
