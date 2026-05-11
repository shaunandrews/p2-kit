# p2-kit

`p2-kit` turns a P2 into a portable, human-readable brain for AI agents and teams.

The premise is simple: a P2 can be more than a publishing surface. It can be a hosted, permissioned, inspectable memory layer that any capable agent can load, use, update, and hand off. A brain can be private to one person, shared read-only with a team, or collaboratively written by multiple people and agents. Instead of tying long-term context to one vendor, runtime, or local machine, the "brain" is a P2 URL plus a small set of conventions.

## Why P2 as a Brain?

P2 already has useful properties for agent memory:

- **Hosted:** available from anywhere an authorized agent can reach it.
- **Portable:** usable across agents, sessions, and tools.
- **Readable:** humans can inspect and correct the memory directly.
- **Social:** shared brains can give teams a common working context.
- **Permissioned:** access can follow existing P2 and WordPress.com controls.
- **Durable:** important decisions, context, and artifacts do not disappear when a chat ends.

`p2-kit` is not trying to make P2 into a vector database. Its strength is that memory remains understandable, editable, linkable, and socially legible.

## Core Idea

A brain is a P2 with a protocol.

At minimum, a brain should have:

- a **Brainstem** page, written as normal WordPress blocks, that explains the brain's purpose, owner, scope, rules, and indexes
- a **Memory** page that stays compact and current with recent and important memory
- a local **`P2-BRAIN.md` pointer** in each project that should use the brain
- **memory posts** for decisions, preferences, project state, artifacts, meeting notes, and unresolved questions
- **summaries** that compact recent activity into useful working context
- **source links** back to Slack, Linear, GitHub, Zendesk, P2s, files, screenshots, or other evidence
- **hygiene rules** for stale context, sensitive content, confidence, write modes, and publish behavior

Agents can then be told:

> Use this P2 as your brain.

The agent loads the Brainstem, reads the Memory page, searches relevant posts, performs the task, and writes useful new context back to the brain.

For project work, the local `P2-BRAIN.md` file is the discovery hook. It tells an agent which hosted brain to load without requiring the user to paste the P2 URL into every session.

## Brain Types

Different P2s can act as different brains:

- **Personal brain:** private work memory, preferences, goals, recurring context, review evidence
- **Project brain:** decisions, current state, open questions, milestones, artifacts
- **Team brain:** rituals, norms, updates, shared references, operating context
- **Shared reference brain:** read-mostly context that many agents can load, with a small set of maintainers
- **Multiplayer brain:** collaboratively written context where team members and their agents can draft or publish memory under shared rules
- **Design brain:** snaps, visual explorations, feedback, rationale, iterations
- **Review brain:** self-feedback, accomplishments, impact evidence, growth notes
- **Incident brain:** timeline, decisions, remediation, follow-ups, learnings

Swapping brains should be as simple as pointing the agent at a different P2 and loading that brain's Brainstem.

## Shared Brains

The same protocol works for teams. A shared brain lets team members and their agents work from the same context instead of each person rebuilding it in separate chats.

Useful shared-brain modes:

- **Read-only shared brain:** many people and agents can load/search context, but only maintainers write. Good for team norms, project state, onboarding, and canonical decisions.
- **Draft-only shared brain:** many agents can create proposed memories as drafts, while humans review/publish. Good for early team use where trust and format are still developing.
- **Multiplayer write brain:** multiple people and agents can publish under explicit rules. Good for high-trust teams, fast-moving projects, incidents, or design/product rituals where shared context needs to stay current.

Shared brains need clearer rules than personal brains: who owns the Brainstem, who can publish, when to update an existing memory instead of adding a new post, and how to handle conflicting context. The Brainstem should make the audience and write mode explicit.

## Creating a Brain P2

For now, `p2-kit` should assume that creating the P2 itself is a human-in-the-loop setup step.

The current `context-a8c` tools can discover P2s and create or update content on existing WordPress.com/P2 sites, but they do not expose a tool for provisioning a brand-new P2. Internal docs point Automatticians to the MC P2 tool for that step:

<https://mc.a8c.com/tools/p2/>

Suggested setup flow:

1. Open the MC P2 tool.
2. Create a new internal P2 for the brain.
3. Choose a clear URL, such as:
   - `shauns-brain.wordpress.com`
   - `p2-kit-brain.wordpress.com`
   - `team-name-brain.wordpress.com`
4. Keep the P2 private unless there is a specific reason to share it.
5. Add the intended human owner and any collaborators.
6. Give the agent the P2 URL.
7. The agent verifies access and creates the initial published `Brainstem` page.
8. The agent writes a local `P2-BRAIN.md` pointer file in the current project.

