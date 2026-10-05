export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const { text, style = "Mirna meditacija" } = req.body || {};
    if (typeof text !== "string" || !text.trim()) return res.status(400).json({ error: "Nedostaje tekst." });
    if (!process.env.OPENAI_API_KEY) return res.status(500).json({ error: "OPENAI_API_KEY nije podešen na serveru." });

    const prompt = `Nastavi sledeću meditacionu skriptu na srpskom jeziku.
Stil: ${style}.
Nastavi tačno od poslednje misli. Ne ponavljaj korisnikov tekst. Piši prirodno za spor, umirujući glas.
Ne dodaj naslove, objašnjenja, navodnike ni meta-komentare. Napravi jedan koherentan nastavak od približno 120-180 reči.

KORISNIKOV TEKST:
${text.trim()}`;

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
  } catch (e) {
    return res.status(500).json({ error: e.message || "Server error" });
  }
}