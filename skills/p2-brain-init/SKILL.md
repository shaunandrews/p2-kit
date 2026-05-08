---
name: p2-brain-init
description: Initialize a new P2 brain for an AI agent. Use when a user wants to create, configure, bootstrap, or test a P2 as portable agent memory; needs instructions for creating a new brain P2 through the Automattic MC P2 tool; wants concise form-filling guidance for the MC P2 creation form; wants an initial Brainstem page after the P2 exists; or has created a P2 and wants the agent to verify access and prepare it for use.
---

# P2 Brain Init

## Purpose

Guide a human through creating a new P2 brain, then verify it and prepare the initial `Brainstem`.

Do not silently provision a new P2. Current agent-accessible `context-a8c` tools can work with existing P2s, but do not expose a normal tool for creating a brand-new P2. Treat P2 creation as an explicit human-in-the-loop setup step through the MC P2 tool:

<https://mc.a8c.com/tools/p2/>

## Operating Rules

- Keep the setup phase short and focused. The user is filling out a form and may have questions.
- Do not generate the full Brainstem during the initial MC setup unless the user explicitly asks for it.
- Stop after giving form values and ask the user to return with the created P2 URL.
- Keep brain creation explicit because it sets audience, permissions, and long-term memory boundaries.
- The initial `Brainstem` should be a page, not a post.
- Recommend publishing the initial Brainstem page after explicit confirmation; it is canonical setup/configuration, not an ordinary update.
- For ordinary memory writes after setup, draft by default unless the user explicitly asks to publish.
- Do not publish or update P2 content without explicit user confirmation.
- Prefer private access for personal brains and early project brains.
- Prefer MC `Personal` type for a private personal brain, and use direct site-scoped WordPress.com/content-authoring tools to access it.
- Do not treat absence from `p2-sites` or rejection by `posts-text` as proof that a Personal P2 is inaccessible.
- Do not invent details about the user's work, teams, projects, tools, or preferences.
- Do not copy large private conversations into the Brainstem. Link sources or summarize instead.
- Mark assumptions and inferred context clearly.
- Do not claim a P2 was created, configured, or verified unless you actually verified it.
- If the user wants the MC tool opened and a browser capability is available, open `https://mc.a8c.com/tools/p2/`. Otherwise provide the link.

## Workflow

### 1. Identify the Minimum Setup

Gather only what is needed to complete the MC form.

Required:

- **Brain purpose:** personal work memory, project memory, team memory, design memory, review memory, etc.
- **Access:** just the user, named collaborators, a team, or broader group

Useful if already known:

- **Owner:** primary human owner
- **Preferred name or slug**
- **Sensitivity:** whether this brain may hold HR, performance, customer, unreleased, or private-team context

If key information is missing, ask at most two concise questions. Good questions:

- "What kind of brain are you setting up?"
- "Who should have access?"

If the user already answered those, proceed with reasonable defaults and label them as assumptions.

### 2. Recommend Names and Slugs

Use the heading `Names and slugs` when offering options.

Offer no more than three options. Put the recommended option first. Keep rationale to one short phrase per option.

For a personal brain named after a person, use a possessive title:

- Prefer `Shaun's Brain` for a private first-name personal brain.
- Use `Shaun Andrews' Brain` when the full name is helpful for disambiguation.
- If the name does not end in `s`, use `'s`, e.g. `Jane's Brain`.
- If the name ends in `s`, use an apostrophe after the `s`, e.g. `Andrews' Brain`.
- Keep slugs lowercase and punctuation-free, e.g. `shauns-brain` or `shaunandrews-brain`.
- Avoid awkward noun stacks like `Shaun Andrews Brain`.

Example:

```markdown
## Names and slugs

Recommended:

1. Shaun's Brain / shauns-brain
   Clear and personal.

Alternatives:

2. Shaun Andrews' Brain / shaunandrews-brain
   Useful if the full name helps disambiguate.
3. Shaun's Memory / shauns-memory
   More generic.
```

If the user chooses or types a custom value, use that value and move on.

### 3. Map to the MC P2 Form

Format setup guidance around the actual MC form fields. Keep it practical.

Use this shape:

```markdown
## MC form values

Open: https://mc.a8c.com/tools/p2/

- P2 title: <human readable title>
- P2 name: <subdomain slug>
- P2 description: <one-line description>
- Business unit: None, unless this belongs to a specific business unit
- P2 type: <Personal/Project/Team/Documentation>
- Non-Automattician access: unchecked, unless external collaborators need access
- Internal AI Access: enable if this brain should be usable by internal AI systems; leave disabled for highly sensitive memory
- AI summaries: optional; enable only if useful for the brain's audience
- P2 users: add only the owner and intended collaborators
- Add subteam members: unchecked unless adding a team group and all subteam members should join
```

Field guidance:

- **P2 title:** Use the visible brain name. For personal brains, use a possessive title such as `Shaun's Brain` or `Shaun Andrews' Brain`. For project brains, use a project title such as `p2-kit Brain`.
- **P2 name:** Use the short URL slug. If MC normalizes the slug, accept the normalized value and use it later as the P2 URL.
- **P2 description:** Keep it one line, e.g. `Portable memory for Shaun's agent sessions.`
- **Business unit:** Use `None` unless the user knows the correct business unit.
- **P2 type:** Use `Personal` for a private personal brain, `Project` for a project brain or when workspace P2 behavior matters, `Team` for a shared team brain, and `Documentation` only when knowledge-base behavior is desired.
- **Personal type caveat:** Personal P2s are not part of the A8C workspace and x-posting to/from A8C P2s is not possible. Some workspace-specific tools such as `p2-sites` and `posts-text` may not discover them. That is expected; use direct site-scoped tools such as `content-authoring`, `site-activity-log`, and `get-blog-report-card` instead.
- **Internal AI Access:** For an agent brain, this usually needs to be enabled. If the user wants very sensitive memory, discuss the tradeoff before recommending it.
- **AI summaries:** Useful for shared or project brains, less important for a brand-new personal brain.
- **P2 users:** Keep narrow at creation time. More users can be added later.

