"""Original score and effects for one ad, synthesised (no samples, nothing to license).

    python3 score.py meta.json out.wav

meta: {"dur": 15, "bpm": 112, "mood": "warm|bright|calm|drive", "key": "A", "cues": [[t, kind], ...]}
kind: click pop chime notify whoosh swish riser hit type paper printer stamp shutter marker coin box — recorded takes
from motion/sfx (see its CREDITS.md); whoosh/riser/hit/click/pop/type fall back to synthesis when a kind has no takes.
The mix is left at a safe level; the renderer normalises loudness to -14 LUFS / -1.5 dBTP with ffmpeg.
"""
import glob
import json
import os
import subprocess
import sys
import wave

import numpy as np

SR = 48000
NOTES = {'C': 0, 'C#': 1, 'D': 2, 'D#': 3, 'E': 4, 'F': 5, 'F#': 6, 'G': 7, 'G#': 8, 'A': 9, 'A#': 10, 'B': 11}


def hz(semi_from_a4):
    return 440.0 * 2 ** (semi_from_a4 / 12)


def lp_fast(x, cutoff):
    # Vectorised approximation: a short moving average tuned to the cutoff (good enough for pads and noise colour).
    n = max(1, int(SR / (cutoff * 2.2)))
    k = np.ones(n) / n
    return np.convolve(x, k, mode='same')


def env_adsr(n, a, d, s, r):
    a, d, r = int(a * SR), int(d * SR), int(r * SR)
    sus = max(0, n - a - d - r)
    e = np.concatenate([np.linspace(0, 1, max(a, 1)), np.linspace(1, s, max(d, 1)), np.full(sus, s), np.linspace(s, 0, max(r, 1))])
    return e[:n] if len(e) >= n else np.pad(e, (0, n - len(e)))


def kick(n=int(0.42 * SR)):
    t = np.arange(n) / SR
    f = 46 + 110 * np.exp(-t * 28)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.exp(-t * 9) * 0.95


def hat(rng, n=int(0.07 * SR)):
    x = rng.standard_normal(n)
    # Band-limited (6–11 kHz): bright enough to read as a hat, without the top octave AAC overshoots on.
    x = lp_fast(x, 11000) - lp_fast(x, 6000)
    return x * np.exp(-np.arange(n) / SR * 60) * 0.18


def clap(rng, n=int(0.22 * SR)):
    x = rng.standard_normal(n)
    x = lp_fast(x, 3500) - lp_fast(x, 900)
    t = np.arange(n) / SR
    e = np.exp(-t * 22) + 0.6 * np.exp(-np.maximum(t - 0.012, 0) * 30) * (t > 0.012)
    return x * e * 0.45


def tone(freq, n, harmonics=(1, .5, .25, .12), detune=0.0):
    t = np.arange(n) / SR
    out = np.zeros(n)
    for i, amp in enumerate(harmonics, start=1):
        out += amp * np.sin(2 * np.pi * freq * i * (1 + detune) * t)
    return out


def pad_chord(freqs, n):
    out = np.zeros(n)
    for f in freqs:
        out += tone(f, n, (1, .35, .15), 0.0) + tone(f, n, (1, .35, .15), 0.004)
    return out / max(1, len(freqs)) * env_adsr(n, 0.35, 0.3, 0.8, 0.5)


def pluck(freq, n):
    t = np.arange(n) / SR
    return tone(freq, n, (1, .6, .3, .15)) * np.exp(-t * 9)


def whoosh(rng, n=int(0.6 * SR), up=True):
    x = rng.standard_normal(n)
    t = np.linspace(0, 1, n)
    e = np.sin(np.pi * t) ** 2
    # sweep a band by mixing two low-passes
    lo = lp_fast(x, 600)
    hi = lp_fast(x, 4000)
    mix = (hi * (t if up else 1 - t) + lo * (1 - t if up else t))
    return mix * e * 0.55


def riser(rng, n=int(1.4 * SR)):
    x = rng.standard_normal(n)
    t = np.linspace(0, 1, n)
    out = lp_fast(x, 900) * (1 - t) + lp_fast(x, 5200) * t
    return out * t ** 2 * 0.5


