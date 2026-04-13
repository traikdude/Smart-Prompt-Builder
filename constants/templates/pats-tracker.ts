import { PromptTemplate } from '../../types';

export const patsTrackerTemplate: PromptTemplate = {
    id: 'pats-tracker',
    name: 'P.A.T.S. - Prompt Articulation Tracker',
    description: 'Systematic Solution Tracking & Analysis for CLI Articulation',
    category: 'analysis',
    placeholderTrigger: `\n\n[Paste session log or articulation details here]\n\n`,
    content: `ðŸ” P.A.T.S. - Prompt Articulation Tracking System
CLI Issue Articulation Agent Companion
Systematic Solution Tracking & What Worked/Didn't Work Analysis


ðŸ“‹ SYSTEM PURPOSE
P.A.T.S. ensures you never repeat failed prompt articulation strategies and always explore fresh approaches when communicating issues to CLI coding assistants. This companion document helps you:
Track which articulation methods produced successful solutions
Identify patterns in what works for different CLI tools
Avoid repeating unsuccessful communication strategies
Build institutional knowledge of effective prompt patterns


ðŸŽ¯ PART ONE: INPUT REQUIREMENTS
Before analyzing prompt effectiveness, gather:
Requirement
Description
Example
Original Problem
Raw user description
"My script doesn't work"
Articulated Prompt
Structured version sent to CLI
Full formatted prompt
CLI Tool Used
Target assistant
Gemini CLI / Claude Code / Codex
Response Quality
Solution effectiveness
Solved / Partial / Failed
Iteration Count
Clarifications needed
0 = first try success



ðŸ“Š PART TWO: ARTICULATION ELEMENT TRACKING
Category Classification Matrix
Track which articulation elements were included in each prompt:
â•”â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•—
â•‘          ARTICULATION ELEMENTS CHECKLIST             â•‘
â• â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•£
â•‘ ELEMENT CATEGORY    â”‚ INCLUDED â”‚ QUALITY â”‚ IMPACT ON RESULT      â•‘
â• â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•£
â•‘ ENV: Environment Context                          â•‘
â•‘ â”œâ”€ Operating System   â”‚ â–¡ Yes/No â”‚ 1-5  â”‚ [Critical/Helpful/None]  â•‘
â•‘ â”œâ”€ Shell Type      â”‚ â–¡ Yes/No â”‚ 1-5  â”‚ [Critical/Helpful/None]  â•‘
â•‘ â”œâ”€ Runtime Version   â”‚ â–¡ Yes/No â”‚ 1-5  â”‚ [Critical/Helpful/None]  â•‘
â•‘ â”œâ”€ Working Directory  â”‚ â–¡ Yes/No â”‚ 1-5  â”‚ [Critical/Helpful/None]  â•‘
â•‘ â””â”€ Package Manager State â”‚ â–¡ Yes/No â”‚ 1-5  â”‚ [Critical/Helpful/None]  â•‘
â• â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•£
â•‘ ERR: Error Information                           â•‘
â•‘ â”œâ”€ Complete Error Messageâ”‚ â–¡ Yes/No â”‚ 1-5  â”‚ [Critical/Helpful/None]  â•‘
â•‘ â”œâ”€ Full Stack Trace   â”‚ â–¡ Yes/No â”‚ 1-5  â”‚ [Critical/Helpful/None]  â•‘
â•‘ â”œâ”€ Exit Codes      â”‚ â–¡ Yes/No â”‚ 1-5  â”‚ [Critical/Helpful/None]  â•‘
â•‘ â””â”€ Error Frequency   â”‚ â–¡ Yes/No â”‚ 1-5  â”‚ [Critical/Helpful/None]  â•‘
â• â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•£
â•‘ BEH: Behavioral Context                           â•‘
â•‘ â”œâ”€ Expected Behavior  â”‚ â–¡ Yes/No â”‚ 1-5  â”‚ [Critical/Helpful/None]  â•‘
â•‘ â”œâ”€ Actual Behavior   â”‚ â–¡ Yes/No â”‚ 1-5  â”‚ [Critical/Helpful/None]  â•‘
â•‘ â”œâ”€ Reproduction Steps  â”‚ â–¡ Yes/No â”‚ 1-5  â”‚ [Critical/Helpful/None]  â•‘
â•‘ â””â”€ Trigger Conditions  â”‚ â–¡ Yes/No â”‚ 1-5  â”‚ [Critical/Helpful/None]  â•‘
â• â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•£
â•‘ CON: Constraints & Requirements                       â•‘
â•‘ â”œâ”€ Technical Constraints â”‚ â–¡ Yes/No â”‚ 1-5  â”‚ [Critical/Helpful/None]  â•‘
â•‘ â”œâ”€ Compatibility Needs â”‚ â–¡ Yes/No â”‚ 1-5  â”‚ [Critical/Helpful/None]  â•‘
â•‘ â”œâ”€ Performance Targets â”‚ â–¡ Yes/No â”‚ 1-5  â”‚ [Critical/Helpful/None]  â•‘
â•‘ â””â”€ Preferences Stated  â”‚ â–¡ Yes/No â”‚ 1-5  â”‚ [Critical/Helpful/None]  â•‘
â• â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•£
â•‘ SUC: Success Criteria                            â•‘
â•‘ â”œâ”€ Primary Success Def â”‚ â–¡ Yes/No â”‚ 1-5  â”‚ [Critical/Helpful/None]  â•‘
â•‘ â”œâ”€ Verification Method â”‚ â–¡ Yes/No â”‚ 1-5  â”‚ [Critical/Helpful/None]  â•‘
â•‘ â””â”€ Edge Cases Noted   â”‚ â–¡ Yes/No â”‚ 1-5  â”‚ [Critical/Helpful/None]  â•‘
â• â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•£
â•‘ ATT: Previous Attempts                           â•‘
â•‘ â”œâ”€ Solutions Tried   â”‚ â–¡ Yes/No â”‚ 1-5  â”‚ [Critical/Helpful/None]  â•‘
â•‘ â”œâ”€ Why They Failed   â”‚ â–¡ Yes/No â”‚ 1-5  â”‚ [Critical/Helpful/None]  â•‘
â•‘ â””â”€ Research Done    â”‚ â–¡ Yes/No â”‚ 1-5  â”‚ [Critical/Helpful/None]  â•‘
â•šâ•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•


ðŸ”¬ PART THREE: ARTICULATION STYLE TRACKING
Communication Approach Log
Track which communication styles were used:
Structure Styles:
[ ] Flat narrative (paragraph form)
[ ] Bulleted lists
[ ] Numbered sequences
[ ] Hierarchical sections (headers)
[ ] XML/structured markup
[ ] Code-first with context
[ ] Template-based fill-in
Tone/Voice:
[ ] Technical/precise
[ ] Conversational/natural
[ ] Minimal/telegraphic
[ ] Verbose/comprehensive
[ ] Question-forward
[ ] Directive/commanding
Context Ordering:
[ ] Environment â†’ Problem â†’ Error â†’ Goal
[ ] Error â†’ Environment â†’ Goal â†’ Constraints
[ ] Goal â†’ Problem â†’ Environment â†’ Error
[ ] Problem â†’ Expected â†’ Actual â†’ Environment
[ ] Custom ordering: _______________


ðŸ“ˆ PART FOUR: COVERAGE ANALYSIS SCORES
Calculate your articulation coverage:
â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”
ðŸ“Š ARTICULATION COVERAGE SCORES
â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”
ðŸ–¥ï¸ Environment Context Coverage:  X/5 elements included
   â–¡ OS Version  â–¡ Shell Type  â–¡ Runtime  â–¡ Directory  â–¡ Packages
ðŸš¨ Error Information Coverage:   X/4 elements included  
   â–¡ Error Message  â–¡ Stack Trace  â–¡ Exit Code  â–¡ Frequency
ðŸŽ¯ Behavioral Context Coverage:   X/4 elements included
   â–¡ Expected  â–¡ Actual  â–¡ Repro Steps  â–¡ Trigger
âš™ï¸ Constraints Coverage:      X/4 elements included
   â–¡ Technical  â–¡ Compatibility  â–¡ Performance  â–¡ Preferences
âœ… Success Criteria Coverage:    X/3 elements included
   â–¡ Primary Goal  â–¡ Verification  â–¡ Edge Cases
ðŸ”„ Previous Attempts Coverage:   X/3 elements included
   â–¡ What Tried  â–¡ Why Failed  â–¡ Research Done
â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”
ðŸ“ˆ OVERALL ARTICULATION COVERAGE: XX/23 (XX%)
â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”

Coverage Thresholds:
Score
Rating
Recommendation
90-100%
Excellent
Comprehensive articulation
75-89%
Good
Minor gaps, likely successful
60-74%
Adequate
May need follow-up clarification
40-59%
Weak
High risk of misunderstanding
<40%
Poor
Retry with more context



âœ…âŒ PART FIVE: WHAT WORKED / DIDN'T WORK LOG
Session Tracking Template
â•”â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•—
â•‘ ðŸ“‹ ARTICULATION SESSION LOG                         â•‘
â•šâ•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
ðŸ“… Date: _______________
ðŸ› ï¸ CLI Tool: â–¡ Gemini CLI â–¡ Claude Code â–¡ Codex CLI â–¡ Other: _______
ðŸŽ¯ Problem Type: â–¡ Error/Bug â–¡ Feature â–¡ Debug â–¡ Review â–¡ How-To
ðŸ“Š Result: â–¡ First-Try Success â–¡ Needed Clarification â–¡ Failed
â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”
âœ… WHAT WORKED (Keep Doing)
â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”
Element             â”‚ Why It Helped
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
[e.g., Full stack trace]    â”‚ [AI immediately identified the issue]
[e.g., Explicit success criteria]â”‚ [Solution matched exactly what was needed]
[e.g., Minimal reproduction]  â”‚ [AI could test and verify approach]
                                 â”‚
                                 â”‚
â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”
âŒ WHAT DIDN'T WORK (Stop/Modify)
â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”
Element             â”‚ Why It Failed / What Happened
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
[e.g., Vague "it doesn't work"] â”‚ [AI asked 5 clarifying questions]
[e.g., No version numbers]   â”‚ [Solution was for wrong version]
[e.g., Missing OS context]   â”‚ [Got Linux solution for Windows]
                                 â”‚
                                 â”‚
â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”
ðŸ”„ WHAT TO TRY DIFFERENTLY NEXT TIME
â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”
1. ___________________________________________________________________
2. ___________________________________________________________________
3. ___________________________________________________________________
â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”
ðŸ’¡ KEY INSIGHT FROM THIS SESSION
â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”
[One sentence summary of the most important learning]




ðŸš« PART SIX: EXCLUSION MATRIX
Articulation Approaches Exhausted
Track patterns that consistently fail for each CLI tool:
â•”â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•—
â•‘       EXCLUSION MATRIX - APPROACHES TO AVOID             â•‘
â• â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•£
â•‘ CLI TOOL   â”‚ EXHAUSTED APPROACHES   â”‚ BETTER ALTERNATIVES      â•‘
â• â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•£
â•‘ GEMINI CLI  â”‚              â”‚                â•‘
â•‘       â”‚ â—‹ [approach that failed] â”‚ â†’ [what works instead]    â•‘
â•‘       â”‚ â—‹ [approach that failed] â”‚ â†’ [what works instead]    â•‘
â•‘       â”‚ â—‹ [approach that failed] â”‚ â†’ [what works instead]    â•‘
â• â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•£
â•‘ CLAUDE CODE â”‚              â”‚                â•‘
â•‘       â”‚ â—‹ [approach that failed] â”‚ â†’ [what works instead]    â•‘
â•‘       â”‚ â—‹ [approach that failed] â”‚ â†’ [what works instead]    â•‘
â•‘       â”‚ â—‹ [approach that failed] â”‚ â†’ [what works instead]    â•‘
â• â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•£
â•‘ CODEX CLI  â”‚              â”‚                â•‘
â•‘       â”‚ â—‹ [approach that failed] â”‚ â†’ [what works instead]    â•‘
â•‘       â”‚ â—‹ [approach that failed] â”‚ â†’ [what works instead]    â•‘
â•‘       â”‚ â—‹ [approach that failed] â”‚ â†’ [what works instead]    â•‘
â•šâ•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

Known Anti-Patterns by Problem Type
â•”â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•—
â•‘       ANTI-PATTERNS BY PROBLEM TYPE                 â•‘
â• â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•£
â•‘ PROBLEM TYPE â”‚ COMMON MISTAKES      â”‚ PROVEN FIXES         â•‘
â• â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•£
â•‘ ERROR/BUG  â”‚ â–¡ Paraphrasing error msg â”‚ â†’ Always paste exact message â•‘
â•‘       â”‚ â–¡ Omitting stack trace  â”‚ â†’ Include full trace     â•‘
â•‘       â”‚ â–¡ "It doesn't work"    â”‚ â†’ Describe actual behavior  â•‘
â• â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•£
â•‘ FEATURE REQ â”‚ â–¡ Vague outcomes     â”‚ â†’ Define success precisely  â•‘
â•‘       â”‚ â–¡ No constraints listed  â”‚ â†’ State limits upfront    â•‘
â•‘       â”‚ â–¡ Missing edge cases   â”‚ â†’ List 2-3 edge scenarios   â•‘
â• â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•£
â•‘ DEBUG SESSION â”‚ â–¡ No hypothesis      â”‚ â†’ State what you suspect   â•‘
â•‘       â”‚ â–¡ Missing working state  â”‚ â†’ Compare works vs broken   â•‘
â•‘       â”‚ â–¡ No isolation attempt  â”‚ â†’ Show minimal reproduction  â•‘
â• â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•£
â•‘ CODE REVIEW â”‚ â–¡ Whole file dump     â”‚ â†’ Highlight specific concerns â•‘
â•‘       â”‚ â–¡ No context       â”‚ â†’ Explain purpose/usage    â•‘
â•‘       â”‚ â–¡ Generic "review this"  â”‚ â†’ Ask specific questions   â•‘
â• â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•£
â•‘ WSL-SPECIFIC â”‚ â–¡ Assuming Linux-only   â”‚ â†’ State WSL explicitly    â•‘
â•‘       â”‚ â–¡ Windows paths in bash  â”‚ â†’ Show path translation issue â•‘
â•‘       â”‚ â–¡ Missing interop context â”‚ â†’ Note if crossing boundaries â•‘
â•šâ•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•


ðŸ“Š PART SEVEN: TOOL-SPECIFIC EFFECTIVENESS PATTERNS
Gemini CLI - What Works Best
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚ âœ… HIGH SUCCESS PATTERNS                          â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚ â€¢ Conversational, natural language descriptions              â”‚
â”‚ â€¢ Context built up progressively (background â†’ problem â†’ goal)      â”‚
â”‚ â€¢ Questions embedded naturally ("I'm trying to X but Y happens")     â”‚
â”‚ â€¢ Real-world analogies for complex concepts                â”‚
â”‚ â€¢ Collaborative framing ("help me figure out...")             â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚ âŒ LOW SUCCESS PATTERNS                          â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚ â€¢ Overly formal/robotic structure                     â”‚
â”‚ â€¢ Dense technical jargon without explanation               â”‚
â”‚ â€¢ Missing the "why" behind what you're doing               â”‚
â”‚ â€¢ Abrupt problem statements without context                â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜

Claude Code CLI - What Works Best
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚ âœ… HIGH SUCCESS PATTERNS                          â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚ â€¢ Hierarchical structure with clear sections               â”‚
â”‚ â€¢ XML markup for complex, multi-part issues                â”‚
â”‚ â€¢ Explicit constraints and requirements upfront              â”‚
â”‚ â€¢ Clearly defined success criteria                    â”‚
â”‚ â€¢ Reasoning transparency (show your thought process)           â”‚
â”‚ â€¢ Hypothesis-first for debugging ("I suspect X because Y")        â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚ âŒ LOW SUCCESS PATTERNS                          â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚ â€¢ Unstructured stream-of-consciousness                  â”‚
â”‚ â€¢ Missing measurable success criteria                   â”‚
â”‚ â€¢ Ambiguous pronouns ("it", "this", "that")                â”‚
â”‚ â€¢ Implicit assumptions not stated                     â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜

Codex CLI - What Works Best
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚ âœ… HIGH SUCCESS PATTERNS                          â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚ â€¢ Code-first presentation (show relevant code immediately)        â”‚
â”‚ â€¢ Minimal prose, maximum signal                      â”‚
â”‚ â€¢ Pattern-matching friendly (show input â†’ expected output)        â”‚
â”‚ â€¢ Clear function signatures and type hints                â”‚
â”‚ â€¢ Focused, single-purpose requests                    â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚ âŒ LOW SUCCESS PATTERNS                          â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚ â€¢ Heavy narrative without code samples                  â”‚
â”‚ â€¢ Multi-part requests in single prompt                  â”‚
â”‚ â€¢ Abstract descriptions without concrete examples             â”‚
â”‚ â€¢ Verbose explanations that bury the actual need             â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜


ðŸŽ¯ PART EIGHT: PROMPT QUALITY SCORECARD
Rate each articulated prompt before sending:
â•”â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•—
â•‘ ðŸ“Š PROMPT QUALITY SCORECARD                         â•‘
â• â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•£
â•‘ DIMENSION     â”‚ SCORE â”‚ CRITERIA                    â•‘
â• â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•£
â•‘ ðŸ“Œ CLARITY    â”‚ _/5 â”‚ Is the problem unambiguous?          â•‘
â•‘          â”‚   â”‚ 1=Vague, 3=Mostly clear, 5=Crystal clear    â•‘
â• â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•£
â•‘ ðŸ“¦ COMPLETENESS  â”‚ _/5 â”‚ Is all necessary context included?       â•‘
â•‘          â”‚   â”‚ 1=Major gaps, 3=Minor gaps, 5=Fully complete  â•‘
â• â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•£
â•‘ ðŸŽ¯ SPECIFICITY  â”‚ _/5 â”‚ Are details concrete, not abstract?      â•‘
â•‘          â”‚   â”‚ 1=Too general, 3=Somewhat specific, 5=Precise â•‘
â• â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•£
â•‘ âš¡ ACTIONABILITY â”‚ _/5 â”‚ Can the AI act immediately?          â•‘
â•‘          â”‚   â”‚ 1=Needs clarification, 3=Mostly ready, 5=Ready â•‘
â• â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•£
â•‘ ðŸ§­ GOAL ALIGNMENT â”‚ _/5 â”‚ Is success criteria well-defined?       â•‘
â•‘          â”‚   â”‚ 1=No criteria, 3=Implicit, 5=Explicit & testableâ•‘
â• â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•£
â•‘          â”‚   â”‚                        â•‘
â•‘ ðŸ“ˆ TOTAL SCORE  â”‚ __/25 â”‚ Target: 20+ for first-try success       â•‘
â•‘          â”‚   â”‚                        â•‘
â•šâ•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
SCORE INTERPRETATION:
â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”
22-25: Excellent - High confidence in first-try success
18-21: Good - Likely successful, minor clarification possible
14-17: Adequate - Expect 1-2 follow-up questions
10-13: Weak - Significant clarification likely needed
<10: Poor - Re-articulate before sending
â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”


ðŸ”„ PART NINE: CONTINUOUS IMPROVEMENT PROTOCOL
After Each Session
Log the session using the template in Part Five
Update the exclusion matrix if you discovered new anti-patterns
Note tool-specific learnings in Part Seven
Calculate your coverage score to identify systematic gaps
Weekly Review
Review all session logs from the week
Identify recurring patterns (good and bad)
Update your personal "quick reference" of what works
Set one improvement goal for next week
Monthly Analysis
â•”â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•—
â•‘ ðŸ“Š MONTHLY ARTICULATION EFFECTIVENESS REPORT                â•‘
â• â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•£
â•‘ Period: _____________                            â•‘
â• â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•£
â•‘ METRIC             â”‚ THIS MONTH â”‚ LAST MONTH â”‚ TREND      â•‘
â• â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•£
â•‘ Total prompts sent       â”‚      â”‚      â”‚ â†‘ â†“ â†’      â•‘
â•‘ First-try success rate     â”‚    % â”‚    % â”‚ â†‘ â†“ â†’      â•‘
â•‘ Average clarifications needed â”‚      â”‚      â”‚ â†‘ â†“ â†’      â•‘
â•‘ Average quality score     â”‚  /25  â”‚  /25  â”‚ â†‘ â†“ â†’      â•‘
â•‘ Average coverage score     â”‚    % â”‚    % â”‚ â†‘ â†“ â†’      â•‘
â• â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•£
â•‘ TOP 3 IMPROVEMENTS MADE:                          â•‘
â•‘ 1. ________________________________________________________________    â•‘
â•‘ 2. ________________________________________________________________    â•‘
â•‘ 3. ________________________________________________________________    â•‘
â• â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•£
â•‘ TOP 3 AREAS NEEDING WORK:                          â•‘
â•‘ 1. ________________________________________________________________    â•‘
â•‘ 2. ________________________________________________________________    â•‘
â•‘ 3. ________________________________________________________________    â•‘
â•šâ•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•


ðŸ“ PART TEN: QUICK REFERENCE DECISION TREES
When Prompt Fails - What To Check First
PROMPT DIDN'T WORK?
        â”‚
        â”œâ”€â†’ AI asked clarifying questions
        â”‚ â””â”€â†’ Check: What info was missing?
        â”‚   â”œâ”€â†’ Environment? â†’ Add OS/shell/version
        â”‚   â”œâ”€â†’ Error details? â†’ Add full message/trace
        â”‚   â”œâ”€â†’ Goal? â†’ Add success criteria
        â”‚   â””â”€â†’ Context? â†’ Add repro steps/constraints
        â”‚
        â”œâ”€â†’ AI gave wrong solution
        â”‚ â””â”€â†’ Check: Why was it wrong?
        â”‚   â”œâ”€â†’ Wrong platform? â†’ Clarify OS/environment
        â”‚   â”œâ”€â†’ Wrong version? â†’ Specify versions explicitly
        â”‚   â”œâ”€â†’ Wrong approach? â†’ State constraints/preferences
        â”‚   â””â”€â†’ Misunderstood goal? â†’ Restate success criteria
        â”‚
        â”œâ”€â†’ AI gave partial solution
        â”‚ â””â”€â†’ Check: What was missing?
        â”‚   â”œâ”€â†’ Edge cases? â†’ List them explicitly
        â”‚   â”œâ”€â†’ Integration? â†’ Describe full context
        â”‚   â””â”€â†’ Error handling? â†’ Request it specifically
        â”‚
        â””â”€â†’ AI seemed confused
            â””â”€â†’ Check: Was articulation clear?
                â”œâ”€â†’ Too long/complex? â†’ Simplify, focus on core issue
                â”œâ”€â†’ Too short/vague? â†’ Add more context
                â”œâ”€â†’ Contradictory? â†’ Review for consistency
                â””â”€â†’ Wrong tool match? â†’ Try different CLI tool

Choosing The Right CLI Tool
WHAT'S YOUR PROBLEM TYPE?
        â”‚
        â”œâ”€â†’ Complex, multi-layered issue
        â”‚ â””â”€â†’ Claude Code CLI (structured analysis)
        â”‚
        â”œâ”€â†’ Quick code generation/modification
        â”‚ â””â”€â†’ Codex CLI (pattern-focused)
        â”‚
        â”œâ”€â†’ Need conversational exploration
        â”‚ â””â”€â†’ Gemini CLI (dialogue-friendly)
        â”‚
        â”œâ”€â†’ Deep debugging session
        â”‚ â””â”€â†’ Claude Code CLI (hypothesis testing)
        â”‚
        â”œâ”€â†’ Simple "how do I..."
        â”‚ â””â”€â†’ Any tool (Gemini for explanation, Codex for code)
        â”‚
        â””â”€â†’ Code review/optimization
            â””â”€â†’ Claude Code CLI (detailed analysis)


âœ… SYSTEM GUARANTEES
This tracking system guarantees:
âœ… Never repeating failed articulation approaches
âœ… Systematic identification of what works per tool
âœ… Measurable improvement in prompt effectiveness
âœ… Evidence-based pattern recognition
âœ… Continuous learning and adaptation
âœ… Clear decision support for tool selection
âœ… Comprehensive gap identification


ðŸš€ GETTING STARTED
First session: Fill out the Session Log template after your next CLI interaction
Score your prompt: Use the Quality Scorecard before sending
Track patterns: Update the Exclusion Matrix when you discover anti-patterns
Review weekly: Look for recurring themes in your logs
Improve monthly: Set specific articulation improvement goals


P.A.T.S. v1.0 - Companion to CLI Issue Articulation Agent`
  };
