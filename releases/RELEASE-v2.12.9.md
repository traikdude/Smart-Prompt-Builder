# 🎉 Release v2.12.9 - Smart-Prompt-Builder

## 📅 Release Information
- Date: Monday, April 13, 2026 at 08:46 PM EDT
- Tag: Smart-Prompt-Builder-v2.12.9
- Commit: aedcd4955239ced38d89b9ad466b70dada05b1ed
- Branch: main

## 📦 Included Files
- (Live Google Apps Script Deployment - ID: AKfycbwcP0UgfCiDq6CH0gPWroJexCyKcEjLy-kb6FWa1VOYFHzajgjF3gc-cOqv87Til4y1tA @59)

## 📋 Summary
Resolved related sub-layer configuration issues across the entire `TextStyleToolbar` where modifier dropdown options were cascading down but rendering strictly beneath the 'YOUR CONTENT' input area framework due to implicitly lower static `z-index` contexts in their bounding box.

## 🔄 Changes in This Release

### 🐛 Fixed
- Implemented `z-20` absolute layering to the `Text Style Toolbar` wrapper component (font, emoji, ascii, xml dropdowns) to secure physical space above the `z-10` input blocks.
- Applied dynamic inline `z-index` classes (`z-40` when open vs `z-10` when closed) directly to `<ModifierDropdown />` and `<XMLMultiSelectDropdown />` primitives inside the Flex-wrap rendering bounds to ensure sibling components safely avoid z-collision errors with adjacent modifier inputs (e.g. Infographics and Slideshow overlays).

## 🧪 Testing Performed
- Visually examined "Font Style", "Xml Extractor", "Infographics", and "Slideshow", guaranteeing dropdowns extend downward with full opacity explicitly obscuring background artifacts.
- Verified live rendering post `vite build` pushing to specific Google site frames.

## 📝 Notes
Visual fidelity restored completely across all auxiliary drop zones. 

## 🔗 Links
- Commit: <REPO_URL>/commit/aedcd4955239ced38d89b9ad466b70dada05b1ed
- Tag: <REPO_URL>/releases/tag/Smart-Prompt-Builder-v2.12.9
