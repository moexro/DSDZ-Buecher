"use strict";

(() => {
  const SPEICHER_SCHLUESSEL = "dsdz-klasse";
  const KLASSEN = Object.keys(BUECHER).map(Number).sort((a, b) => a - b);

  const ICONS = {
    Naturwissenschaften:
      '<path d="M10 2v7.5a2 2 0 0 1-.2.9L4.7 20.6a1 1 0 0 0 .9 1.4h12.8a1 1 0 0 0 .9-1.4l-5.1-10.2a2 2 0 0 1-.2-.9V2" /><path d="M8.5 2h7" /><path d="M7 16h10" />',
    Sprachen:
      '<path d="m5 8 6 6" /><path d="m4 14 6-6 2-3" /><path d="M2 5h12" /><path d="M7 2h1" /><path d="m22 22-5-10-5 10" /><path d="M14 18h6" />',
    Gesellschaftswissenschaften:
      '<circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" />',
    Religionen:
      '<path d="M12 2v6" /><path d="M9 5h6" /><path d="M6 22V12l6-4 6 4v10" /><path d="M10 22v-4a2 2 0 0 1 4 0v4" /><path d="M2 22h20" />',
    pfeil: '<path d="M7 7h10v10" /><path d="M7 17 17 7" />',
    uhr: '<circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />',
  };

  // Farbe und Kurzname je Fachbereich
  const FACHBEREICHE = {
    Naturwissenschaften: { farbe: "nat", kurz: "Naturwiss." },
    Sprachen: { farbe: "spr", kurz: "Sprachen" },
    Gesellschaftswissenschaften: { farbe: "ges", kurz: "Gesellschaft" },
    Religionen: { farbe: "rel", kurz: "Religion" },
  };

  // Fächerkürzel wie im Stundenplan (Fachname beginnt mit …)
  const KUERZEL = [
    ["Biophysik", "BPh"],
    ["Biologie", "Bio"],
    ["Chemie", "Ch"],
    ["Physik", "Ph"],
    ["Informatik", "Inf"],
    ["Mathe", "M"],
    ["Latein", "L"],
    ["Englisch", "E"],
    ["Deutsch", "D"],
    ["Französisch", "F"],
    ["Spanisch", "Sp"],
    ["Geschichte", "G"],
    ["Politik", "PuG"],
    ["Wirtschaft", "WR"],
    ["Geographie", "Geo"],
    ["Musik", "Mu"],
    ["Katholisch", "K"],
    ["Evangelisch", "Ev"],
    ["Ethik", "Eth"],
  ];

  const VERLAGE = [
    ["ccbuchner.de", "C.C.Buchner"],
    ["westermann.de", "Westermann"],
    ["cornelsen.de", "Cornelsen"],
    ["klett", "Klett"],
    ["helbling", "Helbling"],
    ["sharepoint.com", "SharePoint"],
  ];

  const $ = (id) => document.getElementById(id);
  const schalter = $("klassen-schalter");
  const uebersicht = $("uebersicht");
  const inhalt = $("inhalt");
  const sucheBox = $("suche-box");
  const suche = $("suche");
  const keineTreffer = $("keine-treffer");

  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

  const normalisieren = (s) =>
    s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

  const icon = (name, klasse = "") =>
    `<svg class="${klasse}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name]}</svg>`;

  function kuerzel(fach) {
    const treffer = KUERZEL.find(([anfang]) => fach.startsWith(anfang));
    return treffer ? treffer[1] : fach.slice(0, 2);
  }

  function verlag(url) {
    if (!url) return "";
    let host = "";
    try {
      host = new URL(url).hostname;
    } catch {
      return "";
    }
    const treffer = VERLAGE.find(([teil]) => host.includes(teil));
    const name = treffer ? treffer[1] : host.replace(/^www\./, "");
    return /\.pdf($|\?)/i.test(url) ? `${name} · PDF` : name;
  }

  // "Latein (Lesebuch)" → ["Latein", "Lesebuch"]
  function fachUndZusatz(fach) {
    const m = fach.match(/^(.*?)\s*\((.+)\)$/);
    return m ? [m[1], m[2]] : [fach, ""];
  }

  function buecherVon(klasse) {
    return Object.entries(BUECHER[klasse]).flatMap(([bereich, faecher]) =>
      Object.entries(faecher).map(([fach, url]) => ({ bereich, fach, url })),
    );
  }

  function zaehle(klasse) {
    const alle = buecherVon(klasse);
    return {
      verfuegbar: alle.filter((b) => b.url).length,
      fehlend: alle.filter((b) => !b.url).length,
      bereiche: Object.keys(BUECHER[klasse]).length,
    };
  }

  // Weiches Trennzeichen, damit lange Namen auf schmalen Handys umbrechen
  const trennbar = (s) => s.replace(/(.)wissenschaften/, "$1\u00ADwissenschaften");

  const mehrzahl = (n, eins, viele) => `${n} ${n === 1 ? eins : viele}`;

  /* ---------- Speicher (kann im privaten Modus fehlen) ---------- */

  function gespeicherteKlasse() {
    try {
      const k = Number(localStorage.getItem(SPEICHER_SCHLUESSEL));
      return KLASSEN.includes(k) ? k : null;
    } catch {
      return null;
    }
  }

  function klasseSpeichern(klasse) {
    try {
      if (klasse) localStorage.setItem(SPEICHER_SCHLUESSEL, klasse);
      else localStorage.removeItem(SPEICHER_SCHLUESSEL);
    } catch {
      /* egal */
    }
  }

  function klasseAusHash() {
    const m = location.hash.match(/^#klasse-(\d+)$/);
    const k = m ? Number(m[1]) : null;
    return KLASSEN.includes(k) ? k : null;
  }

  /* ---------- Darstellung ---------- */

  function schalterBauen() {
    schalter.innerHTML = KLASSEN.map(
      (k) => `<button type="button" class="grade-btn" data-klasse="${k}" aria-pressed="false">${k}</button>`,
    ).join("");
    schalter.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-klasse]");
      if (!btn) return;
      waehleKlasse(Number(btn.dataset.klasse));
      window.scrollTo(0, 0);
    });
  }

  function uebersichtBauen() {
    uebersicht.innerHTML = KLASSEN.map((k) => {
      const { verfuegbar } = zaehle(k);
      const anteile = Object.entries(BUECHER[k])
        .map(([bereich, faecher]) => {
          const n = Object.keys(faecher).length;
          const farbe = FACHBEREICHE[bereich]?.farbe ?? "nat";
          return `<span class="mix-seg fb-${farbe}" style="flex:${n}" title="${esc(bereich)}: ${n}"></span>`;
        })
        .join("");
      return `
        <button type="button" class="grade-card" data-klasse="${k}">
          <span class="grade-card-num">${k}<span>.</span></span>
          <span class="grade-card-label">Klasse</span>
          <span class="grade-card-count">${mehrzahl(verfuegbar, "Buch", "Bücher")}</span>
          <span class="mix" aria-hidden="true">${anteile}</span>
        </button>`;
    }).join("");

    uebersicht.insertAdjacentHTML(
      "beforeend",
      `<div class="legend" aria-hidden="true">${Object.entries(FACHBEREICHE)
        .map(([, { farbe, kurz }]) => `<span class="legend-item fb-${farbe}"><i></i>${kurz}</span>`)
        .join("")}</div>`,
    );

    uebersicht.addEventListener("click", (e) => {
      const karte = e.target.closest("[data-klasse]");
      if (!karte) return;
      waehleKlasse(Number(karte.dataset.klasse));
      schalter.querySelector(`[data-klasse="${karte.dataset.klasse}"]`).focus();
    });
  }

  function kachel(bereich, fach, url, i) {
    const [name, zusatz] = fachUndZusatz(fach);
    const v = verlag(url);
    const suchtext = normalisieren(`${name} ${zusatz} ${kuerzel(fach)} ${v} ${bereich}`);
    const zusatzHtml = zusatz ? ` <span class="tag">${esc(zusatz)}</span>` : "";
    const kopf = `
      <span class="tile-badge">${esc(kuerzel(fach))}</span>
      <span class="tile-text">
        <span class="tile-name">${esc(name)}${zusatzHtml}</span>`;

    if (!url) {
      return `
        <div class="tile is-missing" data-suche="${esc(suchtext)}" style="--i:${i}">
          ${kopf}
          <span class="tile-meta">${icon("uhr", "meta-icon")}Link folgt</span>
          </span>
        </div>`;
    }

    return `
      <a class="tile" href="${esc(url)}" target="_blank" rel="noopener" data-suche="${esc(suchtext)}" style="--i:${i}">
        ${kopf}
          <span class="tile-meta">${esc(v)}</span>
        </span>
        ${icon("pfeil", "tile-arrow")}
      </a>`;
  }

  function inhaltBauen(klasse) {
    let i = 0;
    inhalt.innerHTML = Object.entries(BUECHER[klasse])
      .map(([bereich, faecher]) => {
        const farbe = FACHBEREICHE[bereich]?.farbe ?? "nat";
        const eintraege = Object.entries(faecher);
        const kacheln = eintraege.map(([fach, url]) => kachel(bereich, fach, url, i++)).join("");
        return `
          <section class="fachbereich fb-${farbe}">
            <header class="fb-head">
              <span class="fb-icon">${icon(ICONS[bereich] ? bereich : "Naturwissenschaften")}</span>
              <h2 class="fb-title">${esc(trennbar(bereich))}</h2>
              <span class="fb-count">${eintraege.length}</span>
            </header>
            <div class="tiles">${kacheln}</div>
          </section>`;
      })
      .join("");
  }

  function heroSetzen(eyebrow, titel, text) {
    $("hero-eyebrow").textContent = eyebrow;
    $("hero-titel").textContent = titel;
    $("hero-text").textContent = text;
  }

  function waehleKlasse(klasse) {
    klasseSpeichern(klasse);

    for (const btn of schalter.querySelectorAll(".grade-btn")) {
      btn.setAttribute("aria-pressed", String(Number(btn.dataset.klasse) === klasse));
    }

    // #klasse-12 wirkt nur beim Öffnen. Bleibt er in der Adresse, öffnen Lesezeichen und
    // Home-Bildschirm-Icons für immer diese Klasse, auch nach dem Wechsel ins neue Schuljahr.
    if (location.hash) history.replaceState(null, "", location.pathname + location.search);

    suche.value = "";
    keineTreffer.hidden = true;

    if (!klasse) {
      heroSetzen("Digitale Schulbücher", "Alle Bücher. Ein Klick.", "Wähle deine Klasse und öffne dein Buch direkt beim Verlag.");
      document.title = "DSDZ-Bücher";
      sucheBox.hidden = true;
      inhalt.innerHTML = "";
      uebersicht.hidden = false;
      return;
    }

    const { verfuegbar, fehlend, bereiche } = zaehle(klasse);
    let text = `${mehrzahl(verfuegbar, "Buch", "Bücher")} in ${mehrzahl(bereiche, "Fachbereich", "Fachbereichen")}`;
    if (fehlend) text += ` · ${mehrzahl(fehlend, "folgt", "folgen")}`;
    heroSetzen("Deine Bücher", `${klasse}. Klasse`, text);
    document.title = `${klasse}. Klasse · DSDZ-Bücher`;

    uebersicht.hidden = true;
    sucheBox.hidden = false;
    inhaltBauen(klasse);
  }

  /* ---------- Suche ---------- */

  function filtern() {
    const woerter = normalisieren(suche.value.trim()).split(/\s+/).filter(Boolean);
    let treffer = 0;
    for (const bereich of inhalt.querySelectorAll(".fachbereich")) {
      let sichtbar = 0;
      for (const k of bereich.querySelectorAll(".tile")) {
        const passt = woerter.every((w) => k.dataset.suche.includes(w));
        k.hidden = !passt;
        if (passt) sichtbar++;
      }
      bereich.hidden = sichtbar === 0;
      bereich.querySelector(".fb-count").textContent = sichtbar;
      treffer += sichtbar;
    }
    $("suchbegriff").textContent = suche.value.trim();
    keineTreffer.hidden = treffer > 0;
  }

  suche.addEventListener("input", filtern);
  suche.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      suche.value = "";
      filtern();
      suche.blur();
    } else if (e.key === "Enter") {
      suche.blur();
    }
  });

  document.addEventListener("keydown", (e) => {
    const tippt = e.target.closest?.("input, textarea, [contenteditable]");
    if (e.key === "/" && !tippt && !sucheBox.hidden) {
      e.preventDefault();
      suche.focus();
    }
  });

  $("brand").addEventListener("click", () => waehleKlasse(null));

  window.addEventListener("hashchange", () => {
    const k = klasseAusHash();
    if (k) waehleKlasse(k);
  });

  /* ---------- Start ---------- */

  schalterBauen();
  uebersichtBauen();
  waehleKlasse(klasseAusHash() ?? gespeicherteKlasse());
})();
