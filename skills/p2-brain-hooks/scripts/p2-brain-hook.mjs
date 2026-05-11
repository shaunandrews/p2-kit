#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const action = process.argv[2] || "";

async function readInput() {
  let raw = "";
  for await (const chunk of process.stdin) {
    raw += chunk;
  }
  if (!raw.trim()) {
    return {};
  }
  try {
    return JSON.parse(raw);
  } catch (error) {
    return { _raw: raw, _parseError: String(error) };
  }
}

function projectRoot(payload) {
  return process.env.CLAUDE_PROJECT_DIR || payload.cwd || process.cwd();
}

function statePaths(root, payload) {
  const sessionId = sanitize(payload.session_id || "unknown-session");
  const stateDir = path.join(root, ".p2-kit", "state");
  return {
    sessionId,
    stateDir,
    dirtyFile: path.join(stateDir, "session-dirty.json"),
    lockFile: path.join(stateDir, "session-publish.lock"),
    publishedFile: path.join(stateDir, `session-${sessionId}.published.json`),
    outboxDir: path.join(root, ".p2-kit", "outbox"),
  };
}

function sanitize(value) {
  return String(value).replace(/[^a-zA-Z0-9._-]/g, "-").slice(0, 120);
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function readJson(file) {
  if (!fs.existsSync(file)) {
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return null;
  }
}

function writeJson(file, value) {
  ensureDir(path.dirname(file));
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function parsePointer(text) {
  const result = {};
  for (const line of text.split(/\r?\n/)) {
    const match = line.match(/^- ([^:]+):\s*(.*)$/);
    if (match) {
      result[match[1].trim().toLowerCase()] = match[2].trim();
    }
  }
  return result;
}

function loadPointer(root) {
  const file = path.join(root, "P2-BRAIN.md");
  if (!fs.existsSync(file)) {
    return null;
  }
  return {
    file,
    fields: parsePointer(fs.readFileSync(file, "utf8")),
  };
}

function isLikelyReadOnlyShell(command) {
  const cmd = String(command || "").trim();
  if (!cmd) {
    return true;
  }
  if (/[>|;&]|(^|\s)(tee|touch|mkdir|cp|mv|rm|chmod|chown|npm|pnpm|yarn|bun|cargo|make)\b/.test(cmd)) {
    return false;
  }
  return /^(pwd|ls\b|find\b|rg\b|grep\b|cat\b|sed\s+-n\b|awk\b|git\s+(status|diff|log|show|branch|remote|rev-parse)\b|gh\s+(repo|pr|issue)\s+view\b)/.test(cmd);
}

function shouldMarkDirty(payload) {
  const tool = payload.tool_name || "";
  if (["Edit", "Write", "MultiEdit", "NotebookEdit"].includes(tool)) {
    return `tool:${tool}`;
  }
  if (/^mcp__.*__(create|update|delete|write|publish|edit|execute)/.test(tool)) {
    return `tool:${tool}`;
  }
  if (tool === "Bash") {
    const command = payload.tool_input?.command || "";
    if (!isLikelyReadOnlyShell(command)) {
      return `bash:${command.slice(0, 160)}`;
    }
  }
  return null;
}

function markDirty(root, payload, reason) {
  const paths = statePaths(root, payload);
  ensureDir(paths.stateDir);
  const now = new Date().toISOString();
  const current = readJson(paths.dirtyFile) || {
    sessionId: paths.sessionId,
    dirtySince: now,
    reasons: [],
  };
  current.sessionId = paths.sessionId;
  current.updatedAt = now;
  current.reasons ||= [];
  current.reasons.push({
    at: now,
    reason,
    event: payload.hook_event_name || null,
  });
  current.reasons = current.reasons.slice(-50);
  writeJson(paths.dirtyFile, current);
}

function sessionStart(root) {
  const pointer = loadPointer(root);
  if (!pointer) {
    return;
  }
  const brain = pointer.fields.brain || "P2 brain";
  const brainUrl = pointer.fields["brain url"] || "<unknown>";
  const memory = pointer.fields.memory || "<pending>";
  const additionalContext = [
    `P2 brain hooks are enabled for this project.`,
    `Brain: ${brain}`,
    `Brain URL: ${brainUrl}`,
    `Memory: ${memory}`,
    `Before substantive work, read P2-BRAIN.md, load the Brainstem, and load Memory when it exists.`,
    `At stop, p2-kit hooks may auto-publish a session-summary post and update Memory if this session did meaningful work.`,
  ].join("\n");

  process.stdout.write(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: "SessionStart",
      additionalContext,
    },
  }));
}

