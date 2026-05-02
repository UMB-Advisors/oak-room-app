# Oak Room Houston — Members' App (v1.0.0)

> Owner setup guide. Designed for the owner's local Claude Code session — the operating instructions for getting this deployed and connected to a Codespaces sandbox the collaborator can edit live.

---

## What this repo is

A members' app for The Oak Room. Next.js + Tailwind + framer-motion, deployed to Vercel. Editable live in a browser via GitHub Codespaces (collaborator) or locally via Claude Code (you).

## The architecture you're setting up

Two URLs, two branches, one promote button:

| | Branch | URL | Who pushes here |
|---|---|---|---|
| **Production** | `main` | `oak-room.vercel.app` (or your custom domain) | Owner only, via promote action |
| **Sandbox** | `sandbox` | `oak-room-app-git-sandbox-USER.vercel.app` | Collaborator (via Codespaces) and owner |

Both are Vercel deploys of the same repo, configured to deploy different branches. Collaborator edits sandbox, you click "Promote" in GitHub Actions when ready, sandbox merges to main, production deploys.

---

## Setup walkthrough — for your Claude Code session to execute

The following are the exact commands and steps to get this running end-to-end. Tell your Claude Code session something like *"set up this project per the README"* and feed it this section.

### Step 1 — Push to a new GitHub repo

```bash
cd <this-folder>
git init
git add .
git commit -m "Initial commit — Oak Room app v1.0.0"
git branch -M main

# Create the sandbox branch from main
git checkout -b sandbox
git checkout main

# Create the repo on GitHub (requires gh CLI authenticated)
gh repo create oak-room-app --public --source=. --remote=origin --push

# Push the sandbox branch too
git push origin sandbox
```

### Step 2 — Connect to Vercel

```bash
# From the project root, with vercel CLI installed (npm i -g vercel)
vercel link

# Vercel auto-detects Next.js. Accept defaults for everything.
# This creates the production deploy from main.
```

To configure the **sandbox** deploy:
- Go to the Vercel project dashboard → Settings → Git
- Under "Production Branch," confirm it's set to `main`
- Under "Deploy Hooks" or "Preview Deployments," confirm "All branches" is enabled (it is by default)
- The `sandbox` branch will now auto-deploy to its own preview URL

### Step 3 — Get the sandbox URL

After the first push to `sandbox`, Vercel assigns a stable preview URL. You can find it:

```bash
vercel ls --scope=YOUR_VERCEL_USERNAME
```

It'll look like `oak-room-app-git-sandbox-<username>.vercel.app`. Save this URL — you'll give it to the collaborator.

### Step 4 — Set up the Codespaces link

GitHub Codespaces opens any repo as a full Linux container with VS Code in the browser. The repo's `.devcontainer/devcontainer.json` auto-installs npm deps and Claude Code on first launch. The launch link format is:

```
https://github.com/codespaces/new?repo=YOUR_USERNAME/oak-room-app&ref=sandbox
```

The `&ref=sandbox` part is critical — it tells Codespaces to open the sandbox branch, not main. Save this URL — you'll give it to the collaborator.

When the collaborator opens this link, they get a Codespace that:
- Boots a real Ubuntu container (~1 minute first time, seconds after)
- Auto-runs `npm install` and installs `@anthropic-ai/claude-code` globally
- Forwards port 3000 with auto-open preview once they run `npm run dev`
- Has a terminal where they run `claude` to start Claude Code

