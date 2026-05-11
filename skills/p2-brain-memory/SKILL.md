---
name: p2-brain-memory
description: Load and maintain the primary Memory page for a P2 brain. Use when a user asks to remember, save, recall, load, update, or summarize brain memory; wants recent or important context from a P2 brain; asks what the brain knows; wants to create or repair the Memory page; or is doing substantive project work in a repository with P2-BRAIN.md and the P2 brain may contain relevant recent context, decisions, preferences, handoffs, or artifacts.
---

# P2 Brain Memory

## Purpose

Use the P2 brain's `Memory` page as the compact, current working-memory layer for agents.

The Memory page is a published page titled `Memory` with slug `memory`. It is read after the Brainstem and before deeper search. It should stay short, useful, and linked to source material or supporting memory posts.

## Operating Rules

- Read `P2-BRAIN.md` first when present. It identifies the brain URL, Brainstem, Memory page, audience, and project scope.
- Read the Brainstem before creating or updating memory.
- Do not bake in a draft-first default. Follow the Brainstem write mode.
- Treat explicit user requests like "remember this", "save this", or "update memory" as intent to write according to the write mode.
- Before tool writes, state the target P2, audience, write mode, and planned update; include the user's request or confirmation in `user_confirmed` when the tool requires it.
- For sensitive content, shared brains, ambiguous write mode, or memory moving from private to shared context, ask before writing.
- Keep the Memory page compact. It is a high-signal map, not a transcript or archive.
- Prefer updating existing memory over creating duplicates.
- Use source links whenever memory comes from Slack, P2, GitHub, Linear, Zendesk, files, screenshots, or another external system.
- Mark confidence: high, medium, or low.
- Mark assumptions, inferences, conflicts, and stale context.
- Write WordPress pages/posts as serialized core block HTML, not raw Markdown.
- When reading existing WordPress content, use rendered/plaintext content for reasoning; do not carry raw block comments in working context.

## Workflow

### 1. Find the Brain

Use this order:

1. Read local `P2-BRAIN.md` from the project root if present.
2. Use a P2 URL, Brainstem URL, Memory URL, or blog ID from the user request.
3. If neither exists, ask for the P2 brain URL.

Do not guess a brain URL from unrelated project files.

### 2. Load Brainstem and Memory

1. Load the Brainstem page first.
2. Extract brain name, audience, write mode, scope, Memory URL if listed, and safety rules.
3. Load the Memory page if it exists.
4. If the Memory page is missing and the user asked to save/update memory, create it as a published page according to the write mode.
5. If the Memory page is missing and the user only asked to load context, say it is missing and continue with Brainstem plus relevant search.

Useful `context-a8c` operations when available:

- `wpcom` provider, `content-authoring`: list/read/create/update pages and posts
- `wpcom` provider, `posts-text`: read P2 posts/pages in plaintext when supported
- `wpcom` provider, `get-blog-report-card`: verify site metadata
- `wpcom` provider, `site-activity-log`: inspect recent site changes when needed

### 3. Decide What to Update

Choose the lightest durable write:

- **Small recent/important fact:** update the Memory page only.
- **Decision, preference, handoff, project log, artifact, or source-heavy context:** create or update a supporting memory post, then link it from the Memory page.
- **Correction:** update the wrong memory in place and note what changed.
- **Conflict:** preserve both claims, cite sources, and mark the conflict until resolved.
- **Stale context:** move it out of `Now`, keep it under `Recent` or a supporting post if still useful, and add a revisit note when appropriate.

### 4. Update the Memory Page

The Memory page should use this semantic shape:

```markdown
# Memory

Last updated: <YYYY-MM-DD>

## Now

- <current high-signal context>

## Important

- <durable memory that should stay easy to find>

## Recent

- <dated recent memory with source link when available>

## Open Loops

- <question, follow-up, or revisit date>

## Indexes

- Decisions: <link or pending>
- Projects: <link or pending>
- Handoffs: <link or pending>
- Preferences: <link or pending>
```

Keep each section short:

- `Now`: usually 3-7 bullets
- `Important`: usually 5-12 bullets
- `Recent`: usually 5-10 dated bullets
- `Open Loops`: only unresolved items
- `Indexes`: links to canonical pages/posts when they exist

When writing to WordPress, convert the shape to serialized core block HTML:

```html
<!-- wp:paragraph -->
<p><strong>Last updated:</strong> 2026-05-11</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":2} -->
<h2 class="wp-block-heading">Now</h2>
<!-- /wp:heading -->

<!-- wp:list -->
<ul>
<!-- wp:list-item --><li>p2-kit is defining a P2-powered memory protocol for agents.</li><!-- /wp:list-item -->
</ul>
<!-- /wp:list -->
```

### 5. Memory Posts

Use memory posts when a memory needs durable detail beyond a compact bullet.

Recommended post shape:

```markdown
# <Memory type>: <short title>

Type: <decision/preference/project-log/artifact/handoff/summary>
Status: <current/stale/superseded/resolved>
Confidence: <high/medium/low>
Source: <links or "user-provided">
Recorded: <YYYY-MM-DD>
Revisit: <YYYY-MM-DD or none>

## Summary

<short durable summary>

## Details

<only the useful detail>

## Links

- <source or related artifact>
```

After creating or updating a memory post, add or update one concise bullet on the Memory page linking to it.

### 6. Output Shape

For load/recall requests:

1. **Brain loaded**: brain name, URL, audience, write mode
2. **Memory summary**: relevant `Now`, `Important`, and `Recent` context
3. **Gaps**: missing Memory page, missing indexes, stale context, or confidence limits
4. **Next action**: what the agent will do with that context

For remember/save/update requests:

1. **Target**: P2 brain, audience, write mode
2. **Update**: what changed on the Memory page and any supporting memory post
3. **Links**: Memory page and supporting post links
4. **Confidence/source**: source and confidence level

If a write is blocked by tooling or permission, provide the exact Memory page/post content for the user to paste.
