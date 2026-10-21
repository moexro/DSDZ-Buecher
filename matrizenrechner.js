"use strict";

// Matrizenrechner: rechnet exakt mit Brüchen (BigInt), Eingabe als 3, -1,5 oder 2/3.
window.Matrizenrechner = (() => {
  const MAX = 6;

  /* ---------- Brüche ---------- */

  const betrag = (a) => (a < 0n ? -a : a);
  const ggt = (a, b) => {
    a = betrag(a);
    b = betrag(b);
    while (b) [a, b] = [b, a % b];
    return a;
  };
  const bruch = (n, d = 1n) => {
    if (d < 0n) [n, d] = [-n, -d];
    const g = ggt(n, d) || 1n;
    return { n: n / g, d: d / g };
  };
  const NULL = bruch(0n);
  const EINS = bruch(1n);
  const plus = (a, b) => bruch(a.n * b.d + b.n * a.d, a.d * b.d);
  const minus = (a, b) => bruch(a.n * b.d - b.n * a.d, a.d * b.d);
  const mal = (a, b) => bruch(a.n * b.n, a.d * b.d);
  const durch = (a, b) => bruch(a.n * b.d, a.d * b.n);
  const istNull = (a) => a.n === 0n;
  const istEins = (a) => a.n === 1n && a.d === 1n;

  function dezimal(s) {
    const m = s.match(/^([+-]?)(\d*)(?:\.(\d*))?$/);
    if (!m || (m[2] === "" && !m[3])) return null;
    const nachkomma = m[3] || "";
    let n = BigInt((m[2] || "0") + nachkomma);
    if (m[1] === "-") n = -n;
    return bruch(n, 10n ** BigInt(nachkomma.length));
  }

  // Leeres Feld zählt als 0, ungültige Eingabe gibt null zurück
  function lies(text) {
    const t = text.replace(/\s+/g, "").replace(/,/g, ".").replace(/[−–]/g, "-");
    if (t === "") return NULL;
    const teile = t.split("/");
    if (teile.length > 2) return null;
    const zaehler = dezimal(teile[0]);
    const nenner = teile.length === 2 ? dezimal(teile[1]) : EINS;
    if (!zaehler || !nenner || istNull(nenner)) return null;
    return durch(zaehler, nenner);
  }

  const zahlFormat = new Intl.NumberFormat("de-DE", { maximumFractionDigits: 4 });

  function alsZahl(f) {
    const x = Number(f.n) / Number(f.d);
    return Object.is(x, -0) ? 0 : x;
  }

  function anzeige(f, dez) {
    if (dez) return `<span class="mx-zahl">${zahlFormat.format(alsZahl(f))}</span>`;
    if (f.d === 1n) return `<span class="mx-zahl">${f.n}</span>`;
    const vz = f.n < 0n ? "−" : "";
    return `<span class="mx-zahl">${vz}<span class="bruch"><span>${betrag(f.n)}</span><span>${f.d}</span></span></span>`;
  }

  /* ---------- Matrizen ---------- */

  const kopie = (M) => M.map((z) => z.slice());
  const einheit = (n) => Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? EINS : NULL)));
  const zeilen = (M) => M.length;
  const spalten = (M) => M[0].length;

  function gauss(M, voll) {
    const a = kopie(M);
    const R = zeilen(a);
    const C = spalten(a);
    let rang = 0;
    let vz = 1;
    for (let c = 0; c < C && rang < R; c++) {
      let p = rang;
      while (p < R && istNull(a[p][c])) p++;
      if (p === R) continue;
      if (p !== rang) {
        [a[p], a[rang]] = [a[rang], a[p]];
        vz = -vz;
      }
      const pivot = a[rang][c];
      for (let r = voll ? 0 : rang + 1; r < R; r++) {
        if (r === rang || istNull(a[r][c])) continue;
        const f = durch(a[r][c], pivot);
        for (let j = c; j < C; j++) a[r][j] = minus(a[r][j], mal(f, a[rang][j]));
      }
      rang++;
    }
    if (voll) {
      for (let r = 0; r < rang; r++) {
        const p = a[r].find((x) => !istNull(x));
        a[r] = a[r].map((x) => durch(x, p));
      }
    }
    return { a, rang, vz };
  }

  const summe = (A, B, vz) => A.map((z, i) => z.map((x, j) => (vz > 0 ? plus(x, B[i][j]) : minus(x, B[i][j]))));
  const transponiert = (M) => M[0].map((_, j) => M.map((z) => z[j]));

  function produkt(A, B) {
    return A.map((z) => B[0].map((_, j) => z.reduce((s, x, k) => plus(s, mal(x, B[k][j])), NULL)));
  }

  function determinante(M) {
    const { a, rang, vz } = gauss(M, false);
    if (rang < zeilen(M)) return NULL;
    return a.reduce((p, z, i) => mal(p, z[i]), vz > 0 ? EINS : bruch(-1n));
  }

  function inverse(M) {
    const n = zeilen(M);
    const E = einheit(n);
    const erweitert = M.map((z, i) => z.concat(E[i]));
    const { a } = gauss(erweitert, true);
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (!(i === j ? istEins(a[i][j]) : istNull(a[i][j]))) return null;
      }
    }
    return a.map((z) => z.slice(n));
  }

  /* ---------- Rechenoperationen ---------- */

  const gleichGross = (A, B) => zeilen(A) === zeilen(B) && spalten(A) === spalten(B);
  const quadratisch = (M) => zeilen(M) === spalten(M);

  const fehler = (text) => ({ fehler: text });
  const nurQuadratisch = (name) => `${name} muss quadratisch sein (gleich viele Zeilen und Spalten).`;

  const OPERATIONEN = [
    {
      gruppe: "Mit A und B",
      eintraege: [
        {
          label: "A + B",
          rechne: ({ A, B }) => (gleichGross(A, B) ? { matrix: summe(A, B, 1) } : fehler("Für A + B müssen beide Matrizen gleich groß sein.")),
        },
        {
          label: "A − B",
          rechne: ({ A, B }) => (gleichGross(A, B) ? { matrix: summe(A, B, -1) } : fehler("Für A − B müssen beide Matrizen gleich groß sein.")),
        },
        {
          label: "A · B",
          rechne: ({ A, B }) =>
            spalten(A) === zeilen(B)
              ? { matrix: produkt(A, B) }
              : fehler(`Für A · B muss A so viele Spalten (${spalten(A)}) wie B Zeilen (${zeilen(B)}) haben.`),
        },
        {
          label: "B · A",
          rechne: ({ A, B }) =>
            spalten(B) === zeilen(A)
              ? { matrix: produkt(B, A) }
              : fehler(`Für B · A muss B so viele Spalten (${spalten(B)}) wie A Zeilen (${zeilen(A)}) haben.`),
        },
      ],
    },
    {
      gruppe: "Mit A",
      eintraege: [
        { label: "k · A", rechne: ({ A, k }) => ({ matrix: A.map((z) => z.map((x) => mal(x, k))) }) },
        {
          label: "Aⁿ",
          rechne: ({ A, k }) => {
            if (!quadratisch(A)) return fehler(nurQuadratisch("A"));
            if (k.d !== 1n || betrag(k.n) > 20n) return fehler("Der Exponent n muss eine ganze Zahl zwischen −20 und 20 sein.");
            let basis = A;
            if (k.n < 0n) {
              basis = inverse(A);
              if (!basis) return fehler("A ist nicht invertierbar, deshalb gibt es kein A mit negativem Exponenten.");
            }
            let ergebnis = einheit(zeilen(A));
            for (let i = 0n; i < betrag(k.n); i++) ergebnis = produkt(ergebnis, basis);
            return { matrix: ergebnis };
          },
        },
        { label: "Aᵀ", rechne: ({ A }) => ({ matrix: transponiert(A) }) },
        {
          label: "A⁻¹",
          rechne: ({ A }) => {
            if (!quadratisch(A)) return fehler(nurQuadratisch("A"));
            const inv = inverse(A);
            return inv ? { matrix: inv } : fehler("A ist nicht invertierbar (det A = 0).");
          },
        },
        {
          label: "det A",
          rechne: ({ A }) => (quadratisch(A) ? { wert: determinante(A), name: "det A" } : fehler(nurQuadratisch("A"))),
        },
        { label: "Rang A", rechne: ({ A }) => ({ wert: bruch(BigInt(gauss(A, false).rang)), name: "Rang A" }) },
        { label: "Stufenform", rechne: ({ A }) => ({ matrix: gauss(A, false).a }) },
        { label: "Gauß-Jordan", rechne: ({ A }) => ({ matrix: gauss(A, true).a }) },
      ],
    },
  ];

  /* ---------- Oberfläche ---------- */

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

  function groesse(werte, zeilenZahl, spaltenZahl) {
    return Array.from({ length: zeilenZahl }, (_, i) => Array.from({ length: spaltenZahl }, (_, j) => werte[i]?.[j] ?? ""));
  }

  function mount(wurzel) {
    const zustand = {
      A: [
        ["1", "2"],
        ["3", "4"],
      ],
      B: [
        ["0", "1"],
        ["1", "0"],
      ],
      k: "2",
      dez: false,
      ergebnis: null,
    };

    const zahlOptionen = (n) =>
      Array.from({ length: MAX }, (_, i) => `<option value="${i + 1}"${i + 1 === n ? " selected" : ""}>${i + 1}</option>`).join("");

    function matrixFeld(name) {
      const M = zustand[name];
      const z = M.length;
      const s = M[0].length;
      const zellen = M.map(
        (zeile, i) =>
          zeile
            .map(
              (wert, j) =>
                `<input class="mx-zelle" type="text" inputmode="text" autocomplete="off" autocapitalize="off" spellcheck="false"
                  value="${esc(wert)}" data-m="${name}" data-i="${i}" data-j="${j}" aria-label="${name}, Zeile ${i + 1}, Spalte ${j + 1}" />`,
            )
            .join(""),
      ).join("");
      return `
        <div class="mx-feld" data-matrix="${name}">
          <div class="mx-kopf">
            <strong class="mx-name">${name}</strong>
            <label class="mx-dim">
              <select data-dim="${name}-z" aria-label="Zeilen von ${name}">${zahlOptionen(z)}</select>
              <span aria-hidden="true">×</span>
              <select data-dim="${name}-s" aria-label="Spalten von ${name}">${zahlOptionen(s)}</select>
            </label>
            <button type="button" class="mx-mini" data-aktion="einheit-${name}" title="Einheitsmatrix">E</button>
            <button type="button" class="mx-mini" data-aktion="leeren-${name}" title="Alles auf 0 setzen">0</button>
          </div>
          <div class="mx-gitter" style="--s:${s}">${zellen}</div>
        </div>`;
    }

    function aufbauen() {
      const knoepfe = OPERATIONEN.map(
        (g) => `
          <div class="mx-gruppe">
            <span class="mx-gruppe-name">${g.gruppe}</span>
            <div class="mx-knoepfe">
              ${g.eintraege.map((o) => `<button type="button" class="mx-op" data-op="${esc(o.label)}">${esc(o.label)}</button>`).join("")}
            </div>
          </div>`,
      ).join("");

      wurzel.innerHTML = `
        <div class="mx-felder">${matrixFeld("A")}${matrixFeld("B")}</div>
        <div class="mx-leiste">
          <label class="mx-k">
            <span>k bzw. n</span>
            <input class="mx-zelle" type="text" inputmode="text" autocomplete="off" spellcheck="false" id="mx-k" value="${esc(zustand.k)}" aria-label="Zahl k beziehungsweise Exponent n" />
          </label>
          <div class="mx-schalter" role="group" aria-label="Darstellung des Ergebnisses">
            <button type="button" data-darstellung="bruch" aria-pressed="${!zustand.dez}">Bruch</button>
            <button type="button" data-darstellung="dezimal" aria-pressed="${zustand.dez}">Dezimal</button>
          </div>
        </div>
        ${knoepfe}
        <div class="mx-ergebnis" id="mx-ergebnis" role="status" aria-live="polite" hidden></div>`;
    }

    function matrixLesen(name) {
      const M = zustand[name].map((zeile, i) =>
        zeile.map((text, j) => {
          const f = lies(text);
          const feld = wurzel.querySelector(`[data-m="${name}"][data-i="${i}"][data-j="${j}"]`);
          feld?.toggleAttribute("aria-invalid", f === null);
          return f;
        }),
      );
      return M.some((z) => z.includes(null)) ? null : M;
    }

    function ergebnisZeigen() {
      const box = wurzel.querySelector("#mx-ergebnis");
      const e = zustand.ergebnis;
      if (!e) {
        box.hidden = true;
        return;
      }
      box.hidden = false;
      box.classList.toggle("ist-fehler", Boolean(e.fehler));
      if (e.fehler) {
        box.innerHTML = `<p class="mx-fehler">${esc(e.fehler)}</p>`;
        return;
      }
      const titel = `<div class="mx-titel">${esc(e.titel)} =</div>`;
      if (e.wert) {
        box.innerHTML = `${titel}<div class="mx-wert">${anzeige(e.wert, zustand.dez)}</div>`;
        return;
      }
      const zeilenHtml = e.matrix
        .map((z) => `<tr>${z.map((x) => `<td>${anzeige(x, zustand.dez)}</td>`).join("")}</tr>`)
        .join("");
      box.innerHTML = `
        ${titel}
        <table class="mx-tabelle"><tbody>${zeilenHtml}</tbody></table>
        <div class="mx-uebernehmen">
          <button type="button" class="mx-mini breit" data-aktion="nach-A">→ in A übernehmen</button>
          <button type="button" class="mx-mini breit" data-aktion="nach-B">→ in B übernehmen</button>
        </div>`;
    }

    function rechnen(label) {
      const A = matrixLesen("A");
      const B = matrixLesen("B");
      const k = lies(zustand.k);
      wurzel.querySelector("#mx-k").toggleAttribute("aria-invalid", k === null);
      if (!A || !B || !k) {
        zustand.ergebnis = { fehler: "Bitte nur Zahlen eingeben, zum Beispiel 3, −1,5 oder 2/3." };
      } else {
        const op = OPERATIONEN.flatMap((g) => g.eintraege).find((o) => o.label === label);
        const r = op.rechne({ A, B, k });
        zustand.ergebnis = { ...r, titel: r.name ?? label };
      }
      zustand.letzte = label;
      ergebnisZeigen();
    }

    function uebernehmen(ziel) {
      const e = zustand.ergebnis;
      if (!e?.matrix) return;
      zustand[ziel] = e.matrix.map((z) => z.map((x) => (x.d === 1n ? String(x.n) : `${x.n}/${x.d}`)));
      aufbauen();
      zustand.ergebnis = null;
    }

    function groesseAendern(name, zeilenZahl, spaltenZahl) {
      zustand[name] = groesse(zustand[name], zeilenZahl, spaltenZahl);
      const feld = wurzel.querySelector(`[data-matrix="${name}"]`);
      feld.outerHTML = matrixFeld(name);
    }

    wurzel.addEventListener("input", (e) => {
      const t = e.target;
      if (t.id === "mx-k") zustand.k = t.value;
      else if (t.dataset.m) zustand[t.dataset.m][t.dataset.i][t.dataset.j] = t.value;
      t.removeAttribute("aria-invalid");
    });

    wurzel.addEventListener("change", (e) => {
      const dim = e.target.dataset.dim;
      if (!dim) return;
      const [name] = dim.split("-");
      const feld = wurzel.querySelector(`[data-matrix="${name}"]`);
      const z = Number(feld.querySelector(`[data-dim="${name}-z"]`).value);
      const s = Number(feld.querySelector(`[data-dim="${name}-s"]`).value);
      groesseAendern(name, z, s);
    });

    wurzel.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;
      if (btn.dataset.op) return rechnen(btn.dataset.op);

      if (btn.dataset.darstellung) {
        zustand.dez = btn.dataset.darstellung === "dezimal";
        for (const b of wurzel.querySelectorAll("[data-darstellung]")) {
          b.setAttribute("aria-pressed", String(b === btn));
        }
        return ergebnisZeigen();
      }

      const aktion = btn.dataset.aktion;
      if (!aktion) return;
      const [was, name] = aktion.split("-");
      if (was === "nach") return uebernehmen(name);
      const M = zustand[name];
      const n = Math.min(M.length, M[0].length);
      zustand[name] = M.map((z, i) => z.map((_, j) => (was === "einheit" ? (i === j && i < n ? "1" : "0") : "0")));
      wurzel.querySelector(`[data-matrix="${name}"]`).outerHTML = matrixFeld(name);
    });

    // Enter springt zur nächsten Zelle, Pfeil hoch/runter zur Zelle darüber/darunter
    wurzel.addEventListener("keydown", (e) => {
      const t = e.target;
      if (!t.dataset?.m) return;
      const { m, i, j } = t.dataset;
      const rechts = e.key === "Enter";
      const ziel = rechts
        ? [Number(i), Number(j) + 1]
        : e.key === "ArrowDown"
          ? [Number(i) + 1, Number(j)]
          : e.key === "ArrowUp"
            ? [Number(i) - 1, Number(j)]
            : null;
      if (!ziel) return;
      let feld = wurzel.querySelector(`[data-m="${m}"][data-i="${ziel[0]}"][data-j="${ziel[1]}"]`);
      if (!feld && rechts) feld = wurzel.querySelector(`[data-m="${m}"][data-i="${ziel[0] + 1}"][data-j="0"]`);
      if (!feld) return;
      e.preventDefault();
      feld.focus();
      feld.select();
    });

    aufbauen();
  }

  return { mount };
})();