def impact(rng, n=int(0.9 * SR)):
    t = np.arange(n) / SR
    boom = np.sin(2 * np.pi * (38 + 60 * np.exp(-t * 12)) * t) * np.exp(-t * 4.5)
    noise = lp_fast(rng.standard_normal(n), 2400) * np.exp(-t * 14) * 0.5
    return (boom + noise) * 0.9


def click(n=int(0.03 * SR)):
    t = np.arange(n) / SR
    return np.sin(2 * np.pi * 2200 * t) * np.exp(-t * 260) * 0.5


def pop(n=int(0.18 * SR)):
    t = np.arange(n) / SR
    return np.sin(2 * np.pi * (660 + 520 * np.exp(-t * 40)) * t) * np.exp(-t * 18) * 0.42


def typing(rng, n=int(0.05 * SR)):
    x = rng.standard_normal(n)
    # A soft key click in the 2.5–6 kHz band (no full-band noise burst for the encoder to overshoot on).
    return (lp_fast(x, 6000) - lp_fast(x, 2500)) * np.exp(-np.arange(n) / SR * 120) * 0.35


SFX_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'sfx')
# Recorded effects (motion/sfx/<kind>/*.wav, CC0 / CC BY — see sfx/CREDITS.md). Gain per kind against the music bed;
# `peak` kinds are placed so their loudest moment lands on the cue (a whoosh peaks on the cut, a riser on the reveal),
# the others start on it. `cap` trims long takes (seconds) with a short fade.
SFX = {
    'click': dict(gain=0.42, cap=0.35), 'pop': dict(gain=0.48, cap=0.6), 'chime': dict(gain=0.5, cap=1.6),
    'notify': dict(gain=0.5, cap=1.4), 'whoosh': dict(gain=0.55, cap=1.6, peak=True), 'swish': dict(gain=0.45, cap=0.9, peak=True),
    'riser': dict(gain=0.5, cap=3.0, peak=True), 'hit': dict(gain=0.7, cap=1.8), 'type': dict(gain=0.4, cap=0.9),
    'paper': dict(gain=0.5, cap=1.0), 'printer': dict(gain=0.45, cap=1.4), 'stamp': dict(gain=0.62, cap=0.8),
    'shutter': dict(gain=0.5, cap=0.9), 'marker': dict(gain=0.45, cap=1.0), 'coin': dict(gain=0.42, cap=1.0),
    'box': dict(gain=0.6, cap=1.0),
}
_cache = {}


def load_wav(path):
    if path not in _cache:
        with wave.open(path, 'rb') as w:
            ch, n = w.getnchannels(), w.getnframes()
            x = np.frombuffer(w.readframes(n), dtype=np.int16).astype(np.float64) / 32768.0
            x = x.reshape(-1, ch).mean(axis=1)
        _cache[path] = x
    return _cache[path]


def recorded(kind, at, n_cue):
    """A recorded take for this cue (a different take each time, chosen deterministically), or None."""
    files = sorted(glob.glob(os.path.join(SFX_DIR, kind, '*.wav')))
    if kind not in SFX or not files:
        return None
    o = SFX[kind]
    x = load_wav(files[(n_cue * 7 + int(at * 10)) % len(files)])
    cap = int(o['cap'] * SR)
    if len(x) > cap:
        x = x[:cap].copy()
        f = min(int(0.08 * SR), cap // 4)
        x[-f:] *= np.linspace(1, 0, f)
    start = at - (int(np.argmax(np.abs(x))) / SR if o.get('peak') else 0.0)
    return x * o['gain'], max(0.0, start)


def place(buf, sig, at, gain=1.0):
    i = int(at * SR)
    if i >= len(buf):
        return
    j = min(len(buf), i + len(sig))
    buf[i:j] += sig[: j - i] * gain


MUSIC_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'music')