**Note:** the collaborator must add `ANTHROPIC_API_KEY` as a Codespaces secret at [github.com/settings/codespaces](https://github.com/settings/codespaces) and grant `oak-room-app` access. Walk them through it from `COLLABORATOR-GUIDE.md` if needed.

### Step 5 — Add the collaborator to the GitHub repo

```bash
# Add by GitHub username
gh api -X PUT /repos/YOUR_USERNAME/oak-room-app/collaborators/COLLABORATOR_USERNAME -f permission=push
```

Or via the web: Repo → Settings → Collaborators → Add people → choose `Write` permission.

### Step 6 — (Important) Branch protection on `main`

This makes the sandbox-only flow safe. Without it, a typo in their workflow could push directly to production.

Via gh CLI:

```bash
gh api -X PUT /repos/YOUR_USERNAME/oak-room-app/branches/main/protection \
  --input - <<'EOF'
{
  "required_status_checks": null,
  "enforce_admins": false,
  "required_pull_request_reviews": null,
  "restrictions": {
    "users": ["YOUR_GITHUB_USERNAME"],
    "teams": [],
    "apps": []
  },
  "allow_force_pushes": false,
  "allow_deletions": false
}
EOF
```

This restricts pushes to `main` to only your GitHub user. The collaborator can still push to `sandbox` freely.

(Or via web: Repo → Settings → Branches → Add rule → Branch name pattern `main` → "Restrict who can push to matching branches" → add only yourself.)

---

## How to publish (the "promote" button)

When the collaborator has staged changes on sandbox and you want them live:

**Option A — GitHub UI (easier for occasional use):**
1. Go to repo → Actions tab → "Promote sandbox to production"
2. Click "Run workflow"
3. Type `publish` in the confirm field
4. Click the green "Run workflow" button
5. Within ~60 seconds, production updates

**Option B — From your local Claude Code (faster if you're already in terminal):**

```bash
gh workflow run promote.yml -f confirm=publish
```

Either way, the workflow merges `sandbox → main`, Vercel deploys `main` to production, members see the new content within about a minute.

---

## How to revert if something goes live that shouldn't have

**Option A — GitHub UI:**
1. Repo → Actions → "Revert last promotion"
2. Click "Run workflow"
3. Type `revert`
4. Run

**Option B — Local:**

```bash
gh workflow run revert.yml -f confirm=revert
```

This reverts the last commit on `main`, pushes, and Vercel re-deploys the previous version. Takes about a minute.

---

## What to send the collaborator

Send them three things:

1. **The Codespaces link:** `https://github.com/codespaces/new?repo=YOUR_USERNAME/oak-room-app&ref=sandbox`
2. **The sandbox preview URL:** so they can see their changes live (`oak-room-app-git-sandbox-<USER>.vercel.app`)
3. **The collaborator guide:** point them to `COLLABORATOR-GUIDE.md` in the repo, or send the file directly

That's it. They click the Codespaces link, follow the guide, edit, save → sandbox URL updates → they message you → you click promote → live.

---

## Files in this repo

| File | What it's for |
|---|---|
| `CLAUDE.md` | Orientation file Claude Code reads on every session — works for both collaborator and owner contexts |
| `COLLABORATOR-GUIDE.md` | What you send the collaborator |
| `README.md` | This file |
| `.devcontainer/devcontainer.json` | Tells Codespaces how to open this project (Node 20, auto-install deps + Claude Code, forward port 3000) |
| `.github/workflows/promote.yml` | The "publish to production" button |
| `.github/workflows/revert.yml` | The "rollback production" button |
| `components/ClubApp.jsx` | The whole app — events, guests, member, ledger, etc. |
| `app/`, configs | Next.js plumbing |

---

## Costs (rough monthly estimates)

| Service | Free tier covers | When you'd pay |
|---|---|---|
| **Vercel** | Unlimited prototypes, custom domain, 100GB bandwidth | Bandwidth-heavy production traffic |
| **Codespaces** | 60 core-hours/month per user (free tier) | ~$0.18/core-hour past the free tier — light editing usage stays within free tier |
| **GitHub** | Unlimited private repos | Not relevant here |
| **Anthropic API** | Pay-as-you-go from $5 minimum | ~$5–10/mo for light editing usage |

Total: **~$5–10/mo**, almost all of it API usage by the collaborator.

---

## Versioning

This is `v1.0.0`. Bump `package.json` version when you ship meaningful changes. Tag major releases with `git tag` for easy rollback reference.
