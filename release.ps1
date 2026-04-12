$PROJECT_ID = "Smart-Prompt-Builder"
$VERSION = "v2.7.1"
$ARTIFACT_NAME = "appscript.zip"

Write-Host "Staging Changes..."
git add .

Write-Host "Committing..."
$commitMsg = @"
feat(release): Publish $ARTIFACT_NAME $VERSION

- Add left/right directional arrows for horizontal scrolling in the OutputConfigurator tab bar
- Implement custom hide-scrollbar CSS class
"@
git commit -m $commitMsg

$COMMIT_HASH = (git rev-parse --short HEAD).Trim()
Write-Host "Commit Hash: $COMMIT_HASH"

Write-Host "Tagging Release..."
$currentDate = Get-Date -Format "dddd, MMMM dd, yyyy 'at' hh:mm tt zzz"
$tagMsg = @"
Release ${VERSION}: Universal Output Formatting Engine

📅 Release Date: $currentDate
🏷️ Tag: $PROJECT_ID-$VERSION
📦 Commit: $COMMIT_HASH
📄 Files: App.tsx, engineConstants.ts, OutputConfigurator.tsx

## Summary
Completely decoupled prompt generation into an execution-driven engine featuring multi-select architectural choices like Mermaid Logic mapping, JSON/YAML schemas, and comparative table synthesis.
"@
git tag -a "$PROJECT_ID-$VERSION" -m $tagMsg

Write-Host "Pushing to remote..."
git push origin main
git push origin "$PROJECT_ID-$VERSION"

Write-Host "✅ Release procedure complete."
