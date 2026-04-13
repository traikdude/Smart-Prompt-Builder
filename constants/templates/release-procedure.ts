import { PromptTemplate } from '../../types';

export const releaseProcedureTemplate: PromptTemplate = {
    id: 'release-procedure',
    name: 'Artifact Release & Repository Publish Workflow',
    description: 'Comprehensive step-by-step guide for publishing Git-based artifacts',
    category: 'development',
    placeholderTrigger: `\n\n`,
    content: `ðŸš€ Comprehensive Release & Repository Update Procedure
Git-Based Artifact Publishing Workflow

ðŸ“‹ PREREQUISITES CHECKLIST
Before beginning this procedure, verify:
[ ] âœ… Working directory is clean (git status shows no uncommitted changes)
[ ] âœ… Currently on correct branch (git branch --show-current)
[ ] âœ… Local repository is synced with remote (git fetch && git status)
[ ] âœ… Artifact has been successfully built and tested
[ ] âœ… You have push permissions to the remote repository
[ ] âœ… Release version number has been determined (see Semantic Versioning below)

ðŸŽ¯ OVERVIEW
Purpose: Finalize and integrate a new project artifact (e.g., APK, transcript, module) into the project repository with proper version control, tagging, and release documentation.
Success Criteria:
âœ… Artifact committed with descriptive message
âœ… Semantic version tag applied correctly 
âœ… Formal release note created
âœ… All changes pushed to remote successfully
âœ… Release visible and documented on remote platform
â±ï¸ Estimated Time: 10â€“15 minutes

ðŸ“Š CONTEXTUAL VARIABLES
Define these values for your current release:
Variable
Example Value
Description
<PROJECT_ID>
qklipto
Project's unique identifier
<VERSION>
v1.0.1
Semantic version for this release (MAJOR.MINOR.PATCH)
<ARTIFACT_PATH>
android-source-zip/clipto-android-main/app/build/outputs/apk/debug/app-debug.apk
Location of newly built file
<ARTIFACT_NAME>
app-debug-v1.0.1.apk
Final versioned filename
<CURRENT_BRANCH>
main
Local branch you're committing from
<RELEASE_DIR>
<PROJECT_ID>/releases
Destination directory in repository


ðŸ”¢ SEMANTIC VERSIONING GUIDE
Choose your version number based on the change type:
ðŸ”´ MAJOR (2.0.0): Breaking changes, incompatible API modifications
ðŸŸ¡ MINOR (1.1.0): New features, backward-compatible functionality
ðŸŸ¢ PATCH (1.0.1): Bug fixes, dependency updates, backward-compatible corrections
Example: Dependency update (OkHttp downgrade) = PATCH increment

ðŸ“ STEP-BY-STEP PROCEDURE
STEP 1: Artifact Integration & Commit ðŸ”¥ CRITICAL
Objective: Copy artifact to versioned release directory and commit 
Commands:
# Create release directory if it doesn't exist
mkdir -p <RELEASE_DIR>

# Copy artifact with versioned naming
cp <ARTIFACT_PATH> <RELEASE_DIR>/<ARTIFACT_NAME>

# Stage the new artifact
git add <RELEASE_DIR>/<ARTIFACT_NAME>

# Commit with conventional commit format
git commit -m "feat(release): Publish <ARTIFACT_NAME> <VERSION>

- Finalize dependency updates (OkHttp 4.10.0 for Kotlin 1.6.x compatibility)
- Add missing configuration files
- Complete build verification

Resolves: #<ISSUE_NUMBER> (if applicable)"

âœ… Verification:
git log -1 --oneline
export COMMIT_HASH=$(git rev-parse --short HEAD)
echo "Commit hash: $COMMIT_HASH"

âŒ Error Recovery:
If commit fails: Check git status, resolve issues, retry
If wrong files committed: git reset --soft HEAD~1, fix staging, recommit

STEP 2: Version Tagging ðŸ”¥ CRITICAL
Objective: Apply immutable semantic tag to mark this release point 
Tag Format:
 <PROJECT_ID>-<VERSION>
Commands:
git tag -a <PROJECT_ID>-<VERSION> -m "Release <VERSION>: <Brief description>

ðŸ“… Release Date: $(date '+%A, %B %d, %Y at %I:%M %p %Z')
ðŸ·ï¸ Tag: <PROJECT_ID>-<VERSION>
ðŸ“¦ Commit: $COMMIT_HASH
ðŸ“„ Files: <ARTIFACT_NAME>

## Summary
<Detailed description of what this release contains>"

âœ… Verification:
git tag -l "<PROJECT_ID>-*"
git show <PROJECT_ID>-<VERSION>

âŒ Error Recovery:
If tag exists: git tag -d <PROJECT_ID>-<VERSION>, recreate
If wrong commit tagged: Delete tag, checkout correct commit, re-tag

STEP 3: Release Note Documentation âš ï¸ IMPORTANT
Objective: Create formal, standardized release documentation 
Release Note Template:
# ðŸŽ‰ Release <VERSION> - <PROJECT_ID>

## ðŸ“… Release Information
- Date: [Auto-populated Date]
- Tag: <PROJECT_ID>-<VERSION>
- Commit: <FULL_COMMIT_HASH>
- Branch: <CURRENT_BRANCH>

## ðŸ“¦ Included Files
- <ARTIFACT_NAME>

## ðŸ“‹ Summary
Final build verification after dependency updates and configuration improvements.

## ðŸ”„ Changes in This Release

### âœ¨ Added
- Missing configuration files for build process

### ðŸ”§ Changed
- Downgraded OkHttp to 4.10.0 for Kotlin 1.6.x compatibility
- Updated build verification procedures

### ðŸ› Fixed
- Build failures related to dependency conflicts

## ðŸ§ª Testing Performed
- Build completion verification
- Dependency conflict resolution
- Configuration file validation

## ðŸ“ Notes
This release focuses on stability and compatibility improvements.

## ðŸ”— Links
- Commit: <REPO_URL>/commit/<FULL_COMMIT_HASH>
- Tag: <REPO_URL>/releases/tag/<PROJECT_ID>-<VERSION>


STEP 4: Remote Repository Synchronization ðŸ”¥ CRITICAL
Objective: Push commits, tags, and documentation to remote 
Commands:
git push origin <CURRENT_BRANCH>
git push origin <PROJECT_ID>-<VERSION>

âœ… Verification:
git ls-remote --heads origin <CURRENT_BRANCH>
git ls-remote --tags origin | grep <PROJECT_ID>-<VERSION>


ðŸŽ¯ POST-RELEASE VERIFICATION CHECKLIST
[ ] Commit visible on remote repository
[ ] Tag appears in tags/releases section
[ ] Release notes accessible
[ ] Artifact browsable at correct path
[ ] CI/CD pipelines triggered
[ ] Team notified

ðŸ†˜ TROUBLESHOOTING GUIDE
Problem: fatal: pathspec did not match any files
 Solution:
ls -la <ARTIFACT_PATH>
pwd

Problem: Tag already exists
 Solution:
git tag -d <PROJECT_ID>-<VERSION>
git push origin --delete <PROJECT_ID>-<VERSION>

Problem: Permission denied (publickey)
 Solution:
ssh -T git@github.com


âš¡ QUICK REFERENCE: Command Summary
mkdir -p <RELEASE_DIR>
cp <ARTIFACT_PATH> <RELEASE_DIR>/<ARTIFACT_NAME>
git add <RELEASE_DIR>/<ARTIFACT_NAME>
git commit -m "feat(release): Publish <ARTIFACT_NAME> <VERSION>"
git tag -a <PROJECT_ID>-<VERSION> -m "Release <VERSION>"
git push origin <CURRENT_BRANCH>
git push origin <PROJECT_ID>-<VERSION>
git tag -l


ðŸ“š BEST PRACTICES
Never force-push tags or release branches
Use conventional commit messages
Prefer annotated tags for releases
Test locally before pushing
Keep commit history clean
Pull before push
Document breaking changes clearly
Sign tags for security-critical projects

ðŸ“– ADDITIONAL RESOURCES
Semantic Versioning Spec: semver.org
Conventional Commits: conventionalcommits.org
Git Tagging Documentation: git tag --help
GitHub Release Guide: docs.github.com/releases`
  };
