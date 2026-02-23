/**
 * chord-synth engine module
 * Core synthesis engine: MIDI arpeggiator + WAV renderer.
 * 
 * const { renderJob, SCHEMA, PRESETS } = require('chord-synth');
 * const wavBuf = renderJob({ preset: "C G Am/E F", bpm: 120 });
 * fs.writeFileSync('out.wav', wavBuf);
 */
'use strict';
const SAMPLE_RATE = 44100;

// ════════════════════════════════════════════════════════════════════════
// SECTION 1: MIDI ARPEGGIATOR ENGINE (ported from Logic Pro Scripter)
// ════════════════════════════════════════════════════════════════════════

const NoteMap = {
  "C": 0, "C#": 1, "Db": 1, "D": 2, "D#": 3, "Eb": 3,
  "E": 4, "F": 5, "F#": 6, "Gb": 6, "G": 7, "G#": 8,
  "Ab": 8, "A": 9, "A#": 10, "Bb": 10, "B": 11
};

const NoteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

const ChordPatterns = {
  "": [0, 4, 7], "maj": [0, 4, 7], "M": [0, 4, 7],
  "m": [0, 3, 7], "min": [0, 3, 7], "-": [0, 3, 7],
  "dim": [0, 3, 6], "aug": [0, 4, 8], "+": [0, 4, 8],
  "sus2": [0, 2, 7], "sus4": [0, 5, 7], "sus": [0, 5, 7],
  "7": [0, 4, 7, 10], "dom7": [0, 4, 7, 10],
  "maj7": [0, 4, 7, 11], "M7": [0, 4, 7, 11],
  "m7": [0, 3, 7, 10], "min7": [0, 3, 7, 10], "-7": [0, 3, 7, 10],
  "dim7": [0, 3, 6, 9], "m7b5": [0, 3, 6, 10],
  "add9": [0, 4, 7, 14], "madd9": [0, 3, 7, 14],
  "6": [0, 4, 7, 9], "m6": [0, 3, 7, 9],
  "9": [0, 4, 7, 10, 14], "m9": [0, 3, 7, 10, 14],
  "maj9": [0, 4, 7, 11, 14], "M9": [0, 4, 7, 11, 14],
  "11": [0, 4, 7, 10, 14, 17], "m11": [0, 3, 7, 10, 14, 17],
  "13": [0, 4, 7, 10, 14, 17, 21],
  "5": [0, 7], "power": [0, 7, 12]
};

const RateValues = { 
  "1/1": 4, "1/2": 2, "1/2T": 1.333, "1/4": 1, "1/4T": 0.667,
  "1/8": 0.5, "1/8T": 0.333, "1/16": 0.25, "1/16T": 0.167, "1/32": 0.125
};

const ArpPatternNames = [
  "Chord (Block)", "Up", "Down", "Up-Down", "Down-Up",
  "Up-Down (No Repeat)", "Down-Up (No Repeat)", "Random", "Random Walk",
  "Outside-In", "Inside-Out", "Pinky-Thumb", "Thumb-Pinky",
  "1-3-5-3", "1-5-3-5", "1-5-8-5", "1-3-5-8-5-3",
  "Alberti Bass (1-5-3-5)", "Stride (Root-Chord)", "Broken 3rds",
  "Pedal Tone", "Alternating Bass"
];

const PrebuiltProgressions = [
  { name: "Custom", chords: "", beats: 4 },
  { name: "I-V-vi-IV (Pop)", chords: "C | G | Am | F", beats: 4 },
  { name: "I-vi-IV-V (50s)", chords: "C | Am | F | G", beats: 4 },
  { name: "vi-IV-I-V (Sad)", chords: "Am | F | C | G", beats: 4 },
  { name: "I-IV-V-IV (Rock)", chords: "C | F | G | F", beats: 4 },
  { name: "I-V-vi-iii-IV (Canon)", chords: "C | G | Am | Em | F | C | F | G", beats: 2 },
  { name: "ii-V-I (Jazz)", chords: "Dm7 | G7 | Cmaj7 | Cmaj7", beats: 4 },
  { name: "I-vi-ii-V (Jazz Turnaround)", chords: "Cmaj7 | Am7 | Dm7 | G7", beats: 2 },
  { name: "iii-vi-ii-V (Coltrane)", chords: "Em7 | A7 | Dm7 | G7", beats: 2 },
  { name: "Autumn Leaves", chords: "Am7 | D7 | Gmaj7 | Cmaj7 | F#m7b5 | B7 | Em7 | Em7", beats: 4 },
  { name: "So What", chords: "Dm7 | Dm7 | Dm7 | Dm7 | Ebm7 | Ebm7 | Dm7 | Dm7", beats: 4 },
  { name: "Neo-Soul I", chords: "Fmaj9 | Em7 | Dm9 | Cmaj7", beats: 4 },
  { name: "Neo-Soul II", chords: "Gmaj9 | F#m7 | Bm7 | Am9", beats: 4 },
  { name: "R&B Smooth", chords: "Cmaj7 | Bm7 | Am7 | Gmaj7", beats: 4 },
  { name: "12-Bar Blues", chords: "A7 | A7 | A7 | A7 | D7 | D7 | A7 | A7 | E7 | D7 | A7 | E7", beats: 4 },
  { name: "Minor Blues", chords: "Am7 | Am7 | Dm7 | Dm7 | Am7 | E7 | Am7 | E7", beats: 4 },
  { name: "Bossa Nova", chords: "Cmaj7 | C#dim7 | Dm7 | G7", beats: 4 },
  { name: "Girl from Ipanema", chords: "Fmaj7 | Fmaj7 | G7 | G7 | Gm7 | Gb7 | Fmaj7 | Gb7", beats: 4 },
  { name: "Dorian Vamp", chords: "Dm7 | G7 | Dm7 | G7", beats: 4 },
  { name: "Lydian Float", chords: "Cmaj7 | D | Cmaj7 | D", beats: 4 },
  { name: "Ambient Pads", chords: "Cmaj9 | Am9 | Fmaj9 | Gsus4", beats: 8 },
  { name: "EDM Anthem", chords: "Am | F | C | G", beats: 4 },
  { name: "Trance", chords: "Am | G | F | Em", beats: 4 },
  { name: "House", chords: "Cm | Gm | Bb | F", beats: 4 },
  { name: "Pachelbel Canon", chords: "C | G | Am | Em | F | C | F | G", beats: 2 },
  { name: "Andalusian Cadence", chords: "Am | G | F | E", beats: 4 },
  { name: "Royal Road (JP)", chords: "F | G | Em | Am", beats: 4 },
  { name: "Steely Dan", chords: "Cmaj7 | Bm7b5 E7 | Am7 | Gm7 C7 | Fmaj7 | Fm7 Bb7 | Em7 A7 | Dm7 G7", beats: 2 },
  { name: "Gospel", chords: "C | C7 | F | Fm | C | G7 | C | G7", beats: 4 }
];

