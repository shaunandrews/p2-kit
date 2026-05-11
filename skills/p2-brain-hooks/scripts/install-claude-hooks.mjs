#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function findProjectRoot() {
  try {
    return execFileSync("git", ["rev-parse", "--show-toplevel"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return process.cwd();
  }
}

function readJson(file) {
  if (!fs.existsSync(file)) {
    return {};
  }
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function ensureHook(settings, eventName, entry) {
  settings.hooks ||= {};
  settings.hooks[eventName] ||= [];

  const command = entry.hooks[0].command;
  settings.hooks[eventName] = settings.hooks[eventName].filter((existing) => {
    const hooks = Array.isArray(existing.hooks) ? existing.hooks : [];
    return !hooks.some((hook) => hook && hook.command === command);
  });

  settings.hooks[eventName].push(entry);
}

function parsePointer(pointerText) {
  const result = {};
  for (const line of pointerText.split(/\r?\n/)) {
    const match = line.match(/^- ([^:]+):\s*(.*)$/);
    if (match) {
      result[match[1].trim().toLowerCase()] = match[2].trim();
    }
  }
  return result;
}

const projectRoot = findProjectRoot();
const pointerPath = path.join(projectRoot, "P2-BRAIN.md");

if (!fs.existsSync(pointerPath)) {
  console.error(`P2-BRAIN.md not found in ${projectRoot}. Run p2-brain-init first.`);
  process.exit(1);
}

const pointer = parsePointer(fs.readFileSync(pointerPath, "utf8"));
const hookSource = path.join(__dirname, "p2-brain-hook.mjs");
const hookDir = path.join(projectRoot, ".p2-kit", "hooks");
const stateDir = path.join(projectRoot, ".p2-kit", "state");
const hookTarget = path.join(hookDir, "p2-brain-hook.mjs");

fs.mkdirSync(hookDir, { recursive: true });
fs.mkdirSync(stateDir, { recursive: true });
fs.copyFileSync(hookSource, hookTarget);
fs.chmodSync(hookTarget, 0o755);

const settingsPath = path.join(projectRoot, ".claude", "settings.local.json");
const settings = readJson(settingsPath);
const commandBase = 'node "$CLAUDE_PROJECT_DIR/.p2-kit/hooks/p2-brain-hook.mjs"';

ensureHook(settings, "SessionStart", {
  matcher: "startup|resume|clear|compact",
  hooks: [
    {
      type: "command",
      command: `${commandBase} session-start`,
      timeout: 10,
      statusMessage: "Loading P2 brain",
    },
  ],
});

ensureHook(settings, "PostToolUse", {
  matcher: "Bash|Edit|Write|MultiEdit|NotebookEdit|mcp__.*",
  hooks: [
    {
      type: "command",
      command: `${commandBase} post-tool-use`,
      timeout: 10,
      statusMessage: "Tracking P2 brain session activity",
    },
  ],
});

ensureHook(settings, "Stop", {
  hooks: [
    {
      type: "command",
      command: `${commandBase} stop`,
      timeout: 900,
      statusMessage: "Publishing P2 brain session memory",
    },
  ],
});

ensureHook(settings, "SessionEnd", {
  hooks: [
    {
      type: "command",
      command: `${commandBase} session-end`,
      timeout: 900,
      statusMessage: "Finalizing P2 brain session memory",
    },
  ],
});

writeJson(settingsPath, settings);

console.log(JSON.stringify({
  projectRoot,
  brain: pointer.brain || null,
  brainUrl: pointer["brain url"] || null,
  settingsPath,
  hookTarget,
  hooks: ["SessionStart", "PostToolUse", "Stop", "SessionEnd"],
}, null, 2));
