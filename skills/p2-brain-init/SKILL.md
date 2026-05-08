---
name: p2-brain-init
description: Initialize a new P2 brain for an AI agent. Use when a user wants to create, configure, bootstrap, or test a P2 as portable agent memory; needs instructions for creating a new brain P2 through the Automattic MC P2 tool; wants an initial Brain Manifest post; or has created a P2 and wants the agent to verify access and prepare it for use.
---

# P2 Brain Init

## Purpose

Guide a human through creating a new P2 brain, then produce and verify the initial `Brain Manifest`.

Do not silently provision a new P2. Current agent-accessible `context-a8c` tools can work with existing P2s, but do not expose a normal tool for creating a brand-new P2. Treat P2 creation as an explicit human-in-the-loop setup step through the MC P2 tool:

<https://mc.a8c.com/tools/p2/>

## Operating Rules

- Keep brain creation explicit because it sets audience, permissions, and long-term memory boundaries.
- Draft before publishing. Do not publish or update P2 content without explicit user confirmation.
- Prefer private P2s for personal brains and early project brains.
- Do not copy large private conversations into the manifest. Link sources or summarize instead.
- Mark assumptions and inferred context clearly.
- Do not claim a P2 was created, configured, or verified unless you actually verified it.
- If the user wants the MC tool opened and a browser capability is available, open `https://mc.a8c.com/tools/p2/`. Otherwise provide the link.

## Workflow

### 1. Identify the Brain Profile

Gather only the details needed to draft a useful setup brief. If the user already provided enough context, proceed with reasonable defaults and label them as assumptions.

Required:

- **Brain name:** human-readable name, such as `Shaun Work Brain` or `p2-kit Project Brain`
- **Brain type:** `personal`, `project`, `team`, `design`, `review`, `incident`, or another concise type
- **Purpose:** what this brain should help agents remember and do
- **Owner:** primary human owner
- **Audience:** private, named collaborators, team, or broader group

Recommended:

- **Proposed URL slug:** lowercase, short, memorable, e.g. `shaun-brain`, `p2-kit-brain`
- **Default write behavior:** usually `draft before publishing`
- **Allowed memory types:** decisions, project logs, preferences, artifacts, source summaries, handoffs, review evidence
- **Sensitive areas:** HR, performance, customer data, private team context, credentials, unreleased plans
- **Source systems:** P2, Slack, GitHub, Linear, Zendesk, local files, screenshots

If missing information blocks progress, ask at most three concise questions. Otherwise continue.

### 2. Produce the Setup Brief

Give the user a short setup brief they can follow in MC:

1. Open the MC P2 tool: `https://mc.a8c.com/tools/p2/`
2. Create a new internal P2.
3. Use the recommended name and slug.
4. Keep it private unless the stated audience requires sharing.
5. Add the owner and collaborators.
6. Create a first post titled `Brain Manifest`.
7. Paste the generated manifest.
8. Return with the P2 URL so the agent can verify and load it.

For external/non-Automattician access, tell the user to use the MC tool's external-user option if appropriate, but call out that this changes the privacy posture.

### 3. Generate the Brain Manifest

Generate a complete first-post draft titled `Brain Manifest`. Keep it clear enough for humans and structured enough for future agents.

Use this shape:

```markdown
# Brain Manifest

Brain name: <name>
Brain type: <type>
Owner: <owner>
Audience: <private/collaborators/team>
P2 URL: <pending or URL>
Initialized: <YYYY-MM-DD>
Default write behavior: Draft before publishing

## Purpose

<1-3 sentences describing what this brain is for.>

## Scope

This brain should remember:

- <memory type>
- <memory type>
- <memory type>

This brain should not store:

- credentials, secrets, or access tokens
- raw private conversations when a summary and source link are enough
- sensitive HR, performance, customer, or private-team information unless explicitly approved

## Loading Instructions for Agents

When using this P2 as a brain:

1. Read this manifest first.
2. Search for task-relevant memory before assuming context is missing.
3. Prefer recent summaries, active project indexes, and decision records.
4. Treat older memory as potentially stale unless reaffirmed.
5. Cite source links for factual claims.
6. Distinguish facts, assumptions, inferences, and preferences.

## Writing Instructions for Agents

When writing to this brain:

1. Draft by default unless the user explicitly asks to publish.
2. Prefer updating existing memory over creating duplicates.
3. Use descriptive titles.
4. Include source links when memory comes from another system.
5. Mark confidence: high, medium, or low.
6. Add a revisit date when the memory may become stale.

## Memory Types

- `manifest`: canonical instructions for using this brain
- `project-log`: running project context and progress
- `decision`: durable decision records
- `preference`: owner/team preferences
- `artifact`: links to files, screenshots, posts, PRs, issues, tickets, or designs
- `handoff`: summaries that help another agent continue work
- `summary`: periodic compaction of recent activity

## Indexes

- Active projects: <pending>
- Decisions: <pending>
- Handoffs: <pending>
- Preferences: <pending>

## Safety Rules

- Ask before publishing.
- Ask before moving memory from a private brain to a shared brain.
- Do not store secrets.
- Summarize sensitive source material instead of copying it.
- Flag uncertain or inferred information.

## Bootstrap Tasks

- Create initial index posts.
- Add the first project log.
- Add owner preferences as they become clear.
- Create a handoff after meaningful setup work.
```

Adapt section names to the user context, but keep the core loading, writing, memory type, and safety instructions.

### 4. Optional: Create the Manifest Post

If the P2 already exists and the user wants the agent to create the manifest:

1. State exactly which P2 will be changed.
2. State that the agent will create a `Brain Manifest` post as a draft unless the user explicitly requests publish.
3. Ask for confirmation.
4. If `context-a8c` is available, use the `wpcom` provider's `content-authoring` tool with `posts.create`.
5. Include `user_confirmed` in the write parameters.
6. Report the edit and preview links returned by the tool.

If write tools are unavailable, give the manifest draft in chat and ask the user to paste it into the first P2 post.

### 5. Verify the Brain P2

After the user provides a P2 URL:

1. If `context-a8c` is available, load the `wpcom` provider.
2. Use `p2-sites` or `posts-text` to verify the user has access to the P2.
3. Look for a post or page titled `Brain Manifest`.
4. If found, summarize the loaded brain profile and note any missing manifest fields.
5. If missing, offer to draft or create the manifest.
6. Do not proceed as if the brain is ready until the manifest exists or the user explicitly asks to continue without it.

Useful `context-a8c` operations when available:

- `wpcom` provider, `p2-sites`: discover accessible P2s
- `wpcom` provider, `posts-text`: read posts/pages from a P2
- `wpcom` provider, `content-authoring`: create or update manifest posts after confirmation

## Output Shape

For a normal setup request, respond with:

1. **Recommendation:** brain name, slug, privacy, owner/collaborators
2. **Setup Steps:** concise MC instructions
3. **Brain Manifest Draft:** ready to paste into P2
4. **Next Step:** ask the user to return with the P2 URL for verification

For a verification request, respond with:

1. whether the P2 was reachable
2. whether the manifest was found
3. the loaded brain profile
4. missing or risky setup items
5. the next action needed to make the brain usable
