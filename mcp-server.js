#!/usr/bin/env node
/**
 * chord-synth MCP Server
 * 
 * Model Context Protocol server over stdio (JSON-RPC 2.0).
 * Zero external dependencies — uses raw stdio transport.
 * 
 * Exposes two tools:
 *   - generate_wav:  Render a chord progression to a WAV file
 *   - list_options:  Return all available presets, patterns, instruments, drums
 * 
 * Add to your MCP client config:
 * 
 *   claude_desktop_config.json:
 *   {
 *     "mcpServers": {
 *       "chord-synth": {
 *         "command": "node",
 *         "args": ["-y", "chord-synth", "mcp"]
 *       }
 *     }
 *   }
 * 
 *   Claude Code:
 *   claude mcp add chord-synth -- node /path/to/chord-synth/mcp-server.js
 */

'use strict';

const fs = require('fs');
const path = require('path');
const engine = require('./lib/synth-engine');

// ── MCP Tool Definitions ──

const TOOLS = [
  {
    name: "generate_wav",
    description: "Generate a chord progression WAV file. Supports 28 named presets (e.g. 'I-V-vi-IV (Pop)', 'Autumn Leaves', 'ii-V-I (Jazz)') or custom chord strings (e.g. 'C G Am/E F', 'Dm7 | G7 | Cmaj7'). Slash chords like Am/E set the bass note. Returns the file path of the rendered WAV.",
    inputSchema: {
      type: "object",
      required: ["preset"],
      properties: {
        ...engine.SCHEMA.properties,
        output_path: { type: "string", description: "File path to write the WAV. Defaults to CHORD_SYNTH_OUTPUT_DIR env var or current directory. If a directory, uses filename param or auto-generates." },
        filename: { type: "string", description: "WAV filename when output_path is a directory. Default: chord_synth_output.wav" }
      }
    }
  },
  {
    name: "list_options",
    description: "List all available chord presets, arpeggio patterns, instruments, drum patterns, and note rates. Use this before generate_wav to discover options.",
    inputSchema: {
      type: "object",
      properties: {
        category: {
          type: "string",
          description: "Optional: filter to one category.",
          enum: ["presets", "patterns", "instruments", "drums", "rates", "all"]
        }
      }
    }
  }
];

// ── Tool Handlers ──

function handleGenerateWav(params) {
  const defaultDir = process.env.CHORD_SYNTH_OUTPUT_DIR || '.';
  const outputPath = params.output_path || defaultDir;
  if (!outputPath) return { error: "output_path is required" };

  let filePath = outputPath;
  if (fs.existsSync(outputPath) && fs.statSync(outputPath).isDirectory()) {
    const fname = params.filename || 'chord_synth_output.wav';
    filePath = path.join(outputPath, fname);
  }

  fs.mkdirSync(path.dirname(path.resolve(filePath)), { recursive: true });

  // Remove non-engine params before passing to renderJob
  const job = { ...params };
  delete job.output_path;
  delete job.filename;

  const wavData = engine.renderJob(job);
  fs.writeFileSync(filePath, wavData);

  const durationSec = (wavData.length - 44) / (engine.SAMPLE_RATE * 2);

  return {
    content: [{
      type: "text",
      text: JSON.stringify({
        status: "success",
        file: path.resolve(filePath),
        size_bytes: wavData.length,
        size_mb: (wavData.length / 1048576).toFixed(1),
        duration_seconds: durationSec.toFixed(1),
        preset: params.preset,
        bpm: params.bpm || 120,
        instrument: params.instrument || "piano",
        transpose: params.transpose || 0
      }, null, 2)
    }]
  };
}

function handleListOptions(params) {
  const cat = (params && params.category) || "all";
  const data = {};

  if (cat === "all" || cat === "presets")     data.presets = engine.PRESETS;
  if (cat === "all" || cat === "patterns")    data.patterns = engine.PATTERNS;
  if (cat === "all" || cat === "instruments") data.instruments = engine.INSTRUMENTS;
  if (cat === "all" || cat === "drums")       data.drums = engine.DRUMS;
  if (cat === "all" || cat === "rates")       data.rates = engine.RATES;

  return {
    content: [{ type: "text", text: JSON.stringify(data, null, 2) }]
  };
}

// ── MCP JSON-RPC Transport (stdio) ──

const SERVER_INFO = {
  name: "chord-synth",
  version: require('./package.json').version
};

const CAPABILITIES = {
  tools: {}
};

function handleRequest(msg) {
  switch (msg.method) {
    case "initialize":
      return { protocolVersion: "2024-11-05", capabilities: CAPABILITIES, serverInfo: SERVER_INFO };

    case "notifications/initialized":
      return null; // no response needed

    case "tools/list":
      return { tools: TOOLS };

    case "tools/call": {
      const name = msg.params && msg.params.name;
      const args = (msg.params && msg.params.arguments) || {};
      try {
        if (name === "generate_wav")  return handleGenerateWav(args);
        if (name === "list_options")  return handleListOptions(args);
        return { content: [{ type: "text", text: `Unknown tool: ${name}` }], isError: true };
      } catch (err) {
        return { content: [{ type: "text", text: `Error: ${err.message}` }], isError: true };
      }
    }

    default:
      throw { code: -32601, message: `Method not found: ${msg.method}` };
  }
}

// ── Stdio Line Reader ──

let buffer = '';

process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => {
  buffer += chunk;
  // MCP uses newline-delimited JSON
  const lines = buffer.split('\n');
  buffer = lines.pop(); // keep incomplete last line
  for (const line of lines) {
    if (!line.trim()) continue;
    try {
      const msg = JSON.parse(line);
      const result = handleRequest(msg);
      if (result !== null && msg.id !== undefined) {
        const response = { jsonrpc: "2.0", id: msg.id, result };
        process.stdout.write(JSON.stringify(response) + '\n');
      }
    } catch (err) {
      if (err.code) {
        // JSON-RPC error
        const parsed = (() => { try { return JSON.parse(line); } catch { return {}; } })();
        if (parsed.id !== undefined) {
          process.stdout.write(JSON.stringify({
            jsonrpc: "2.0", id: parsed.id,
            error: { code: err.code, message: err.message }
          }) + '\n');
        }
      } else {
        process.stderr.write(`MCP error: ${err.message}\n`);
      }
    }
  }
});

process.stderr.write('chord-synth MCP server started on stdio\n');