For a first version, a skill can help by opening the MC tool for the user, preparing the recommended site name and form values, then verifying the created P2 and publishing the initial Brainstem once the user provides the URL.

`p2-kit` should not try to silently provision P2s. Brain creation changes audience, permissions, and long-term memory boundaries, so it should stay explicit.

## Proposed Skills

The first version should be skills-first. Skills define the behavior and conventions; implementation can use `context-a8c` where available.

### MVP Skills

0. **`p2-brain-init`**
   - Explain how to create a new brain P2.
   - Open or link to the MC P2 tool.
   - Recommend a brain name, URL, privacy posture, and owner/collaborators.
   - Accept an existing P2 URL and skip the setup flow.
   - Create and publish the initial `Brainstem` page as WordPress blocks when it is missing.
   - Save a local `P2-BRAIN.md` pointer file for future agents.
   - After the user creates the P2, verify access and load the Brainstem.

1. **`p2-brain-load`**
   - Read local `P2-BRAIN.md` when present to discover the default brain.
   - Given a P2 brain URL, load the Brainstem.
   - Identify active indexes and recent summaries.
   - Search task-relevant memory.
   - Produce a compact working-memory summary for the current agent session.

2. **`p2-brain-memory`**
   - Read and maintain the primary Memory page.
   - Keep recent and important memory compact, current, and cited.
   - Create supporting memory posts when a detail needs its own durable record.
   - Follow the Brainstem write mode; do not bake in a project-wide draft preference.

3. **`p2-brain-write`**
   - Save new durable context back to the brain.
   - Choose whether to update the Memory page, update an existing memory post, or create a new memory post.
   - Include source links, confidence, status, and follow-ups.
   - Follow the Brainstem write mode.

4. **`p2-brain-handoff`**
   - Summarize current work so another agent can continue.
   - Capture what changed, what matters, open questions, next steps, and relevant links.
   - Write a durable handoff post or update an existing project log.

### Later Skills

- **`p2-brain-search`**: query prior memory and return cited context
- **`p2-project-log`**: maintain a project-specific running log
- **`p2-team-update`**: draft team updates from Slack, GitHub, Linear, Zendesk, and P2 context
- **`p2-snap`**: package visual design snapshots with rationale and feedback prompts
- **`p2-self-feedback`**: collect review evidence and draft self-feedback
- **`p2-performance-review`**: structure review input with evidence and examples
- **`p2-decision-record`**: capture durable decision records

## Memory System

The **Memory** page is the primary working-memory surface for an agent. It should be a published page titled `Memory` with slug `memory`.

The Memory page is not a full archive. It is the compact context layer an agent can read after the Brainstem. It has two required sections:

- **Short Term:** active working set for current projects, recent changes, open loops, and context likely to change soon.
- **Long Term:** durable facts, decisions, preferences, stable project context, and canonical links that should survive across sessions.

Agents should keep the Memory page concise. Short Term is volatile and should be pruned or promoted. Long Term is curated and should change more slowly. When a memory needs detail, discussion, or source-heavy context, create or update a separate memory post and link it from the Memory page.

The model is intentionally small:

- **Brainstem:** always-read operating instructions for the brain.
- **Memory page:** always-read compact working context.
- **Supporting memory posts:** deeper records opened only when relevant.

This keeps token use predictable while preserving enough structure for durable context. The Memory page should act like an agent-maintained table of contents plus working set, not a full transcript.

Promotion rules:

1. Capture active context in **Short Term** while it is useful for the current thread of work.
2. Promote to **Long Term** only when it is likely to matter across sessions, agents, or projects.
3. Link to supporting memory posts for decisions, handoffs, project logs, artifacts, and source-heavy summaries.
4. Remove or archive stale Short Term items once they are resolved, superseded, or promoted.
5. Preserve source links, confidence, and dates for Long Term items whenever possible.

Publishing is core to the brain: memory needs to be available to future agents. Draft/review is a write mode a human or team can choose, not a global default baked into the protocol.

## Memory Post Shape

Memory should be structured enough for agents and readable enough for humans.

```markdown
# Decision: Use P2 as the first brain backend

Type: decision
Project: p2-kit
Status: accepted
Date: 2026-05-08
Confidence: high
Revisit: 2026-08-01

## Context

The project needs a hosted, portable memory layer that agents can use across sessions.

## Decision

Use P2 as the first backend for agent brain memory.

## Rationale

P2 is hosted, permissioned, human-readable, linkable, and already part of the expected work environment.

## Source Links

- Initial project discussion

## Follow-ups

- Define the Brainstem format.
- Create the first three skills: load, write, handoff.
```

## Brainstem Shape

Every brain should have a canonical Brainstem page. The Brainstem tells an agent how to use the brain, and should be stored as normal WordPress blocks rather than raw Markdown. Agents should read its rendered or plaintext form so block markup does not become working-memory noise.