def music_bed(name, dur, offset=0.0):
    """A recorded CC0 bed (motion/music/<name>.ogg, see tracks.json): `dur` seconds from `offset`, faded out at the end."""
    path = os.path.join(MUSIC_DIR, name + '.ogg')
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-ss', str(offset), '-t', str(dur), '-i', path, '-ac', '1', '-ar', str(SR),
                          '-f', 'f64le', '-'], capture_output=True, check=True).stdout
    x = np.frombuffer(raw, dtype=np.float64).copy()
    n = int(dur * SR)
    x = np.pad(x, (0, max(0, n - len(x))))[:n]
    fi = int(0.04 * SR)
    x[:fi] *= np.linspace(0, 1, fi)
    fo = int(1.3 * SR)
    x[-fo:] *= np.linspace(1, 0, fo) ** 1.4
    return x


VO_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'vo')


def voice_track(ad_id, n):
    """The ad's voice-over (motion/vo/<ID>/index.json from vo.mjs), placed at its times; None without one."""
    idx = os.path.join(VO_DIR, ad_id, 'index.json')
    if not os.path.exists(idx):
        return None
    vo = np.zeros(n)
    for line in json.load(open(idx)):
        place(vo, load_wav(os.path.join(VO_DIR, ad_id, line['file'])), float(line['t']), 1.0)
    return vo


def duck(vo, depth=0.32, attack=0.08, release=0.35):
    """1 where nobody speaks, `depth` under speech, with smooth attack and release."""
    env = np.abs(vo)
    w = int(0.03 * SR)
    env = np.convolve(env, np.ones(w) / w, mode='same')
    speaking = (env > 0.01).astype(np.float64)
    a, r = int(attack * SR), int(release * SR)
    # widen the speaking mask so the dip starts before the first word and lifts after the last
    k = np.ones(a + r)
    speaking = np.clip(np.convolve(speaking, k, mode='same'), 0, 1)
    gain = 1 - (1 - depth) * speaking
    sm = int(0.12 * SR)
    return np.convolve(gain, np.ones(sm) / sm, mode='same')


import tempfile


def write_wav(path, x):
    pcm = (np.clip(x, -1, 1) * 32767).astype(np.int16)
    with wave.open(path, 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())


def ffmpeg_mono(x, af):
    """Run a mono signal through an ffmpeg filter chain and back (used for the voice's EQ and compression)."""
    with tempfile.TemporaryDirectory() as d:
        a, b = os.path.join(d, 'a.wav'), os.path.join(d, 'b.wav')
        write_wav(a, x)
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', a, '-af', af, '-ar', str(SR), '-ac', '1', b], check=True)
        return _read_plain(b, len(x))


def _read_plain(path, n):
    with wave.open(path, 'rb') as w:
        y = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float64) / 32768.0
    return np.pad(y, (0, max(0, n - len(y))))[:n]


def lufs(x):
    """Integrated loudness (ITU BS.1770 via ffmpeg ebur128); -70 for silence."""
    if np.max(np.abs(x)) < 1e-5:
        return -70.0
    with tempfile.TemporaryDirectory() as d:
        a = os.path.join(d, 'a.wav')
        write_wav(a, x / max(1.0, np.max(np.abs(x))))
        r = subprocess.run(['ffmpeg', '-hide_banner', '-i', a, '-af', 'ebur128', '-f', 'null', '-'], capture_output=True, text=True).stderr
    import re
    m = re.findall(r'I:\s+(-?[\d.]+) LUFS', r)
    v = float(m[-1]) if m else -70.0
    return v + 20 * np.log10(max(1.0, np.max(np.abs(x))))


def to_lufs(x, target):
    cur = lufs(x)
    return x if cur <= -69 else x * 10 ** ((target - cur) / 20)


def band_carve(x, lo=1000.0, hi=4000.0, depth_db=-6.0):
    """The same signal with the speech band (lo..hi Hz) lowered by depth_db, soft edges (FFT, whole signal)."""
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    g = np.ones_like(f)
    edge = 0.35  # octaves of fade at each side
    lf, hf = np.log2(lo), np.log2(hi)
    lfreq = np.log2(np.maximum(f, 1))
    t = np.clip(np.minimum((lfreq - (lf - edge)) / edge, ((hf + edge) - lfreq) / edge), 0, 1)
    g = 10 ** (depth_db * t / 20)
    return np.fft.irfft(X * g, n=len(x))


