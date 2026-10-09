export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const { text, style = "Mirna meditacija", mode = "continue", durationMinutes = 3 } = req.body || {};
    if (typeof text !== "string" || !text.trim()) return res.status(400).json({ error: "Nedostaje tema ili tekst." });
    if (text.length > 5000) return res.status(400).json({ error: "Tekst je predugačak." });
    if (!process.env.OPENAI_API_KEY) return res.status(500).json({ error: "OPENAI_API_KEY nije podešen na serveru." });

    let prompt;
    if (mode === "full") {
      const minutes = Math.max(1, Math.min(10, Number(durationMinutes) || 3));
      const wordRange = minutes === 1 ? "100-140" : minutes <= 3 ? "280-380" : minutes <= 5 ? "480-620" : "850-1100";
      prompt = `Napiši kompletnu vođenu meditaciju na srpskom jeziku, latinicom i ekavicom.
Tema / namera: ${text.trim()}
Stil: ${style}.
Napravi tekst za približno ${minutes} minuta sporog govora, oko ${wordRange} reči.
Piši prirodno za toplu, mirnu AI naraciju. Koristi kratke, jasne rečenice i obraćanje slušaocu u drugom licu.
Umetni oznake [PAUZA: 3s] ili [PAUZA: 4s] na nekoliko prirodnih mesta za disanje i tišinu. Ne preteruj s oznakama.
Ne dodaj naslov, objašnjenja, navodnike ni meta-komentare. Ne obećavaj medicinske ili terapijske rezultate.`;
    } else {
      prompt = `Nastavi sledeću meditacionu skriptu na srpskom jeziku.
Stil: ${style}.
Nastavi tačno od poslednje misli. Ne ponavljaj korisnikov tekst. Piši prirodno za spor, umirujući glas.
Ne dodaj naslove, objašnjenja, navodnike ni meta-komentare. Napravi jedan koherentan nastavak od približno 120-180 reči.

KORISNIKOV TEKST:
${text.trim()}`;
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: process.env.OPENAI_TEXT_MODEL || "gpt-6-luna",
        input: prompt
      })
    });

    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: data?.error?.message || "AI greška." });

    const continuation = data.output_text || data.output?.flatMap(x => x.content || []).map(x => x.text || "").join("") || "";
    return res.status(200).json({ continuation: continuation.trim() });
  } catch {
    return res.status(500).json({ error: "Došlo je do greške pri generisanju naracije. Pokušaj ponovo." });
  }
}
