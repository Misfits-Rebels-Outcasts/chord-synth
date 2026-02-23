#!/usr/bin/env node
/**
 * chord-synth CLI
 * 
 * Self-describing command-line interface for autonomous agents and humans.
 * Run with --schema to get full JSON parameter spec.
 * 
 * Usage:
 *   chord-synth --schema                          # JSON schema (agent-readable)
 *   chord-synth --list                             # all options as JSON
 *   chord-synth --preset "C G Am/E F" --bpm 120    # render single file
 *   chord-synth --json '{"preset":"Am F C G"}'     # render from inline JSON
 *   chord-synth --batch render_jobs.json            # batch render from file
 *   chord-synth --batch render_jobs.json --dry-run  # validate without rendering
 */

'use strict';

const fs = require('fs');
const path = require('path');
const engine = require('../lib/synth-engine');

const args = process.argv.slice(2);

// ── Subcommand: "mcp" launches the MCP server ──
if (args[0] === 'mcp') {
  require('../mcp-server.js');
} else {

function flag(name) { return args.includes('--' + name); }
function flagVal(name) {
  const i = args.indexOf('--' + name);
  return i >= 0 && i + 1 < args.length ? args[i + 1] : null;
}
function flagNum(name, def) { const v = flagVal(name); return v !== null ? Number(v) : def; }

// ── --schema: machine-readable parameter specification ──
if (flag('schema')) {
  const spec = {
    tool: "chord-synth",
    version: require('../package.json').version,
    description: "Generate chord progression WAV files. Renders arpeggio patterns with configurable instruments, drums, pads, and effects. Supports 28 named presets, 22 arp patterns, 7 instruments, slash chords (Am/E), and transposition.",
    input_schema: engine.SCHEMA,
    output: { type: "file", format: "WAV PCM 16-bit mono 44100Hz" },
    examples: [
      { description: "Pop piano arpeggio", args: { preset: "I-V-vi-IV (Pop)", bpm: 120, instrument: "piano", pattern: 1 } },
      { description: "Custom jazz with slash chords", args: { preset: "Dm9 | G7/B | Cmaj7 | Am7/E", bpm: 92, instrument: "piano", pattern: 17, swing: 0.62 } },
      { description: "Ambient pad wash, no drums", args: { preset: "Cmaj9 Am9 Fmaj9 Gsus4", bpm: 55, enableDrums: false, padVolume: 0.24, reverbMix: 0.35 } },
      { description: "Transposed to key of G", args: { preset: "I-V-vi-IV (Pop)", transpose: 7, bpm: 120 } }
    ]
  };
  process.stdout.write(JSON.stringify(spec, null, 2) + '\n');
  process.exit(0);
}

// ── --list: all available options as JSON ──
if (flag('list')) {
  process.stdout.write(JSON.stringify({
    presets: engine.PRESETS,
    patterns: engine.PATTERNS,
    instruments: engine.INSTRUMENTS,
    drums: engine.DRUMS,
    rates: engine.RATES
  }, null, 2) + '\n');
  process.exit(0);
}

// ── --help: human-readable ──
if (flag('help') || flag('h') || args.length === 0) {
  console.log(`
chord-synth — Generate chord progression WAV files

AGENT COMMANDS (machine-readable output):
  --schema              Full JSON tool specification with parameter schema
  --list                All available presets, patterns, instruments, drums as JSON
  mcp                   Launch as MCP server (stdio JSON-RPC for Claude/Cursor/etc)

RENDER COMMANDS:
  --preset "chords"     Named preset or custom chords (required for single render)
  --bpm N               Tempo (default: 120)
  --instrument NAME     piano|guitar|violin|flute|clarinet|cello (default: piano)
  --pattern N           Arp pattern 0-21 (default: 1=Up)
  --rate RATE           1/8, 1/16, 1/4, etc (default: 1/8)
  --transpose N         Semitones -11 to +11 (default: 0)
  --drums PATTERN       poprock|swing|bossanova|funk|rnb|8beat|none (default: poprock)
  --loops N             Repetitions (default: 2)
  --output FILE         Output WAV path (default: ./output.wav)
  --json '{"key":"val"}' Full job as inline JSON
  --batch FILE          Batch render from JSON array file
  --dry-run             Validate batch file without rendering

QUICK EXAMPLES:
  chord-synth --preset "C G Am F" --bpm 120 --output pop.wav
  chord-synth --preset "ii-V-I (Jazz)" --instrument piano --drums swing --swing 0.62
  chord-synth --json '{"preset":"Am F C/G G","bpm":100,"instrument":"violin"}'
  chord-synth --batch render_jobs.json --output ./wavs/
  chord-synth --schema | jq .input_schema    # agent: read parameter spec
  chord-synth mcp                             # start MCP server on stdio
`);
  process.exit(0);
}

// ── --batch: batch render from JSON file ──
const batchFile = flagVal('batch');
if (batchFile) {
  if (!fs.existsSync(batchFile)) { console.error(`File not found: ${batchFile}`); process.exit(1); }
  const jobs = JSON.parse(fs.readFileSync(batchFile, 'utf8'));
  const arr = Array.isArray(jobs) ? jobs : (jobs.RENDER_JOBS || jobs.jobs || [jobs]);
  const outDir = flagVal('output') || (jobs.OUTPUT_DIR || './output');
  const dryRun = flag('dry-run');

  if (dryRun) {
    console.log(JSON.stringify({ valid: true, jobs: arr.length, output_dir: outDir }));
    process.exit(0);
  }

  fs.mkdirSync(outDir, { recursive: true });
  console.error(`Rendering ${arr.length} jobs to ${outDir}...`);
  const results = [];
  for (let i = 0; i < arr.length; i++) {
    const job = arr[i];
    const filename = job.filename || `${String(i + 1).padStart(3, '0')}_output.wav`;
    console.error(`[${i + 1}/${arr.length}] ${filename}`);
    const wavData = engine.renderJob(job);
    const outPath = path.join(outDir, filename);
    fs.writeFileSync(outPath, wavData);
    results.push({ filename, path: outPath, size: wavData.length });
  }
  // Output structured result to stdout (agent reads this)
  process.stdout.write(JSON.stringify({ rendered: results.length, files: results }) + '\n');
  process.exit(0);
}

// ── --json: inline JSON render ──
const jsonStr = flagVal('json');
if (jsonStr) {
  const job = JSON.parse(jsonStr);
  const outFile = flagVal('output') || 'output.wav';
  fs.mkdirSync(path.dirname(path.resolve(outFile)), { recursive: true });
  const wavData = engine.renderJob(job);
  fs.writeFileSync(outFile, wavData);
  process.stdout.write(JSON.stringify({ file: outFile, size: wavData.length }) + '\n');
  process.exit(0);
}

// ── --preset: single render from flags ──
const preset = flagVal('preset');
if (preset) {
  const job = {
    preset,
    bpm:            flagNum('bpm', 120),
    transpose:      flagNum('transpose', 0),
    pattern:        flagNum('pattern', 1),
    rate:           flagVal('rate') || '1/8',
    instrument:     flagVal('instrument') || 'piano',
    octaveRange:    flagNum('octave-range', 1),
    baseOctave:     flagNum('base-octave', 3),
    gatePercent:    flagNum('gate', 0.9),
    velocity:       flagNum('velocity', 90),
    velRandom:      flagNum('vel-random', 5),
    accentEvery:    flagNum('accent-every', 4),
    accentAmount:   flagNum('accent-amount', 20),
    firstBeatAccent: !flag('no-first-accent'),
    swing:          flagNum('swing', 0.5),
    loops:          flagNum('loops', 2),
    enablePad:      !flag('no-pad'),
    padOctave:      flagNum('pad-octave', 4),
    padVolume:      flagNum('pad-volume', 0.12),
    enableBass:     !flag('no-bass'),
    enableDrums:    !flag('no-drums'),
    drumPattern:    flagVal('drums') || 'poprock',
    reverbMix:      flagNum('reverb', 0.18),
    masterVolume:   flagNum('volume', 0.85),
    beatsPerChord:  flagNum('beats-per-chord', undefined),
  };

  const outFile = flagVal('output') || 'output.wav';
  fs.mkdirSync(path.dirname(path.resolve(outFile)), { recursive: true });
  const wavData = engine.renderJob(job);
  fs.writeFileSync(outFile, wavData);
  process.stdout.write(JSON.stringify({ file: outFile, size: wavData.length, preset, bpm: job.bpm }) + '\n');
  process.exit(0);
}

console.error('No action specified. Run with --help or --schema.');
process.exit(1);

} // end else (not mcp)
