/**
 * Text Style Modifiers — Font, Emoji, and ASCII style prompts
 * that get appended as formatting instructions during prompt generation.
 */

export interface TextModifier {
  id: string;
  name: string;
  description: string;
  emoji: string;
  /** The prompt text injected into the generation pipeline */
  prompt: string;
}

export interface ModifierCategory {
  id: 'font' | 'emoji' | 'ascii';
  label: string;
  emoji: string;
  color: string;        // Tailwind color prefix (e.g., 'pink', 'amber')
  bgClass: string;
  textClass: string;
  borderClass: string;
  glowClass: string;
  modifiers: TextModifier[];
}

// ═══════════════════════════════════════════
// 🔤 FONT STYLE MODIFIERS
// ═══════════════════════════════════════════

const FONT_MODIFIERS: TextModifier[] = [
  {
    id: 'strikethrough',
    name: 'Strikethrough',
    description: 'Applies combining strikethrough formatting to text',
    emoji: 'A̶',
    prompt: `You are a Text Formatting Assistant specializing in converting regular text into strikethrough format. Your role is to help users implement strikethrough text effectively while maintaining professional documentation standards.

CORE INSTRUCTIONS:

Text Modification Principles:
1. Convert standard letters to their strikethrough equivalents:
   - A → A̶, B → B̶, C → C̶, D → D̶, E → E̶, F → F̶, G → G̶, H → H̶, I → I̶, J → J̶, K → K̶, L → L̶, M → M̶, N → N̶, O → O̶, P → P̶, Q → Q̶, R → R̶, S → S̶, T → T̶, U → U̶, V → V̶, W → W̶, X → X̶, Y → Y̶, Z → Z̶
   - a → a̶, b → b̶, c → c̶, d → d̶, e → e̶, f → f̶, g → g̶, h → h̶, i → i̶, j → j̶, k → k̶, l → l̶, m → m̶, n → n̶, o → o̶, p → p̶, q → q̶, r → r̶, s → s̶, t → t̶, u → u̶, v → v̶, w → w̶, x → x̶, y → y̶, z → z̶
2. Preserve spacing and punctuation
3. Ensure the strikethrough line is clear and visible
4. Maintain text readability beneath the strikethrough
5. Consider the semantic meaning of struck-through text

Understanding Strikethrough Usage:
Strikethrough formatting serves several important professional purposes:
- Indicating deleted content in document revisions
- Marking outdated information while preserving history
- Showing price changes or discounts
- Demonstrating task completion in lists
- Tracking editorial changes in collaborative documents

VALIDATION CHECKS:
Before applying strikethrough, verify:
1. The context justifies using strikethrough notation
2. The text remains legible under the strikethrough
3. The meaning of the deletion is clear
4. The document history needs preservation
5. Alternative formatting wouldn't be more appropriate

RESPONSE FORMAT:
For each conversion request:
1. Present the struck-through text
2. Ensure the formatting serves its intended purpose

CHARACTER REFERENCE:
Strikethrough Alphabet:
A̶ B̶ C̶ D̶ E̶ F̶ G̶ H̶ I̶ J̶ K̶ L̶ M̶ N̶ O̶ P̶ Q̶ R̶ S̶ T̶ U̶ V̶ W̶ X̶ Y̶ Z̶
a̶ b̶ c̶ d̶ e̶ f̶ g̶ h̶ i̶ j̶ k̶ l̶ m̶ n̶ o̶ p̶ q̶ r̶ s̶ t̶ u̶ v̶ w̶ x̶ y̶ z̶

Apply the strikethrough formatting to the following text:`
  },
];

// ═══════════════════════════════════════════
// 😀 EMOJI MODIFIERS (awaiting user prompts)
// ═══════════════════════════════════════════

const EMOJI_MODIFIERS: TextModifier[] = [
  // Placeholder — user will provide emoji prompts
];

// ═══════════════════════════════════════════
// ⌨️ ASCII / SPECIAL CHARACTER MODIFIERS (awaiting user prompts)
// ═══════════════════════════════════════════

const ASCII_MODIFIERS: TextModifier[] = [
  // Placeholder — user will provide ASCII prompts
];

// ═══════════════════════════════════════════
// CATEGORY DEFINITIONS
// ═══════════════════════════════════════════

export const MODIFIER_CATEGORIES: ModifierCategory[] = [
  {
    id: 'font',
    label: 'Font Style',
    emoji: '🔤',
    color: 'pink',
    bgClass: 'bg-pink-500/15',
    textClass: 'text-pink-400',
    borderClass: 'border-pink-500/30',
    glowClass: 'shadow-[0_0_12px_rgba(255,107,157,0.25)]',
    modifiers: FONT_MODIFIERS,
  },
  {
    id: 'emoji',
    label: 'Emoji',
    emoji: '😀',
    color: 'amber',
    bgClass: 'bg-amber-500/15',
    textClass: 'text-amber-400',
    borderClass: 'border-amber-500/30',
    glowClass: 'shadow-[0_0_12px_rgba(251,191,36,0.25)]',
    modifiers: EMOJI_MODIFIERS,
  },
  {
    id: 'ascii',
    label: 'ASCII Art',
    emoji: '⌨️',
    color: 'cyan',
    bgClass: 'bg-cyan-500/15',
    textClass: 'text-cyan-400',
    borderClass: 'border-cyan-500/30',
    glowClass: 'shadow-[0_0_12px_rgba(34,211,238,0.25)]',
    modifiers: ASCII_MODIFIERS,
  },
];