### 4. Stop and Wait

After giving MC form values, stop. Do not include a full `Brainstem` draft yet.

End with:

```markdown
Create the P2 with those values, then send me the P2 URL. I will verify access and create the Brainstem page.
```

This keeps the first interaction focused on completing the form.

### 5. Verify the Brain P2

After the user provides a P2 URL:

1. If `context-a8c` is available, load the `wpcom` provider.
2. Use `get-blog-report-card` with the P2 URL to confirm the blog exists, identify the blog ID, owner, privacy, and stickers.
3. Use `content-authoring` with the P2 URL or blog ID to list pages and posts. Check `pages.list` first, then `posts.list`.
4. Use `p2-sites` or `posts-text` only as optional workspace-P2 helpers. If they reject a Personal P2 as "not an Automattic P2" or do not return it, continue with `content-authoring`.
5. Look for a page titled `Brainstem`. If a `Brain Manifest` page or post exists instead, treat it as legacy naming and recommend renaming or replacing it with the canonical `Brainstem` page.
6. If found, summarize the loaded brain profile and note any missing Brainstem fields.
7. If missing, offer to create and publish the Brainstem page after confirmation.
8. Do not proceed as if the brain is ready until the Brainstem exists or the user explicitly asks to continue without it.

Useful `context-a8c` operations when available:

- `wpcom` provider, `p2-sites`: discover accessible P2s
- `wpcom` provider, `posts-text`: read posts/pages from a P2
- `wpcom` provider, `content-authoring`: list, read, create, or update posts on an existing site after confirmation for writes
- `wpcom` provider, `get-blog-report-card`: inspect site metadata when normal P2 discovery fails
- `wpcom` provider, `site-activity-log`: inspect recent site activity when confirming newly created sites

### 6. Create the Brainstem Page

Only prepare the Brainstem after one of these is true:

- the P2 exists and the user provided its URL
- the user explicitly asks to see the Brainstem before creating the P2
- the user asks for a template they can paste manually

The default recommendation is to create a published page titled `Brainstem` with slug `brainstem`. Ask directly:

```markdown
Create and publish the Brainstem page now?
```

If the user says yes, this is explicit publish confirmation for the initial Brainstem page.

If the P2 exists and the user wants the agent to create the Brainstem page:

1. State exactly which P2 will be changed.
2. State that the agent will create a `Brainstem` page.
3. Recommend publishing it now so future agents can find the canonical loading instructions.
4. Ask for confirmation before creating or publishing.
5. If the user confirms publishing, use `content-authoring` with `pages.create`, `status: publish`, title `Brainstem`, and slug `brainstem`.
6. If the user asks to review first, create it as a draft page instead.
7. Include `user_confirmed` in the write parameters.
8. Report the edit and view/preview links returned by the tool.

If a `Brainstem` page already exists:

1. Fetch it first.
2. Summarize what would change.
3. Ask for confirmation.
4. Use `pages.update` after confirmation.

If a legacy `Brain Manifest` page or post already exists, offer to rename/update it to `Brainstem` instead of creating a duplicate.

If write tools are unavailable, give the Brainstem draft in chat and ask the user to create a page named `Brainstem`.

Use this Brainstem shape:

```markdown
# Brainstem

Brain name: <name>
Brain type: <type>
Owner: <owner>
Audience: <private/collaborators/team>
P2 URL: <URL>
Initialized: <YYYY-MM-DD>
Default write behavior: Publish this Brainstem after setup confirmation; draft ordinary memories before publishing

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

1. Read the Brainstem first.
2. Search for task-relevant memory before assuming context is missing.
3. Prefer recent summaries, active project indexes, and decision records.
4. Treat older memory as potentially stale unless reaffirmed.
5. Cite source links for factual claims.
6. Distinguish facts, assumptions, inferences, and preferences.

## Writing Instructions for Agents

When writing ordinary memories to this brain:

1. Draft by default unless the user explicitly asks to publish.
2. Prefer updating existing memory over creating duplicates.
3. Use descriptive titles.
4. Include source links when memory comes from another system.
5. Mark confidence: high, medium, or low.
6. Add a revisit date when the memory may become stale.

## Memory Types

- `brainstem`: canonical instructions for using this brain
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

- Ask before publishing ordinary memories.
- Ask before moving memory from a private brain to a shared brain.
- Do not store secrets.
- Summarize sensitive source material instead of copying it.
- Flag uncertain or inferred information.
```

## Output Shapes

For a new setup request, respond with:

1. **Names and slugs** if the user has not already chosen one
2. **MC form values**
3. **Next step** asking the user to create the P2 and return with the URL

Do not include the Brainstem in this first response unless requested.

For a verification request, respond with:

1. whether the P2 was reachable
2. whether the Brainstem was found
3. the loaded brain profile, if available
4. missing or risky setup items
5. the next action needed to make the brain usable
