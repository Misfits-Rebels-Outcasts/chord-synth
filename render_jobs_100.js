/**
 * render_jobs.js — 100 curated render jobs for integrated_synth.js
 * 
 * Edit this file to add/remove/modify jobs. The main synth script
 * loads this automatically via require('./render_jobs.js').
 * 
 * Each job can use:
 *   preset:        Named preset ("I-V-vi-IV (Pop)") OR custom chords ("C G Am/E F")
 *   beatsPerChord: Beats per chord (default from preset, or specify for custom)
 *   bpm:           Tempo in BPM
 *   transpose:     Semitones (-11 to +11)
 *   pattern:       Arp pattern index (0-21) — see PATTERN_INDEX below
 *   rate:          "1/1","1/2","1/2T","1/4","1/4T","1/8","1/8T","1/16","1/16T","1/32"
 *   instrument:    "piano","guitar","bass","violin","flute","clarinet","cello"
 *   octaveRange:   1-4
 *   baseOctave:    1-5
 *   gatePercent:   0.1-1.0
 *   velocity:      1-127
 *   velRandom:     0-30
 *   accentEvery:   0 (off) or 1-16
 *   accentAmount:  0-50
 *   firstBeatAccent: true/false
 *   swing:         0.5 (straight) to 0.75 (heavy swing)
 *   loops:         Number of times to repeat the progression
 *   enablePad:     true/false
 *   padOctave:     MIDI octave for pad (3-5)
 *   padVolume:     0.0-0.3
 *   enableBass:    true/false
 *   enableDrums:   true/false
 *   drumPattern:   "8beat","16beat","poprock","acousticpop","bossanova","swing",
 *                  "funk","rnb","waltz","arpeggio","none"
 *   reverbMix:     0.0-0.5
 *   masterVolume:  0.0-1.0
 * 
 * PATTERN_INDEX:
 *   0  Chord (Block)       7  Random            14 1-5-3-5           
 *   1  Up                  8  Random Walk       15 1-5-8-5           
 *   2  Down                9  Outside-In        16 1-3-5-8-5-3       
 *   3  Up-Down            10  Inside-Out        17 Alberti Bass       
 *   4  Down-Up            11  Pinky-Thumb       18 Stride (Root-Chord)
 *   5  Up-Down No Repeat  12  Thumb-Pinky       19 Broken 3rds       
 *   6  Down-Up No Repeat  13  1-3-5-3           20 Pedal Tone        
 *                                                21 Alternating Bass  
 */

// ── Output folder — change this to write files elsewhere ──
const OUTPUT_DIR = '/mnt/user-data/outputs';

