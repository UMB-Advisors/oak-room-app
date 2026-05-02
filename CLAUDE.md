# CLAUDE.md — Oak Room Houston Members' App

> Read this first. It tells you what this project is, who's editing it, and how to behave.

## Detect your environment first

You're running in one of two contexts. Check which one before doing anything:

- **Collaborator context (GitHub Codespace, browser):** the user is on the `sandbox` branch in a Codespace (browser-based VS Code on a real Linux container). They've started the dev server with `npm run dev` and are running you via `claude` in a second terminal. They're a non-developer making content edits. Their pushes go to the sandbox URL only — production updates only when the owner clicks "publish" in GitHub Actions.

- **Owner context (local machine):** the user is Dustin, the owner. He runs Ubuntu, uses Claude Code locally, and has full control. He may push to `main` or `sandbox`, run the promote/revert workflows, and refactor things the collaborator can't.

To tell which you're in: check `git branch --show-current`. If it's `sandbox`, you're with the collaborator. If `main` or any other branch, you're with the owner.

## What this is

A members' app for The Oak Room at The Post Oak Hotel (Houston, TX). Built as Next.js + Tailwind + framer-motion. The whole app is one component (`components/ClubApp.jsx`) by design — content is hardcoded for fast iteration, not pulled from a CMS.

## The two-surface architecture

```
                        GitHub repo
                             │
        ┌────────────────────┴───────────────────┐
        │                                        │
   sandbox branch                          main branch
        │                                        │
   Vercel preview deploy                Vercel production deploy
        │                                        │
   sandbox.vercel.app                  oak-room.vercel.app
   (you + owner only)                  (members)

   Collaborator pushes here                       │
   from a Codespace                               │
        │                                        │
        └─── one-click "Promote" Action ─────────┘
        (manually triggered in GitHub UI by owner)
```

**Critical:** the collaborator's edits go to `sandbox` automatically. They are NEVER pushed directly to `main`. Production only updates when the owner runs the `Promote sandbox to production` GitHub Action.

## What you'll usually be asked to do (collaborator context)

Almost every request will be a content edit to `components/ClubApp.jsx`:

| User says | You edit |
|---|---|
| "Add an event for [date]" / "Update upcoming events" | `const EVENTS` |
| "Change the house rules" / "Update the dress code" | `const HOUSE_RULES` |
| "Add a new private room" / "Change reservation times" | `const RESERVATIONS_AVAIL` |
| "Update my membership tier" / "Change the member name" | `const MEMBER` |
| "Update recent transactions" / "Change the balance" | The transactions array in `BillingScreen` |
| "Update the phone number" / "Change the email" | The contact block at the bottom of `RulesScreen` |

These are plain JavaScript objects/arrays at the top of `components/ClubApp.jsx`. Find them by searching for the constant name. Do not refactor them into separate files unless explicitly asked.

## What you should NOT touch without explicit permission

- **The color palette** (`COBALT`, `GRAPHITE`, `MARBLE`, `VEIN`, etc. near the top of `ClubApp.jsx`). Visual identity is deliberately tuned. If the user says "make it red" or "change the theme," confirm before sweeping color changes.
- **The component structure / tab list.** Adding/removing tabs is a design decision. Confirm scope first.
- **`app/layout.jsx`, `app/page.jsx`, `next.config.js`, `tailwind.config.js`, `package.json`, `.devcontainer/`.** Plumbing — don't change unless the user is explicitly asking for a build/deploy/dependency change.
- **Anything in `.github/workflows/`.** That's the promote/revert automation. Breaking it stops the publishing flow. (Owner context: feel free to edit if asked.)

## Style and voice

Match the marketing flyers (visible @TheOakRoomHouston on Instagram):

- **Direct, unfussy.** "RSVP required." "Complimentary tasting." "4 PM – 8 PM."
- **Houston luxury, not Manhattan minimalism.** Warmer, more approachable.
- **No exclamation points.** No motivational language. No "Don't miss out!"
- **Italic pull-quotes** for the `note` field on events. One sentence, sets the mood.
- **Short teasers** for the `teaser` field on events. Two beats, separated by `·`. Example: "Willamette Valley · complimentary"

When writing event copy, use `EVENTS[1]` (Annual Derby Watch Party) as a reference example.

## Commit and push workflow

### Collaborator context (Codespace, on sandbox branch)

1. Make the edit in `components/ClubApp.jsx`.
2. **Verify the build first:**
   ```bash
   npm run build
   ```
   If it fails, **do not commit.** Show the user the error in plain language and stop.
3. Confirm you're on `sandbox`:
   ```bash
   git branch --show-current
   ```
   If somehow not on sandbox, switch:
   ```bash
   git checkout sandbox
   ```
4. Commit and push:
   ```bash
   git add .
   git commit -m "[short, friendly description]"
   git push origin sandbox
   ```
5. Tell the user (in their language, not technical):
   > "Saved to the sandbox. The sandbox URL will update in about a minute. When you're ready, message the owner to publish."

**Never push to `main` from the collaborator context.** Even if asked. Only the owner can promote.

### Owner context (local, on any branch)

The owner has full freedom. Follow whatever branch/commit pattern they ask for. Common patterns:
- "Push this to main" → `git push origin main` (deploys to production immediately)
- "Push to sandbox" → checkout sandbox, commit, push (deploys to sandbox URL)
- "Promote sandbox to main" → use `gh workflow run promote.yml -f confirm=publish` or merge manually
- "Revert production" → use `gh workflow run revert.yml -f confirm=revert` or `git revert HEAD; git push origin main`

## Verification before any commit

Always run `npm run build` before committing. A failed build means a broken sandbox or production. If it fails:
- Show the user the error message
- Do not commit
- Suggest they roll back the edit, or ask for guidance

## Things to confirm before doing (both contexts)

Stop and ask before:
- Adding new dependencies (`npm install [anything]`)
- Removing or renaming files
- Changing more than one tab/screen at once
- Anything in `package.json`, configs, or `.github/`
- Anything that looks like a design overhaul vs. a content edit

For routine content edits — events, rules, perks, member info — proceed and summarize what changed.

## Useful pointers

- Member name and tier: `const MEMBER = { ... }` near the top of `ClubApp.jsx`
- Privileges list on Member tab: search for `Guest allowance`
- "A Fertitta property" colophon: search for `A Fertitta property`
- Contact info footer (phone, email, IG handle): bottom of `RulesScreen`
- Dates: `THU · APR 30`. Times: `6 PM`. Match the existing pattern.
- All cobalt accents come from the `COBALT` constant — don't hardcode `#2547D8`.

## Communication style — collaborator context

Speak in their language, not in code-speak.

❌ "I updated the EVENTS array on line 47, adding a new object with id: 7."
✓ "I added the new Whiskey & Cigars event for May 18th. The preview should refresh in a moment — check the events grid on the home screen."

When you push:

❌ "Pushed to origin/sandbox at HEAD~1."
✓ "Saved to the sandbox. The sandbox URL will update in about a minute. Send the owner a quick message when you want them to publish it."

## When in doubt

Ask before sweeping changes. This is a prototype with intentional design decisions; respect them. Small content edits ship immediately to sandbox. Anything larger, confirm scope first.
