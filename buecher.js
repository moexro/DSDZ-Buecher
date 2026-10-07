// Hier werden alle Buch-Links gepflegt.
// Aufbau: Klasse → Fachbereich → Fach: "Link"
// Ein leerer Link ("") wird auf der Seite als „Link folgt“ angezeigt.
// Ein Zusatz in Klammern, z. B. "Latein (Lesebuch)", erscheint als kleines Etikett.

const BUECHER = {
  12: {
    Naturwissenschaften: {
      Chemie: "https://www.ccbuchner.de/_files_media/livebook/7241/",
      Physik: "https://blickinsbuch.westermann.de/978-3-14-152407-9/index-h5.html#page=1",
      Biophysik: "https://www.ccbuchner.de/_files_media/livebook/8290/",
      Biologie: "https://www.ccbuchner.de/_files_media/livebook/8646/",
      Informatik: "https://static.cornelsen.de/bgd/97/83/63/70/24/76/2/9783637024762_x1LIAB/index.html",
      Mathe: "https://klettbib.livebook.de/978-3-12-735020-3/",
    },
    Sprachen: {
      Latein: "https://www.ccbuchner.de/_files_media/livebook/8749/",
      Englisch: "https://blickinsbuch.westermann.de/978-3-425-73096-7/index-h5.html#page=1",
      Deutsch: "https://klettbib.livebook.de/978-3-12-350568-3/",
      Französisch: "",
      Spanisch: "https://static.cornelsen.de/bgd/97/83/06/02/24/52/4/9783060224524_x1LIAB/index.html",
    },
    Gesellschaftswissenschaften: {
      Geschichte: "https://www.ccbuchner.de/_files_media/livebook/8332/",
      "Politik und Gesellschaft (gA)": "https://www.ccbuchner.de/_files_media/livebook/7709/",
      "Wirtschaft und Recht": "https://www.ccbuchner.de/_files_media/livebook/7757/",
      Geographie: "https://blickinsbuch.westermann.de/978-3-14-151945-7/index-h5.html#page=1",
    },
    Religionen: {
      "Katholisch Mom": "https://jsgkar.sharepoint.com/:b:/s/1k2KatholischeReligionMom26-27/IQDU86k2ONSmR5IWpN-IcCGZAb653Hs0JWWH1nqQupn1tek?e=FogZ7V",
    },
  },

  11: {
    Naturwissenschaften: {
      Chemie: "https://static.cornelsen.de/bgd/97/83/46/48/50/43/5/9783464850435_x1LIAB/index.html",
      Physik: "https://blickinsbuch.westermann.de/978-3-14-152400-0/",
      Mathe: "https://klettbib.livebook.de/978-3-12-735010-4/",
    },
    Sprachen: {
      Deutsch: "https://static.cornelsen.de/bgd/97/83/46/46/30/00/6/9783464630006_x1LIAB/index.html",
      Englisch: "https://blickinsbuch.westermann.de/978-3-425-73090-5/",
      Französisch: "https://klettbib.livebook.de/978-3-12-521061-5/",
      Latein: "https://www.ccbuchner.de/produkt/lesebuch-latein-oberstufe-1-neu-8748/livebook/8748",
      Spanisch: "https://static.cornelsen.de/bgd/97/83/06/02/24/50/0/9783060224500_x1LIAB/index.html",
    },
    Gesellschaftswissenschaften: {
      Geschichte: "https://www.ccbuchner.de/produkt/band-11-8331/livebook/8331",
      Politik: "https://www.ccbuchner.de/produkt/politik-aktuell-11-7708/livebook/7708",
      Geographie: "https://blickinsbuch.westermann.de/978-3-14-115093-3/",
      Wirtschaft: "https://www.ccbuchner.de/produkt/band-11-7756/livebook/7756",
    },
    Religionen: {
      Katholisch: "https://klettbib.livebook.de/978-3-12-007395-6/",
      Evangelisch: "https://www.ccbuchner.de/produkt/oberstufe-11-8325/livebook/8325",
      Ethik: "https://blickinsbuch.westermann.de/978-3-14-161339-1/index-h5.html",
    },
  },

  10: {
    Naturwissenschaften: {
      Chemie: "https://www.ccbuchner.de/produkt/chemie-10-ntg-5052/livebook/5052",
      Biologie: "https://www.ccbuchner.de/produkt/biologie-10-7236/livebook/7236",
      Physik: "https://blickinsbuch.westermann.de/978-3-507-11820-1/",
      Mathe: "https://klettbib.livebook.de/978-3-12-733001-4/",
      Informatik: "https://www.ccbuchner.de/produkt/informatik-10-ntg-7201/livebook/7201",
    },
    Sprachen: {
      Deutsch: "https://static.cornelsen.de/bgd/97/83/06/06/27/81/3/9783060627813_x1LIAB/index.html",
      Englisch: "https://static.cornelsen.de/bgd/97/83/06/03/34/94/0/9783060334940_x1LIAB/index.html",
      Französisch: "https://static.cornelsen.de/bgd/97/83/06/12/21/74/4/9783061221744_x1LIAB/index.html",
      Latein: "https://www.ccbuchner.de/produkt/lesebuch-latein-mittelstufe-2-5011/livebook/5011",
    },
    Gesellschaftswissenschaften: {
      Geschichte: "https://www.ccbuchner.de/produkt/band-5-fuer-die-jahrgangsstufe-10-4148/livebook/4148",
      Politik: "https://www.ccbuchner.de/produkt/politik-aktuell-10-7707/livebook/7707",
      Geographie: "https://blickinsbuch.westermann.de/978-3-14-115087-2/",
      Wirtschaft: "https://www.ccbuchner.de/produkt/band-10-7755/livebook/7755",
      Musik: "https://www.helbling.com/sites/default/files/media/documents/386227442_DEMO_Tonart_9_10_B_2021_sample.pdf",
    },
    Religionen: {
      Katholisch: "https://klettbib.livebook.de/978-3-12-007386-4/",
      Evangelisch: "https://www.ccbuchner.de/produkt/theologisch-10-4988/livebook/4988",
      Ethik: "https://www.ccbuchner.de/produkt/abenteuer-ethik-10-7639/livebook/7639",
    },
  },

  9: {
    Naturwissenschaften: {
      Chemie: "https://www.ccbuchner.de/produkt/chemie-9-ntg-5051/livebook/5051",
      Biologie: "https://www.ccbuchner.de/produkt/biologie-9-7235/livebook/7235",
      Physik: "https://blickinsbuch.westermann.de/978-3-507-11818-8/index-h5.html#page=1",
      Mathe: "https://klettbib.livebook.de/978-3-12-733091-5/",
      Informatik: "https://www.ccbuchner.de/_files_media/livebook/7198/",
    },
    Sprachen: {
      Deutsch: "https://static.cornelsen.de/bgd/97/83/06/06/27/80/6/9783060627806_x1LIAB/index.html",
      Französisch: "https://klettbib.livebook.de/978-3-12-622281-5/",
      "Latein (Lesebuch)": "https://www.ccbuchner.de/produkt/lesebuch-latein-mittelstufe-1-5010/livebook/5010",
      "Latein (Grammatikbuch)": "https://www.ccbuchner.de/produkt/band-c-3-3759/livebook/3759",
    },
    Gesellschaftswissenschaften: {
      Geschichte: "https://www.ccbuchner.de/produkt/band-4-fuer-die-jahrgangsstufe-9-4147/livebook/4147",
      Musik: "https://www.helbling.com/sites/default/files/media/documents/386227442_DEMO_Tonart_9_10_B_2021_sample.pdf",
    },
    Religionen: {
      Katholisch: "https://klettbib.livebook.de/978-3-12-006889-1/",
      Evangelisch: "https://www.ccbuchner.de/produkt/theologisch-9-4987/livebook/4987",
      Ethik: "https://www.ccbuchner.de/produkt/abenteuer-ethik-9-7638/livebook/7638",
    },
  },
};
