import { ContextSource, OutputFormatCategory } from './types';

export const CONTEXT_SOURCES: ContextSource[] = [
  { id: 'conversation', name: 'Current Conversation', icon: '💬', description: 'Derived entirely from the active dialogue context' },
  { id: 'framework', name: 'Specific Framework', icon: '📐', description: 'Filtered and processed through a designated analytical framework' },
  // Phase 2 Integrations:
  // { id: 'source_materials', name: 'Source Materials', icon: '📚', description: 'Extracted exclusively from user-provided documents' },
  // { id: 'project_files', name: 'Project Files', icon: '📁', description: 'Pulled from attached or linked project assets' },
  // { id: 'online_search', name: 'Online Search', icon: '🌐', description: 'Dynamically fetched and synthesized from live web sources' },
];

export const OUTPUT_CATEGORIES: OutputFormatCategory[] = [
  {
    id: 'code_and_technical',
    title: 'Code & Technical Content',
    icon: '💻',
    description: 'Snippets, code structures, and logical layouts',
    options: [
      {
        id: 'code_blocks',
        name: 'Code Blocks',
        icon: '📝',
        description: 'Syntax-highlighted, properly formatted snippets',
        instruction: 'FORMATTING REQUIREMENT: Present all technical or logic-based output strictly inside standard markdown code blocks with the appropriate language identifier.'
      },
      {
        id: 'markdown_clean',
        name: 'Clean Markdown',
        icon: '📑',
        description: 'Structured plain-text standard markdown',
        instruction: 'FORMATTING REQUIREMENT: Utilize extensive, clean, highly structured GitHub-Flavored Markdown. Use hierarchical headers, bolding, lists, and quote blocks.'
      },
      {
        id: 'mermaid_flowchart',
        name: 'Flowchart (Mermaid)',
        icon: '🖇️',
        description: 'Process Flowcharts for visual workflow mapping',
        instruction: 'FORMATTING REQUIREMENT: Output a Mermaid.js compliant Flowchart (graph TD) that visually outlines the sequential steps or logic paths of the content.'
      },
      {
        id: 'mermaid_er',
        name: 'ER Diagram (Mermaid)',
        icon: '🗄️',
        description: 'Entity-Relationship visualization',
        instruction: 'FORMATTING REQUIREMENT: Output a Mermaid.js compliant Entity-Relationship Diagram (erDiagram) representing the domains, relationships, and attributes found in the text.'
      }
    ]
  },
  {
    id: 'structured_tables',
    title: 'Structured Tables',
    icon: '📊',
    description: 'Row-and-column data configurations',
    options: [
      {
        id: 'standard_table',
        name: 'Standard Table',
        icon: '🧮',
        description: 'Clean, foundational row-and-column layout',
        instruction: 'FORMATTING REQUIREMENT: Synthesize all core information into a highly organized, readable Markdown table. Include clearly defined header columns.'
      },
      {
        id: 'comparative_table',
        name: 'Comparative Analysis',
        icon: '⚖️',
        description: 'Formatted for multi-item evaluation',
        instruction: 'FORMATTING REQUIREMENT: Generate a comparative Markdown table that evaluates subjects side-by-side. Include columns for Strengths, Weaknesses, and Key Distinctions.'
      }
    ]
  },
  {
    id: 'schema_driven',
    title: 'Schema-Driven Serialization',
    icon: '⚙️',
    description: 'Machine-readable structured outputs',
    options: [
      {
        id: 'schema_json',
        name: 'JSON Schema',
        icon: '{}',
        description: 'Lightweight, universally compatible',
        instruction: 'FORMATTING REQUIREMENT: Serialize the entire output strictly as valid, well-formed JSON. Do not include introductory or concluding text outside of the JSON block.'
      },
      {
        id: 'schema_xml',
        name: 'XML Definition',
        icon: '</>',
        description: 'Highly structured, document document-oriented data',
        instruction: 'FORMATTING REQUIREMENT: Serialize the entire output strictly as valid, well-formed XML with descriptive root nodes and nested hierarchy. Do not include conversational text.'
      },
      {
        id: 'schema_yaml',
        name: 'YAML Configuration',
        icon: '📄',
        description: 'Human-readable, indentation-based',
        instruction: 'FORMATTING REQUIREMENT: Serialize the entire output strictly as valid YAML format, suitable directly for configuration. Do not include conversational text.'
      },
      {
        id: 'schema_graphql',
        name: 'GraphQL Schema',
        icon: '🕸️',
        description: 'Query-focused definition',
        instruction: 'FORMATTING REQUIREMENT: Define a complete GraphQL schema representing the data and relationships using formal schema definition language (SDL) wrapping types and queries.'
      }
    ]
  }
];