const RENDER_JOBS = [

  // ════════════════════════════════════════════════════════════════
  // 001–010: POP & ROCK — warm, familiar progressions
  // ════════════════════════════════════════════════════════════════

  { filename: "001_Pop_Up_Piano_C_120.wav",
    preset: "I-V-vi-IV (Pop)", bpm: 120, pattern: 1, rate: "1/8", instrument: "piano",
    transpose: 0, octaveRange: 2, baseOctave: 3, velocity: 90, accentEvery: 4,
    enablePad: true, padOctave: 4, padVolume: 0.12, drumPattern: "poprock", loops: 2 },

  { filename: "002_Pop_Up_Piano_G_120.wav",
    preset: "I-V-vi-IV (Pop)", bpm: 120, pattern: 1, rate: "1/8", instrument: "piano",
    transpose: 7, octaveRange: 2, baseOctave: 3, velocity: 90, accentEvery: 4,
    enablePad: true, padOctave: 4, padVolume: 0.12, drumPattern: "poprock", loops: 2 },

  { filename: "003_Pop_UpDown_Guitar_D_110.wav",
    preset: "I-V-vi-IV (Pop)", bpm: 110, pattern: 3, rate: "1/8", instrument: "guitar",
    transpose: 2, octaveRange: 2, baseOctave: 3, velocity: 85, velRandom: 8,
    enablePad: true, padOctave: 4, padVolume: 0.10, drumPattern: "acousticpop", loops: 2 },

  { filename: "004_Pop_Block_Piano_Eb_100.wav",
    preset: "I-V-vi-IV (Pop)", bpm: 100, pattern: 0, rate: "1/4", instrument: "piano",
    transpose: 3, octaveRange: 1, baseOctave: 3, velocity: 80, gatePercent: 0.95,
    enablePad: true, padOctave: 3, padVolume: 0.14, drumPattern: "8beat", loops: 2 },

  { filename: "005_50s_Alberti_Piano_F_115.wav",
    preset: "I-vi-IV-V (50s)", bpm: 115, pattern: 17, rate: "1/8", instrument: "piano",
    transpose: 5, octaveRange: 1, baseOctave: 3, velocity: 88,
    enablePad: true, padOctave: 4, padVolume: 0.10, drumPattern: "poprock", loops: 2 },

  { filename: "006_Sad_Down_Violin_Am_85.wav",
    preset: "vi-IV-I-V (Sad)", bpm: 85, pattern: 2, rate: "1/8", instrument: "violin",
    transpose: 0, octaveRange: 2, baseOctave: 4, velocity: 75, velRandom: 10,
    enablePad: true, padOctave: 4, padVolume: 0.15, drumPattern: "8beat", loops: 2 },

  { filename: "007_Rock_Up_Guitar_A_130.wav",
    preset: "I-IV-V-IV (Rock)", bpm: 130, pattern: 1, rate: "1/8", instrument: "guitar",
    transpose: 9, octaveRange: 2, baseOctave: 3, velocity: 100, accentEvery: 2, accentAmount: 25,
    enablePad: false, drumPattern: "poprock", loops: 2 },

  { filename: "008_Canon_135_Piano_C_135.wav",
    preset: "I-V-vi-iii-IV (Canon)", bpm: 135, pattern: 5, rate: "1/16", instrument: "piano",
    transpose: 0, octaveRange: 2, baseOctave: 3, velocity: 85,
    enablePad: true, padOctave: 4, padVolume: 0.08, drumPattern: "16beat", loops: 1 },

  { filename: "009_Pop_PedalTone_Flute_Bb_95.wav",
    preset: "I-V-vi-IV (Pop)", bpm: 95, pattern: 20, rate: "1/8", instrument: "flute",
    transpose: 10, octaveRange: 2, baseOctave: 4, velocity: 78,
    enablePad: true, padOctave: 4, padVolume: 0.12, drumPattern: "acousticpop", loops: 2 },

  { filename: "010_Pop_Broken3rds_Clarinet_E_108.wav",
    preset: "I-V-vi-IV (Pop)", bpm: 108, pattern: 19, rate: "1/8", instrument: "clarinet",
    transpose: 4, octaveRange: 1, baseOctave: 4, velocity: 82,
    enablePad: true, padOctave: 4, padVolume: 0.10, drumPattern: "8beat", loops: 2 },

  // ════════════════════════════════════════════════════════════════
  // 011–025: JAZZ — swing, extended chords, sophisticated voicings
  // ════════════════════════════════════════════════════════════════

  { filename: "011_Jazz_iiVI_Alberti_Piano_C_100.wav",
    preset: "ii-V-I (Jazz)", bpm: 100, pattern: 17, rate: "1/8", instrument: "piano",
    transpose: 0, octaveRange: 1, baseOctave: 3, velocity: 78, swing: 0.62,
    enablePad: true, padOctave: 3, padVolume: 0.10, drumPattern: "swing", loops: 3 },

  { filename: "012_Jazz_iiVI_Up_Piano_Bb_112.wav",
    preset: "ii-V-I (Jazz)", bpm: 112, pattern: 1, rate: "1/8T", instrument: "piano",
    transpose: 10, octaveRange: 1, baseOctave: 3, velocity: 80, swing: 0.60,
    enablePad: true, padOctave: 3, padVolume: 0.10, drumPattern: "swing", loops: 3 },

  { filename: "013_JazzTurnaround_153_Piano_F_120.wav",
    preset: "I-vi-ii-V (Jazz Turnaround)", bpm: 120, pattern: 13, rate: "1/8", instrument: "piano",
    transpose: 5, octaveRange: 1, baseOctave: 3, velocity: 82, swing: 0.58,
    enablePad: true, padOctave: 3, padVolume: 0.10, drumPattern: "swing", loops: 3 },

  { filename: "014_Coltrane_OutsideIn_Piano_C_140.wav",
    preset: "iii-vi-ii-V (Coltrane)", bpm: 140, pattern: 9, rate: "1/8", instrument: "piano",
    transpose: 0, octaveRange: 1, baseOctave: 3, velocity: 85, swing: 0.60,
    enablePad: false, drumPattern: "swing", loops: 4 },

  { filename: "015_AutumnLeaves_UpDown_Violin_Am_95.wav",
    preset: "Autumn Leaves", bpm: 95, pattern: 3, rate: "1/8", instrument: "violin",
    transpose: 0, octaveRange: 2, baseOctave: 4, velocity: 80,
    enablePad: true, padOctave: 4, padVolume: 0.12, drumPattern: "bossanova", loops: 1 },

  { filename: "016_AutumnLeaves_Alberti_Piano_Dm_88.wav",
    preset: "Autumn Leaves", bpm: 88, pattern: 17, rate: "1/8", instrument: "piano",
    transpose: 5, octaveRange: 1, baseOctave: 3, velocity: 75, swing: 0.62,
    enablePad: true, padOctave: 3, padVolume: 0.14, drumPattern: "swing", loops: 1 },

  { filename: "017_SoWhat_Up_Piano_D_132.wav",
    preset: "So What", bpm: 132, pattern: 1, rate: "1/8", instrument: "piano",
    transpose: 0, octaveRange: 1, baseOctave: 3, velocity: 80, swing: 0.58,
    enablePad: true, padOctave: 3, padVolume: 0.10, drumPattern: "swing", loops: 1 },

  { filename: "018_Jazz_iiVI_Stride_Piano_Ab_96.wav",
    preset: "ii-V-I (Jazz)", bpm: 96, pattern: 18, rate: "1/4", instrument: "piano",
    transpose: 8, octaveRange: 1, baseOctave: 3, velocity: 82, swing: 0.64,
    enablePad: true, padOctave: 3, padVolume: 0.08, drumPattern: "swing", loops: 3 },

  { filename: "019_Jazz_iiVI_Random_Guitar_Eb_108.wav",
    preset: "ii-V-I (Jazz)", bpm: 108, pattern: 7, rate: "1/8T", instrument: "guitar",
    transpose: 3, octaveRange: 1, baseOctave: 3, velocity: 72, swing: 0.60, velRandom: 15,
    enablePad: true, padOctave: 3, padVolume: 0.10, drumPattern: "swing", loops: 3 },

  { filename: "020_SteellyDan_153_Piano_C_105.wav",
    preset: "Steely Dan", bpm: 105, pattern: 13, rate: "1/8", instrument: "piano",
    transpose: 0, octaveRange: 1, baseOctave: 3, velocity: 78, swing: 0.58,
    enablePad: true, padOctave: 3, padVolume: 0.12, drumPattern: "funk", loops: 2 },

  { filename: "021_Jazz_iiVI_InsideOut_Clarinet_F_115.wav",
    preset: "ii-V-I (Jazz)", bpm: 115, pattern: 10, rate: "1/8", instrument: "clarinet",
    transpose: 5, octaveRange: 1, baseOctave: 4, velocity: 80, swing: 0.60,
    enablePad: true, padOctave: 3, padVolume: 0.08, drumPattern: "swing", loops: 3 },

  { filename: "022_JazzTurnaround_RandomWalk_Flute_G_100.wav",
    preset: "I-vi-ii-V (Jazz Turnaround)", bpm: 100, pattern: 8, rate: "1/8T", instrument: "flute",
    transpose: 7, octaveRange: 2, baseOctave: 4, velocity: 74, swing: 0.58,
    enablePad: true, padOctave: 4, padVolume: 0.12, drumPattern: "swing", loops: 3 },

  { filename: "023_AutumnLeaves_Down_Cello_Gm_80.wav",
    preset: "Autumn Leaves", bpm: 80, pattern: 2, rate: "1/8", instrument: "cello",
    transpose: -2, octaveRange: 1, baseOctave: 3, velocity: 78,
    enablePad: true, padOctave: 3, padVolume: 0.14, drumPattern: "bossanova", loops: 1 },

  { filename: "024_SoWhat_PedalTone_Piano_D_145.wav",
    preset: "So What", bpm: 145, pattern: 20, rate: "1/16", instrument: "piano",
    transpose: 0, octaveRange: 1, baseOctave: 3, velocity: 85, swing: 0.55,
    enablePad: false, drumPattern: "swing", loops: 1 },

  { filename: "025_Gospel_153_Piano_C_92.wav",
    preset: "Gospel", bpm: 92, pattern: 13, rate: "1/8", instrument: "piano",
    transpose: 0, octaveRange: 1, baseOctave: 3, velocity: 85,
    enablePad: true, padOctave: 3, padVolume: 0.14, drumPattern: "8beat", loops: 2 },

  // ════════════════════════════════════════════════════════════════
  // 026–035: NEO-SOUL & R&B — warm, lush, groovy
  // ════════════════════════════════════════════════════════════════

  { filename: "026_NeoSoul1_UpDownNR_Guitar_F_88.wav",
    preset: "Neo-Soul I", bpm: 88, pattern: 5, rate: "1/8T", instrument: "guitar",
    transpose: 0, octaveRange: 2, baseOctave: 3, velocity: 75, velRandom: 10, swing: 0.58,
    enablePad: true, padOctave: 4, padVolume: 0.14, drumPattern: "rnb", loops: 2 },

  { filename: "027_NeoSoul2_ThumbPinky_Piano_G_82.wav",
    preset: "Neo-Soul II", bpm: 82, pattern: 12, rate: "1/8T", instrument: "piano",
    transpose: 0, octaveRange: 1, baseOctave: 3, velocity: 72, swing: 0.62,
    enablePad: true, padOctave: 3, padVolume: 0.14, drumPattern: "rnb", loops: 2 },

  { filename: "028_RnBSmooth_Up_Piano_C_90.wav",
    preset: "R&B Smooth", bpm: 90, pattern: 1, rate: "1/8", instrument: "piano",
    transpose: 0, octaveRange: 2, baseOctave: 3, velocity: 78, swing: 0.58,
    enablePad: true, padOctave: 4, padVolume: 0.12, drumPattern: "rnb", loops: 2 },

  { filename: "029_NeoSoul1_PedalTone_Cello_Eb_76.wav",
    preset: "Neo-Soul I", bpm: 76, pattern: 20, rate: "1/8T", instrument: "cello",
    transpose: -1, octaveRange: 1, baseOctave: 3, velocity: 70, swing: 0.60,
    enablePad: true, padOctave: 3, padVolume: 0.16, drumPattern: "rnb", loops: 2 },

  { filename: "030_NeoSoul2_Block_Piano_Ab_78.wav",
    preset: "Neo-Soul II", bpm: 78, pattern: 0, rate: "1/2", instrument: "piano",
    transpose: 1, octaveRange: 1, baseOctave: 3, velocity: 68, swing: 0.60,
    enablePad: true, padOctave: 3, padVolume: 0.16, drumPattern: "rnb", loops: 2 },

  { filename: "031_RnBSmooth_Alberti_Guitar_D_86.wav",
    preset: "R&B Smooth", bpm: 86, pattern: 17, rate: "1/8T", instrument: "guitar",
    transpose: 2, octaveRange: 1, baseOctave: 3, velocity: 74, swing: 0.62,
    enablePad: true, padOctave: 4, padVolume: 0.10, drumPattern: "rnb", loops: 2 },

  { filename: "032_NeoSoul1_Broken3rds_Flute_F_92.wav",
    preset: "Neo-Soul I", bpm: 92, pattern: 19, rate: "1/8", instrument: "flute",
    transpose: 0, octaveRange: 2, baseOctave: 4, velocity: 76, swing: 0.56,
    enablePad: true, padOctave: 4, padVolume: 0.10, drumPattern: "rnb", loops: 2 },

  { filename: "033_NeoSoul2_DownUp_Violin_Bb_80.wav",
    preset: "Neo-Soul II", bpm: 80, pattern: 4, rate: "1/8", instrument: "violin",
    transpose: 3, octaveRange: 2, baseOctave: 4, velocity: 72,
    enablePad: true, padOctave: 4, padVolume: 0.12, drumPattern: "rnb", loops: 2 },

  { filename: "034_RnBSmooth_PinkyThumb_Piano_E_94.wav",
    preset: "R&B Smooth", bpm: 94, pattern: 11, rate: "1/8T", instrument: "piano",
    transpose: 4, octaveRange: 1, baseOctave: 3, velocity: 76, swing: 0.60,
    enablePad: true, padOctave: 3, padVolume: 0.12, drumPattern: "funk", loops: 2 },

  { filename: "035_NeoSoul1_AltBass_Guitar_C_84.wav",
    preset: "Neo-Soul I", bpm: 84, pattern: 21, rate: "1/8", instrument: "guitar",
    transpose: -5, octaveRange: 1, baseOctave: 3, velocity: 70, swing: 0.58,
    enablePad: true, padOctave: 3, padVolume: 0.14, drumPattern: "rnb", loops: 2 },

  // ════════════════════════════════════════════════════════════════
  // 036–045: BLUES — gritty, swung, dominant 7ths
  // ════════════════════════════════════════════════════════════════

  { filename: "036_12BarBlues_Up_Piano_A_120.wav",
    preset: "12-Bar Blues", bpm: 120, pattern: 1, rate: "1/8", instrument: "piano",
    transpose: 0, octaveRange: 1, baseOctave: 3, velocity: 90, swing: 0.65,
    enablePad: false, drumPattern: "swing", loops: 1 },

  { filename: "037_12BarBlues_Up_Guitar_E_100.wav",
    preset: "12-Bar Blues", bpm: 100, pattern: 1, rate: "1/8T", instrument: "guitar",
    transpose: 7, octaveRange: 1, baseOctave: 3, velocity: 88, swing: 0.64,
    enablePad: false, drumPattern: "swing", loops: 1 },

  { filename: "038_MinorBlues_Down_Piano_Am_90.wav",
    preset: "Minor Blues", bpm: 90, pattern: 2, rate: "1/8", instrument: "piano",
    transpose: 0, octaveRange: 1, baseOctave: 3, velocity: 82, swing: 0.62,
    enablePad: true, padOctave: 3, padVolume: 0.08, drumPattern: "swing", loops: 1 },

  { filename: "039_12BarBlues_Stride_Piano_Bb_108.wav",
    preset: "12-Bar Blues", bpm: 108, pattern: 18, rate: "1/4", instrument: "piano",
    transpose: 1, octaveRange: 1, baseOctave: 3, velocity: 92, swing: 0.66,
    enablePad: false, drumPattern: "swing", loops: 1 },

  { filename: "040_MinorBlues_RandomWalk_Clarinet_Dm_85.wav",
    preset: "Minor Blues", bpm: 85, pattern: 8, rate: "1/8T", instrument: "clarinet",
    transpose: 5, octaveRange: 1, baseOctave: 4, velocity: 78, swing: 0.60,
    enablePad: true, padOctave: 3, padVolume: 0.10, drumPattern: "swing", loops: 1 },

  { filename: "041_12BarBlues_1358_Piano_G_116.wav",
    preset: "12-Bar Blues", bpm: 116, pattern: 16, rate: "1/8", instrument: "piano",
    transpose: -2, octaveRange: 1, baseOctave: 3, velocity: 88, swing: 0.62,
    enablePad: false, drumPattern: "swing", loops: 1 },

  { filename: "042_MinorBlues_Up_Violin_Cm_78.wav",
    preset: "Minor Blues", bpm: 78, pattern: 1, rate: "1/8", instrument: "violin",
    transpose: 3, octaveRange: 2, baseOctave: 4, velocity: 76,
    enablePad: true, padOctave: 4, padVolume: 0.12, drumPattern: "8beat", loops: 1 },

  { filename: "043_12BarBlues_AltBass_Piano_D_124.wav",
    preset: "12-Bar Blues", bpm: 124, pattern: 21, rate: "1/8", instrument: "piano",
    transpose: 5, octaveRange: 1, baseOctave: 2, velocity: 90, swing: 0.64,
    enablePad: false, drumPattern: "swing", loops: 1 },

  { filename: "044_MinorBlues_153_Guitar_Em_92.wav",
    preset: "Minor Blues", bpm: 92, pattern: 13, rate: "1/8T", instrument: "guitar",
    transpose: 7, octaveRange: 1, baseOctave: 3, velocity: 80, swing: 0.58,
    enablePad: true, padOctave: 3, padVolume: 0.08, drumPattern: "swing", loops: 1 },

  { filename: "045_12BarBlues_Block_Piano_C_96.wav",
    preset: "12-Bar Blues", bpm: 96, pattern: 0, rate: "1/4", instrument: "piano",
    transpose: 3, octaveRange: 1, baseOctave: 3, velocity: 85, swing: 0.66,
    enablePad: false, drumPattern: "swing", loops: 1 },

  // ════════════════════════════════════════════════════════════════
  // 046–055: LATIN & BOSSA — rhythmic, warm
  // ════════════════════════════════════════════════════════════════

  { filename: "046_Bossa_Up_Piano_C_130.wav",
    preset: "Bossa Nova", bpm: 130, pattern: 1, rate: "1/8", instrument: "piano",
    transpose: 0, octaveRange: 1, baseOctave: 3, velocity: 78,
    enablePad: true, padOctave: 4, padVolume: 0.10, drumPattern: "bossanova", loops: 2 },

  { filename: "047_Bossa_153_Guitar_F_125.wav",
    preset: "Bossa Nova", bpm: 125, pattern: 13, rate: "1/8", instrument: "guitar",
    transpose: 5, octaveRange: 1, baseOctave: 3, velocity: 74,
    enablePad: true, padOctave: 4, padVolume: 0.10, drumPattern: "bossanova", loops: 2 },

  { filename: "048_Ipanema_Alberti_Piano_F_120.wav",
    preset: "Girl from Ipanema", bpm: 120, pattern: 17, rate: "1/8", instrument: "piano",
    transpose: 0, octaveRange: 1, baseOctave: 3, velocity: 76,
    enablePad: true, padOctave: 4, padVolume: 0.12, drumPattern: "bossanova", loops: 1 },

  { filename: "049_Ipanema_UpDown_Flute_Ab_115.wav",
    preset: "Girl from Ipanema", bpm: 115, pattern: 3, rate: "1/8", instrument: "flute",
    transpose: 3, octaveRange: 2, baseOctave: 4, velocity: 72,
    enablePad: true, padOctave: 4, padVolume: 0.10, drumPattern: "bossanova", loops: 1 },

  { filename: "050_Bossa_PedalTone_Clarinet_G_118.wav",
    preset: "Bossa Nova", bpm: 118, pattern: 20, rate: "1/8", instrument: "clarinet",
    transpose: 7, octaveRange: 1, baseOctave: 4, velocity: 76,
    enablePad: true, padOctave: 4, padVolume: 0.08, drumPattern: "bossanova", loops: 2 },

  { filename: "051_Andalusian_Down_Guitar_Am_105.wav",
    preset: "Andalusian Cadence", bpm: 105, pattern: 2, rate: "1/8", instrument: "guitar",
    transpose: 0, octaveRange: 2, baseOctave: 3, velocity: 88, accentEvery: 4,
    enablePad: true, padOctave: 4, padVolume: 0.12, drumPattern: "8beat", loops: 2 },

  { filename: "052_Andalusian_Up_Violin_Dm_95.wav",
    preset: "Andalusian Cadence", bpm: 95, pattern: 1, rate: "1/8", instrument: "violin",
    transpose: 5, octaveRange: 2, baseOctave: 4, velocity: 82,
    enablePad: true, padOctave: 4, padVolume: 0.14, drumPattern: "bossanova", loops: 2 },

  { filename: "053_Bossa_InsideOut_Piano_Bb_110.wav",
    preset: "Bossa Nova", bpm: 110, pattern: 10, rate: "1/8T", instrument: "piano",
    transpose: -2, octaveRange: 1, baseOctave: 3, velocity: 74,
    enablePad: true, padOctave: 3, padVolume: 0.10, drumPattern: "bossanova", loops: 2 },

  { filename: "054_RoyalRoad_Up_Piano_F_112.wav",
    preset: "Royal Road (JP)", bpm: 112, pattern: 1, rate: "1/8", instrument: "piano",
    transpose: 0, octaveRange: 2, baseOctave: 3, velocity: 84,
    enablePad: true, padOctave: 4, padVolume: 0.12, drumPattern: "poprock", loops: 2 },

  { filename: "055_RoyalRoad_UpDown_Violin_A_100.wav",
    preset: "Royal Road (JP)", bpm: 100, pattern: 3, rate: "1/8", instrument: "violin",
    transpose: 4, octaveRange: 2, baseOctave: 4, velocity: 80,
    enablePad: true, padOctave: 4, padVolume: 0.14, drumPattern: "8beat", loops: 2 },

  // ════════════════════════════════════════════════════════════════
  // 056–065: MODAL & AMBIENT — spacious, atmospheric
  // ════════════════════════════════════════════════════════════════

  { filename: "056_DorianVamp_Up_Piano_Dm_110.wav",
    preset: "Dorian Vamp", bpm: 110, pattern: 1, rate: "1/8", instrument: "piano",
    transpose: 0, octaveRange: 2, baseOctave: 3, velocity: 80, swing: 0.55,
    enablePad: true, padOctave: 4, padVolume: 0.12, drumPattern: "funk", loops: 3 },

  { filename: "057_LydianFloat_UpDown_Piano_C_90.wav",
    preset: "Lydian Float", bpm: 90, pattern: 3, rate: "1/8", instrument: "piano",
    transpose: 0, octaveRange: 2, baseOctave: 3, velocity: 72,
    enablePad: true, padOctave: 4, padVolume: 0.16, drumPattern: "arpeggio", loops: 3 },

  { filename: "058_AmbientPads_Block_Piano_C_60.wav",
    preset: "Ambient Pads", bpm: 60, pattern: 0, rate: "1/1", instrument: "piano",
    transpose: 0, octaveRange: 1, baseOctave: 3, velocity: 60, gatePercent: 0.95,
    enablePad: true, padOctave: 4, padVolume: 0.20, drumPattern: "none", loops: 2 },

  { filename: "059_AmbientPads_Up_Flute_Eb_55.wav",
    preset: "Ambient Pads", bpm: 55, pattern: 1, rate: "1/4", instrument: "flute",
    transpose: 3, octaveRange: 2, baseOctave: 4, velocity: 55,
    enablePad: true, padOctave: 4, padVolume: 0.22, drumPattern: "none", loops: 2 },

  { filename: "060_DorianVamp_Broken3rds_Clarinet_Gm_118.wav",
    preset: "Dorian Vamp", bpm: 118, pattern: 19, rate: "1/8", instrument: "clarinet",
    transpose: 5, octaveRange: 1, baseOctave: 4, velocity: 78, swing: 0.56,
    enablePad: true, padOctave: 4, padVolume: 0.10, drumPattern: "funk", loops: 3 },

  { filename: "061_LydianFloat_PedalTone_Violin_G_85.wav",
    preset: "Lydian Float", bpm: 85, pattern: 20, rate: "1/8", instrument: "violin",
    transpose: 7, octaveRange: 2, baseOctave: 4, velocity: 70,
    enablePad: true, padOctave: 4, padVolume: 0.18, drumPattern: "none", loops: 3 },

  { filename: "062_AmbientPads_Random_Piano_F_50.wav",
    preset: "Ambient Pads", bpm: 50, pattern: 7, rate: "1/4", instrument: "piano",
    transpose: 5, octaveRange: 2, baseOctave: 3, velocity: 50,
    enablePad: true, padOctave: 4, padVolume: 0.24, reverbMix: 0.35, drumPattern: "none", loops: 2 },

  { filename: "063_DorianVamp_AltBass_Guitar_Am_125.wav",
    preset: "Dorian Vamp", bpm: 125, pattern: 21, rate: "1/8", instrument: "guitar",
    transpose: 7, octaveRange: 1, baseOctave: 3, velocity: 82, swing: 0.55,
    enablePad: false, drumPattern: "funk", loops: 3 },

  { filename: "064_Pachelbel_Up_Piano_C_72.wav",
    preset: "Pachelbel Canon", bpm: 72, pattern: 1, rate: "1/8", instrument: "piano",
    transpose: 0, octaveRange: 2, baseOctave: 3, velocity: 75,
    enablePad: true, padOctave: 4, padVolume: 0.14, drumPattern: "none", loops: 2 },

  { filename: "065_Pachelbel_UpDown_Cello_D_68.wav",
    preset: "Pachelbel Canon", bpm: 68, pattern: 3, rate: "1/8", instrument: "cello",
    transpose: 2, octaveRange: 1, baseOctave: 3, velocity: 72,
    enablePad: true, padOctave: 3, padVolume: 0.16, drumPattern: "none", loops: 2 },

  // ════════════════════════════════════════════════════════════════
  // 066–075: EDM & ELECTRONIC — driving, energetic
  // ════════════════════════════════════════════════════════════════

  { filename: "066_EDM_Up_Piano_Am_128.wav",
    preset: "EDM Anthem", bpm: 128, pattern: 1, rate: "1/16", instrument: "piano",
    transpose: 0, octaveRange: 2, baseOctave: 3, velocity: 95, accentEvery: 4, accentAmount: 25,
    enablePad: true, padOctave: 4, padVolume: 0.14, drumPattern: "16beat", loops: 2 },

  { filename: "067_EDM_PedalTone_Flute_Cm_136.wav",
    preset: "EDM Anthem", bpm: 136, pattern: 20, rate: "1/16", instrument: "flute",
    transpose: 3, octaveRange: 2, baseOctave: 4, velocity: 92, accentEvery: 8,
    enablePad: true, padOctave: 4, padVolume: 0.12, drumPattern: "16beat", loops: 2 },

  { filename: "068_Trance_UpDown_Piano_Am_140.wav",
    preset: "Trance", bpm: 140, pattern: 5, rate: "1/16", instrument: "piano",
    transpose: 0, octaveRange: 3, baseOctave: 3, velocity: 90, accentEvery: 8,
    enablePad: true, padOctave: 4, padVolume: 0.16, drumPattern: "8beat", loops: 2 },

  { filename: "069_Trance_Up_Piano_Fm_138.wav",
    preset: "Trance", bpm: 138, pattern: 1, rate: "1/16", instrument: "piano",
    transpose: 8, octaveRange: 3, baseOctave: 3, velocity: 92,
    enablePad: true, padOctave: 4, padVolume: 0.14, drumPattern: "16beat", loops: 2 },

  { filename: "070_House_Up_Piano_Cm_124.wav",
    preset: "House", bpm: 124, pattern: 1, rate: "1/8", instrument: "piano",
    transpose: 0, octaveRange: 2, baseOctave: 3, velocity: 88,
    enablePad: true, padOctave: 4, padVolume: 0.12, drumPattern: "16beat", loops: 2 },

  { filename: "071_House_Block_Piano_Fm_126.wav",
    preset: "House", bpm: 126, pattern: 0, rate: "1/4", instrument: "piano",
    transpose: 5, octaveRange: 1, baseOctave: 3, velocity: 85,
    enablePad: true, padOctave: 4, padVolume: 0.16, drumPattern: "16beat", loops: 2 },

  { filename: "072_EDM_158_Guitar_Em_132.wav",
    preset: "EDM Anthem", bpm: 132, pattern: 15, rate: "1/16", instrument: "guitar",
    transpose: 7, octaveRange: 2, baseOctave: 3, velocity: 94, accentEvery: 4,
    enablePad: true, padOctave: 4, padVolume: 0.10, drumPattern: "16beat", loops: 2 },

  { filename: "073_Trance_OutsideIn_Piano_Dm_142.wav",
    preset: "Trance", bpm: 142, pattern: 9, rate: "1/16", instrument: "piano",
    transpose: 5, octaveRange: 2, baseOctave: 3, velocity: 90,
    enablePad: true, padOctave: 4, padVolume: 0.14, drumPattern: "8beat", loops: 2 },

  { filename: "074_House_Broken3rds_Piano_Gm_122.wav",
    preset: "House", bpm: 122, pattern: 19, rate: "1/8", instrument: "piano",
    transpose: 7, octaveRange: 2, baseOctave: 3, velocity: 86,
    enablePad: true, padOctave: 4, padVolume: 0.12, drumPattern: "16beat", loops: 2 },

  { filename: "075_EDM_DownUp_Piano_Bbm_130.wav",
    preset: "EDM Anthem", bpm: 130, pattern: 4, rate: "1/16", instrument: "piano",
    transpose: 1, octaveRange: 3, baseOctave: 3, velocity: 92, accentEvery: 8,
    enablePad: true, padOctave: 4, padVolume: 0.14, drumPattern: "16beat", loops: 2 },

  // ════════════════════════════════════════════════════════════════
  // 076–090: CUSTOM PROGRESSIONS — slash chords, creative voicings
  // ════════════════════════════════════════════════════════════════

  { filename: "076_Custom_CGAmEF_Guitar_105.wav",
    preset: "C G Am/E F", beatsPerChord: 4,
    bpm: 105, pattern: 5, rate: "1/8", instrument: "guitar",
    octaveRange: 2, baseOctave: 3, velocity: 80, velRandom: 8,
    enablePad: true, padOctave: 4, padVolume: 0.10, drumPattern: "acousticpop", loops: 2 },

  { filename: "077_Custom_JazzSlash_Piano_92.wav",
    preset: "Dm9 | G7/B | Cmaj7 | Am7/E", beatsPerChord: 4,
    bpm: 92, pattern: 13, rate: "1/8T", instrument: "piano",
    velocity: 75, swing: 0.60,
    enablePad: true, padOctave: 3, padVolume: 0.14, drumPattern: "bossanova", loops: 2 },

  { filename: "078_Custom_EmCGD_Violin_88.wav",
    preset: "Em | C | G/B | D", beatsPerChord: 4,
    bpm: 88, pattern: 3, rate: "1/8", instrument: "violin",
    octaveRange: 2, baseOctave: 4, velocity: 80,
    enablePad: true, padOctave: 4, padVolume: 0.14, drumPattern: "8beat", loops: 2 },

  { filename: "079_Custom_FmBbEbAb_Piano_72.wav",
    preset: "Fm | Bb | Eb | Ab", beatsPerChord: 4,
    bpm: 72, pattern: 1, rate: "1/8", instrument: "piano",
    octaveRange: 2, baseOctave: 3, velocity: 74,
    enablePad: true, padOctave: 4, padVolume: 0.16, drumPattern: "arpeggio", loops: 2 },

  { filename: "080_Custom_Cm7Fm7BbGm_Guitar_95.wav",
    preset: "Cm7 | Fm7 | Bb7 | Gm7", beatsPerChord: 4,
    bpm: 95, pattern: 17, rate: "1/8T", instrument: "guitar",
    velocity: 76, swing: 0.58,
    enablePad: true, padOctave: 3, padVolume: 0.12, drumPattern: "rnb", loops: 2 },

  { filename: "081_Custom_Dsus4_DmCG_Piano_100.wav",
    preset: "Dsus4 | Dm | C | G", beatsPerChord: 4,
    bpm: 100, pattern: 5, rate: "1/8", instrument: "piano",
    octaveRange: 2, baseOctave: 3, velocity: 82,
    enablePad: true, padOctave: 4, padVolume: 0.12, drumPattern: "poprock", loops: 2 },

  { filename: "082_Custom_AmFCG_Trans5_Flute_80.wav",
    preset: "Am F C/G G", beatsPerChord: 4,
    bpm: 80, pattern: 1, rate: "1/8", instrument: "flute",
    transpose: 5, octaveRange: 2, baseOctave: 4, velocity: 74,
    enablePad: true, padOctave: 4, padVolume: 0.14, drumPattern: "8beat", loops: 2 },

  { filename: "083_Custom_Fmaj7Em7Am7Dm7_Piano_86.wav",
    preset: "Fmaj7 | Em7 | Am7 | Dm7/A", beatsPerChord: 4,
    bpm: 86, pattern: 12, rate: "1/8T", instrument: "piano",
    velocity: 72, swing: 0.60,
    enablePad: true, padOctave: 3, padVolume: 0.14, drumPattern: "bossanova", loops: 2 },

  { filename: "084_Custom_Power_Guitar_E5_150.wav",
    preset: "E5 | A5 | B5 | A5", beatsPerChord: 4,
    bpm: 150, pattern: 0, rate: "1/4", instrument: "guitar",
    octaveRange: 1, baseOctave: 2, velocity: 110, accentEvery: 2, accentAmount: 30,
    enablePad: false, enableBass: true, drumPattern: "poprock", loops: 2 },

  { filename: "085_Custom_Gbmaj7_Ebm7_Abm7_Db7_Piano_78.wav",
    preset: "Gbmaj7 | Ebm7 | Abm7 | Db7", beatsPerChord: 4,
    bpm: 78, pattern: 17, rate: "1/8", instrument: "piano",
    velocity: 70, swing: 0.62,
    enablePad: true, padOctave: 3, padVolume: 0.14, drumPattern: "swing", loops: 2 },

  { filename: "086_Custom_WalkDown_CBAm_Cello_68.wav",
    preset: "C | C/B | Am | Am/G | F | G", beatsPerChord: 2,
    bpm: 68, pattern: 1, rate: "1/8", instrument: "cello",
    octaveRange: 1, baseOctave: 3, velocity: 74,
    enablePad: true, padOctave: 3, padVolume: 0.16, drumPattern: "none", loops: 3 },

  { filename: "087_Custom_Minor9ths_Piano_85.wav",
    preset: "Am9 | Dm9 | Gmaj9 | Cmaj9", beatsPerChord: 4,
    bpm: 85, pattern: 5, rate: "1/8", instrument: "piano",
    octaveRange: 1, baseOctave: 3, velocity: 68,
    enablePad: true, padOctave: 4, padVolume: 0.18, reverbMix: 0.28, drumPattern: "rnb", loops: 2 },

  { filename: "088_Custom_Dim_Augmented_Piano_110.wav",
    preset: "C | Cdim | Db | Dbaug", beatsPerChord: 4,
    bpm: 110, pattern: 9, rate: "1/8", instrument: "piano",
    octaveRange: 1, baseOctave: 3, velocity: 80,
    enablePad: true, padOctave: 4, padVolume: 0.10, drumPattern: "8beat", loops: 2 },

  { filename: "089_Custom_Sus4_Resolve_Guitar_98.wav",
    preset: "Csus4 | C | Fsus4 | F | Gsus4 | G | Csus4 | C", beatsPerChord: 2,
    bpm: 98, pattern: 1, rate: "1/8", instrument: "guitar",
    octaveRange: 2, baseOctave: 3, velocity: 78,
    enablePad: true, padOctave: 4, padVolume: 0.12, drumPattern: "acousticpop", loops: 2 },

  { filename: "090_Custom_MinorWaltz_Violin_75.wav",
    preset: "Am | Dm/F | E7 | Am", beatsPerChord: 6,
    bpm: 75, pattern: 3, rate: "1/4", instrument: "violin",
    octaveRange: 2, baseOctave: 4, velocity: 76,
    enablePad: true, padOctave: 4, padVolume: 0.16, drumPattern: "waltz", loops: 2 },

  // ════════════════════════════════════════════════════════════════
  // 091–100: SPECIAL COMBOS — unusual pairings & edge cases
  // ════════════════════════════════════════════════════════════════

  { filename: "091_Pachelbel_16th_Flute_G_80.wav",
    preset: "Pachelbel Canon", bpm: 80, pattern: 1, rate: "1/16", instrument: "flute",
    transpose: 7, octaveRange: 2, baseOctave: 4, velocity: 70,
    enablePad: true, padOctave: 4, padVolume: 0.14, drumPattern: "none", loops: 2 },

  { filename: "092_Gospel_UpDown_Piano_C_104.wav",
    preset: "Gospel", bpm: 104, pattern: 3, rate: "1/8", instrument: "piano",
    transpose: 0, octaveRange: 2, baseOctave: 3, velocity: 90, accentEvery: 4,
    enablePad: true, padOctave: 3, padVolume: 0.14, drumPattern: "8beat", loops: 2 },

  { filename: "093_Ipanema_Random_Guitar_Db_108.wav",
    preset: "Girl from Ipanema", bpm: 108, pattern: 7, rate: "1/8", instrument: "guitar",
    transpose: -4, octaveRange: 1, baseOctave: 3, velocity: 72,
    enablePad: true, padOctave: 4, padVolume: 0.10, drumPattern: "bossanova", loops: 1 },

  { filename: "094_NeoSoul_WidePiano_4oct_F_80.wav",
    preset: "Neo-Soul I", bpm: 80, pattern: 1, rate: "1/16", instrument: "piano",
    transpose: 0, octaveRange: 4, baseOctave: 2, velocity: 65, swing: 0.58,
    enablePad: true, padOctave: 4, padVolume: 0.16, drumPattern: "rnb", loops: 2 },

  { filename: "095_EDM_NoBass_NoDrums_Piano_Am_120.wav",
    preset: "EDM Anthem", bpm: 120, pattern: 5, rate: "1/16", instrument: "piano",
    transpose: 0, octaveRange: 3, baseOctave: 3, velocity: 80,
    enableBass: false, enableDrums: false,
    enablePad: true, padOctave: 4, padVolume: 0.20, reverbMix: 0.30, loops: 2 },

  { filename: "096_Custom_OneChord_Dm7_Funky_130.wav",
    preset: "Dm7", beatsPerChord: 8,
    bpm: 130, pattern: 7, rate: "1/16", instrument: "piano",
    octaveRange: 2, baseOctave: 3, velocity: 88, swing: 0.56,
    enablePad: true, padOctave: 3, padVolume: 0.08, drumPattern: "funk", loops: 4 },

  { filename: "097_Custom_HeavyReverb_Ambient_55.wav",
    preset: "Cmaj9 | Fmaj9 | Am9 | Em7", beatsPerChord: 8,
    bpm: 55, pattern: 1, rate: "1/4", instrument: "piano",
    octaveRange: 2, baseOctave: 3, velocity: 50,
    enablePad: true, padOctave: 4, padVolume: 0.24, reverbMix: 0.40,
    enableDrums: false, loops: 2 },

  { filename: "098_SteellyDan_Down_Guitar_C_100.wav",
    preset: "Steely Dan", bpm: 100, pattern: 2, rate: "1/8", instrument: "guitar",
    transpose: 0, octaveRange: 1, baseOctave: 3, velocity: 76, swing: 0.58,
    enablePad: true, padOctave: 3, padVolume: 0.10, drumPattern: "funk", loops: 2 },

  { filename: "099_Custom_AllSus_Clarinet_90.wav",
    preset: "Csus2 | Fsus4 | Gsus4 | Csus2", beatsPerChord: 4,
    bpm: 90, pattern: 10, rate: "1/8", instrument: "clarinet",
    octaveRange: 1, baseOctave: 4, velocity: 74,
    enablePad: true, padOctave: 4, padVolume: 0.16, drumPattern: "arpeggio", loops: 2 },

  { filename: "100_Custom_Cinematic_Violin_60.wav",
    preset: "Am | Am/G | F | Fmaj7 | Dm7 | Dm7/C | E7 | E7", beatsPerChord: 4,
    bpm: 60, pattern: 3, rate: "1/8", instrument: "violin",
    octaveRange: 2, baseOctave: 4, velocity: 68,
    enablePad: true, padOctave: 4, padVolume: 0.20, reverbMix: 0.32,
    enableDrums: false, loops: 2 }
];

module.exports = { RENDER_JOBS, OUTPUT_DIR };
