# chord-synth

Generate chord progression WAV files. Zero dependencies. Node.js only.

28 named presets, 22 arpeggio patterns, 7 instruments, slash chords (`Am/E`), transposition, pad/bass/drum tracks, reverb.

## Quick Start

```bash
# Install globally
npm install -g chord-synth

# Generate a WAV file
chord-synth --preset "C G Am F" --bpm 120 --output pop.wav

# Custom jazz with slash chords
chord-synth --preset "Dm9 | G7/B | Cmaj7 | Am7/E" --instrument piano --drums bossanova --output jazz.wav

# Named preset transposed to key of G
chord-synth --preset "I-V-vi-IV (Pop)" --transpose 7 --output pop_in_G.wav

# Batch render from JSON file
chord-synth --batch render_jobs.json --output ./wavs/
```

## Use as MCP Server

Exposes `generate_wav` and `list_options` tools to any MCP-compatible agent (Claude Desktop, Claude Code, Cursor, Windsurf, etc).

**Claude Desktop** — add to `claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "chord-synth": {
      "command": "node",
      "args": ["/path/to/chord-synth/mcp-server.js"]
    }
  }
}
```

**Claude Code:**
```bash
# Install globally
npm install -g chord-synth

# Add to Claude Code (point to the installed mcp-server.js)
claude mcp add chord-synth -- node $(npm root -g)/chord-synth/mcp-server.js
```

Then ask Claude: *"Generate a sad violin arpeggio over Am F C G at 80 BPM"* — it will call `generate_wav` directly.

## Use as Node.js Module

```javascript
const { renderJob, PRESETS, SCHEMA } = require('chord-synth');
const fs = require('fs');

// Render a WAV buffer
const wav = renderJob({
  preset: "C G Am/E F",
  bpm: 120,
  instrument: "piano",
  pattern: 1,        // Up
  enablePad: true,
  drumPattern: "poprock"
});

fs.writeFileSync('output.wav', wav);
```

## Agent Interface

Agents should call `chord-synth --schema` to get the full JSON tool specification:

```bash
chord-synth --schema
```

Returns:
```json
{
  "tool": "chord-synth",
  "description": "Generate chord progression WAV files...",
  "input_schema": {
    "type": "object",
    "required": ["preset"],
    "properties": {
      "preset": { "type": "string", "description": "Named preset or custom chords..." },
      "bpm": { "type": "integer", "default": 120 },
      "instrument": { "type": "string", "enum": ["piano","guitar","violin",...] },
      ...
    }
  },
  "examples": [...]
}
```

List all available options:
```bash
chord-synth --list
```

## Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `preset` | string | *required* | Named preset (`"I-V-vi-IV (Pop)"`) or custom chords (`"C G Am/E F"`) |
| `bpm` | int | 120 | Tempo |
| `transpose` | int | 0 | Semitones (-11 to +11) |
| `pattern` | int | 1 | Arp pattern index (see below) |
| `rate` | string | `"1/8"` | Note rate: `1/1` `1/2` `1/4` `1/8` `1/16` `1/32` (add T for triplet) |
| `instrument` | string | `"piano"` | `piano` `guitar` `violin` `flute` `clarinet` `cello` `bass` |
| `octaveRange` | int | 1 | 1-4 octave span |
| `baseOctave` | int | 3 | Starting MIDI octave |
| `velocity` | int | 90 | MIDI velocity 1-127 |
| `swing` | float | 0.5 | 0.5=straight, 0.66=medium, 0.75=heavy |
| `loops` | int | 2 | Progression repetitions |
| `enablePad` | bool | true | Sustained pad chord track |
| `padOctave` | int | 4 | Pad voicing octave |
| `padVolume` | float | 0.12 | Pad volume (0.0-0.3) |
| `enableBass` | bool | true | Auto bass (slash chords set bass note) |
| `enableDrums` | bool | true | Drum track |
| `drumPattern` | string | `"poprock"` | See drum patterns below |
| `reverbMix` | float | 0.18 | Reverb amount (0.0-0.5) |

## Named Presets

| Category | Presets |
|----------|---------|
| Pop/Rock | `I-V-vi-IV (Pop)`, `I-vi-IV-V (50s)`, `vi-IV-I-V (Sad)`, `I-IV-V-IV (Rock)`, `I-V-vi-iii-IV (Canon)` |
| Jazz | `ii-V-I (Jazz)`, `I-vi-ii-V (Jazz Turnaround)`, `iii-vi-ii-V (Coltrane)`, `Autumn Leaves`, `So What`, `Steely Dan` |
| Neo-Soul/R&B | `Neo-Soul I`, `Neo-Soul II`, `R&B Smooth` |
| Blues | `12-Bar Blues`, `Minor Blues` |
| Latin | `Bossa Nova`, `Girl from Ipanema`, `Andalusian Cadence`, `Royal Road (JP)` |
| Modal/Ambient | `Dorian Vamp`, `Lydian Float`, `Ambient Pads` |
| EDM | `EDM Anthem`, `Trance`, `House` |
| Classic | `Pachelbel Canon`, `Gospel` |

Or use any custom chord string: `"Fmaj7 Em7 Dm9 Cmaj7"`, `"Am | Dm/F | E7 | Am"`, etc.

## Arp Patterns

| Index | Name | Index | Name |
|-------|------|-------|------|
| 0 | Chord (Block) | 11 | Pinky-Thumb |
| 1 | Up | 12 | Thumb-Pinky |
| 2 | Down | 13 | 1-3-5-3 |
| 3 | Up-Down | 14 | 1-5-3-5 |
| 4 | Down-Up | 15 | 1-5-8-5 |
| 5 | Up-Down (No Repeat) | 16 | 1-3-5-8-5-3 |
| 6 | Down-Up (No Repeat) | 17 | Alberti Bass |
| 7 | Random | 18 | Stride |
| 8 | Random Walk | 19 | Broken 3rds |
| 9 | Outside-In | 20 | Pedal Tone |
| 10 | Inside-Out | 21 | Alternating Bass |

## Drum Patterns

`8beat` `16beat` `poprock` `acousticpop` `bossanova` `swing` `funk` `rnb` `waltz` `arpeggio` `none`

## Chord Notation

Roots: `C C# Db D D# Eb E F F# Gb G G# Ab A A# Bb B`

Qualities: `(major)` `m` `7` `maj7` `m7` `dim` `aug` `sus2` `sus4` `9` `m9` `maj9` `11` `m11` `13` `6` `m6` `dim7` `m7b5` `add9` `5` `power`

Slash chords: `Am/E` (Am chord, E bass note), `C/G`, `Dm7/A`

Separator: spaces or `|` both work. `C G Am F` = `C | G | Am | F`

## Output

WAV PCM 16-bit mono 44100 Hz. Compatible with all DAWs, audio players, and audio processing tools.

## License

MIT
