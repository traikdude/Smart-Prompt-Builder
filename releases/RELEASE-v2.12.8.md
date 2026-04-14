# 🎉 Release v2.12.8 - Smart-Prompt-Builder

## 📅 Release Information
- Date: Monday, April 13, 2026 at 08:37 PM EDT
- Tag: Smart-Prompt-Builder-v2.12.8
- Commit: a542a76d76e044f74ef7a9848ef04b64d0710889
- Branch: main

## 📦 Included Files
- (Live Google Apps Script Deployment - ID: AKfycbwcP0UgfCiDq6CH0gPWroJexCyKcEjLy-kb6FWa1VOYFHzajgjF3gc-cOqv87Til4y1tA @57)

## 📋 Summary
Resolved a boundary rendering issue causing dropdown menus to unnaturally overlay and intersect with transparent background layers on lower z-index planes.

## 🔄 Changes in This Release

### 🐛 Fixed
- Increased relative positioning `z-index` from `10` to `30` on the "Engine / Lens" primary container to ensure dropdowns render correctly over subsequent app sections (e.g., "YOUR CONTENT").
- Fixed Tailwind class typo in dropdown wrapper: corrected `mx-h-60` to `max-h-60`.

## 🧪 Testing Performed
- Validated dropdown intersection visually over subsequent DOM elements.
- Successfully redeployed via Vite build / Clasp push to Apps Script execution environment.

## 📝 Notes
Enhances the UX when browsing complex or deeply nested custom configurations.

## 🔗 Links
- Commit: <REPO_URL>/commit/a542a76d76e044f74ef7a9848ef04b64d0710889
- Tag: <REPO_URL>/releases/tag/Smart-Prompt-Builder-v2.12.8
