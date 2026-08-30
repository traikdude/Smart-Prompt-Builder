https://script.google.com/macros/s/AKfycbwM32r75Aa2mZvnRvS6U6RB1lyNpLklaw_VhHJvpdeC5fELjhjezhJRlSTK6slwCNcV7Q/exec

<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Smart Prompt Builder (Google Apps Script Version)

> Migrated Google Apps Script project deployed with Clasp

## 🚀 Live Deployment
**Web App URL:** [Will be populated after deployment]

## 📋 Project Information
- **Script ID:** 1a2ao_CuU-HGao97iSsPnhjcASfho0VyEfLlc59cnE9BNSl9_n0gQjvU3
- **Container Type:** Standalone (Currently)
- **Container URL:** N/A (Can be connected to Google Sheets Later)

## 🛠️ Development Setup

### Prerequisites
- Node.js ≥14.x
- Clasp CLI: `npm install -g @google/clasp`
- Git

### Local Development
```bash
# Clone this repository
git clone https://github.com/traikdude/Smart-Prompt-Builder.git
cd Smart-Prompt-Builder

# Login to Clasp
clasp login

# Pull latest from Apps Script
cd appscript
clasp pull

# Push changes to Apps Script
clasp push
```

## 🔄 CI/CD Pipeline
This project uses GitHub Actions for automated deployment.

### Deployment Triggers
- **Push to main:** Automatically deploys to production
- **Pull Request:** Runs tests and validation

---

## 🏛 Legacy AI Studio VersionThis contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1iS2RZkWqJ7Nq3gSoRSVip18lRfgW71vT

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