// ── Chord parsing with slash chord support ──

function parseChordMidi(str) {
  str = str.trim();
  if (!str || str === "|") return null;

  // Handle slash chords: "Am/E" → Am chord with E bass note
  let bassNote = null;
  let chordPart = str;
  const slashIdx = str.indexOf('/');
  if (slashIdx > 0) {
    const bassPart = str.substring(slashIdx + 1);
    chordPart = str.substring(0, slashIdx);
    let bassRoot = bassPart.charAt(0).toUpperCase();
    if (bassPart.length > 1 && (bassPart.charAt(1) === '#' || bassPart.charAt(1) === 'b')) {
      bassRoot += bassPart.charAt(1);
    }
    if (NoteMap[bassRoot] !== undefined) bassNote = NoteMap[bassRoot];
  }

  let root = chordPart.charAt(0).toUpperCase();
  let idx = 1;
  if (chordPart.length > 1 && (chordPart.charAt(1) === "#" || chordPart.charAt(1) === "b")) {
    root += chordPart.charAt(1); idx = 2;
  }
  if (NoteMap[root] === undefined) return null;
  const quality = chordPart.substring(idx);
  const intervals = ChordPatterns[quality] || ChordPatterns[quality.toLowerCase()] || [0, 4, 7];
  return {
    name: str, root: NoteMap[root], intervals: intervals.slice(), quality,
    bassNote: bassNote !== null ? bassNote : NoteMap[root]
  };
}

function parseProgression(str) {
  return str.replace(/\|/g, " | ").split(/\s+/)
    .filter(s => s.length > 0 && s !== "|")
    .map(parseChordMidi).filter(c => c);
}

function applyTranspose(chord, semitones) {
  if (semitones === 0) return chord;
  const newRoot = (chord.root + semitones + 12) % 12;
  const newBass = ((chord.bassNote ?? chord.root) + semitones + 12) % 12;
  // Rebuild display name
  let qualStr = chord.quality || '';
  let displayName = NoteNames[newRoot] + qualStr;
  if ((chord.bassNote ?? chord.root) !== chord.root) {
    // Was a slash chord — show transposed bass
    displayName += '/' + NoteNames[newBass];
  }
  return { ...chord, name: displayName, root: newRoot, bassNote: newBass };
}

// ── Arp pattern builder (all 22 patterns from Logic Pro script) ──

function buildArpSequence(chord, octaveRange, baseOctave, pattern) {
  const basePitch = (baseOctave + 1) * 12 + chord.root;
  const notes = [];
  for (let oct = 0; oct < octaveRange; oct++) {
    for (const interval of chord.intervals) {
      const pitch = basePitch + interval + (oct * 12);
      if (pitch >= 0 && pitch <= 127) notes.push(pitch);
    }
  }
  if (notes.length === 0) return [];

  let sequence = [], temp, mid, left, right;
  switch (pattern) {
    case 0: sequence = [notes.slice()]; break;
    case 1: sequence = notes.slice(); break;
    case 2: sequence = notes.slice().reverse(); break;
    case 3: sequence = notes.slice().concat(notes.slice().reverse()); break;
    case 4: sequence = notes.slice().reverse().concat(notes.slice()); break;
    case 5:
      sequence = notes.slice();
      if (notes.length > 2) sequence = sequence.concat(notes.slice(1, -1).reverse());
      break;
    case 6:
      sequence = notes.slice().reverse();
      if (notes.length > 2) sequence = sequence.concat(notes.slice(1, -1));
      break;
    case 7:
      sequence = notes.slice();
      for (let j = sequence.length - 1; j > 0; j--) {
        const k = Math.floor(Math.random() * (j + 1));
        [sequence[j], sequence[k]] = [sequence[k], sequence[j]];
      }
      break;
    case 8:
      sequence = [];
      let cur = Math.floor(notes.length / 2);
      for (let j = 0; j < notes.length * 2; j++) {
        sequence.push(notes[cur]);
        cur = Math.max(0, Math.min(notes.length - 1, cur + (Math.random() < 0.5 ? -1 : 1)));
      }
      break;
    case 9:
      temp = notes.slice(); sequence = [];
      while (temp.length > 0) { if (temp.length > 0) sequence.push(temp.shift()); if (temp.length > 0) sequence.push(temp.pop()); }
      break;
    case 10:
      temp = notes.slice(); sequence = []; mid = Math.floor(temp.length / 2); left = mid - 1; right = mid;
      while (left >= 0 || right < temp.length) {
        if (right < temp.length) sequence.push(temp[right++]);
        if (left >= 0) sequence.push(temp[left--]);
      }
      break;
    case 11:
      sequence = [];
      for (let j = 0; j < Math.ceil(notes.length / 2); j++) {
        const hi = notes.length - 1 - j, lo = j;
        if (hi >= lo) { sequence.push(notes[hi]); if (hi !== lo) sequence.push(notes[lo]); }
      }
      break;
    case 12:
      sequence = [];
      for (let j = 0; j < Math.ceil(notes.length / 2); j++) {
        const lo = j, hi = notes.length - 1 - j;
        if (lo <= hi) { sequence.push(notes[lo]); if (lo !== hi) sequence.push(notes[hi]); }
      }
      break;
    case 13: sequence = notes.length >= 3 ? [notes[0], notes[1], notes[2], notes[1]] : notes.slice(); break;
    case 14: case 17: sequence = notes.length >= 3 ? [notes[0], notes[2], notes[1], notes[2]] : notes.slice(); break;
    case 15: {
      const octUp = notes[0] + 12;
      sequence = notes.length >= 3 ? [notes[0], notes[2], octUp <= 127 ? octUp : notes[0], notes[2]] : notes.slice();
      break;
    }
    case 16: {
      const oc = Math.min(notes[0] + 12, 127);
      sequence = notes.length >= 3 ? [notes[0], notes[1], notes[2], oc, notes[2], notes[1]] : notes.slice();
      break;
    }
    case 18:
      sequence = notes.length >= 2 ? [notes[0], notes.slice(1)] : notes.slice();
      break;
    case 19:
      sequence = [];
      for (let j = 0; j < notes.length - 1; j++) { sequence.push(notes[j]); sequence.push(notes[j + 1]); }
      break;
    case 20:
      sequence = [];
      for (let j = 1; j < notes.length; j++) { sequence.push(notes[0]); sequence.push(notes[j]); }
      break;
    case 21:
      sequence = notes.length >= 3 ? [notes[0], notes[2], notes[0], notes[2]] : notes.slice();
      break;
    default: sequence = notes.slice();
  }
  return sequence;
}

