export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const { prompt, durationMs = 60000 } = req.body || {};
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "ELEVENLABS_API_KEY nije podešen na serveru." });
    if (typeof prompt !== "string" || !prompt.trim()) return res.status(400).json({ error: "Opiši kakvu muziku želiš." });
    if (prompt.length > 4100) return res.status(400).json({ error: "Opis muzike je predugačak." });
    const length = Number(durationMs);
    if (!Number.isInteger(length) || length < 3000 || length > 600000) {
      return res.status(400).json({ error: "Trajanje muzike mora biti između 3 sekunde i 10 minuta." });
    }

    const response = await fetch("https://api.elevenlabs.io/v1/music?output_format=mp3_44100_128", {
      method: "POST",
      headers: { "xi-api-key": apiKey, "Content-Type": "application/json", "Accept": "audio/mpeg" },
      body: JSON.stringify({
        prompt: prompt.trim(),
        music_length_ms: length,
        model_id: process.env.ELEVENLABS_MUSIC_MODEL || "music_v2_5",
        force_instrumental: true
      })
    });
    if (!response.ok) {
      const raw = await response.text();
      let message = raw;
      try {
        const parsed = JSON.parse(raw);
        message = parsed.detail?.message || parsed.detail || parsed.message || parsed.error?.message || raw;
      } catch {}
      return res.status(response.status).json({ error: String(message).slice(0, 500) || "Generisanje muzike nije uspelo." });
    }
    const audio = Buffer.from(await response.arrayBuffer());
    res.setHeader("Content-Type", response.headers.get("content-type") || "audio/mpeg");
    res.setHeader("Content-Disposition", 'inline; filename="meditation-background.mp3"');
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).send(audio);
  } catch {
    return res.status(500).json({ error: "Došlo je do greške pri generisanju muzike. Pokušaj ponovo." });
  }
}
