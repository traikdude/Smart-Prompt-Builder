import { FormatTemplate } from '../types';

export const FORMAT_STYLES: FormatTemplate[] = [
  {
    id: 'none',
    name: '— Default (No Override)',
    description: 'Use the formatting natively defined by the selected template.',
    content: ''
  },
  {
    id: 'standard-prose',
    name: '📝 Standard Paragraph Prose',
    description: 'Flowing, cohesive narrative text in a natural, conversational register.',
    content: 'Format your response as flowing, cohesive narrative text in a natural, conversational register using standard paragraphs. Do not use bullet points or lists unless absolutely necessary.'
  },
  {
    id: 'actionable-bullets',
    name: '⚡ Actionable Bullet Points',
    description: 'High-impact, scannable lists designed for rapid parsing and immediate clarity.',
    content: 'Format your response strictly as high-impact, actionable bullet points. The list should be scannable, concise, and designed for rapid parsing and immediate clarity.'
  },
  {
    id: 'executive-summary',
    name: '🎯 Executive Summary (BLUF)',
    description: 'A high-level, bottom-line-up-front distillation, optimized for decision-makers who need the essence quickly.',
    content: 'Format your response as an Executive Summary following the Bottom-Line-Up-Front (BLUF) methodology. Begin with the most critical conclusions or recommendations, followed by a succinct distillation of the supporting context.'
  },
  {
    id: 'structured-outline',
    name: '📑 Structured Outline',
    description: 'Hierarchical organization utilizing Roman numerals, headers, and nested sub-points for complex topics.',
    content: 'Format your response as a deeply structured outline. Utilize hierarchical organization with Roman numerals for main sections, capital letters for sub-sections, and numbers for specific points.'
  },
  {
    id: 'numbered-guide',
    name: '🔢 Numbered Step-by-Step Guide',
    description: 'Chronological, procedural directives ideal for instructional or process-driven content.',
    content: 'Format your response as a rigorously numbered, chronological step-by-step guide. Ensure each step is phrased as a clear, actionable directive.'
  },
  {
    id: 'data-table',
    name: '📊 Data Table / Markdown Matrix',
    description: 'A categorized grid presentation enabling structured comparative analysis at a glance.',
    content: 'Format your response exclusively as a fully structured Markdown Data Table (or matrix). Ensure the table captures all critical dimensions to enable comparative analysis at a glance.'
  },
  {
    id: 'qa-format',
    name: '💬 Q&A Format',
    description: 'Content reframed as question-and-answer pairs, excellent for clarifying complex subjects.',
    content: 'Format your response entirely as a series of Question-and-Answer pairs. Anticipate the most critical inquiries regarding the topic and answer them clearly and directly.'
  },
  {
    id: 'tldr-hybrid',
    name: '💡 TL;DR + Detail Hybrid',
    description: 'A brief, scannable summary followed by an in-depth elaboration for layered consumption.',
    content: 'Format your response as a "TL;DR + Detail Hybrid". Start with a very brief, bolded "TL;DR" section that summarizes the entire response in a few words/lines. Follow this with a comprehensive, in-depth elaboration.'
  }
];