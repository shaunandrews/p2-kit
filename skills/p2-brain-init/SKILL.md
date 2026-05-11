---
name: p2-brain-init
description: Initialize a new P2 brain for an AI agent. Use when a user wants to create, configure, bootstrap, or test a P2 as portable agent memory; provides an existing P2 URL to initialize or verify; needs instructions for creating a new brain P2 through the Automattic MC P2 tool; wants concise form-filling guidance for the MC P2 creation form; wants an initial Brainstem page after the P2 exists; wants a local P2-BRAIN.md project pointer; or has created a P2 and wants the agent to verify access and prepare it for use.
---

# P2 Brain Init

## Purpose

Guide a human through creating a new P2 brain, then verify it and prepare the initial `Brainstem`.

Do not silently provision a new P2. Current agent-accessible `context-a8c` tools can work with existing P2s, but do not expose a normal tool for creating a brand-new P2. Treat P2 creation as an explicit human-in-the-loop setup step through the MC P2 tool:

<https://mc.a8c.com/tools/p2/>

## Operating Rules

- Keep the setup phase short and focused. The user is filling out a form and may have questions.
- If the user's request includes a P2 URL or WordPress.com domain, skip the MC setup flow and start with verification.
- Do not generate the full Brainstem during the initial MC setup unless the user explicitly asks for it.
- Stop after giving form values and ask the user to return with the created P2 URL.
- Keep brain creation explicit because it sets audience, permissions, and long-term memory boundaries.
- The initial `Brainstem` should be a page, not a post.
- Write the Brainstem to WordPress as serialized core block HTML, not raw Markdown.
- When reading an existing Brainstem, use plaintext or rendered content for reasoning; do not carry raw block comments in working context.
- When initializing a verified brain P2 and `Brainstem` is missing, create and publish the Brainstem page without asking again.
- After the Brainstem exists, create a local `P2-BRAIN.md` pointer file when working in a writable project.
- Do not pause with a yes/no publish question before creating the initial Brainstem.
- For ordinary memory writes after setup, follow the Brainstem write mode; if no write mode is defined, draft by default unless the user explicitly asks to publish.
- Do not publish or update ordinary memory content without explicit user confirmation unless the Brainstem explicitly allows multiplayer write for the acting agent.
- Prefer private access for personal brains and early project brains.
- Prefer MC `Personal` type for a private personal brain, and use direct site-scoped WordPress.com/content-authoring tools to access it.
- Do not treat absence from `p2-sites` or rejection by `posts-text` as proof that a Personal P2 is inaccessible.
- Do not invent details about the user's work, teams, projects, tools, or preferences.
- Do not copy large private conversations into the Brainstem. Link sources or summarize instead.
- Mark assumptions and inferred context clearly.
- Do not claim a P2 was created, configured, or verified unless you actually verified it.
- If the user wants the MC tool opened and a browser capability is available, open `https://mc.a8c.com/tools/p2/`. Otherwise provide the link.

## Workflow

### 1. Route the Request

Check whether the user provided a P2 URL or domain, such as:

- `https://shaunsbrain.wordpress.com/`
- `shaunsbrain.wordpress.com`
- a WordPress.com blog ID

If a URL/domain/blog ID is provided:

1. Normalize it to a site identifier usable by WordPress.com tools.
2. Skip the setup questions, name suggestions, and MC form guidance.
3. Go directly to **Verify the Brain P2**.
4. After verification, look for `Brainstem`.
5. If `Brainstem` is missing, create and publish it.
6. Create or update the local `P2-BRAIN.md` pointer file if the current project is writable.

Do not ask what name or slug the P2 should use when a URL already exists. Infer name, owner, privacy, and type from site metadata where available.

If no URL/domain/blog ID is provided, continue with the setup flow below.

### 2. Identify the Minimum Setup

Gather only what is needed to complete the MC form and Brainstem.

Required:

- **Brain purpose:** personal work memory, project memory, team memory, design memory, review memory, etc.
- **Access:** just the user, named collaborators, a team, or broader group
- **Write mode:** owner-write, maintainer-write, draft-only shared, or multiplayer write

Useful if already known:

- **Owner:** primary human owner
- **Preferred name or slug**
- **Sensitivity:** whether this brain may hold HR, performance, customer, unreleased, or private-team context