function buildPrompt(root, payload, dirty, pointer) {
  const fields = pointer.fields;
  const date = new Date().toISOString().slice(0, 10);
  const project = fields.project || path.basename(root);
  const sessionId = payload.session_id || dirty.sessionId || "unknown-session";
  const transcriptPath = payload.transcript_path || "<missing transcript_path>";

  return `You are the automatic p2-kit session memory writer.

This is a non-interactive hook run. Do not ask questions. The user configured p2-kit hooks to publish session memory automatically.

Project root: ${root}
Project: ${project}
Session ID: ${sessionId}
Transcript path: ${transcriptPath}
Date: ${date}

P2 brain pointer:
- Brain: ${fields.brain || "<unknown>"}
- Brain URL: ${fields["brain url"] || "<unknown>"}
- Brainstem: ${fields.brainstem || "<unknown>"}
- Memory: ${fields.memory || "<pending>"}
- Audience: ${fields.audience || "<unknown>"}
- Write mode: ${fields["write mode"] || "<unknown>"}
- Scope: ${fields.scope || "<unknown>"}

Dirty marker:
${JSON.stringify(dirty, null, 2)}

Required actions:
1. Read P2-BRAIN.md.
2. Read the transcript at the transcript path. Use it only to summarize the session; do not copy raw transcript content into P2.
3. Load the Brainstem and follow its write mode.
4. Publish or update one P2 post for this session summary. Use type session-summary. Include the session ID so reruns can find/update rather than duplicate it.
5. Update or create the Memory page:
   - Short Term: active work, recent changes, open loops, and context likely to change soon.
   - Long Term: durable facts, decisions, preferences, stable project context, and canonical links.
6. Link the session-summary post from Memory when useful.
7. Use WordPress core block HTML when creating/updating P2 pages or posts.
8. Use context-a8c/wpcom/content-authoring or the available P2 tools. Include user_confirmed exactly as: "User configured p2-kit hooks to auto-publish session summaries and derived Memory updates."
9. Omit credentials, secrets, raw private conversations, and sensitive content that was not explicitly approved during the session.

Final response:
- Session-summary post URL
- Memory page URL
- Short Term updates
- Long Term updates
- Any skipped sensitive or uncertain items`;
}

function acquireLock(lockFile) {
  try {
    fs.writeFileSync(lockFile, String(process.pid), { flag: "wx" });
    return true;
  } catch {
    return false;
  }
}

function releaseLock(lockFile) {
  try {
    fs.unlinkSync(lockFile);
  } catch {
    // best effort
  }
}

function publish(root, payload, { allowBlock }) {
  const pointer = loadPointer(root);
  if (!pointer) {
    return;
  }

  const paths = statePaths(root, payload);
  const dirty = readJson(paths.dirtyFile);
  if (!dirty) {
    return;
  }

  const published = readJson(paths.publishedFile);
  if (published?.dirtySince === dirty.dirtySince) {
    return;
  }

  if (process.env.P2_KIT_HOOK_CHILD === "1") {
    return;
  }

  ensureDir(paths.stateDir);
  if (!acquireLock(paths.lockFile)) {
    return;
  }

  const startedAt = new Date().toISOString();
  const prompt = buildPrompt(root, payload, dirty, pointer);

  try {
    const child = spawnSync("claude", [
      "-p",
      "--permission-mode",
      "bypassPermissions",
      "--output-format",
      "json",
      "--max-turns",
      "30",
      prompt,
    ], {
      cwd: root,
      encoding: "utf8",
      env: {
        ...process.env,
        P2_KIT_HOOK_CHILD: "1",
      },
      maxBuffer: 20 * 1024 * 1024,
    });

    const finishedAt = new Date().toISOString();
    const result = {
      sessionId: paths.sessionId,
      dirtySince: dirty.dirtySince,
      startedAt,
      finishedAt,
      status: child.status,
      signal: child.signal,
      stdout: child.stdout || "",
      stderr: child.stderr || "",
    };

    if (child.status === 0) {
      writeJson(paths.publishedFile, result);
      try {
        fs.unlinkSync(paths.dirtyFile);
      } catch {
        // best effort
      }
      return;
    }

    writeOutbox(root, payload, dirty, result);
    if (allowBlock && !payload.stop_hook_active) {
      process.stdout.write(JSON.stringify({
        decision: "block",
        reason: [
          "p2-kit automatic P2 brain publishing failed.",
          "Inspect .p2-kit/outbox/ and .p2-kit/state/, then publish the session summary and Memory updates manually or repair the hook.",
          result.stderr || result.stdout || "No child output captured.",
        ].join("\n\n"),
      }));
    }
  } finally {
    releaseLock(paths.lockFile);
  }
}

function writeOutbox(root, payload, dirty, result) {
  const paths = statePaths(root, payload);
  ensureDir(paths.outboxDir);
  const file = path.join(paths.outboxDir, `${new Date().toISOString().replace(/[:.]/g, "-")}-${paths.sessionId}.json`);
  writeJson(file, {
    sessionId: paths.sessionId,
    transcriptPath: payload.transcript_path || null,
    dirty,
    result,
  });
}

const payload = await readInput();
const root = projectRoot(payload);

if (process.env.P2_KIT_HOOK_CHILD === "1") {
  process.exit(0);
}

if (action === "session-start") {
  sessionStart(root);
} else if (action === "post-tool-use") {
  if (loadPointer(root)) {
    const reason = shouldMarkDirty(payload);
    if (reason) {
      markDirty(root, payload, reason);
    }
  }
} else if (action === "stop") {
  publish(root, payload, { allowBlock: true });
} else if (action === "session-end") {
  publish(root, payload, { allowBlock: false });
} else if (action === "smoke-test") {
  process.stdout.write(JSON.stringify({
    ok: true,
    root,
    hasPointer: Boolean(loadPointer(root)),
  }, null, 2));
}