```markdown
# Brainstem

Brain name: Shaun Work Brain
Owner: Shaun
Audience: Private - Shaun only
Write mode: Owner-defined
Scope: Private work memory
Default behavior: publish the Brainstem during setup; follow write mode for ordinary memories
Primary indexes:
- Memory
- Active projects
- Decisions
- Preferences
- Review evidence

Rules:
- Cite sources for factual claims.
- Mark uncertain or inferred context clearly.
- Prefer updating existing memory over creating duplicates.
- Put active or changing context in Short Term.
- Promote durable cross-session context to Long Term.
- Link supporting memory posts when details or sources matter.
- Treat review and HR content as sensitive.
- Follow the write mode before publishing to shared P2s.

Memory page standard:
- Short Term: active working context, recent changes, open loops, and information likely to change soon.
- Long Term: durable facts, decisions, preferences, stable project context, and canonical links.
```

## Project Brain Pointer

Projects that use a P2 brain should include a small `P2-BRAIN.md` file at the project root. It should contain only the brain pointer and operating instructions, not private memory content.

```markdown
# P2 Brain

This project uses a P2 as portable agent memory.

- Brain: Shaun's Brain
- Brain URL: https://shaunsbrain.wordpress.com/
- Brainstem: https://shaunsbrain.wordpress.com/brainstem/
- Memory: <pending>
- Project: p2-kit
- Scope: p2-kit project memory, decisions, preferences, and handoffs
- Owner: Shaun Andrews
- Audience: Private - Shaun only
- Write mode: Defined by Brainstem; no project-level override
- Last verified: 2026-05-08

## Agent Instructions

1. Load the Brainstem before substantive work when project context, prior decisions, or owner preferences may matter.
2. Load the Memory page when it exists; it is the compact recent/important context layer.
3. Search the brain before assuming important context is missing.
4. Use the brain when the user asks to remember, save, hand off, continue, or explain prior decisions.
5. Follow the Brainstem write mode before creating or updating memory.
6. Cite source links and mark assumptions, inferences, and stale context.
```

## Safety and Hygiene

The default behavior should be conservative:

- Publish the Brainstem during setup so future agents have canonical loading instructions.
- Follow the Brainstem write mode for ordinary memories.
- Always show the target P2 and intended audience before posting.
- For shared brains, show the write mode before creating or updating memory.
- Cite sources for factual claims.
- Separate facts, preferences, assumptions, and inferences.
- Mark stale or low-confidence context.
- Treat HR, performance, customer, and private-team information as sensitive.
- Prefer summaries and links over copying large private conversations.
- Ask before moving context from a private brain to a shared brain.
- In multiplayer brains, prefer updating canonical memory posts over creating competing versions.

## Getting Started

The practical starting point is to define the protocol before building many workflows.

1. Write the first `SKILL.md` for `p2-brain-init`.
2. Define the required Brainstem fields.
3. Create a sample personal Brainstem page.
4. Create a sample project Brainstem page.
5. Create one private P2 manually through the MC P2 tool.
6. Add a `P2-BRAIN.md` pointer to one project.
7. Write `p2-brain-load`.
8. Implement `p2-brain-memory`.
9. Implement `p2-brain-write`.
10. Implement `p2-brain-handoff`.
11. Test the flow against one private P2:
   - load the brain
   - ask a task-specific question
   - write a memory
   - produce a handoff
   - start a new session and reload from the brain

## Suggested Repository Shape

```text
p2-kit/
  README.md
  skills/
    p2-brain-init/
      SKILL.md
    p2-brain-memory/
      SKILL.md
    p2-brain-load/
      SKILL.md
    p2-brain-write/
      SKILL.md
    p2-brain-handoff/
      SKILL.md
  references/
    brain-protocol.md
    brainstem.md
    memory-posts.md
    safety-and-hygiene.md
    context-a8c.md
  examples/
    personal-brainstem.md
    project-brainstem.md
    decision-memory.md
    handoff-memory.md
```

## Open Questions

- What is the minimum Brainstem needed for a useful first brain?
- Should memories be primarily posts, comments, or a mix?
- How should agents discover canonical index posts?
- How should shared brains handle conflicts when two agents update the same memory?
- How should stale memory be marked and revisited?
- What should be private by default?
- How much should the skills rely on `context-a8c` versus plain P2/WordPress.com APIs?
- Should the protocol support non-P2 backends later, or stay intentionally P2-native?

## First Milestone

The first milestone is a working "brain loop":

1. An agent loads a P2 brain.
2. The agent performs useful work using that context.
3. The agent writes a durable memory back to the brain.
4. A different agent or later session can load the brain and continue with minimal explanation.

That loop is the core product.
