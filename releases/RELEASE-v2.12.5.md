# 🎉 Release v2.12.5 — Smart-Prompt-Builder

## 📅 Release Information
- **Date:** Sunday, April 13, 2026 at 6:42 PM EST
- **Tag:** `Smart-Prompt-Builder-v2.12.5`
- **Commit:** `10b85c4db59010dcbc60d5833df84bffc7db161c`
- **Branch:** `main`
- **Deployed Revision:** `smart-prompt-builder-00010-8df` (Cloud Run, us-central1)
- **GAS Deployment ID:** `AKfycbwcP0UgfCiDq6CH0gPWroJexCyKcEjLy-kb6FWa1VOYFHzajgjF3gc-cOqv87Til4y1tA`

---

## 📦 Included Files
- `backend/main.py` — CORS fix + origin logging + v2.12.5 version bump
- `appscript/index.html` — Built React/Vite frontend with cost-warning UI
- `GEMINI.md` — Permanent project rules (CORS, deployment, billing)

---

## 📋 Summary
This release resolves a critical CORS misconfiguration that was silently blocking **all**
generation pipelines with `"One or more pipelines failed!"`. The root cause was that the
Google Apps Script iframe sends requests from a **dynamic** `googleusercontent.com`
subdomain that cannot be statically whitelisted — any origin restriction causes a
`400 Bad Request` on the `OPTIONS` preflight before Gemini is ever called.

Additionally includes the cost-awareness UI enhancements (amber Pro badge, pricing
tooltip, Flash downgrade banner) and permanent project documentation in `GEMINI.md`.

---

## 🔄 Changes in This Release

### 🐛 Fixed
- **CORS preflight 400** — `allow_origins=["*"]` replaces all restricted origin lists.
  GAS iframe origin is dynamic per-session (`https://n-<hash>-script.googleusercontent.com`)
  and cannot be statically matched. Any restriction silently kills all pipelines.
- **CORS spec violation** — `allow_credentials=False` + `allow_headers=["*"]` is now
  used correctly. Previous `allow_credentials=True` + wildcard headers violated the spec.
- **Batch endpoint param collision** — `request: BatchGenerateRequest` renamed to
  `body: BatchGenerateRequest` to avoid collision with FastAPI's `Request` type after
  the origin-logging parameter was added.

### ✨ Added
- **Origin logging** — Every batch request logs `"Batch request from Origin: <url>"` to
  Cloud Run logs. Enables exact GAS iframe origin capture for future CORS lockdown.
- **Pro model cost-warning UI** — Amber pulsing "PRO" badge, `💰` emoji, pricing
  tooltip, and contextual warning banner with one-click "Switch to Flash" link.
- **GEMINI.md project rules** — Permanent CORS rule, deployment workflow, billing
  context, and Pylint enforcement documented for all future sessions.

### 🔧 Changed
- Backend version: `2.12.3` → `2.12.5`
- CORS: `allow_origins=["*"]` (was restricted list)
- CORS: `allow_credentials=False` (was `True` — spec violation)
- Model mapping: `"3.1"` → `gemini-2.5-pro` restored (was previously downgraded to Flash)
- Infrastructure: `smart-prompt-builder-engine` and `pdftoimg-suite-ai-studio-ux`
  Cloud Run services deleted (April 13, 2026) — only `smart-prompt-builder` active.

### 🔒 Security
- All changes are security-neutral: backend is protected by server-side Gemini API key
  via Secret Manager. No credentials are exposed to client. `allow_credentials=False`
  ensures no browser cookies cross the boundary.

---

## 🧪 Testing Performed
- ✅ Pylint score: 10.00/10 (enforced before every commit)
- ✅ Cloud Run deployment: `smart-prompt-builder-00010-8df` live at 100% traffic
- ✅ GAS web app tested: both pipelines complete successfully end-to-end
- ✅ Cloud Run logs: `OPTIONS 200` replacing previous `OPTIONS 400`
- ✅ `git status` clean before release tag

---

## ⚠️ Critical Notes for Future Maintainers

> **DO NOT change `allow_origins` back to a restricted list.**
> The GAS iframe origin is dynamic per session/user. Any restriction causes
> `OPTIONS 400 Bad Request`, silently breaking all generation pipelines.
> See `GEMINI.md` → `## ⚠️ CORS — Critical Rule` for full context.

> **`clasp push` alone does NOT publish the live web app.**
> Always follow with `clasp deploy --deploymentId <id>` to push to the live URL.

---

## 🔗 Links
- **Live Web App:** `https://script.google.com/macros/s/AKfycbwcP0UgfCiDq6CH0gPWroJexCyKcEjLy-kb6FWa1VOYFHzajgjF3gc-cOqv87Til4y1tA/exec`
- **Cloud Run Service:** `https://smart-prompt-builder-825046261103.us-central1.run.app`
- **GitHub Repository:** `https://github.com/traikdude/Smart-Prompt-Builder`
- **Commit:** `https://github.com/traikdude/Smart-Prompt-Builder/commit/10b85c4db59010dcbc60d5833df84bffc7db161c`
- **Tag:** `https://github.com/traikdude/Smart-Prompt-Builder/releases/tag/Smart-Prompt-Builder-v2.12.5`

---

## 🎯 Post-Release Verification Checklist
- [x] Commit visible on remote repository
- [x] Tag `Smart-Prompt-Builder-v2.12.5` pushed to remote
- [x] Release notes committed and accessible
- [x] Cloud Run revision `00010-8df` serving 100% traffic
- [x] GAS web app pipelines confirmed working by user
- [x] CORS rules documented in GEMINI.md for all future sessions
- [x] Pylint 10.00/10 verified before every commit

---

*Smart-Prompt-Builder — Engineered with ❤️ 🚀 ⚡ by Elite Architect*
