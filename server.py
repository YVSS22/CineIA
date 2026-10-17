#!/usr/bin/env python3
"""CineIA backend — TTS (edge-tts), musique, montage (ffmpeg), sert le frontend.

Le frontend (index.html + app.js) appelle Agnes directement pour le script/les
images/les vidéos (clés en localStorage, BYOK). Ce backend fournit ce que le
navigateur ne peut pas faire seul : la voix (edge-tts) et le montage (ffmpeg).

Run: python3 server.py  (port 8648)
"""
import base64
import json
import os
import re
import secrets
import subprocess
import tempfile
import threading
import time
import urllib.request
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
MUSIC_DIR = BASE_DIR / "music"
OUT_DIR = BASE_DIR / "output"
OUT_DIR.mkdir(exist_ok=True)
PORT = int(os.environ.get("CINEIA_PORT", "8648"))
HOST = "0.0.0.0"

FFMPEG = "/root/.hermes/tools/ffmpeg-9.0.1-linux-x64/bin/ffmpeg"

VOICES = {
    "homme": "fr-FR-HenriNeural",
    "femme": "fr-FR-DeniseNeural",
}

MUSIC_TRACKS = [
    {"id": "ambiant", "name": "Ambiant"},
    {"id": "mysterieux", "name": "Mystérieux"},
    {"id": "doux", "name": "Doux"},
]

def _dur(path):
    r = subprocess.run([FFMPEG, "-i", str(path)], capture_output=True, text=True)
    m = re.search(r"Duration: (\d+):(\d+):([\d.]+)", r.stderr or "")
    if m:
        return int(m.group(1)) * 3600 + int(m.group(2)) * 60 + float(m.group(3))
    return 0.0

def tts(text, voice):
    import asyncio
    import edge_tts
    v = VOICES.get(voice, VOICES["homme"])
    async def go():
        tmp = tempfile.NamedTemporaryFile(suffix=".mp3", delete=False)
        tmp.close()
        await edge_tts.Communicate(text, v).save(tmp.name)
        return tmp.name
    path = asyncio.run(go())
    dur = _dur(path)
    data = Path(path).read_bytes()
    os.unlink(path)
    return data, dur

def download(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=300) as r:
        return r.read()

def montage(scenes, music_id, subtitles):
    """Télécharge les scènes, concatène, ajoute musique + sous-titres. Retourne un mp4."""
    jobdir = tempfile.mkdtemp(prefix="cineia_")
    try:
        # 1. télécharger les scènes
        takes = []
        durs = []
        for i, sc in enumerate(scenes):
            data = download(sc["url"])
            p = Path(jobdir) / f"scene{i}.mp4"
            p.write_bytes(data)
            takes.append(p)
            durs.append(_dur(p))

        # 2. concaténation (ré-encodage, codecs identiques)
        lst = Path(jobdir) / "list.txt"
        lst.write_text("".join(f"file '{p}'\n" for p in takes))
        raw = Path(jobdir) / "raw.mp4"
        subprocess.run([FFMPEG, "-y", "-v", "error", "-f", "concat", "-safe", "0",
                        "-i", str(lst), "-c", "copy", str(raw)], check=True)
        total = sum(durs)
        current = raw
        srt = None

        # 3. sous-titres (optionnel)
        if subtitles:
            srt = Path(jobdir) / "subs.srt"
            srt.write_text(_make_srt(scenes, durs))

        # 4. musique (optionnel)
        music_path = MUSIC_DIR / f"{music_id}.mp3" if music_id else None
        if music_path and music_path.exists():
            with_audio = Path(jobdir) / "with_music.mp4"
            subprocess.run([FFMPEG, "-y", "-v", "error",
                            "-i", str(current), "-stream_loop", "-1", "-i", str(music_path),
                            "-filter_complex", "[1:a]volume=0.15[m];[0:a][m]amix=inputs=2:duration=first:dropout_transition=0[a]",
                            "-map", "0:v", "-map", "[a]", "-c:v", "copy", "-c:a", "aac",
                            "-b:a", "128k", "-t", str(total), str(with_audio)], check=True)
            current = with_audio

        # 5. incruster les sous-titres
        if subtitles:
            final = Path(jobdir) / "final.mp4"
            subprocess.run([FFMPEG, "-y", "-v", "error", "-i", str(current), "-vf",
                            f"subtitles={srt}:force_style='FontSize=13,Alignment=2,MarginV=30,Outline=1'",
                            "-c:a", "copy", str(final)], check=True)
            current = final

        out_id = secrets.token_hex(8)
        out = OUT_DIR / f"{out_id}.mp4"
        out.write_bytes(current.read_bytes())
        return f"/output/{out_id}.mp4", total
    finally:
        subprocess.run(["rm", "-rf", jobdir])