// ── MIDI event generator ──

function generateMidiEvents(config) {
  const {
    progression, beatsPerChord, bpm, transpose = 0,
    pattern = 1, rate = "1/8", octaveRange = 1, baseOctave = 3,
    gatePercent = 0.9, velocity = 90, velRandom = 5,
    accentEvery = 4, accentAmount = 20, firstBeatAccent = true,
    swing = 0.5, loops = 1
  } = config;

  const rawChords = parseProgression(progression);
  if (rawChords.length === 0) return { events: [], duration: 0, chords: [] };

  // Apply transpose globally — pad, bass, and display all see transposed chords
  const chords = rawChords.map(c => applyTranspose(c, transpose));

  const stepLength = RateValues[rate] || 0.5;
  const beatDuration = 60 / bpm;
  const stepDur = stepLength * beatDuration;

  const totalChordsBeats = chords.length * beatsPerChord;
  const totalBeats = totalChordsBeats * loops;
  const totalDuration = totalBeats * beatDuration;
  const totalSteps = Math.floor(totalBeats / stepLength);

  const events = [];
  let stepCounter = 0;

  for (let step = 0; step < totalSteps; step++) {
    const beatPos = step * stepLength;
    const loopBeat = beatPos % totalChordsBeats;
    const chordIdx = Math.floor(loopBeat / beatsPerChord) % chords.length;
    const isFirstBeatOfChord = (Math.floor(loopBeat / stepLength) % Math.floor(beatsPerChord / stepLength)) === 0;

    const chord = chords[chordIdx];
    const arpSeq = buildArpSequence(chord, octaveRange, baseOctave, pattern);
    if (arpSeq.length === 0) continue;

    const arpIdx = step % arpSeq.length;
    let pitches = arpSeq[arpIdx];
    if (!Array.isArray(pitches)) pitches = [pitches];

    let vel = velocity;
    if (velRandom > 0) vel += Math.floor(Math.random() * velRandom * 2) - velRandom;
    if (accentEvery > 0 && stepCounter % accentEvery === 0) vel += accentAmount;
    if (firstBeatAccent && isFirstBeatOfChord) vel += Math.floor(accentAmount * 0.5);
    vel = Math.max(1, Math.min(127, vel));

    let time = step * stepDur;
    if (step % 2 === 1 && swing > 0.5) time += (swing - 0.5) * 2 * stepDur;

    events.push({ time, pitches, velocity: vel, duration: stepDur * gatePercent, chordName: chord.name, chordIdx });
    stepCounter++;
  }

  return { events, duration: totalDuration, chords };
}


// ════════════════════════════════════════════════════════════════════════
// SECTION 2: WAV SYNTHESIS ENGINE
// ════════════════════════════════════════════════════════════════════════

