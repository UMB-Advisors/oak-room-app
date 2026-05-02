# Editing the Oak Room App

> Open one link in your browser. The app, the code, and Claude are all there. You describe what you want changed in plain English, Claude makes the edit, and you watch the app update live next to you. Nothing to install on your computer. Ever.

---

## The setup (one time only)

Before your first edit, do these two small things:

### 1. Get an Anthropic API key

This is what powers Claude. Two ways:

- **Make your own** at [console.anthropic.com](https://console.anthropic.com) → API Keys → Create Key. About $5–10/month if you edit lightly. *Recommended.*
- **Use one the owner gives you.**

Either way, copy the key — it'll start with `sk-ant-`.

### 2. Save the key as a Codespaces secret

In your browser, go to [github.com/settings/codespaces](https://github.com/settings/codespaces).

Under **Codespaces secrets**, click **New secret**:
- Name: `ANTHROPIC_API_KEY`
- Value: paste the key
- Repository access: select `oak-room-app`
- Save

Done forever. Every Codespace you open will have this available.

---

## How to make an edit (every single time)

### Step 1 — Open the Codespace

Click the link the owner sent you. (It looks like `github.com/codespaces/new?repo=...&ref=sandbox`.)

After about a minute (first time) or a few seconds (after that), you'll see:
- **Code** on the left (the project files)
- **A terminal** at the bottom
- A **Ports** tab in the bottom panel — that's where the live preview will appear

### Step 2 — Start the live preview

In the terminal, type:

```bash
npm run dev
```

After a moment, a **"Open in Browser"** popup will appear, or you can click the **Ports** tab → globe icon next to port `3000`. The live preview opens in a new tab. Keep it side-by-side with the Codespace tab.

### Step 3 — Open a Claude terminal

Click the **`+`** button on the terminal tabs to open a second terminal. (Leave the first one running the dev server.)

In the new terminal, type:

```bash
claude
```

You're now chatting with Claude. It already knows everything about your project — it reads `CLAUDE.md` automatically.

### Step 4 — Tell Claude what you want

Just describe it in plain English:

- *"Add an event for May 18th — Whiskey & Cigars on the patio at 7 PM. RSVP required."*
- *"Update the phone number on the House screen to 713.555.1234."*
- *"Change the member name on the membership card to Sarah Powers."*
- *"Remove the Tres Colline Wine Night event — it already happened."*
- *"Add a new house rule: phones may not be used past the bar."*

Claude finds the right place, makes the change, and tells you what was edited.

### Step 5 — Watch the preview update

The live preview tab refreshes automatically within 1–2 seconds of any save. Click around. Make sure it looks right.

If it's not quite right, just tell Claude:
- *"The title is too long, shorten it"*
- *"The date should be Friday, not Thursday"*
- *"Make the description warmer"*

Each fix shows up live in seconds.

### Step 6 — Save it to the sandbox

When you're happy, tell Claude:

> Save this to the sandbox.

Claude will commit and push to the sandbox. Within about a minute, the **sandbox URL** updates — that's the link you and the owner share to preview together.

**The sandbox URL is not the production URL.** Members don't see your changes yet. They go live when the owner clicks "publish."

### Step 7 — Tell the owner

Just send them a message: *"Sandbox is ready — added the May 18 event. Take a look?"*

They'll review at the sandbox URL. When they want it live for members, they click "Publish" and it ships. That's their step, not yours.

---

## Prompts that work especially well

| Instead of saying… | Try saying… |
|---|---|
| "Make it look nicer" | "Make the event title 10% bigger" |
| "Update the events" | "Add this event: [paste full description]" |
| "Fix the colors" | "The cobalt accent is too bright — slightly deeper" |
| "Change everything about Mother's Day" | One change at a time, separately |

Pasting works. Claude reads it well:

> Here's the new House Rules text — please update them in the app, keeping the same Roman numeral format:
>
> I. Members shall arrive on time.
> II. Phones are silenced past the curtain.
> III. ...

---

## What you can edit safely

| ✓ Edit on your own | ⚠️ Ask the owner first |
|---|---|
| Event titles, dates, descriptions | Adding new tabs |
| House rules text | Changing the color scheme |
| Phone numbers, email, contact info | Removing existing screens |
| Member name, tier, card number | Anything that says "config" |
| Reservation room names and times | Anything ending in `.json` or `.yml` |
| Recent transaction items | Anything you don't recognize |
| Privilege list items | The `.github/` folder |

When in doubt, ask Claude: *"Is this a safe change to make on my own, or should I check with the owner first?"*

---

## When something goes wrong

- **The live preview is blank.** Wait another 10 seconds — the dev server can be slow to start. Still blank? In the terminal, press `Ctrl+C` then run `npm run dev` again.

- **Claude says "build failed."** Don't save it to the sandbox. Tell the owner what you were trying to do and paste the error message. **Don't try to fix it harder** — that's how things get worse.

- **Codespace shut down or you closed the tab.** Codespaces auto-pause after 30 minutes of inactivity, but everything is saved. Re-open the link or go to [github.com/codespaces](https://github.com/codespaces) and click your existing one to resume.

- **Claude Code keeps asking for an API key.** The Codespaces secret didn't save or wasn't scoped to this repo. Go to [github.com/settings/codespaces](https://github.com/settings/codespaces), check that `ANTHROPIC_API_KEY` exists and `oak-room-app` is in its repository access list. Then close and re-open the Codespace.

---

## When you're done

Just close the tab. Everything auto-saves. The Codespace stays paused until you re-open the link, then resumes where you left off.

Codespaces include 60 free hours per month — more than enough for content edits. After that, it's a few cents per hour. The owner can also stop a running Codespace from [github.com/codespaces](https://github.com/codespaces) if you forget to close it.

If you started something and didn't finish, tell Claude: *"Save my changes as a draft."* It's saved.

---

## The mental model

```
You ───→ Claude ───→ Code ───→ Live preview ───→ Sandbox URL ───→ Owner publishes ───→ Production
       (in chat)    (Claude        (instant)        (~1 min)         (one click)            (live)
                     edits)
```

Everything in your browser. Nothing on your laptop. Members see only what the owner publishes.
