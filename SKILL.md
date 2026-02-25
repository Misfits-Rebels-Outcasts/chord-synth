---
name: chord-synth
description: >
  Generate chord progression WAV audio files using a zero-dependency Node.js synthesizer.
  Use when user asks to create music, generate audio, make a chord progression, produce a WAV file,
  render a beat, create background music, generate a soundtrack, make an arpeggio,
  synthesize chords, or mentions terms like "chord progression", "WAV", "BPM", "arpeggio",
  "music generation", "audio file", "synthesizer", "backing track", "loop", or "beat".
  Supports 28 named presets (Pop, Jazz, Blues, Bossa Nova, Neo-Soul, EDM, Trance, Gospel),
  22 arpeggio patterns, 7 instruments, 11 drum patterns, slash chords, and transposition.
  Output: WAV PCM 16-bit mono 44100Hz.
---

# chord-synth

Generate chord progression WAV files. Zero dependencies, pure Node.js synthesis.

## When to activate

- User asks about chord progression generation
- User needs help to produce WAV files of chords
- User wants to create music, beats, loops, or backing tracks
- User mentions "arpeggio", "synthesizer", "BPM", or "chord progression"
- User asks to render, generate, or export audio files
- User needs background music or a soundtrack

## Quick Start

```bash
# Install once (if not already available)
npm install -g chord-synth

# Generate a WAV file
chord-synth --preset "C G Am F" --bpm 120 --output song.wav

# Custom jazz with slash chords
chord-synth --preset "Dm9 | G7/B | Cmaj7 | Am7/E" --instrument piano --drums bossanova --output jazz.wav

# Named preset transposed to key of G
chord-synth --preset "I-V-vi-IV (Pop)" --transpose 7 --output pop_in_G.wav

# Batch render from JSON file
chord-synth --batch render_jobs.json --output ./wavs/

# Discover all options (JSON)
chord-synth --schema
chord-synth --list
```

## Node.js Module Usage

When writing scripts or inline code to generate audio:

```javascript
const { renderJob, PRESETS, SCHEMA } = require('chord-synth');
const fs = require('fs');

// Render with a named preset
const wav = renderJob({ preset: "I-V-vi-IV (Pop)", bpm: 120, instrument: "piano" });
fs.writeFileSync('output.wav', wav);

// Render with custom chords — slash chords set bass note
const wav2 = renderJob({
  preset: "Dm9 | G7/B | Cmaj7 | Am7/E",
  bpm: 95,
  instrument: "guitar",
  pattern: 17,       // Alberti Bass
  drumPattern: "bossanova",
  swing: 0.66,
  enablePad: true,
  reverbMix: 0.25
});
fs.writeFileSync('bossa.wav', wav2);
```

## CLI Usage

```bash
# Single render
chord-synth --preset "Am F C G" --bpm 100 --instrument violin --output sad.wav

# Named preset with transpose
chord-synth --preset "ii-V-I (Jazz)" --transpose 5 --bpm 140 --output jazz_F.wav

# Full JSON input
chord-synth --json '{"preset":"Dm7 | G7 | Cmaj7","bpm":110,"pattern":18,"drumPattern":"swing"}' --output swing.wav

# Batch render from file
chord-synth --batch jobs.json --output ./output_dir/

# Validate batch without rendering
chord-synth --batch jobs.json --dry-run
```

## Batch Jobs Format

Create a JSON file with an array of job objects for `--batch`:

```json
[
  {
    "name": "pop_piano",
    "preset": "I-V-vi-IV (Pop)",
    "bpm": 120,
    "instrument": "piano",
    "pattern": 1
  },
  {
    "name": "jazz_guitar",
    "preset": "ii-V-I (Jazz)",
    "bpm": 140,
    "instrument": "guitar",
    "pattern": 17,
    "swing": 0.66,
    "drumPattern": "swing"
  }
]
```

## Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| preset | string | required | Named preset OR custom chords (`"C G Am/E F"`) |
| bpm | int | 120 | Tempo 30–300 |
| transpose | int | 0 | Semitones -11 to +11 |
| pattern | int | 1 | Arp pattern 0–21 (see below) |
| rate | string | "1/8" | Note rate: 1/1, 1/2, 1/4, 1/8, 1/16, 1/32 (+ triplets T) |
| instrument | string | "piano" | piano, guitar, bass, violin, flute, clarinet, cello |
| octaveRange | int | 1 | Octave span 1–4 |
| baseOctave | int | 3 | Starting octave 1–5 |
| velocity | int | 90 | MIDI velocity 1–127 |
| swing | float | 0.5 | 0.5=straight, 0.66=medium, 0.75=heavy |
| loops | int | 2 | Progression repetitions 1–16 |
| enablePad | bool | true | Sustained pad chord layer |
| padVolume | float | 0.12 | Pad volume 0–0.3 |
| enableBass | bool | true | Auto bass line |
| enableDrums | bool | true | Drum track |
| drumPattern | string | "poprock" | 8beat, 16beat, poprock, acousticpop, bossanova, swing, funk, rnb, waltz, arpeggio, none |
| beatsPerChord | int | 4 | Beats per chord 1–16 |
| reverbMix | float | 0.18 | Reverb 0–0.5 |

## Named Presets (28)

Use exact name string as `preset` value:

**Pop/Rock:** I-V-vi-IV (Pop), I-vi-IV-V (50s), vi-IV-I-V (Sad), I-IV-V-IV (Rock), I-V-vi-iii-IV (Canon)
**Jazz:** ii-V-I (Jazz), I-vi-ii-V (Jazz Turnaround), iii-vi-ii-V (Coltrane), Autumn Leaves, So What, Steely Dan
**Neo-Soul/R&B:** Neo-Soul I, Neo-Soul II, R&B Smooth
**Blues:** 12-Bar Blues, Minor Blues
**Latin:** Bossa Nova, Girl from Ipanema
**Modal:** Dorian Vamp, Lydian Float, Ambient Pads
**EDM:** EDM Anthem, Trance, House
**Classic:** Pachelbel Canon, Andalusian Cadence, Royal Road (JP), Gospel

## Arp Patterns (22)

| Index | Name |
|-------|------|
| 0 | Chord (Block) |
| 1 | Up |
| 2 | Down |
| 3 | Up-Down |
| 7 | Random |
| 13 | 1-3-5-3 |
| 15 | 1-5-8-5 |
| 17 | Alberti Bass (1-5-3-5) |
| 18 | Stride (Root-Chord) |
| 20 | Pedal Tone |
| 21 | Alternating Bass |

Other patterns: 4=Down-Up, 5=Up-Down (No Repeat), 6=Down-Up (No Repeat), 8=Random Walk, 9=Outside-In, 10=Inside-Out, 11=Pinky-Thumb, 12=Thumb-Pinky, 14=1-5-3-5, 16=1-3-5-8-5-3, 19=Broken 3rds

## Chord Notation

Custom chord strings support: roots (C, C#, Db, D…B), qualities (m, 7, maj7, m7, dim, aug, sus2, sus4, 9, m9, maj9, 7b5, m7b5), slash bass (Am/E, G7/B), separators (space or `|` with optional whitespace).

Examples: `"Dm9 | G7/B | Cmaj7 | Am7/E"`, `"C G Am F"`, `"F#m7 B7 Emaj7"`

## Output Format

WAV PCM 16-bit mono 44100 Hz. Typical file size: ~1.4 MB for 2 loops at 120 BPM with 4-chord progression.

## Recommended Combos

For jazz: pattern 17 (Alberti) or 18 (Stride), swing 0.66, drumPattern "swing"
For latin: drumPattern "bossanova", swing 0.58, pattern 1 (Up)
For ambient: pattern 0 (Block), rate "1/1", enableDrums false, reverbMix 0.4
For EDM: pattern 1 (Up), rate "1/16", enablePad true, drumPattern "16beat"
