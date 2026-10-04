(() => {
  const FALLBACK_FONTS = [
    "Cormorant Garamond","Playfair Display","DM Sans","Montserrat","Lora",
    "Libre Baskerville","Bebas Neue","Oswald","Arial","Georgia","Times New Roman"
  ];

  let catalog = [];
  let ready = false;

  function uniqueFamilies(fonts) {
    return [...new Set(fonts.map(f => f.family).filter(Boolean))].sort((a,b) => a.localeCompare(b));
  }

  async function load() {
    if (ready) return catalog;
    try {
      if (typeof window.queryLocalFonts === "function") {
        const fonts = await window.queryLocalFonts();
        catalog = uniqueFamilies(fonts);
      }
    } catch (error) {
      console.warn("Localni fontovi nisu dostupni:", error);
    }
    if (!catalog.length) catalog = [...FALLBACK_FONTS];
    ready = true;
    window.dispatchEvent(new CustomEvent("marijana:fonts-ready", { detail: { fonts: catalog } }));
    return catalog;
  }

  function getFonts() { return catalog.length ? catalog : FALLBACK_FONTS; }

  window.MarijanaMockupFontManager = { load, getFonts };
  load();
})();
