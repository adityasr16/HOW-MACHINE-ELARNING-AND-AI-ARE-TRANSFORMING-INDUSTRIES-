#!/usr/bin/env python3
"""
Generate the reel voiceover as natural American neural speech.

Uses Microsoft Edge's free neural voices via `edge-tts` (no API key needed).
Run this on any machine with normal internet access:

    pip install edge-tts
    python scripts/generate-voiceover.py

It writes one clip per slide to public/vo/<key>.mp3. Then set
VOICEOVER = true at the top of src/Reel.jsx and re-render:

    npm run build

Voice: en-US-AndrewNeural — warm, professional, conversational (not robotic).
Swap VOICE below for another (e.g. en-US-AriaNeural female, en-US-GuyNeural).
"""
import asyncio
import ssl

# Some sandboxes pin certifi's CA bundle; also trust the system bundle if present.
_orig = ssl.create_default_context
def _patched(*a, **k):
    ctx = _orig(*a, **k)
    try:
        ctx.load_verify_locations("/etc/ssl/certs/ca-certificates.crt")
    except Exception:
        pass
    return ctx
ssl.create_default_context = _patched

import edge_tts  # noqa: E402

VOICE = "en-US-AndrewNeural"
RATE = "+6%"  # a touch more energy

LINES = {
    "hook":    "Wood is losing. Here's why U.S. builders are making the switch.",
    "stat1":   "Every year, ten point eight billion dollars is lost to the framing labor shortage.",
    "stat2":   "And material costs? Up over forty-one percent since twenty twenty.",
    "switch":  "So builders are switching to light gauge steel framing.",
    "reason1": "Reason one. It frames faster. Prefab panels go up in days, not weeks.",
    "reason2": "Reason two. It needs fewer hands. Less labor, faster training, fewer field calls.",
    "reason3": "Reason three. It outlasts wood. Non-combustible, termite-proof, built to last a hundred years.",
    "reason4": "Reason four. Prices stay steady. Steel doesn't swing seventy percent in a year.",
    "cta":     "Building your first L-G-S-F project? We've detailed hundreds of them across twelve countries. Let's build yours.",
    "outro":   "U-B-C BIM. Unique Building Concepts.",
}


async def main():
    import os
    os.makedirs("public/vo", exist_ok=True)
    for key, text in LINES.items():
        out = f"public/vo/{key}.mp3"
        await edge_tts.Communicate(text, VOICE, rate=RATE).save(out)
        print("wrote", out)


if __name__ == "__main__":
    asyncio.run(main())