def _make_srt(scenes, durs):
    def ts(t):
        t = max(0, t)
        return f"{int(t//3600):02d}:{int(t%3600//60):02d}:{int(t%60):02d},{int((t%1)*1000):03d}"
    parts = []
    idx = 1
    offset = 0.0
    for sc, d in zip(scenes, durs):
        text = (sc.get("text") or "").strip()
        if text and d > 0:
            # découpe en 2 phrases max pour la lisibilité
            phrases = [p.strip() for p in re.split(r"[.!?…]+", text) if p.strip()] or [text]
            step = d / len(phrases)
            for j, ph in enumerate(phrases):
                parts.append(f"{idx}\n{ts(offset+j*step)} --> {ts(offset+(j+1)*step-0.1)}\n{ph}\n")
                idx += 1
        offset += d
    return "\n".join(parts)

class Handler(BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        pass

    def _send(self, code, body, ctype="application/json"):
        self.send_response(code)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.end_headers()
        self.wfile.write(body)

    def _json(self, code, obj):
        self._send(code, json.dumps(obj).encode())

    def do_OPTIONS(self):
        self._send(204, b"")

    def do_GET(self):
        path = self.path.split("?")[0]
        if path == "/api/music":
            self._json(200, {"tracks": MUSIC_TRACKS})
            return
        if path.startswith("/static/music/"):
            name = path.split("/")[-1]
            f = MUSIC_DIR / name
            if f.exists():
                self._send(200, f.read_bytes(), "audio/mpeg")
            else:
                self._json(404, {"error": "not found"})
            return
        if path.startswith("/output/"):
            name = path.split("/")[-1]
            f = OUT_DIR / name
            if f.exists():
                self._send(200, f.read_bytes(), "video/mp4")
            else:
                self._json(404, {"error": "not found"})
            return
        # frontend
        if path in ("/", "/index.html"):
            self._send(200, (BASE_DIR / "index.html").read_bytes(), "text/html; charset=utf-8")
            return
        if path == "/style.css":
            self._send(200, (BASE_DIR / "style.css").read_bytes(), "text/css")
            return
        if path == "/app.js":
            self._send(200, (BASE_DIR / "app.js").read_bytes(), "application/javascript")
            return
        self._json(404, {"error": "not found"})

    def do_POST(self):
        path = self.path.split("?")[0]
        try:
            n = int(self.headers.get("Content-Length", "0"))
            p = json.loads(self.rfile.read(n).decode() or "{}")
        except Exception:
            self._json(400, {"error": "bad request"})
            return
        if path == "/api/tts":
            text = (p.get("text") or "").strip()
            if not text:
                self._json(400, {"error": "text required"})
                return
            try:
                data, dur = tts(text, p.get("voice", "homme"))
                self._json(200, {"audio_b64": base64.b64encode(data).decode(), "mime": "audio/mpeg", "duration": round(dur, 2)})
            except Exception as e:
                self._json(500, {"error": str(e)})
            return
        if path == "/api/montage":
            scenes = p.get("scenes") or []
            if not scenes:
                self._json(400, {"error": "scenes required"})
                return
            try:
                url, total = montage(scenes, p.get("music_id"), bool(p.get("subtitles")))
                self._json(200, {"video_url": url, "duration": total})
            except Exception as e:
                self._json(500, {"error": str(e)})
            return
        self._json(404, {"error": "not found"})

def main():
    srv = ThreadingHTTPServer((HOST, PORT), Handler)
    print(f"CineIA backend on http://{HOST}:{PORT}  (ffmpeg={'ok' if Path(FFMPEG).exists() else 'MISSING'}, musiques={len(list(MUSIC_DIR.glob('*.mp3')))})")
    srv.serve_forever()

if __name__ == "__main__":
    main()