function generateWaveform(type, phase) {
  const p = ((phase % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
  switch (type) {
    case 'sine': return Math.sin(p);
    case 'sawtooth': return 2 * (p / (2 * Math.PI)) - 1;
    case 'square': return p < Math.PI ? 1 : -1;
    case 'triangle': { const t = p / (2 * Math.PI); return t < 0.25 ? 4*t : t < 0.75 ? 2-4*t : -4+4*t; }
    default: return Math.sin(p);
  }
}

class BiquadFilter {
  constructor(type, freq, Q, sr, gain = 0) {
    this.x1=0;this.x2=0;this.y1=0;this.y2=0;
    const w0=2*Math.PI*freq/sr, cosw0=Math.cos(w0), sinw0=Math.sin(w0), alpha=sinw0/(2*Q);
    let b0,b1,b2,a0,a1,a2;
    switch(type){
      case'lowpass':b0=(1-cosw0)/2;b1=1-cosw0;b2=(1-cosw0)/2;a0=1+alpha;a1=-2*cosw0;a2=1-alpha;break;
      case'highpass':b0=(1+cosw0)/2;b1=-(1+cosw0);b2=(1+cosw0)/2;a0=1+alpha;a1=-2*cosw0;a2=1-alpha;break;
      case'bandpass':b0=alpha;b1=0;b2=-alpha;a0=1+alpha;a1=-2*cosw0;a2=1-alpha;break;
      case'peaking':{const A=Math.pow(10,gain/40);b0=1+alpha*A;b1=-2*cosw0;b2=1-alpha*A;a0=1+alpha/A;a1=-2*cosw0;a2=1-alpha/A;break;}
      default:b0=1;b1=0;b2=0;a0=1;a1=0;a2=0;
    }
    this.b0=b0/a0;this.b1=b1/a0;this.b2=b2/a0;this.a1=a1/a0;this.a2=a2/a0;
  }
  process(x){const y=this.b0*x+this.b1*this.x1+this.b2*this.x2-this.a1*this.y1-this.a2*this.y2;this.x2=this.x1;this.x1=x;this.y2=this.y1;this.y1=y;return y;}
  processBuffer(buf){for(let i=0;i<buf.length;i++)buf[i]=this.process(buf[i]);return buf;}
}

function compress(buffer, threshold=-24, ratio=4, attack=0.003, release=0.25) {
  const tL=Math.pow(10,threshold/20),aC=Math.exp(-1/(attack*SAMPLE_RATE)),rC=Math.exp(-1/(release*SAMPLE_RATE));
  let env=0;
  for(let i=0;i<buffer.length;i++){
    const a=Math.abs(buffer[i]);env=a>env?aC*env+(1-aC)*a:rC*env+(1-rC)*a;
    if(env>tL)buffer[i]*=tL*Math.pow(env/tL,1/ratio-1)/Math.max(env,0.0001);
  }
  return buffer;
}

function applyAlgorithmicReverb(input, decayTime=2.0, mix=0.18) {
  const out=new Float32Array(input.length);
  const cD=[1557,1617,1491,1422].map(d=>Math.floor(d*SAMPLE_RATE/44100));
  const aD=[225,556].map(d=>Math.floor(d*SAMPLE_RATE/44100));
  const cB=cD.map(d=>({buf:new Float32Array(d),idx:0,len:d}));
  const cF=cD.map(d=>Math.pow(0.001,d/(decayTime*SAMPLE_RATE)));
  const aB=aD.map(d=>({buf:new Float32Array(d),idx:0,len:d}));
  for(let i=0;i<input.length;i++){
    let cs=0;
    for(let c=0;c<cB.length;c++){const cb=cB[c];const del=cb.buf[cb.idx];cb.buf[cb.idx]=input[i]+del*cF[c];cb.idx=(cb.idx+1)%cb.len;cs+=del;}
    cs/=cB.length;let ap=cs;
    for(let a=0;a<aB.length;a++){const ab=aB[a];const del=ab.buf[ab.idx];ab.buf[ab.idx]=ap+del*0.5;ab.idx=(ab.idx+1)%ab.len;ap=del-ap*0.5;}
    out[i]=input[i]*(1-mix)+ap*mix;
  }
  return out;
}

function mixInto(mainBuf, noteBuf, offsetSamples) {
  const start=Math.max(0,offsetSamples), end=Math.min(mainBuf.length,offsetSamples+noteBuf.length);
  for(let i=start;i<end;i++) mainBuf[i]+=noteBuf[i-offsetSamples];
}

function midiToFreq(pitch) { return 440 * Math.pow(2, (pitch - 69) / 12); }

// ── Instrument Renderers ──

function renderPianoNote(freq, duration, volume=0.20, velScale=1.0) {
  const len=Math.floor(SAMPLE_RATE*(duration+0.3)); const buf=new Float32Array(len); const vol=volume*velScale;
  const sL=Math.floor(SAMPLE_RATE*0.015);
  for(let i=0;i<sL&&i<len;i++) buf[i]+=(Math.random()*2-1)*vol*0.4*Math.exp(-i/(SAMPLE_RATE*0.003));
  const H=[{r:1,a:1.0,t:'triangle'},{r:2,a:0.5,t:'sine'},{r:3,a:0.25,t:'sine'},{r:4,a:0.12,t:'sine'},{r:5,a:0.06,t:'sine'}];
  for(const h of H){let p=0;const inc=2*Math.PI*freq*h.r/SAMPLE_RATE;for(let i=0;i<len;i++){const t=i/SAMPLE_RATE;buf[i]+=generateWaveform(h.t,p)*vol*h.a*Math.min(1,t/0.005)*Math.exp(-t/(duration*0.4));p+=inc;}}
  new BiquadFilter('lowpass',Math.min(freq*8,8000),1.0,SAMPLE_RATE).processBuffer(buf);
  return buf;
}

function renderGuitarNote(freq, duration, volume=0.16, velScale=1.0) {
  const len=Math.floor(SAMPLE_RATE*(duration+0.2)); const buf=new Float32Array(len); const vol=volume*velScale;
  const pL=Math.floor(SAMPLE_RATE*0.02);
  for(let i=0;i<pL&&i<len;i++) buf[i]+=(Math.random()*2-1)*vol*0.5*Math.exp(-i/(SAMPLE_RATE*0.004));
  const H=[{r:1,a:1.0},{r:2,a:0.6},{r:3,a:0.35},{r:4,a:0.15},{r:5,a:0.08}];
  for(const h of H){let p=0;const inc=2*Math.PI*freq*h.r/SAMPLE_RATE;for(let i=0;i<len;i++){const t=i/SAMPLE_RATE;buf[i]+=generateWaveform('triangle',p)*vol*h.a*Math.min(1,t/0.003)*Math.exp(-t/(duration*0.35));p+=inc;}}
  new BiquadFilter('lowpass',Math.min(freq*6,6000),1.5,SAMPLE_RATE).processBuffer(buf);
  return buf;
}

function renderBassNote(freq, duration, volume=0.30, velScale=1.0) {
  const len=Math.floor(SAMPLE_RATE*(duration+0.2)); const buf=new Float32Array(len); const vol=volume*velScale;
  const bf=freq<150?freq:freq/2; let p1=0,p2=0;
  const i1=2*Math.PI*bf/SAMPLE_RATE, i2=2*Math.PI*bf*2/SAMPLE_RATE;
  for(let i=0;i<len;i++){const t=i/SAMPLE_RATE;const e=Math.min(1,t/0.01)*Math.exp(-t/(duration*0.5));buf[i]=(Math.sin(p1)*0.7+generateWaveform('triangle',p2)*0.3)*vol*e;p1+=i1;p2+=i2;}
  new BiquadFilter('lowpass',Math.min(bf*4,800),2.0,SAMPLE_RATE).processBuffer(buf);
  new BiquadFilter('peaking',bf*1.5,2.0,SAMPLE_RATE,4).processBuffer(buf);
  return buf;
}

function renderPadChord(frequencies, duration, volume=0.12, fadeIn=0.4, fadeOut=0.4) {
  const len=Math.floor(SAMPLE_RATE*duration); const buf=new Float32Array(len);
  for(const freq of frequencies){
    for(let j=0;j<4;j++){
      const df=freq*Math.pow(2,(j-1.5)*3/1200);
      const types=['sawtooth','sine','triangle','sine'];
      let phase=Math.random()*2*Math.PI; const inc=2*Math.PI*df/SAMPLE_RATE;
      const oscVol=volume*0.25/frequencies.length;
      for(let i=0;i<len;i++){const t=i/SAMPLE_RATE;let env=1;if(t<fadeIn)env=t/fadeIn;if(t>duration-fadeOut)env=Math.max(0,(duration-t)/fadeOut);buf[i]+=generateWaveform(types[j],phase)*oscVol*env;phase+=inc;}
    }
  }
  new BiquadFilter('lowpass',2000,0.7,SAMPLE_RATE).processBuffer(buf);
  return buf;
}

function renderViolin(freq, duration, volume=0.18, velScale=1.0) {
  const len=Math.floor(SAMPLE_RATE*(duration+0.1)); const buf=new Float32Array(len); const vol=volume*velScale;
  let phase=0,vibP=0;
  for(let i=0;i<len;i++){const t=i/SAMPLE_RATE;const vib=Math.sin(vibP)*3*Math.min(1,t/0.3);const f=freq+vib;const inc=2*Math.PI*f/SAMPLE_RATE;const att=Math.min(1,t/0.08);const rel=t>duration-0.05?Math.max(0,(duration-t)/0.05):1;buf[i]+=(generateWaveform('sawtooth',phase)*0.5+Math.sin(phase*2)*0.3+Math.sin(phase*3)*0.15)*vol*att*rel;phase+=inc;vibP+=2*Math.PI*5.5/SAMPLE_RATE;}
  new BiquadFilter('lowpass',Math.min(freq*5,6000),1.2,SAMPLE_RATE).processBuffer(buf);
  for(let i=0;i<Math.min(len,SAMPLE_RATE*0.03);i++) buf[i]+=(Math.random()*2-1)*vol*0.15*Math.exp(-i/(SAMPLE_RATE*0.008));
  return buf;
}

function renderFlute(freq, duration, volume=0.14, velScale=1.0) {
  const len=Math.floor(SAMPLE_RATE*(duration+0.1)); const buf=new Float32Array(len); const vol=volume*velScale;
  let phase=0,vibP=0;
  for(let i=0;i<len;i++){const t=i/SAMPLE_RATE;const vib=Math.sin(vibP)*2*Math.min(1,t/0.4);const f=freq+vib;const inc=2*Math.PI*f/SAMPLE_RATE;const att=Math.min(1,t/0.06);const rel=t>duration-0.04?Math.max(0,(duration-t)/0.04):1;buf[i]+=(Math.sin(phase)*0.8+Math.sin(phase*2)*0.15)*vol*att*rel;phase+=inc;vibP+=2*Math.PI*5/SAMPLE_RATE;}
  for(let i=0;i<len;i++){const t=i/SAMPLE_RATE;buf[i]+=(Math.random()*2-1)*vol*0.08*Math.min(1,t/0.02)*Math.exp(-t/(duration*0.8));}
  new BiquadFilter('lowpass',Math.min(freq*4,5000),0.8,SAMPLE_RATE).processBuffer(buf);
  return buf;
}

function renderClarinet(freq, duration, volume=0.16, velScale=1.0) {
  const len=Math.floor(SAMPLE_RATE*(duration+0.1)); const buf=new Float32Array(len); const vol=volume*velScale;
  let phase=0;
  for(let i=0;i<len;i++){const t=i/SAMPLE_RATE;const att=Math.min(1,t/0.04);const rel=t>duration-0.04?Math.max(0,(duration-t)/0.04):1;buf[i]+=(generateWaveform('square',phase)*0.5+Math.sin(phase*3)*0.25+Math.sin(phase*5)*0.1)*vol*att*rel;phase+=2*Math.PI*freq/SAMPLE_RATE;}
  for(let i=0;i<Math.min(len,SAMPLE_RATE*0.02);i++) buf[i]+=(Math.random()*2-1)*vol*0.2*Math.exp(-i/(SAMPLE_RATE*0.005));
  new BiquadFilter('lowpass',Math.min(freq*5,4500),1.5,SAMPLE_RATE).processBuffer(buf);
  return buf;
}

function renderCello(freq, duration, volume=0.20, velScale=1.0) {
  const len=Math.floor(SAMPLE_RATE*(duration+0.15)); const buf=new Float32Array(len); const vol=volume*velScale;
  let phase=0,vibP=0;
  for(let i=0;i<len;i++){const t=i/SAMPLE_RATE;const vib=Math.sin(vibP)*3*Math.min(1,t/0.4);const f=freq+vib;const inc=2*Math.PI*f/SAMPLE_RATE;const att=Math.min(1,t/0.1);const rel=t>duration-0.08?Math.max(0,(duration-t)/0.08):1;buf[i]+=(generateWaveform('sawtooth',phase)*0.6+Math.sin(phase*2)*0.25+Math.sin(phase*3)*0.1)*vol*att*rel;phase+=inc;vibP+=2*Math.PI*4.5/SAMPLE_RATE;}
  for(let i=0;i<Math.min(len,SAMPLE_RATE*0.04);i++) buf[i]+=(Math.random()*2-1)*vol*0.12*Math.exp(-i/(SAMPLE_RATE*0.01));
  new BiquadFilter('lowpass',Math.min(freq*4,3500),1.0,SAMPLE_RATE).processBuffer(buf);
  return buf;
}

// ── Percussion ──
function renderKick(vol=0.4,acc=false){const len=Math.floor(SAMPLE_RATE*0.25);const buf=new Float32Array(len);const v=acc?vol*1.3:vol;let ph=0;for(let i=0;i<len;i++){const t=i/SAMPLE_RATE;buf[i]=Math.sin(ph)*v*Math.exp(-t*12);ph+=2*Math.PI*(50+100*Math.exp(-t*30))/SAMPLE_RATE;}for(let i=0;i<Math.min(Math.floor(SAMPLE_RATE*0.008),len);i++)buf[i]+=(Math.random()*2-1)*v*0.6*Math.exp(-i/(SAMPLE_RATE*0.002));return buf;}
function renderSnare(vol=0.35,acc=false){const len=Math.floor(SAMPLE_RATE*0.2);const buf=new Float32Array(len);const v=acc?vol*1.3:vol;let ph=0;for(let i=0;i<len;i++){const t=i/SAMPLE_RATE;buf[i]=(Math.random()*2-1)*v*0.7*Math.exp(-t*18)+Math.sin(ph)*v*0.5*Math.exp(-t*25);ph+=2*Math.PI*200/SAMPLE_RATE;}for(let i=0;i<Math.min(Math.floor(SAMPLE_RATE*0.01),len);i++)buf[i]+=(Math.random()*2-1)*v*0.5*Math.exp(-i/(SAMPLE_RATE*0.001));return buf;}
function renderHiHat(vol=0.2,acc=false){const len=Math.floor(SAMPLE_RATE*0.08);const buf=new Float32Array(len);const v=acc?vol*1.2:vol;for(let i=0;i<len;i++)buf[i]=(Math.random()*2-1)*v*Math.exp(-i/SAMPLE_RATE*50);new BiquadFilter('highpass',7000,1.0,SAMPLE_RATE).processBuffer(buf);return buf;}
function renderTom(vol=0.3,acc=false){const len=Math.floor(SAMPLE_RATE*0.2);const buf=new Float32Array(len);const v=acc?vol*1.2:vol;let ph=0;for(let i=0;i<len;i++){const t=i/SAMPLE_RATE;buf[i]=Math.sin(ph)*v*Math.exp(-t*10);ph+=2*Math.PI*(120+60*Math.exp(-t*15))/SAMPLE_RATE;}return buf;}

const InstrumentRenderers = {
  piano: renderPianoNote, guitar: renderGuitarNote, bass: renderBassNote,
  violin: renderViolin, flute: renderFlute, clarinet: renderClarinet, cello: renderCello
};


// ════════════════════════════════════════════════════════════════════════
// SECTION 3: INTEGRATED RENDERER
// ════════════════════════════════════════════════════════════════════════

const BeatPatterns = {
  "8beat": "| K! H S H K H S H |",
  "16beat": "| K! H H S H H K H H S H H K H H S H |",
  "poprock": "| K! H S! H K . K H S! H |",
  "acousticpop": "| K! . H S! . H K . H S! . H |",
  "bossanova": "| K . . S . K . S . . K . S . . . |",
  "swing": "| K . T . S . T . K . T . S . T . |",
  "funk": "| K! . S! . K . S! . K! . S . K . |",
  "rnb": "| K! . H S! H . K H H S! . H |",
  "waltz": "| K! T T | K! T T |",
  "arpeggio": "| K . . . S . . . K . . . S . . . |",
  "none": ""
};

function parseURN(text) { return text.replace(/\|/g, "").trim().split(/\s+/).filter(t => t); }

/**
 * Main render function.
 * 
 * config.preset can be:
 *   - A named preset:   "I-V-vi-IV (Pop)", "Autumn Leaves", etc.
 *   - A custom string:  "C G Am/E F", "Dm7 | G7 | Cmaj7", etc.
 * 
 * config.transpose:  semitones (-11 to +11), applied to ALL tracks
 * 
 * New pad controls:
 *   config.padOctave:   MIDI octave for pad (default 4 = middle C region)
 *   config.padVolume:   pad volume 0.0-1.0 (default 0.12)
 *   config.enablePad:   true/false (default true)
 */
function renderJob(config) {
  // ── Resolve preset: named OR custom chord string ──
  let progression = config.preset || "C | G | Am | F";
  let beatsPerChord = config.beatsPerChord || 4;

  const found = PrebuiltProgressions.find(p => p.name === progression);
  if (found) {
    progression = found.chords;
    beatsPerChord = config.beatsPerChord || found.beats;
  }
  // Otherwise, preset IS the chord string (custom mode)

  const bpm         = config.bpm || 120;
  const loops       = config.loops || 2;
  const transpose   = config.transpose || 0;
  const instrument  = config.instrument || 'piano';
  const enableBass  = config.enableBass !== false;
  const enablePad   = config.enablePad !== false;
  const padOctave   = config.padOctave ?? 4;
  const padVolume   = config.padVolume ?? 0.12;
  const enableDrums = config.enableDrums !== false;
  const drumPattern = config.drumPattern || 'poprock';
  const reverbMix   = config.reverbMix ?? 0.18;
  const masterVol   = config.masterVolume ?? 0.85;

  // ── Generate MIDI events (chords returned are already transposed) ──
  const { events, duration, chords } = generateMidiEvents({
    progression, beatsPerChord, bpm, transpose,
    pattern: config.pattern ?? 1,
    rate: config.rate || "1/8",
    octaveRange: config.octaveRange || 1,
    baseOctave: config.baseOctave || 3,
    gatePercent: config.gatePercent || 0.9,
    velocity: config.velocity || 90,
    velRandom: config.velRandom ?? 5,
    accentEvery: config.accentEvery ?? 4,
    accentAmount: config.accentAmount ?? 20,
    firstBeatAccent: config.firstBeatAccent !== false,
    swing: config.swing ?? 0.5,
    loops
  });

  if (events.length === 0) { console.log('  ⚠ No events generated!'); return Buffer.alloc(44); }

  const totalSamples = Math.floor(SAMPLE_RATE * (duration + 3));
  const dryBuf = new Float32Array(totalSamples);
  const wetBuf = new Float32Array(totalSamples);
  const beatDur = 60 / bpm;
  const renderInstr = InstrumentRenderers[instrument] || renderPianoNote;

  const txLabel = transpose !== 0 ? ` [transpose ${transpose > 0 ? '+' : ''}${transpose}]` : '';
  console.log(`  Chords: ${chords.map(c => c.name).join(' → ')}${txLabel}`);
  console.log(`  Pattern: ${ArpPatternNames[config.pattern ?? 1]}, Rate: ${config.rate || '1/8'}, BPM: ${bpm}`);
  console.log(`  Lead: ${instrument} | Pad: ${enablePad ? 'oct'+padOctave+' vol'+padVolume : 'off'} | Bass: ${enableBass ? 'on' : 'off'} | Drums: ${enableDrums ? drumPattern : 'off'}`);

  // ── PAD TRACK: sustained chord pads, one per chord, properly timed ──
  if (enablePad && chords.length > 0) {
    process.stdout.write('  Pad track...');
    const chordDuration = beatsPerChord * beatDur;
    const totalChordBeats = chords.length * beatsPerChord;
    for (let loop = 0; loop < loops; loop++) {
      chords.forEach((chord, idx) => {
        const chordStart = (loop * totalChordBeats + idx * beatsPerChord) * beatDur;
        if (chordStart >= duration) return;
        // Build frequencies from transposed chord at padOctave
        const padFreqs = chord.intervals.map(iv => midiToFreq(padOctave * 12 + chord.root + iv));
        const padDur = Math.min(chordDuration, duration - chordStart);
        const fadeTime = Math.min(0.4, padDur * 0.15);
        const padBuf = renderPadChord(padFreqs, padDur, padVolume, fadeTime, fadeTime);
        const offset = Math.floor(chordStart * SAMPLE_RATE);
        for (let i = 0; i < padBuf.length && i + offset < totalSamples; i++) {
          dryBuf[i + offset] += padBuf[i] * 0.6;
          wetBuf[i + offset] += padBuf[i] * 0.4;  // pads get more reverb
        }
      });
    }
    process.stdout.write(' ✓\n');
  }

  // ── ARP NOTES ──
  process.stdout.write('  Arp notes...');
  let prevChordIdx = -1;
  for (let ei = 0; ei < events.length; ei++) {
    const ev = events[ei];
    const offset = Math.floor(ev.time * SAMPLE_RATE);
    const velScale = ev.velocity / 100;

    for (const pitch of ev.pitches) {
      const noteBuf = renderInstr(midiToFreq(pitch), ev.duration, undefined, velScale);
      for (let i = 0; i < noteBuf.length && i + offset < totalSamples; i++) {
        dryBuf[i + offset] += noteBuf[i] * 0.8;
        wetBuf[i + offset] += noteBuf[i] * 0.2;
      }
    }

    // ── BASS: on chord changes, use slash bass note (Am/E → E bass) ──
    if (enableBass && ev.chordIdx !== undefined && ev.chordIdx !== prevChordIdx) {
      const chord = chords[ev.chordIdx % chords.length];
      const bassNoteNum = chord.bassNote ?? chord.root;
      const bassFreq = midiToFreq(3 * 12 + bassNoteNum);  // octave 2
      const bassDur = beatsPerChord * beatDur * 0.8;
      const bassBuf = renderBassNote(bassFreq, bassDur, 0.28, velScale);
      for (let i = 0; i < bassBuf.length && i + offset < totalSamples; i++) {
        dryBuf[i + offset] += bassBuf[i] * 0.92;
        wetBuf[i + offset] += bassBuf[i] * 0.08;
      }
      prevChordIdx = ev.chordIdx;
    }
  }
  process.stdout.write(' ✓\n');

  // ── DRUMS ──
  if (enableDrums && drumPattern !== 'none' && BeatPatterns[drumPattern]) {
    process.stdout.write('  Drums...');
    const tokens = parseURN(BeatPatterns[drumPattern]);
    if (tokens.length > 0) {
      const totalDrumSteps = Math.ceil(duration / beatDur);
      for (let step = 0; step < totalDrumSteps; step++) {
        const token = tokens[step % tokens.length];
        const time = step * beatDur;
        if (time >= duration) break;
        const offset = Math.floor(time * SAMPLE_RATE);
        const isAcc = token.includes('!');
        const base = token.replace('!', '');
        if (base.includes('K')) mixInto(dryBuf, renderKick(0.35, isAcc), offset);
        if (base.includes('S')) { const s=renderSnare(0.30,isAcc); for(let i=0;i<s.length&&i+offset<totalSamples;i++){dryBuf[i+offset]+=s[i]*0.85;wetBuf[i+offset]+=s[i]*0.15;} }
        if (base.includes('H')) mixInto(dryBuf, renderHiHat(0.18, isAcc), offset);
        if (base.includes('T')) mixInto(dryBuf, renderTom(0.25, isAcc), offset);
      }
    }
    process.stdout.write(' ✓\n');
  }

  // ── EFFECTS & MIXDOWN ──
  process.stdout.write('  Reverb + compress...');
  const reverbbed = applyAlgorithmicReverb(wetBuf, 2.2, 1.0);
  const mixed = new Float32Array(totalSamples);
  for (let i = 0; i < totalSamples; i++) mixed[i] = dryBuf[i] * (1 - reverbMix) + reverbbed[i] * reverbMix;
  compress(mixed, -24, 4, 0.003, 0.25);
  for (let i = 0; i < mixed.length; i++) mixed[i] *= masterVol;

  const targetSamples = Math.floor(duration * SAMPLE_RATE);
  const output = mixed.slice(0, targetSamples);
  let peak = 0;
  for (let i = 0; i < output.length; i++) peak = Math.max(peak, Math.abs(output[i]));
  if (peak > 0.95) { const sc = 0.92 / peak; for (let i = 0; i < output.length; i++) output[i] *= sc; }
  process.stdout.write(' ✓\n');

  return encodeWAV(output);
}

// ── WAV Encoder ──

function encodeWAV(samples) {
  const buf = Buffer.alloc(samples.length * 2 + 44); let o = 0;
  const ws = s => { for (let i = 0; i < s.length; i++) buf[o++] = s.charCodeAt(i); };
  ws("RIFF"); buf.writeUInt32LE(36 + samples.length * 2, o); o += 4;
  ws("WAVE"); ws("fmt ");
  buf.writeUInt32LE(16, o); o += 4;
  buf.writeUInt16LE(1, o); o += 2; buf.writeUInt16LE(1, o); o += 2;
  buf.writeUInt32LE(SAMPLE_RATE, o); o += 4; buf.writeUInt32LE(SAMPLE_RATE * 2, o); o += 4;
  buf.writeUInt16LE(2, o); o += 2; buf.writeUInt16LE(16, o); o += 2;
  ws("data"); buf.writeUInt32LE(samples.length * 2, o); o += 4;
  for (let i = 0; i < samples.length; i++, o += 2) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    buf.writeInt16LE(Math.floor(s < 0 ? s * 0x8000 : s * 0x7fff), o);
  }
  return buf;
}

// ════════════════════════════════════════════════════════════════════════
// MODULE EXPORTS
// ════════════════════════════════════════════════════════════════════════

const PRESETS = PrebuiltProgressions.slice(1).map(p => ({ name: p.name, chords: p.chords, beats: p.beats }));
const PATTERNS = ArpPatternNames.map((name, index) => ({ index, name }));
const INSTRUMENTS = ['piano', 'guitar', 'bass', 'violin', 'flute', 'clarinet', 'cello'];
const DRUMS = Object.keys(BeatPatterns);
const RATES = Object.keys(RateValues);

const SCHEMA = {
  type: "object",
  required: ["preset"],
  properties: {
    preset:         { type: "string",  description: "Named preset (e.g. 'I-V-vi-IV (Pop)') OR custom chords (e.g. 'C G Am/E F', 'Dm7 | G7 | Cmaj7'). Slash chords set bass note." },
    beatsPerChord:  { type: "integer", description: "Beats per chord. Auto-set from named presets, required for custom.", default: 4, minimum: 1, maximum: 16 },
    bpm:            { type: "integer", description: "Tempo in BPM.", default: 120, minimum: 30, maximum: 300 },
    transpose:      { type: "integer", description: "Transpose all tracks by N semitones.", default: 0, minimum: -11, maximum: 11 },
    pattern:        { type: "integer", description: "Arp pattern index 0-21. 0=Block 1=Up 2=Down 3=UpDown 5=UpDownNR 7=Random 13=1-3-5-3 17=Alberti 18=Stride 20=Pedal.", default: 1, minimum: 0, maximum: 21 },
    rate:           { type: "string",  description: "Arp note rate.", default: "1/8", enum: ["1/1","1/2","1/2T","1/4","1/4T","1/8","1/8T","1/16","1/16T","1/32"] },
    instrument:     { type: "string",  description: "Lead instrument.", default: "piano", enum: ["piano","guitar","bass","violin","flute","clarinet","cello"] },
    octaveRange:    { type: "integer", description: "Octave span for arp.", default: 1, minimum: 1, maximum: 4 },
    baseOctave:     { type: "integer", description: "Starting MIDI octave.", default: 3, minimum: 1, maximum: 5 },
    gatePercent:    { type: "number",  description: "Note gate as fraction of step.", default: 0.9, minimum: 0.1, maximum: 1.0 },
    velocity:       { type: "integer", description: "Base MIDI velocity.", default: 90, minimum: 1, maximum: 127 },
    velRandom:      { type: "integer", description: "Velocity randomization +/-.", default: 5, minimum: 0, maximum: 30 },
    accentEvery:    { type: "integer", description: "Accent every N steps. 0=off.", default: 4, minimum: 0, maximum: 16 },
    accentAmount:   { type: "integer", description: "Accent velocity boost.", default: 20, minimum: 0, maximum: 50 },
    firstBeatAccent:{ type: "boolean", description: "Accent first beat of each chord.", default: true },
    swing:          { type: "number",  description: "Swing. 0.5=straight, 0.66=medium, 0.75=heavy.", default: 0.5, minimum: 0.5, maximum: 0.75 },
    loops:          { type: "integer", description: "Repetitions of progression.", default: 2, minimum: 1, maximum: 16 },
    enablePad:      { type: "boolean", description: "Sustained pad chord track.", default: true },
    padOctave:      { type: "integer", description: "Pad octave.", default: 4, minimum: 2, maximum: 5 },
    padVolume:      { type: "number",  description: "Pad volume.", default: 0.12, minimum: 0.0, maximum: 0.3 },
    enableBass:     { type: "boolean", description: "Auto bass (uses slash chord bass).", default: true },
    enableDrums:    { type: "boolean", description: "Drum track.", default: true },
    drumPattern:    { type: "string",  description: "Drum pattern.", default: "poprock", enum: ["8beat","16beat","poprock","acousticpop","bossanova","swing","funk","rnb","waltz","arpeggio","none"] },
    reverbMix:      { type: "number",  description: "Reverb wet/dry.", default: 0.18, minimum: 0.0, maximum: 0.5 },
    masterVolume:   { type: "number",  description: "Master volume.", default: 0.85, minimum: 0.0, maximum: 1.0 }
  }
};

module.exports = {
  renderJob, encodeWAV, PRESETS, PATTERNS, INSTRUMENTS, DRUMS, RATES, SCHEMA, SAMPLE_RATE,
  parseProgression, generateMidiEvents, midiToFreq, PrebuiltProgressions, ArpPatternNames, BeatPatterns, RateValues
};
