# Smart Prompt Builder - Release v2.12.10

## Overview
This patch addresses minor UI layout clipping issues in the Text Styling dropdown menus, resolving a visual bug where styling options were obscured on certain screen resolutions.

## Changes
- **UI Architecture:** Increased the maximum height container boundaries (`max-h-[60vh]`) for both `ModifierDropdown` and `XMLMultiSelectDropdown` in `TextStyleToolbar.tsx` to prevent the unnatural clipping of options.
- **UI Architecture:** Applied the same `max-h-[60vh]` expansion to the `TemplateDropdown` in `PromptForm.tsx` to accommodate the large number of existing format templates.
- **Form Navigation:** Ensured standard scrolling logic only applies when menus actually threaten to exceed the viewport, allowing short categories to expand fully without visually disturbing scrollbars.

## Deployment Status
- **Google Apps Script:** Deployed to `@61` 
- **Production Status:** LIVE

## Hash / Verification
- **Tag:** `v2.12.10`
