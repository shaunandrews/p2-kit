---
name: p2-brain-hooks
description: Install and manage automatic P2 brain memory hooks. Use when a user wants Claude Code or another agent client to automatically load a P2 brain at session start, publish session summaries to P2, update the Memory page from Short Term and Long Term context, configure project hooks, repair hook setup, simulate or test hook firing, manually rehearse a closing-hook publish, or enable/disable automatic P2 brain publishing.
---

# P2 Brain Hooks

## Purpose

Set up automatic hooks so agent sessions publish useful memory to a P2 brain without relying on the interactive agent to remember at the end.

For Claude Code, install project-local hooks that:

- add P2 brain context on `SessionStart`
- mark the session dirty after meaningful tool use
- run a non-interactive child `claude -p` from `Stop` to publish a session-summary post and update the `Memory` page
- use `SessionEnd` as a fallback if `Stop` did not complete

## Operating Rules

- Require a local `P2-BRAIN.md` before installing hooks. Do not guess the brain.
- Treat configured hooks as explicit user permission to publish session summaries and derived Memory page updates.
- Use the Brainstem write mode for ordinary memory behavior, but do not ask a second publish question for hook-managed session memory.
- Never publish raw transcripts. Summarize, link, and omit secrets.
- Keep hook setup local by default: write `.claude/settings.local.json`, not committed project settings, unless the user explicitly asks for shareable hooks.
- Prefer Claude Code first. Codex hooks are experimental until verified in the user's current build.
- Make hook publishing idempotent by session/dirty marker so retries update or skip instead of duplicating posts.
- Avoid recursive hook runs by setting `P2_KIT_HOOK_CHILD=1` for non-interactive child agents.
- If automatic publishing fails during `Stop`, block stopping once so the active agent can report/fix the failure. If already inside a stop-hook continuation, do not loop.
- When the user asks to manually rehearse or "actually do" the closing-hook behavior, publish one session-summary post and update Memory from the active session using the same standards.

## Workflow

### 1. Check the Project

1. Confirm `P2-BRAIN.md` exists in the project root.
2. Read it and identify Brain URL, Brainstem, Memory page, audience, write mode, and project scope.
3. If missing, tell the user to run `p2-brain-init` first.

### 2. Install Claude Hooks

Use the bundled installer:

```sh
node skills/p2-brain-hooks/scripts/install-claude-hooks.mjs
```

If the skill is installed outside the repo, run the script from that installed skill path while the current working directory is the target project.

The installer:

- copies `p2-brain-hook.mjs` to `.p2-kit/hooks/p2-brain-hook.mjs`
- creates `.p2-kit/state/`
- creates or updates `.claude/settings.local.json`
- adds idempotent hook entries for `SessionStart`, `PostToolUse`, `Stop`, and `SessionEnd`

### 3. Hook Behavior

`SessionStart` injects a short reminder:

- read `P2-BRAIN.md`
- load Brainstem before substantive work
- load Memory when present

`PostToolUse` marks the session dirty after meaningful work:

- file edits and writes
- shell commands that likely change state
- write-like MCP tools

`Stop` publishes when dirty:

1. Reads hook input, including `session_id`, `cwd`, `transcript_path`, and `last_assistant_message`.
2. Starts a child command:

   ```sh
   P2_KIT_HOOK_CHILD=1 claude -p --permission-mode bypassPermissions --output-format json --max-turns 30 "<prompt>"
   ```

3. The child reads `P2-BRAIN.md` and the transcript path.
4. The child publishes or updates a P2 `session-summary` post.
5. The child updates the `Memory` page:
   - `Short Term`: active work, recent changes, open loops
   - `Long Term`: durable facts, decisions, preferences, canonical links
6. The child applies standard taxonomy when available: categories `Brain`, `Summaries`; tags `p2-brain`, `session-summary`, and a project-specific tag.
7. The hook records success in `.p2-kit/state/` and clears the dirty marker.

`SessionEnd` runs the same publisher as a fallback. If it cannot publish, it writes an outbox record under `.p2-kit/outbox/`.

### 4. Brainstem Policy

When setting up hooks for a brain, make sure the Brainstem includes a hook policy:

```text
Session summaries: auto-publish from configured hooks.
Memory updates: auto-publish when derived from the same session summary.
Sensitive memory: ask during the session; if unresolved, omit from hook output.
Shared brains: follow the brain write mode.
```

### 5. Manual Rehearsal

Use this path when the user asks to simulate the closing hook, rehearse the hook, or actually publish the closing-hook output from the active session.

1. Read `P2-BRAIN.md`, Brainstem, and Memory.
2. Summarize the active session. Do not copy raw chat or transcript content.
3. Publish one `session-summary` post using the same post shape as the automatic hook.
4. Apply categories `Brain`, `Summaries` and tags `p2-brain`, `session-summary`, plus a project tag when known.
5. Update Memory:
   - `Short Term`: active work, recent changes, open loops
   - `Long Term`: durable decisions, preferences, project facts, canonical links
6. Report the session-summary URL and Memory URL.

Manual rehearsal validates the P2 write path, taxonomy, post shape, and Memory update. It does not prove the installed hook fired; use the verification steps below for that.

### 6. Verification

After installing:

1. Inspect `.claude/settings.local.json`.
2. Confirm `.p2-kit/hooks/p2-brain-hook.mjs` exists.
3. Start a new Claude Code session in the project.
4. Make a small change or run a write-like command.
5. Let Claude stop.
6. Confirm a P2 session-summary post was published and `Memory` was updated.

If publishing fails, inspect:

- `.p2-kit/state/`
- `.p2-kit/outbox/`
- Claude hook output
- whether `claude -p --permission-mode bypassPermissions` can run in the current environment
- whether `context-a8c` is available to the child Claude process

## Output Shape

For install/repair requests, report:

1. target project
2. detected brain URL
3. files created or updated
4. enabled hook events
5. whether a smoke test was run
6. next test step for the user

For manual rehearsal requests, report:

1. session-summary post URL
2. Memory page URL
3. Short Term updates
4. Long Term updates
5. any skipped sensitive or uncertain items