If key information is missing, ask at most two concise questions. Good questions:

- "What kind of brain are you setting up?"
- "Who should have access?"
- "Who should be allowed to write memories?"

If the user already answered those, proceed with reasonable defaults and label them as assumptions.

### 3. Recommend Names and Slugs

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

### 4. Map to the MC P2 Form

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
- **Shared brain access:** For read-only shared brains, add readers broadly but keep writers/maintainers narrow. For multiplayer write brains, add only trusted collaborators and document write rules in the Brainstem.

### 5. Stop and Wait

After giving MC form values, stop. Do not include a full `Brainstem` draft yet.

End with:

```markdown
Create the P2 with those values, then send me the P2 URL. I will verify access and create the Brainstem page.
```

This keeps the first interaction focused on completing the form.

### 6. Verify the Brain P2

When the request includes a P2 URL/domain/blog ID, or after the user returns with a newly created P2 URL:

1. If `context-a8c` is available, load the `wpcom` provider.
2. Use `get-blog-report-card` with the P2 URL to confirm the blog exists, identify the blog ID, owner, privacy, and stickers.
3. Use `content-authoring` with the P2 URL or blog ID to list pages and posts. Check `pages.list` first, then `posts.list`.
4. Use `p2-sites` or `posts-text` only as optional workspace-P2 helpers. If they reject a Personal P2 as "not an Automattic P2" or do not return it, continue with `content-authoring`.
5. Look for a page titled `Brainstem`.
6. If found, summarize the loaded brain profile and note any missing Brainstem fields.
7. If missing and the site is reachable, create and publish the Brainstem page.
8. After the Brainstem exists, create or update the local `P2-BRAIN.md` pointer file.
9. Do not proceed as if the brain is ready until the Brainstem exists or the user explicitly asks to continue without it.

Useful `context-a8c` operations when available:

- `wpcom` provider, `p2-sites`: discover accessible P2s
- `wpcom` provider, `posts-text`: read posts/pages from a P2
- `wpcom` provider, `content-authoring`: list/read pages and posts; create the initial Brainstem page; create or update ordinary memory content after confirmation
- `wpcom` provider, `get-blog-report-card`: inspect site metadata when normal P2 discovery fails
- `wpcom` provider, `site-activity-log`: inspect recent site activity when confirming newly created sites

### 7. Create the Brainstem Page

Create and publish the Brainstem after this is true:

- the P2 exists and the user provided its URL

Only prepare the Brainstem without publishing when one of these is true:

- the user explicitly asks to see the Brainstem before creating the P2
- the user asks for a template they can paste manually

The default action is to create a published page titled `Brainstem` with slug `brainstem`.

When the P2 exists and `Brainstem` is missing:

1. State exactly which P2 will be changed.
2. Create a `Brainstem` page with `content-authoring`, `pages.create`, `status: publish`, title `Brainstem`, slug `brainstem`, and WordPress block HTML in `content.raw`.
3. Include `user_confirmed` with a concise note such as `User asked to initialize this P2 brain; Brainstem is missing.`
4. Report the edit and view links returned by the tool.

If a `Brainstem` page already exists:

1. Fetch it first.
2. Summarize what would change.
3. Ask for confirmation.
4. Use `pages.update` with WordPress block HTML after confirmation.

If the user explicitly asks to review first, show the Brainstem content in chat and ask whether to publish it.

If write tools are unavailable, give the Brainstem content in chat and ask the user to create a published page named `Brainstem`.

Use the Brainstem shape below as the semantic source. When writing with `content-authoring`, convert it to serialized WordPress block HTML before passing it as `content.raw`.

Do:

- Set the page title to `Brainstem`; do not include `# Brainstem` inside the page content.
- Use core blocks only: paragraphs, headings, lists, and list items.
- Use `<strong>` for field labels and `<code>` for memory type labels.
- Escape HTML special characters in user-provided values.
- Keep the block markup concise. The extra markup costs a few hundred tokens on this setup page, but it prevents flattened or visibly raw Markdown.
- When reading the page later, strip block comments/HTML or use plaintext output before summarizing the brain profile.

Do not:

- Pass raw Markdown to `pages.create` or `pages.update`.
- Mix Markdown headings or Markdown bullets into block HTML.
- Include a duplicate top-level `Brainstem` heading inside the content body.

Minimal block pattern:

```html
<!-- wp:paragraph -->
<p><strong>Brain name:</strong> Shaun's Brain</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":2} -->
<h2 class="wp-block-heading">Purpose</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Portable memory for Shaun's agent sessions.</p>
<!-- /wp:paragraph -->

<!-- wp:list -->
<ul>
<!-- wp:list-item --><li>preferences and working style</li><!-- /wp:list-item -->
<!-- wp:list-item --><li>decision records with rationale</li><!-- /wp:list-item -->
</ul>
<!-- /wp:list -->
```

The semantic Brainstem shape:

```markdown
# Brainstem

Brain name: <name>
Brain type: <type>
Owner: <owner>
Audience: <private/collaborators/team>
Write mode: <owner-write/maintainer-write/draft-only shared/multiplayer write>
P2 URL: <URL>
Initialized: <YYYY-MM-DD>
Default write behavior: Publish the Brainstem during setup; follow write mode for ordinary memories

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

1. Follow the write mode in this Brainstem.
2. Draft by default unless the user explicitly asks to publish or the Brainstem allows multiplayer publishing.
3. For shared brains, show the target P2, audience, and write mode before creating or updating memory.
4. Prefer updating existing memory over creating duplicates.
5. Use descriptive titles.
6. Include source links when memory comes from another system.
7. Mark confidence: high, medium, or low.
8. Add a revisit date when the memory may become stale.

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
- In multiplayer brains, avoid competing canonical memories; update or link the existing memory instead.
- Do not store secrets.
- Summarize sensitive source material instead of copying it.
- Flag uncertain or inferred information.
```

### 8. Create the Project Brain Pointer

After the Brainstem exists, create a concise `P2-BRAIN.md` file in the project root when filesystem tools are available and the project is writable. This file lets future agents discover the right brain without the user repeating the URL.

Find the project root by using the git repository root when available; otherwise use the current working directory. Do not write outside the active project unless the user explicitly asks.

If `P2-BRAIN.md` does not exist, create it. If it already exists:

1. Read it first.
2. If it points to the same brain, leave it alone unless important verified metadata is missing.
3. If it points to a different brain, ask before replacing it.

If filesystem writes are unavailable, show the `P2-BRAIN.md` content in chat and tell the user where it should go.

Do not store secrets, credentials, private memory content, or copied source conversations in `P2-BRAIN.md`. Store only the pointer and usage instructions.

Use this shape:

```markdown
# P2 Brain

This project uses a P2 as portable agent memory.

- Brain: <brain name>
- Brain URL: <brain URL>
- Brainstem: <brainstem URL>
- Project: <project name>
- Scope: <what this project should use the brain for>
- Owner: <owner>
- Audience: <private/collaborators/team>
- Write mode: <owner-write/maintainer-write/draft-only shared/multiplayer write>
- Last verified: <YYYY-MM-DD>

## Agent Instructions

1. Load the Brainstem before substantive work when project context, prior decisions, or owner preferences may matter.
2. Search the brain before assuming important context is missing.
3. Use the brain when the user asks to remember, save, hand off, continue, or explain prior decisions.
4. Follow the Brainstem write mode before creating or updating memory.
5. Cite source links and mark assumptions, inferences, and stale context.
```

## Output Shapes

For a new setup request, respond with:

1. **Names and slugs** if the user has not already chosen one
2. **MC form values**
3. **Next step** asking the user to create the P2 and return with the URL

Do not include the Brainstem in this first response unless requested.

For a request that includes a P2 URL/domain/blog ID, respond with:

1. **Verification**: reachable site, blog ID if available, privacy, owner, and relevant stickers
2. **Brainstem**: found, created, or unable to create
3. **Project file**: `P2-BRAIN.md` created, already present, updated, or skipped
4. **Next step**: report that the brain is ready, ask how to handle a blocked write, or suggest the next memory to add

For a verification request, respond with:

1. whether the P2 was reachable
2. whether the Brainstem was found
3. the loaded brain profile, if available
4. missing or risky setup items
5. the next action needed to make the brain usable
