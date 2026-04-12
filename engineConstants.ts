import { ContextSource, OutputFormatCategory } from './types';

export const CONTEXT_SOURCES: ContextSource[] = [
  { id: 'conversation', name: 'Current Conversation', icon: '💬', description: 'Based entirely on the active dialogue context' },
  { id: 'source_materials', name: 'Source Materials', icon: '📚', description: 'Extracted exclusively from user-provided documents' },
  { id: 'project_files', name: 'Project Files', icon: '📁', description: 'Pulled from attached or linked project assets' },
  { id: 'online_search', name: 'Online Search', icon: '🌐', description: 'Dynamically fetched and synthesized from the web' },
  { id: 'framework', name: 'Specific Framework', icon: '📐', description: 'Filtered through a designated analytical framework' }
];

export const OUTPUT_CATEGORIES: OutputFormatCategory[] = [
  {
    id: 'visual_representations',
    title: 'Visual Representations',
    icon: '🖼️',
    description: 'Custom visuals, infographics, and annotations — 💰 outputs text prompts only, no actual media generation',
    options: [
      {
        id: 'generative_images',
        name: 'Generative Images',
        icon: '🎨',
        description: 'Custom visuals generated from text descriptions',
        instruction: 'FORMATTING REQUIREMENT [TEXT ONLY — DO NOT GENERATE ACTUAL IMAGES]: Generate precise, highly descriptive image generation prompts designed for advanced text-to-image models (e.g. Midjourney, DALL-E, Stable Diffusion). Output ONLY the text prompts — do not attempt to create, render, or embed any actual images.'
      },
      {
        id: 'curated_images',
        name: 'Curated Images',
        icon: '🖼️',
        description: 'Relevant, high-quality sourced images',
        instruction: 'FORMATTING REQUIREMENT [TEXT ONLY]: Identify optimal locations for curated imagery and provide exact search queries, alt-text descriptions, or Markdown image placeholders. Output descriptive text only — do not embed or fetch actual images.'
      },
      {
        id: 'infographics',
        name: 'Infographics',
        icon: '📊',
        description: 'Visual storytelling combining text, graphics, and data',
        instruction: 'FORMATTING REQUIREMENT [TEXT ONLY — SLIDE-BY-SLIDE BLUEPRINT]: Architect a sequential infographic structure as a text-only blueprint. For each frame/slide, clearly number it and dictate the layout, text blurbs, icons, color suggestions, and data points. Do not generate actual graphics.'
      },
      {
        id: 'annotated_screenshots',
        name: 'Annotated Screenshots',
        icon: '🎯',
        description: 'Images featuring text overlays and highlights',
        instruction: 'FORMATTING REQUIREMENT [TEXT ONLY]: Provide detailed layout specifications for an annotated screenshot as text, including coordinates/targets for callouts and explanatory text overlays. Do not generate or embed actual images.'
      }
    ]
  },
  {
    id: 'data_visualization',
    title: 'Data Visualization',
    icon: '📈',
    description: 'Statistical representations and graphical charts',
    options: [
      {
        id: 'standard_charts',
        name: 'Standard Charts',
        icon: '📊',
        description: 'Bar (grouped/stacked) and Line (simple/multi)',
        instruction: 'FORMATTING REQUIREMENT: Format data into standard chart plotting points structure, specifying X and Y axis values for Bar and Line charts.',
        subOptions: [
          { id: 'bar_grouped', name: 'Grouped Bar', instructionModifier: '(Ensure metrics are mapped for a Grouped Bar chart architecture)' },
          { id: 'bar_stacked', name: 'Stacked Bar', instructionModifier: '(Ensure metrics are nested for a Stacked Bar chart architecture)' },
          { id: 'bar_horizontal', name: 'Horizontal Bar', instructionModifier: '(Ensure metrics are mapped for a Horizontal Bar chart architecture)' },
          { id: 'bar_vertical', name: 'Vertical Bar', instructionModifier: '(Ensure metrics are mapped for a Vertical Bar chart architecture)' },
          { id: 'line_simple', name: 'Simple Line', instructionModifier: '(Ensure metrics are mapped for a single trajectory Simple Line chart)' },
          { id: 'line_multi', name: 'Multi-Line', instructionModifier: '(Ensure metrics are mapped for a comparative Multi-Line chart architecture)' },
          { id: 'line_area', name: 'Area Fill', instructionModifier: '(Ensure metrics are mapped for an Area Line chart with fill parameters)' }
        ]
      },
      {
        id: 'proportion_distribution',
        name: 'Proportion & Distribution',
        icon: '🍩',
        description: 'Donut, Pie, Scatter Plots, and Bubble Charts',
        instruction: 'FORMATTING REQUIREMENT: Format data explicitly for proportion and distribution visualizations, defining subsets, percentages, and coordinates.',
        subOptions: [
          { id: 'donut', name: 'Donut Chart', instructionModifier: '(Format dataset specifically for a Donut Chart ring rendering)' },
          { id: 'pie', name: 'Pie Chart', instructionModifier: '(Format dataset specifically for a standard Pie Chart circular representation)' },
          { id: 'scatter', name: 'Scatter Plot', instructionModifier: '(Format dataset as coordinate points for a Scatter Plot correlation visualization)' },
          { id: 'bubble', name: 'Bubble Chart', instructionModifier: '(Format dataset with XYZ metrics for three-dimensional Bubble Chart rendering)' }
        ]
      },
      {
        id: 'advanced_analytics',
        name: 'Advanced Analytics',
        icon: '🕸️',
        description: 'Radar, Heatmaps, Candlestick, and Waterfall',
        instruction: 'FORMATTING REQUIREMENT: Format data specifically for complex charts, detailing multi-variable axes, density matrices, or financial high/low/close plotting.',
        subOptions: [
          { id: 'radar', name: 'Radar / Spider', instructionModifier: '(Configure data matrix for multivariate Radar/Spider charting)' },
          { id: 'heatmap', name: 'Heatmap', instructionModifier: '(Configure data density matrix for Heatmap visualization)' },
          { id: 'candlestick', name: 'Candlestick', instructionModifier: '(Configure Open, High, Low, Close (OHLC) values for Financial Candlestick rendering)' },
          { id: 'waterfall', name: 'Waterfall', instructionModifier: '(Configure sequential progression data for Waterfall chart representation)' }
        ]
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
        id: 'static_standard',
        name: 'Static & Standard',
        icon: '🧮',
        description: 'Basic informational rows and columns',
        instruction: 'FORMATTING REQUIREMENT: Synthesize core information into a highly organized, readable standard Markdown table with clear column headers.'
      },
      {
        id: 'comparative_data',
        name: 'Comparative Data',
        icon: '⚖️',
        description: 'Formatted for multi-item evaluation',
        instruction: 'FORMATTING REQUIREMENT: Generate a comparative table evaluating subjects side-by-side, analyzing variables and mapping distinctions.'
      },
      {
        id: 'dynamic_complex',
        name: 'Dynamic & Complex',
        icon: '🔄',
        description: 'Sortable columns and nested headers',
        instruction: 'FORMATTING REQUIREMENT: Generate a complex table structure using advanced markup or code to facilitate nested grouping and sortable multidimensional data.'
      }
    ]
  },
  {
    id: 'code_and_technical',
    title: 'Code & Technical Content',
    icon: '💻',
    description: 'Snippets, plain text mapping, and serialized data',
    options: [
      {
        id: 'code_blocks',
        name: 'Code Blocks',
        icon: '📝',
        description: 'Syntax-highlighted snippets spanning languages',
        instruction: 'FORMATTING REQUIREMENT: Present technical logic strictly inside syntax-highlighted code blocks with appropriate language identifiers.'
      },
      {
        id: 'markdown',
        name: 'Markdown',
        icon: '📑',
        description: 'Clean, structured text formatting',
        instruction: 'FORMATTING REQUIREMENT: Utilize extensive, exceptionally clean GitHub-Flavored Markdown. Employ hierarchical headers, bolding, lists, and quote blocks.'
      },
      {
        id: 'structured_data',
        name: 'Structured Data',
        icon: '{}',
        description: 'JSON, XML, or YAML formatted logic',
        instruction: 'FORMATTING REQUIREMENT: Serialize the data directly into an un-schematized JSON, XML, or YAML standard format block.',
        subOptions: [
          { id: 'data_json', name: 'JSON', instructionModifier: '(Serialize strictly as un-schematized JSON format)' },
          { id: 'data_xml', name: 'XML', instructionModifier: '(Serialize strictly as XML format)' },
          { id: 'data_yaml', name: 'YAML', instructionModifier: '(Serialize strictly as YAML format)' }
        ]
      },
      {
        id: 'logic_mapping',
        name: 'Logic Mapping',
        icon: '🖇️',
        description: 'Pseudocode, Flowcharts, and ER Diagrams',
        instruction: 'FORMATTING REQUIREMENT: Output process mappings, rendering logic graphically using Mermaid.js compliant Flowcharts or ER Diagrams.',
        subOptions: [
          { id: 'logic_pseudocode', name: 'Pseudocode', instructionModifier: '(Ensure logic is represented as rigorous Pseudocode algorithms)' },
          { id: 'logic_flowchart', name: 'Mermaid Flowchart', instructionModifier: '(Ensure logic is structured strictly as a Mermaid.js Flowchart mapping)' },
          { id: 'logic_erd', name: 'Entity-Relationship (ER) Diagram', instructionModifier: '(Ensure data architecture is rendered as a Mermaid.js Entity-Relationship (ER) Diagram)' }
        ]
      }
    ]
  },
  {
    id: 'interactive_elements',
    title: 'Interactive Elements',
    icon: '🕹️',
    description: 'Dashboards, tools, and executable frameworks',
    options: [
      {
        id: 'dashboards',
        name: 'Dashboards',
        icon: '🎛️',
        description: 'Interactive React interfaces and task boards',
        instruction: 'FORMATTING REQUIREMENT [TEXT ONLY — CODE OUTPUT]: Write the complete React component code (JSX/TSX) to build an interactive dashboard UI based on the prompt context. Output the source code as a text code block — do not attempt to render or execute the component.',
        subOptions: [
          { id: 'dashboard_react', name: 'React Interfaces', instructionModifier: '(Write complete React component code for dashboard UI)' },
          { id: 'dashboard_task', name: 'Task Boards', instructionModifier: '(Output structured logic for an interactive task board)' }
        ]
      },
      {
        id: 'logic_time',
        name: 'Logic & Time',
        icon: '⏱️',
        description: 'Decision trees and interactive timelines',
        instruction: 'FORMATTING REQUIREMENT: Structure chronological data formats for timeline visualization and binary decision branches.',
        subOptions: [
          { id: 'logic_decision', name: 'Decision Trees', instructionModifier: '(Structure format for binary decision branch visualization)' },
          { id: 'logic_timeline', name: 'Interactive Timelines', instructionModifier: '(Structure chronological data format for timeline visualization)' }
        ]
      },
      {
        id: 'tools_assessments',
        name: 'Tools & Assessments',
        icon: '🛠️',
        description: 'Maps, calculators, and dynamic quizzes',
        instruction: 'FORMATTING REQUIREMENT: Formulate logic configurations for calculators, geospatial maps, or a structured multiple-choice quiz assessment.',
        subOptions: [
          { id: 'tool_maps', name: 'Maps', instructionModifier: '(Formulate configuration for geospatial map rendering)' },
          { id: 'tool_calculators', name: 'Calculators', instructionModifier: '(Formulate logic configuration for interactive calculators)' },
          { id: 'tool_quizzes', name: 'Dynamic Quizzes', instructionModifier: '(Formulate structured multiple-choice quiz assessment)' }
        ]
      }
    ]
  },
  {
    id: 'multimedia_generation',
    title: 'Multimedia Generation',
    icon: '🎬',
    description: 'Video, audio, and immersive technological synthesis — 💰 outputs text prompts only, no actual media generation',
    options: [
      {
        id: 'video_synthesis',
        name: 'Video Synthesis',
        icon: '🎞️',
        description: 'Video generation derived from prompts',
        instruction: 'FORMATTING REQUIREMENT [TEXT ONLY — DO NOT GENERATE ACTUAL VIDEO]: Write comprehensive, copy-ready prompt engineering guidelines and scene-by-scene blueprints for AI video generation engines (e.g. Sora, Runway, Pika). Include scene descriptions, camera angles, transitions, and timing. Output ONLY the text prompt — do not attempt to create or embed any actual video content.'
      },
      {
        id: 'audio_creation',
        name: 'Audio Creation',
        icon: '🎵',
        description: 'Custom generated music, voiceovers, or sound effects',
        instruction: 'FORMATTING REQUIREMENT [TEXT ONLY — DO NOT GENERATE ACTUAL AUDIO]: Design a precise, copy-ready sonic blueprint including BPM, genre tags, mood descriptors, and temporal events for AI audio engines, or script text-to-speech voiceovers with timing and emphasis notation. Output ONLY the text blueprint — do not attempt to create or embed any actual audio content.',
        subOptions: [
          { id: 'audio_music', name: 'Music Generation', instructionModifier: '(Design blueprint including BPM, tags, and temporal events)' },
          { id: 'audio_voiceover', name: 'Voiceovers', instructionModifier: '(Script text-to-speech voiceover timing and emphasis)' },
          { id: 'audio_effects', name: 'Sound Effects', instructionModifier: '(Design blueprint for sound effect generation)' }
        ]
      },
      {
        id: 'immersive_tech',
        name: 'Immersive Tech',
        icon: '🥽',
        description: 'VR/AR content development and 3D modeling',
        instruction: 'FORMATTING REQUIREMENT: Output Spatial OS architecture or a declarative 3D modeling file format (like Three.js scenes or glTF object structures).',
        subOptions: [
          { id: 'immerse_vrar', name: 'VR/AR Content', instructionModifier: '(Output Spatial OS architecture parameters)' },
          { id: 'immerse_3d', name: '3D Modeling', instructionModifier: '(Output declarative 3D modeling format like Three.js or glTF)' }
        ]
      }
    ]
  },
  {
    id: 'software_development',
    title: 'Interactive Software Development',
    icon: '📱',
    description: 'Prototyping and intelligent simulation',
    options: [
      {
        id: 'prototyping',
        name: 'Prototyping',
        icon: '📱',
        description: 'Game dev and Web/Mobile App interface design',
        instruction: 'FORMATTING REQUIREMENT: Deliver comprehensive software UI/UX blueprints, wireframe logic documentation, or functional game loop logic.',
        subOptions: [
          { id: 'proto_gamedev', name: 'Game Dev', instructionModifier: '(Deliver functional game loop logic documentation)' },
          { id: 'proto_uiux', name: 'Web/Mobile UI/UX', instructionModifier: '(Deliver comprehensive UI/UX blueprints and wireframes)' }
        ]
      },
      {
        id: 'simulations_bots',
        name: 'Simulations & Bots',
        icon: '🤖',
        description: 'Interactive systems and Chatbot frameworks',
        instruction: 'FORMATTING REQUIREMENT: Output a definitive Conversational Flowchart matrix or simulation state-machine architecture for the AI entity.',
        subOptions: [
          { id: 'sim_systems', name: 'Interactive Systems', instructionModifier: '(Output simulation state-machine architecture)' },
          { id: 'sim_chatbots', name: 'Chatbot Frameworks', instructionModifier: '(Output a Conversational Flowchart matrix)' }
        ]
      }
    ]
  },
  {
    id: 'format_control',
    title: 'Output Format Control Language',
    icon: '⚙️',
    description: 'Syntax paradigms and visual parameter mastery',
    options: [
      {
        id: 'syntax_commands',
        name: 'Syntax & Commands',
        icon: '⌨️',
        description: 'Action-oriented keywords and formulations',
        instruction: 'FORMATTING REQUIREMENT: Output a comprehensive CLI command matrix or a structured syntax table governing the requested parameters.'
      },
      {
        id: 'aesthetics',
        name: 'Aesthetics',
        icon: '✨',
        description: 'Control over layout and emphasis patterns',
        instruction: 'FORMATTING REQUIREMENT: Apply advanced typographic visual rules, strictly controlling padding, whitespace, bolding, and data layout aesthetics.'
      }
    ]
  },
  {
    id: 'schema_driven',
    title: 'Schema-Driven Outputs',
    icon: '📑',
    description: 'Highly rigorous structural definitions',
    options: [
      {
        id: 'json_schema',
        name: 'JSON Schema',
        icon: '{}',
        description: 'Forces standard response structure for AI',
        instruction: 'FORMATTING REQUIREMENT: Serialize the entire output strictly as valid, well-formed JSON Schema format. No conversational text.'
      },
      {
        id: 'xsd_schema',
        name: 'XML Schema (XSD)',
        icon: '</>',
        description: 'Verbose, document-oriented namespaces',
        instruction: 'FORMATTING REQUIREMENT: Serialize the entire output strictly as valid XML Schema Definition (XSD). Include namespace declarations.'
      },
      {
        id: 'yaml_schema',
        name: 'YAML Schema',
        icon: '📄',
        description: 'Human-readable configuration formulation',
        instruction: 'FORMATTING REQUIREMENT: Serialize the entire output strictly as valid, indented YAML format. Do not prepend markdown wrap.'
      },
      {
        id: 'protobuf_schema',
        name: 'Protocol Buffers',
        icon: '📦',
        description: 'Compact binary interface definition',
        instruction: 'FORMATTING REQUIREMENT: Define the exact strongly typed proto3 definition syntax (Protocol Buffers) file structure for this context.'
      },
      {
        id: 'graphql_schema',
        name: 'GraphQL Schema',
        icon: '🕸️',
        description: 'Query-focused definition API framework',
        instruction: 'FORMATTING REQUIREMENT: Define a complete GraphQL schema representing the data mapping, using formal Schema Definition Language (SDL).'
      }
    ]
  }
];