def speech_env(vo, attack=0.06, release=0.45):
    """0..1: 1 while the narrator speaks, rising `attack` s before a word and falling `release` s after it."""
    env = np.abs(vo)
    w = int(0.03 * SR)
    env = np.convolve(env, np.ones(w) / w, mode='same')
    on = (env > 0.004).astype(np.float64)
    a, r = int(attack * SR), int(release * SR)
    # extend backwards by attack and forwards by release
    fwd = np.convolve(on, np.ones(r), mode='full')[:len(on)]
    back = np.convolve(on[::-1], np.ones(a), mode='full')[:len(on)][::-1]
    m = np.clip(fwd + back, 0, 1)
    sm = int(0.08 * SR)
    return np.clip(np.convolve(m, np.ones(sm) / sm, mode='same'), 0, 1)


# Voice-led mix targets (research: voice 16–23 LU over the bed under speech; duck 6–12 dB; carve 1–4 kHz).
VO_LUFS = -16.0          # the narrator
BED_GAP_LUFS = -27.0     # music between lines (~11 LU under the voice)
BED_DUCK_DB = -9.0       # extra dip under speech -> about 20 LU under the voice
BED_CARVE_DB = -6.0      # speech band 1–4 kHz cut on the bed while she speaks
SFX_LUFS = -26.0         # effects overall
SFX_DUCK_DB = -6.0       # effects under speech


def voice_led_mix(meta, dur, n, music, sfx, vo):
    """Stems levelled by loudness, music and effects ducked and carved under the voice, no saturation."""
    vo = ffmpeg_mono(vo, 'highpass=f=80,equalizer=f=3000:t=q:w=1.1:g=3,equalizer=f=220:t=q:w=1.0:g=-2,'
                         'acompressor=threshold=-22dB:ratio=3:attack=5:release=120:makeup=2')
    vo = to_lufs(vo, VO_LUFS)
    env = speech_env(vo)
    mode = meta.get('musicMode', 'bed')
    if music is not None and mode != 'none':
        music = to_lufs(music, BED_GAP_LUFS + float(meta.get('musicGainDb', 0)))
        carved = band_carve(music, depth_db=BED_CARVE_DB)
        music = music * (1 - env) + carved * env
        music = music * 10 ** (BED_DUCK_DB * env / 20)
    else:
        music = np.zeros(n)
    sfx = to_lufs(sfx, SFX_LUFS) if np.max(np.abs(sfx)) > 1e-5 else sfx
    sfx = sfx * 10 ** (SFX_DUCK_DB * env / 20)
    mix = vo + music + sfx
    # Gentle master glue: tames the voice's peaks so the -14 LUFS delivery is reached without hitting true peak,
    # while the voice / bed / effects balance set above stays as it is.
    mix = ffmpeg_mono(mix / max(1.0, np.max(np.abs(mix)) / 0.95),
                      'acompressor=threshold=-20dB:ratio=2.5:attack=8:release=160:makeup=1,'
                      'alimiter=limit=0.8:attack=2:release=80:level=false')
    return mix


