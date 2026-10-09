export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const { text, voiceId: requestedVoiceId } = req.body || {};
    if (typeof text !== "string" || !text.trim()) return res.status(400).json({ error: "Nedostaje tekst." });
    const key = process.env.ELEVENLABS_API_KEY;
    const voiceId = typeof requestedVoiceId === "string" && /^[A-Za-z0-9_-]{8,100}$/.test(requestedVoiceId) ? requestedVoiceId : process.env.ELEVENLABS_VOICE_ID;
    if (!key || !voiceId) return res.status(500).json({ error: "ELEVENLABS_API_KEY ili ELEVENLABS_VOICE_ID nije podešen na serveru." });

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`, {
      method: "POST",
      headers: {
        "xi-api-key": key,
        "Content-Type": "application/json",
        "Accept": "audio/mpeg"
      },
      body: JSON.stringify({
        text: text.trim(),
        model_id: process.env.ELEVENLABS_MODEL_ID || "eleven_v4",
        language_code: "sr",
        voice_settings: {
          stability: 0.72,
          similarity_boost: 0.9
        }
      })
    });

    if (!response.ok) {
      const message = await response.text();
      return res.status(response.status).json({ error: message || "Voice API greška." });
    }
    const buffer = Buffer.from(await response.arrayBuffer());
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Content-Disposition", 'inline; filename="marijana-meditacija.mp3"');
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).send(buffer);
  } catch (e) {
    return res.status(500).json({ error: e.message || "Server error" });
  }
}