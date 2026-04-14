import React, { useMemo } from 'react';
import { OUTPUT_CATEGORIES } from '../engineConstants';

export interface FormatSuggestion {
  categoryId: string;
  subFormatId: string | null;
  name: string;
  icon: string;
  reason: string;
}

interface FormatSuggestionsProps {
  promptText: string;
  onSelect: (categoryId: string, subFormatId: string | null) => void;
}

export const FormatSuggestions: React.FC<FormatSuggestionsProps> = ({ promptText, onSelect }) => {
  const suggestions = useMemo(() => {
    if (!promptText || promptText.length < 5) return [];

    const text = promptText.toLowerCase();
    const results: FormatSuggestion[] = [];

    // Simple keyword mapping for suggestions
    const keywordMap: Array<{ keywords: string[], categoryId: string, subFormatId: string | null, reason: string }> = [
      { keywords: ['json', 'api response', 'endpoint'], categoryId: 'schema_driven', subFormatId: 'json_schema', reason: 'Looks like you need an API schema.' },
      { keywords: ['table', 'spreadsheet', 'csv', 'columns'], categoryId: 'structured_tables', subFormatId: 'static_standard', reason: 'Consider a structured table.' },
      { keywords: ['flowchart', 'diagram', 'mermaid', 'mapped'], categoryId: 'code_and_technical', subFormatId: 'logic_mapping', reason: 'A flowchart might map this perfectly.' },
      { keywords: ['dashboard', 'ui', 'react component'], categoryId: 'interactive_elements', subFormatId: 'dashboards', reason: 'Generate a React dashboard component.' },
      { keywords: ['chart', 'graph', 'data visualization'], categoryId: 'data_visualization', subFormatId: 'standard_charts', reason: 'Visualize this data.' },
      { keywords: ['image prompt', 'dall-e', 'midjourney'], categoryId: 'visual_representations', subFormatId: 'generative_images', reason: 'Use the Image Prompt architecture.' },
      { keywords: ['video', 'sora', 'runway', 'pika'], categoryId: 'multimedia_generation', subFormatId: 'video_synthesis', reason: 'Use the Video Synthesis format.' }
    ];

    keywordMap.forEach(map => {
      if (map.keywords.some(kw => text.includes(kw))) {
        // Find the actual option to get name and icon
        const cat = OUTPUT_CATEGORIES.find(c => c.id === map.categoryId);
        const opt = cat?.options.find(o => o.id === (map.subFormatId || ''));
        
        if (cat) {
          results.push({
            categoryId: map.categoryId,
            subFormatId: map.subFormatId,
            name: opt?.name || cat.title,
            icon: opt?.icon || cat.icon,
            reason: map.reason
          });
        }
      }
    });

    return results.slice(0, 3); // Max 3 suggestions
  }, [promptText]);

  if (suggestions.length === 0) return null;

  return (
    <div className="mt-2 flex flex-wrap gap-2 items-center animate-fade-in-up">
      <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">💡 Suggestions:</span>
      {suggestions.map((s, i) => (
        <button
          key={i}
          onClick={() => onSelect(s.categoryId, s.subFormatId)}
          className="flex items-center gap-1.5 px-2.5 py-1 bg-cyan-950/40 border border-cyan-800/50 hover:border-cyan-400 hover:bg-cyan-900/60 transition-all rounded-md text-xs text-cyan-100 shadow-[0_0_10px_-2px_rgba(6,182,212,0.2)] group"
          title={s.reason}
        >
          <span className="opacity-80 group-hover:opacity-100">{s.icon}</span>
          <span>{s.name}</span>
        </button>
      ))}
    </div>
  );
};
