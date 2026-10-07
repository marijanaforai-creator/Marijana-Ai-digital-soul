from fastapi import FastAPI

app = FastAPI(title="Marijana AI Digital Soul API", version="0.1.0")

@app.get("/")
def health_check():
    return {
        "ok": True,
        "service": "Marijana AI Digital Soul Python API",
        "version": "0.1.0",
    }
