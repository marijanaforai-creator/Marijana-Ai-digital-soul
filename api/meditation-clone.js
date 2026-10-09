export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "ELEVENLABS_API_KEY nije podešen na serveru." });
    const contentType = req.headers["content-type"] || "";
    if (!contentType.toLowerCase().includes("multipart/form-data")) {
      return res.status(400).json({ error: "Pošalji audio snimak glasa." });
    }

    const chunks = [];
    let total = 0;
    for await (const chunk of req) {
      total += chunk.length;
      if (total > 4 * 1024 * 1024) return res.status(413).json({ error: "Snimak je prevelik. Izaberi kompresovan audio fajl manji od 4 MB." });
      chunks.push(chunk);
    }
    const body = Buffer.concat(chunks);
    const request = new Request("http://localhost", {
      method: "POST",
      headers: { "content-type": contentType },
      body: new Uint8Array(body)
    });
    const form = await request.formData();
    const file = form.get("audio");
    const name = String(form.get("name") || "Moj glas").trim().slice(0, 80);
    if (!file || typeof file.arrayBuffer !== "function" || !file.type.startsWith("audio/")) {
      return res.status(400).json({ error: "Izaberi validan audio fajl." });
    }
    if (file.size > 4 * 1024 * 1024) return res.status(413).json({ error: "Snimak je prevelik. Izaberi kompresovan audio fajl manji od 4 MB." });

    const cloneForm = new FormData();
    cloneForm.append("name", name || "Moj glas");
    cloneForm.append("files[]", new Blob([await file.arrayBuffer()], { type: file.type }), file.name || "voice-sample");
    const response = await fetch("https://api.elevenlabs.io/v1/voices/add", {
      method: "POST",
      headers: { "xi-api-key": apiKey },
      body: cloneForm
    });
    const raw = await response.text();
    let data = {};
    try { data = JSON.parse(raw); } catch {}
    if (!response.ok) {
      const message = data.detail?.message || data.detail || data.message || data.error?.message || "ElevenLabs nije uspeo da napravi klon glasa.";
      return res.status(response.status).json({ error: String(message).slice(0, 500) });
    }
    return res.status(200).json({ voiceId: data.voice_id, requiresVerification: Boolean(data.requires_verification), name: name || "Moj glas" });
  } catch {
    return res.status(500).json({ error: "Došlo je do greške pri kreiranju klona. Proveri snimak i pokušaj ponovo." });
  }
}
