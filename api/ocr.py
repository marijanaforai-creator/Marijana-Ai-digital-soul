import base64
import os
from typing import Optional

from fastapi import FastAPI, File, Form, HTTPException, UploadFile
import urllib.request
import json

app = FastAPI(title="Marijana AI Digital Soul OCR API", version="0.2.0")

MAX_FILE_SIZE = 4 * 1024 * 1024
ALLOWED_TYPES = {
    "image/png",
    "image/jpeg",
    "image/webp",
    "application/pdf",
}


def openai_request(payload: dict) -> dict:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise HTTPException(
            status_code=500,
            detail="OPENAI_API_KEY nije podešen na Vercelu."
        )

    body = json.dumps(payload).encode("utf-8")
    request = urllib.request.Request(
        "https://api.openai.com/v1/responses",
        data=body,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}",
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(request, timeout=55) as response:
            return json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as error:
        raw = error.read().decode("utf-8", errors="replace")
        try:
            detail = json.loads(raw).get("error", {}).get("message", raw)
        except Exception:
            detail = raw
        raise HTTPException(status_code=502, detail=detail or "OCR AI servis je vratio grešku.")
    except Exception as error:
        raise HTTPException(status_code=502, detail=str(error) or "OCR AI servis nije dostupan.")


def extract_output_text(data: dict) -> str:
    if isinstance(data.get("output_text"), str):
        return data["output_text"].strip()

    parts = []
    for item in data.get("output", []) or []:
        for content in item.get("content", []) or []:
            text = content.get("text")
            if isinstance(text, str):
                parts.append(text)

    return "\n".join(parts).strip()


@app.get("/")
def health():
    return {
        "ok": True,
        "service": "Marijana AI Digital Soul OCR",
        "version": "0.2.0",
    }


@app.post("/")
async def ocr(
    file: UploadFile = File(...),
    language: str = Form("sr-Latn"),
    mode: str = Form("document"),
):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=415,
            detail="Podržani su PNG, JPG/JPEG, WEBP i PDF fajlovi."
        )

    content = await file.read()
    if not content:
        raise HTTPException(status_code=400, detail="Fajl je prazan.")

    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail="Fajl je prevelik. Za OCR trenutno koristi fajl do 4 MB."
        )

    mime = file.content_type
    encoded = base64.b64encode(content).decode("ascii")
    data_url = f"data:{mime};base64,{encoded}"

    language_map = {
        "sr-Latn": "srpski latinica",
        "sr-Cyrl": "srpski ćirilica",
        "English": "engleski",
        "Magyar": "mađarski",
    }
    requested_language = language_map.get(language, language)

    mode_instruction = {
        "document": "Prepoznaj običan dokument, zadrži pasuse, naslove i liste.",
        "handwriting": "Pokušaj da prepoznaš rukopis. Ako je neki deo nečitak, označi ga sa [nečitko].",
        "table": "Prepoznaj tabelu i vrati je kao jednostavnu Markdown tabelu kada je moguće.",
        "screenshot": "Prepoznaj sav vidljiv tekst sa screenshota i zadrži redosled čitanja.",
    }.get(mode, "Prepoznaj tekst i zadrži prirodnu strukturu.")

    if mime == "application/pdf":
        content_part = {
            "type": "input_file",
            "filename": file.filename or "document.pdf",
            "file_data": data_url,
        }
    else:
        content_part = {
            "type": "input_image",
            "image_url": data_url,
            "detail": "high",
        }

    prompt = f"""
Ti si OCR modul aplikacije Marijana AI Digital Soul.

Prepoznaj tekst iz priloženog fajla.
Ciljani jezik: {requested_language}.
Način rada: {mode_instruction}

Pravila:
- Vrati samo prepoznati sadržaj, bez uvoda i objašnjenja.
- Ne izmišljaj tekst koji nije vidljiv.
- Sačuvaj redosled čitanja.
- Zadrži naslove, pasuse i liste kada ih možeš pouzdano prepoznati.
- Ne prevodi sadržaj.
- Ako je neki deo nečitak, jasno ga označi umesto da nagađaš.
""".strip()

    model = os.getenv("OPENAI_OCR_MODEL") or os.getenv("OPENAI_TEXT_MODEL") or "gpt-4.1-mini"

    data = openai_request({
        "model": model,
        "input": [
            {
                "role": "user",
                "content": [
                    {"type": "input_text", "text": prompt},
                    content_part,
                ],
            }
        ],
    })

    text = extract_output_text(data)
    if not text:
        raise HTTPException(status_code=502, detail="OCR servis nije vratio prepoznat tekst.")

    return {
        "ok": True,
        "text": text,
        "filename": file.filename,
        "language": language,
        "mode": mode,
        "model": model,
    }
