# Publishing Guide

Step-by-step to get `chord-synth` discoverable by autonomous agents.

---

## 1. GitHub (do this first — everything else links here)

```bash
# Create the repo
gh repo create chord-synth --public --source=. --push

# Or manually:
git init
git add -A
git commit -m "chord-synth v1.0.0 — MCP + CLI + module for chord progression WAV generation"
git branch -M main
git remote add origin https://github.com/Misfits-Rebels-Outcasts/chord-synth.git
git push -u origin main
```

Then update these placeholders in `package.json`:
- `YOUR_USERNAME` → your GitHub username (3 occurrences)

Add a release tag:
```bash
git tag v1.0.0
git push origin v1.0.0
```

### GitHub repo settings
- **About** description: `Generate chord progression WAV files via MCP server, CLI, or Node.js module. 28 presets, 22 arp patterns, 7 instruments. Zero dependencies.`
- **Topics**: `mcp`, `mcp-server`, `music`, `synthesizer`, `chord-progression`, `wav`, `audio`, `ai-tools`, `agent-tools`

---

## 2. npm

```bash
# Login (one-time)
npm login

# Verify what will be published
npm pack --dry-run

# Publish
npm publish
```

After publish, agents can use it via:
```bash
# Global install
npm install -g chord-synth
chord-synth --schema

# Or npx (no install needed)
npx chord-synth --preset "C G Am F" --output test.wav

# Or as module
npm install chord-synth
```

### Verify it works after publish:
```bash
npx chord-synth --schema | head -5
npx chord-synth --preset "Am F C G" --bpm 100 --output /tmp/verify.wav
```

---

## 3. Smithery.ai (MCP server registry)

Smithery auto-discovers servers from GitHub repos that have a `smithery.yaml` in root.

### Option A: Publish via Smithery CLI
```bash
npm install -g @smithery/cli@latest
smithery namespace create YOUR_USERNAME
smithery mcp publish "https://github.com/YOUR_USERNAME/chord-synth" -n YOUR_USERNAME/chord-synth
```

### Option B: Publish via web
1. Go to https://smithery.ai
2. Click "Add Server"
3. Enter your GitHub repo URL: `https://github.com/YOUR_USERNAME/chord-synth`
4. Smithery reads `smithery.yaml` automatically

### After listing, users install with:
```bash
smithery mcp add YOUR_USERNAME/chord-synth
```

Or in Claude Desktop `claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "chord-synth": {
      "command": "npx",
      "args": ["-y", "chord-synth", "mcp"]
    }
  }
}
```

---

## 4. Anthropic MCP Servers List (community PR)

This is the curated list at https://github.com/modelcontextprotocol/servers — highest visibility among Claude users.

1. Fork `https://github.com/modelcontextprotocol/servers`
2. Edit `README.md`, add under **Community Servers** (alphabetical):

```markdown
- **[Chord Synth](https://github.com/YOUR_USERNAME/chord-synth)** - Generate chord progression WAV files with 28 presets, 22 arp patterns, 7 instruments, slash chords, and transposition. Zero dependencies.
```

3. Submit PR with title: `Add chord-synth — audio synthesis MCP server`

---

## 5. Other registries (optional, broader reach)

### mcp.so
Community MCP directory. Submit at https://mcp.so — just provide GitHub URL and description.

### Glama.ai
Another MCP directory. Add a `glama.json` to your repo root (already included in this package), then submit at https://glama.ai.

---

## 6. Verification checklist

After publishing, verify each channel works:

```bash
# npm — agent with shell access
npx chord-synth --schema
npx chord-synth --list
npx chord-synth --preset "Dm7 G7 Cmaj7" --output /tmp/test.wav

# npm — agent writing code
node -e "const s = require('chord-synth'); console.log(s.SCHEMA.properties.preset.description)"

# MCP — Claude Desktop (after config)
# Ask Claude: "Use chord-synth to generate a sad violin arpeggio"

# Smithery — after listing
smithery mcp search "chord"
smithery tool find "generate wav"
```

---

## How agents actually find this

| Channel | How agent discovers it | Friction |
|---------|----------------------|----------|
| **MCP config** | Human adds to `claude_desktop_config.json` or `claude mcp add` | One-time setup, then zero friction |
| **Smithery** | `smithery mcp search "music"` or `smithery tool find "chord"` | Requires Smithery CLI |
| **npm** | Agent runs `npm search chord wav` or tries `npx chord-synth --schema` | Agent needs shell access |
| **require()** | Agent writes `const s = require('chord-synth')` and reads `s.SCHEMA` | Agent needs npm install |
| **GitHub** | Web search finds repo → human configures MCP | Indirect, but SEO works |

The MCP server is the primary agent interface. Everything else is a path to getting that MCP connection configured.
