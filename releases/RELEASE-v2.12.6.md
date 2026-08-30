# 🎉 Release v2.12.6 — Hardened Build (Smart-Prompt-Builder)

## 📅 Release Information
- **Date:** Monday, April 13, 2026 at 7:29 PM EST
- **Tag:** `Smart-Prompt-Builder-v2.12.6`
- **Commit:** `28eeca31a19e183cfc87e1f52242d5bf128f0b32`
- **Branch:** `main`
- **Deployed Revision:** `smart-prompt-builder-00011-4wv` (Cloud Run, us-central1)
- **GAS Deployment ID:** `AKfycbwcP0UgfCiDq6CH0gPWroJexCyKcEjLy-kb6FWa1VOYFHzajgjF3gc-cOqv87Til4y1tA`

---

## 📦 Included Files
- `backend/main.py` — Sanitized error handling + Model Enums + v2.12.6 bump
- `App.tsx` — Resilient regex-based multi-payload parser
- `package.json` — Frontend version synchronization (v2.12.6)
- `.github/workflows/deploy.yml` — Upgraded CI/CD with automated Pylint & Build quality gates

---

## 📋 Summary
The **Hardened Build** release focuses on system robustness, security sanitization, and
automated quality enforcement. Leveraging a comprehensive audit by **Gemma 4**, this
version eliminates internal system leaks and introduces a resilient output engine capable
of handling diverse AI response formats without failure.

---

## 🔄 Changes in This Release

### 🐛 Fixed
- **Traceback Information Leak** — Backend exception handlers no longer return raw
  Python tracebacks to the client. Full errors are captured in server-side logs, while
  the API returns sanitized generic error types.
- **Fragile Payload Parsing** — The frontend parser is now tolerant of casing,
  whitespace deviations, and markdown code block wrapping in AI responses.

### ✨ Added
- **Automated CI/CD Quality Gates** — The deployment workflow now automatically
  verifies the **10.00/10 Pylint score** and frontend build success before allowing
  a release to production.
- **Defensive Multi-Modal Validation** — Added structural verification for `inlineData`
  payloads in the backend to prevent crashes on malformed multi-modal requests.

### 🔧 Changed
- **Model Mapping Architecture** — Brittle hardcoded string logic replaced with a
  robust `ModelAlias` Enum and centralized `MODEL_ID_MAP` configuration.
- **Backend Version**: `2.12.5` → `2.12.6`
- **Frontend Version**: `2.12.0` → `2.12.6`

### 🔒 Security
- **Hardened Error Surface**: Significantly reduced the attack surface by hiding
  internal stack traces and library versions from API error responses.
- **Validation-First Logic**: Native SDK generation is now preceded by structural
  content validation.

---

## 🧪 Testing Performed
- ✅ Pylint score: **10.00/10** (verified post-refactor)
- ✅ Cloud Run deployment: `smart-prompt-builder-00011-4wv` live serving 100% traffic
- ✅ GAS web app: Build pushed and verified end-to-end
- ✅ K8s Orchestration: Verified in local Minikube environment
- ✅ Resilient Parser: Tested against malformed and markdown-wrapped AI outputs

---

## 🔗 Links
- **Live Web App:** `https://script.google.com/macros/s/AKfycbwcP0UgfCiDq6CH0gPWroJexCyKcEjLy-kb6FWa1VOYFHzajgjF3gc-cOqv87Til4y1tA/exec`
- **Cloud Run Service:** `https://smart-prompt-builder-825046261103.us-central1.run.app`
- **GitHub Repository:** `https://github.com/traikdude/Smart-Prompt-Builder`

---

*Smart-Prompt-Builder — Engineered with ❤️ 🛡️ ⚡ by Elite Architect & Gemma 4*