def main():
    meta = json.load(open(sys.argv[1]))
    out = sys.argv[2]
    dur = float(meta.get('dur', 15))
    bpm = float(meta.get('bpm', 112))
    mood = meta.get('mood', 'warm')
    root = NOTES.get(meta.get('key', 'A'), 9) - 9  # semitones from A
    rng = np.random.default_rng(abs(hash(meta.get('id', 'ad'))) % (2 ** 32))
    n = int(dur * SR)
    drums = np.zeros(n)
    music = np.zeros(n)
    sfx = np.zeros(n)
    beat = 60.0 / bpm
    bar = beat * 4

    # Progressions in semitones from the root (minor-ish warm, major bright).
    progs = {
        'warm': [[0, 3, 7, 10], [-4, 0, 3, 7], [-7, -3, 0, 5], [-2, 2, 5, 9]],
        'bright': [[0, 4, 7, 11], [-3, 0, 4, 7], [5, 9, 12, 16], [7, 11, 14, 17]],
        'calm': [[0, 4, 7, 14], [5, 9, 12, 16], [-3, 0, 4, 7], [7, 11, 14, 19]],
        'drive': [[0, 3, 7, 12], [0, 3, 7, 12], [-4, 0, 3, 8], [-2, 2, 5, 10]],
    }
    prog = progs.get(mood, progs['warm'])
    intro = float(meta.get('intro', 0.0))  # seconds before the beat drops
    outro = float(meta.get('outro', dur - 1.2))

    bed = meta.get('music')
    # Pads and bass per bar (only when no recorded bed is chosen)
    t = 0.0
    bi = 0
    while t < dur and not bed:
        chord = prog[bi % len(prog)]
        ln = int(min(bar, dur - t) * SR) + int(0.5 * SR)
        freqs = [hz(root + c - 12) for c in chord]
        place(music, pad_chord(freqs, ln), t, 0.32 if mood != 'calm' else 0.4)
        if t >= intro and mood != 'calm':
            bass = tone(hz(root + chord[0] - 36), ln, (1, .3)) * env_adsr(ln, 0.01, 0.2, 0.7, 0.2)
            place(music, bass, t, 0.5)
        t += bar
        bi += 1

    # Arpeggio for bright / drive
    if mood in ('bright', 'drive', 'warm') and not bed:
        step = beat / (4 if mood != 'warm' else 2)
        t = intro
        i = 0
        while t < outro:
            chord = prog[int(t / bar) % len(prog)]
            note = chord[[0, 1, 2, 3, 2, 1][i % 6]] + (12 if i % 12 >= 6 else 0)
            place(music, pluck(hz(root + note), int(0.4 * SR)), t, 0.16 if mood == 'warm' else 0.13)
            t += step
            i += 1

    # Drums
    if mood != 'calm' and not bed:
        t = intro
        k = 0
        while t < outro:
            if mood == 'drive' or k % 4 in (0, 2) or mood == 'bright':
                place(drums, kick(), t, 0.9)
            place(drums, hat(rng), t + beat / 2, 1.0)
            if k % 4 in (1, 3):
                place(drums, clap(rng), t, 0.7)
            t += beat
            k += 1

    # Effects at cues: a recorded take where the library has one, the synthesised sound otherwise.
    for n_cue, (at, kind) in enumerate(meta.get('cues', [])):
        at = float(at)
        rec = recorded(kind, at, n_cue)
        if rec is not None:
            place(sfx, rec[0], rec[1], 1.0)
        elif kind == 'whoosh':
            place(sfx, whoosh(rng), max(0, at - 0.3), 0.8)
        elif kind == 'riser':
            place(sfx, riser(rng), max(0, at - 1.4), 0.8)
        elif kind == 'hit':
            place(sfx, impact(rng), at, 0.9)
        elif kind == 'click':
            place(sfx, click(), at, 1.0)
        elif kind == 'pop':
            place(sfx, pop(), at, 1.0)
        elif kind == 'type':
            for j in range(10):
                place(sfx, typing(rng), at + j * 0.07 + rng.uniform(0, 0.02), 1.0)

    if bed:
        music = music_bed(bed, dur, float(meta.get('musicOffset', 0)))
        mix = music * 0.62 + sfx * 0.95
    else:
        mix = drums * 0.8 + music * 0.75 + sfx * 0.9
    vo = voice_track(meta.get('id', ''), n) if meta.get('vo') else None
    voice_led = vo is not None
    if voice_led:
        bedsig = music if bed else drums * 0.8 + music * 0.75
        mix = voice_led_mix(meta, dur, n, bedsig, sfx, vo)
        music = np.zeros(n)  # no widening copy: the bed is already levelled inside the mix
    # Fade in/out
    fi = int(0.05 * SR)
    mix[:fi] *= np.linspace(0, 1, fi)
    fo = int(1.0 * SR)
    mix[-fo:] *= np.linspace(1, 0, fo) ** 1.5
    if not voice_led:
        mix = np.tanh(mix * 0.9)
    # Simple stereo: music widened with a tiny delay, drums centred.
    d = int(0.011 * SR)
    left = mix + np.concatenate([np.zeros(d), music[:-d]]) * 0.08
    right = mix + np.concatenate([music[d:], np.zeros(d)]) * 0.08
    st = np.stack([left, right], axis=1)
    st = st / max(1e-6, np.max(np.abs(st))) * 0.7
    pcm = (st * 32767).astype(np.int16)
    with wave.open(out, 'wb') as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())


if __name__ == '__main__':
    main()
