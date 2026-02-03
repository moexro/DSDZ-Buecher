const buecherElfte = {
	Naturwissenschaften: {
		Chemie: "https://www.ccbuchner.de/produkt/chemie-11-ntg-7240/livebook/7240",
		Physik: "https://blickinsbuch.westermann.de/978-3-14-152400-0/",
		Mathe: "https://klettbib.livebook.de/978-3-12-735010-4/",
	},
	Sprachen: {
		Deutsch:
			"https://static.cornelsen.de/bgd/97/83/46/46/30/00/6/9783464630006_x1LIAB/index.html",
		Englisch: "https://blickinsbuch.westermann.de/978-3-425-73090-5/",
		Französisch: "https://klettbib.livebook.de/978-3-12-521061-5/",
		Latein:
			"https://www.ccbuchner.de/produkt/lesebuch-latein-oberstufe-1-neu-8748/livebook/8748",
		Spanisch:
			"https://static.cornelsen.de/bgd/97/83/06/02/24/50/0/9783060224500_x1LIAB/index.html",
	},
	Geisteswissenschaften: {
		Geschichte: "https://www.ccbuchner.de/produkt/band-11-8331/livebook/8331",
		Politik:
			"https://www.ccbuchner.de/produkt/politik-aktuell-11-7708/livebook/7708",
		Geographie: "https://blickinsbuch.westermann.de/978-3-14-115093-3/",
		Wirtschaft: "https://www.ccbuchner.de/produkt/band-11-7756/livebook/7756",
		Katholisch: "https://klettbib.livebook.de/978-3-12-007395-6/",
		Evangelisch:
			"https://www.ccbuchner.de/produkt/oberstufe-11-8325/livebook/8325",
		Ethik:
			"https://www.ccbuchner.de/produkt/ethik-in-der-oberstufe-11-8320/livebook/8320",
	},
};

const buecherZehnte = {
	Naturwissenschaften: {
		Chemie: "https://www.ccbuchner.de/produkt/chemie-10-ntg-5052/livebook/5052",
		Biologie: "https://www.ccbuchner.de/produkt/biologie-10-7236/livebook/7236",
		Physik: "https://blickinsbuch.westermann.de/978-3-507-11820-1/",
		Mathe: "https://klettbib.livebook.de/978-3-12-733001-4/",
		Informatik:
			"https://www.ccbuchner.de/produkt/informatik-10-ntg-7201/livebook/7201",
	},
	Sprachen: {
		Deutsch:
			"https://static.cornelsen.de/bgd/97/83/06/06/27/81/3/9783060627813_x1LIAB/index.html",
		Englisch:
			"https://static.cornelsen.de/bgd/97/83/06/03/34/94/0/9783060334940_x1LIAB/index.html",
		Französisch:
			"https://static.cornelsen.de/bgd/97/83/06/12/21/74/4/9783061221744_x1LIAB/index.html",
		Latein:
			"https://www.ccbuchner.de/produkt/lesebuch-latein-mittelstufe-2-5011/livebook/5011",
	},
	Geisteswissenschaften: {
		Geschichte:
			"https://www.ccbuchner.de/produkt/band-5-fuer-die-jahrgangsstufe-10-4148/livebook/4148",
		Politik:
			"https://www.ccbuchner.de/produkt/politik-aktuell-10-7707/livebook/7707",
		Geographie: "https://blickinsbuch.westermann.de/978-3-14-115087-2/",
		Wirtschaft: "https://www.ccbuchner.de/produkt/band-10-7755/livebook/7755",
		Katholisch: "https://klettbib.livebook.de/978-3-12-007386-4/",
		Evangelisch:
			"https://www.ccbuchner.de/produkt/theologisch-10-4988/livebook/4988",
		Ethik:
			"https://www.ccbuchner.de/produkt/abenteuer-ethik-10-7639/livebook/7639",
	},
};

const elfteKlasse = document.getElementById("eleven");
const zehnteKlasse = document.getElementById("ten");

const bookselector = document.getElementById("bookselekt");
const bookIframe = document.getElementById("bookframe");

let buecherTopf = null;

function clearBookSelector() {
	bookselector.classList.remove("open");
	dropopen.textContent = "Buchauswahl";
	bookselector.innerHTML = "";
}

elfteKlasse.addEventListener("click", () => {
	elfteKlasse.classList.add("active");
	zehnteKlasse.classList.remove("active");
	buecherTopf = buecherElfte;
	clearBookSelector();
});

zehnteKlasse.addEventListener("click", () => {
	zehnteKlasse.classList.add("active");
	elfteKlasse.classList.remove("active");
	buecherTopf = buecherZehnte;
	clearBookSelector();
});

const dropopen = document.getElementById("dropopen");

document.addEventListener("click", (e) => {
	if (
		!bookselector.contains(e.target) &&
		e.target !== dropopen &&
		bookselector.classList.contains("open")
	) {
		clearBookSelector();
	}
});

dropopen.addEventListener("click", () => {
	if (buecherTopf === null) {
		alert("Bitte wähle zuerst eine der Klassen aus! Dafür musst du auf den Namen deiner Klasse klicken.");
		return;
	}

	if (bookselector.classList.contains("open")) {
		bookselector.classList.remove("open");
		dropopen.textContent = "Buchauswahl";
		bookselector.innerHTML = "";
	} else {
		bookselector.classList.add("open");
		dropopen.textContent = "Schließen";

		Object.keys(buecherTopf).forEach((fachrichtung) => {
			const fachrichtungDiv = document.createElement("div");
			fachrichtungDiv.className = "fachrichtung";
			const fachrichtungTitel = document.createElement("h4");
			fachrichtungTitel.textContent = fachrichtung;
			fachrichtungDiv.appendChild(fachrichtungTitel);
			Object.keys(buecherTopf[fachrichtung]).forEach((buch) => {
				const buchLink = document.createElement("a");
				buchLink.href = "#";
				buchLink.textContent = buch;

				buchLink.addEventListener("click", () => {
					bookselector.classList.remove("open");
					dropopen.textContent = "Buchauswahl";
					bookselector.innerHTML = "";
					if (
						(buecherTopf === buecherElfte &&
							(buch === "Physik" ||
								buch === "Englisch" ||
								buch === "Geographie")) ||
						(buecherTopf === buecherZehnte &&
							(buch === "Physik" || buch === "Geographie"))
					) {
						const confirmed = confirm(
							"Dieses Buch kann aufgrund von Lizenzbestimmungen nicht im direkt hier angezeigt werden. Du wirst zur Verlagsseite weitergeleitet.",
						);
						if (!confirmed) {
							return;
						}
						buchLink.href = buecherTopf[fachrichtung][buch];
						buchLink.target = "_blank";
						return;
					}
					const url = buecherTopf[fachrichtung][buch];
					bookIframe.src = url;
				});
				fachrichtungDiv.appendChild(buchLink);
			});
			bookselector.appendChild(fachrichtungDiv);
		});
	}
});
