import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { GoogleGenAI } from "@google/genai";

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import ResourceFooter from './components/ResourceFooter';
import PromptForm from './components/PromptForm';
import OutputCard from './components/OutputCard';
import MultiOutputCard, { OutputPayload } from './components/MultiOutputCard';
import Toast from './components/Toast';
import Sidebar from './components/Sidebar';
import TemplateModal from './components/TemplateModal';

// Types & Constants
import { TEMPLATES as DEFAULT_TEMPLATES, FORMAT_STYLES } from './constants';
import { ToastState, PromptTemplate, RecentPrompt, AttachmentInput, PromptTaskState } from './types';
import { MODIFIER_CATEGORIES } from './textModifiers';
import { OUTPUT_CATEGORIES } from './engineConstants';
import { OutputFormatOption } from './types';
import { SelectedModifiers } from './components/TextStyleToolbar';
import { OutputConfigurator } from './components/OutputConfigurator';
import TaskProgressPanel from './components/TaskProgressPanel';

// Global declaration for Google Apps Script environment
declare const google: any;

const SYNTAX_TEST_DATA = `python
def validate_highlighting():  
    """Verify syntax colors for keywords, strings, and comments."""  
    sample_data = {"key": "value", "numbers": [1, 2, 3]}  
    if sample_data:  
        print(f"Highlighted correctly! {sample_data['key']}")  
    # TODO: This comment should appear in muted gray  
    return True`;

const App: React.FC = () => {
  // --- State Management ---
  const [templates, setTemplates] = useState<PromptTemplate[]>(DEFAULT_TEMPLATES);
  const [selectedTemplateIds, setSelectedTemplateIds] = useState<string[]>([]);
  const [selectedFormatId, setSelectedFormatId] = useState<string>('none');
  const [userContent, setUserContent] = useState<string>('');
  const [includeExamples, setIncludeExamples] = useState<boolean>(false);
  const [charLimit, setCharLimit] = useState<number | null>(null);
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: 'success' });
  const [promptTasks, setPromptTasks] = useState<PromptTaskState[]>([]);
  
  // Universal Output Engine States
  const [selectedEngineSource, setSelectedEngineSource] = useState<string>('conversation');
  const [selectedEngineFormats, setSelectedEngineFormats] = useState<string[]>([]);
  const [outputPayloads, setOutputPayloads] = useState<OutputPayload[]>([]);
  
  // Phase 7: Multimedia Attachments
  const [attachments, setAttachments] = useState<AttachmentInput[]>([]);

  // History & Sidebar
  const [recentPrompts, setRecentPrompts] = useState<RecentPrompt[]>([]);
  
  // UI States
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Model Generation Selector
  const [modelFamily, setModelFamily] = useState<'2.5' | '3.1'>('2.5');

  // Text Style Modifier States
  const [selectedModifiers, setSelectedModifiers] = useState<SelectedModifiers>({
    font: null, emoji: null, ascii: null, xml: [], infographic: null, slideshow: null
  });

  /** Resolves all active modifier prompts into a single appended instruction block */
  const getModifierPromptText = useCallback((): string => {
    const parts: string[] = [];
    for (const cat of MODIFIER_CATEGORIES) {
      if (cat.id === 'xml') {
        const modIds = selectedModifiers.xml;
        if (modIds && modIds.length > 0) {
          modIds.forEach(id => {
            const mod = cat.modifiers.find(m => m.id === id);
            if (mod) {
              let cleanPrompt = mod.prompt;
              cleanPrompt = cleanPrompt.split('\nApply the ')[0].split('\nExtract text from ')[0];
              parts.push(cleanPrompt.trim());
            }
          });
        }
      } else {
        const modId = selectedModifiers[cat.id];
        if (!modId) continue;
        const mod = cat.modifiers.find(m => m.id === modId);
        if (mod) {
          let cleanPrompt = mod.prompt;
          cleanPrompt = cleanPrompt.split('\nApply the ')[0].split('\nExtract text from ')[0];
          parts.push(cleanPrompt.trim());
        }
      }
    }
    return parts.length > 0 ? '\n\n[CRITICAL ADDITIONAL DIRECTIVE — TEXT STYLING RULES]\nPlease rigorously enforce the following formatting rules onto your finalized string:\n' + parts.join('\n\n---\n\n') : '';
  }, [selectedModifiers]);

  const handleModifierChange = useCallback((categoryId: 'font' | 'emoji' | 'ascii' | 'xml' | 'infographic' | 'slideshow', modifierId: string | string[] | null) => {
    setSelectedModifiers(prev => ({ ...prev, [categoryId]: modifierId }));
  }, []);

  const handleEngineFormatToggle = useCallback((formatId: string) => {
    setSelectedEngineFormats(prev => 
      prev.includes(formatId) 
        ? prev.filter(id => id !== formatId)
        : [...prev, formatId]
    );
  }, []);

  const handleEngineFormatQuantityChange = useCallback((formatId: string, quantity: number) => {
    setSelectedEngineFormats(prev => {
      const withoutFormat = prev.filter(id => id !== formatId);
      const newFormatArr = Array(Math.max(0, quantity)).fill(formatId);
      return [...withoutFormat, ...newFormatArr];
    });
  }, []);

  /**
   * Resolves currently selected engine format IDs into their display labels and icons.
   * Includes sub-options with their parent label for clarity.
   */
  const resolveActiveEngineLabels = useCallback((): { id: string; label: string; icon: string; instruction: string }[] => {
    const labels: { id: string; label: string; icon: string; instruction: string }[] = [];
    
    // Calculate frequency map for exact duplicate limits
    const optionCounts: Record<string, number> = {};
    for (const id of selectedEngineFormats) {
        optionCounts[id] = (optionCounts[id] || 0) + 1;
    }

    for (const cat of OUTPUT_CATEGORIES) {
      for (const opt of cat.options) {
        if (optionCounts[opt.id] > 0 || (opt.subOptions && opt.subOptions.some(sub => optionCounts[sub.id] > 0))) {
          // Check if any sub-options are also selected
          const activeSubs = opt.subOptions?.filter(sub => optionCounts[sub.id] > 0) || [];
          
          if (activeSubs.length > 0) {
            // Iterating by quantity of each sub-option
            for (const sub of activeSubs) {
                const subCount = optionCounts[sub.id];
                for(let i = 0; i < subCount; i++) {
                   labels.push({
                     id: subCount > 1 ? `${sub.id}-${i + 1}` : sub.id,
                     label: subCount > 1 ? `${opt.name} — ${sub.name} (${i + 1})` : `${opt.name} — ${sub.name}`,
                     icon: opt.icon,
                     instruction: `${opt.instruction} ${sub.instructionModifier}`,
                   });
                }
            }
          } else if (optionCounts[opt.id] > 0) {
            // No sub-options selected, use the parent option
            const optCount = optionCounts[opt.id];
            for(let i = 0; i < optCount; i++) {
                labels.push({
                  id: optCount > 1 ? `${opt.id}-${i + 1}` : opt.id,
                  label: optCount > 1 ? `${opt.name} (${i + 1})` : opt.name,
                  icon: opt.icon,
                  instruction: opt.instruction,
                });
            }
          }
        }
      }
    }
    return labels;
  }, [selectedEngineFormats]);

  /**
   * Parses a delimited AI response into separate OutputPayload objects.
   * Falls back to a single payload if delimiters are not found.
   */
  const parsePayloads = useCallback((rawText: string, labels: { id: string; label: string; icon: string }[]): OutputPayload[] => {
    const payloads: OutputPayload[] = [];
    
    for (const label of labels) {
      const beginMarker = `===BEGIN_PAYLOAD: ${label.label}===`;
      const endMarker = `===END_PAYLOAD: ${label.label}===`;
      const beginIdx = rawText.indexOf(beginMarker);
      const endIdx = rawText.indexOf(endMarker);
      
      if (beginIdx !== -1 && endIdx !== -1 && endIdx > beginIdx) {
        const content = rawText.substring(beginIdx + beginMarker.length, endIdx).trim();
        if (content) {
          payloads.push({
            id: label.id,
            label: label.label,
            icon: label.icon,
            content,
          });
        }
      }
    }
    
    // Fallback: if parsing found nothing, try generic pattern or return as single block
    if (payloads.length === 0) {
      // Try generic regex fallback
      const genericRegex = /===BEGIN_PAYLOAD:\s*(.+?)===([\s\S]*?)===END_PAYLOAD:\s*\1===/g;
      let match;
      while ((match = genericRegex.exec(rawText)) !== null) {
        const matchLabel = match[1].trim();
        const matchContent = match[2].trim();
        const matchingLabel = labels.find(l => l.label === matchLabel);
        if (matchContent) {
          payloads.push({
            id: matchingLabel?.id || `payload_${payloads.length}`,
            label: matchLabel,
            icon: matchingLabel?.icon || '📄',
            content: matchContent,
          });
        }
      }
    }
    
    // If still nothing, wrap the entire output as a single payload
    if (payloads.length === 0 && rawText.trim()) {
      payloads.push({
        id: 'combined_output',
        label: 'Combined Output',
        icon: '📋',
        content: rawText.trim(),
      });
    }
    
    return payloads;
  }, []);

  // --- Effects ---

  // Initialize Local Storage Data
  useEffect(() => {
    try {
      const savedTemplates = localStorage.getItem('custom_templates');
      if (savedTemplates) {
        const parsed = JSON.parse(savedTemplates);
        const customOnly = parsed.filter((p: PromptTemplate) => p.isCustom);
        setTemplates([...DEFAULT_TEMPLATES, ...customOnly]);
      }

      const savedHistory = localStorage.getItem('recent_prompts');
      if (savedHistory) {
        setRecentPrompts(JSON.parse(savedHistory));
      }
    } catch (e) {
      console.error("Failed to parse local storage data during initialization:", e);
      showToastMessage("Warning: Failed to load local history.", "error");
    }
  }, []);

  // Manage Toast Auto-hide
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast(prev => ({ ...prev, show: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  // Handle Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Enter to trigger generation
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        if (userContent.trim() && !isLoading) {
          handleGenerate();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [userContent, isLoading]); // eslint-disable-line react-hooks/exhaustive-deps

  // --- Utility Configurations ---

  const showToastMessage = useCallback((message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ show: true, message, type });
  }, []);

  /**
   * Safely bridges the application back to the Google Apps Script backend.
   * This pushes the prompt log securely to the spreadsheet.
   */
  const syncWithGoogleAppsScript = useCallback((data: RecentPrompt) => {
    if (typeof google === 'undefined' || typeof google.script === 'undefined') {
      console.log("ℹ️ Local environment detected. Skipped sending to Google Apps Script.");
      return;
    }

    try {
      google.script.run
        .withSuccessHandler((response: any) => console.log('✅ Sheet Sync Success:', response))
        .withFailureHandler((error: any) => {
          console.error('❌ Sheet Sync Failed:', error);
          showToastMessage('Could not sync to Google Sheets.', 'error');
        })
        .saveDataFromFrontend(data);
    } catch (error) {
      console.error("Execution context exception during Apps Script sync.", error);
    }
  }, [showToastMessage]);

  const saveToHistory = useCallback((template: PromptTemplate, content: string, generated: string) => {
    if (recentPrompts.length > 0) {
      const latest = recentPrompts[0];
      if (latest.templateIds?.includes(template.id) && latest.userContent === content) {
        return; // Prevent duplicate consecutive saves
      }
    }

    const newEntry: RecentPrompt = {
      id: Date.now().toString(),
      templateIds: selectedTemplateIds.length > 0 ? selectedTemplateIds : ['none'],
      templateNames: selectedTemplateIds.length > 0 ? templates.filter(t => selectedTemplateIds.includes(t.id)).map(t => t.name) : ['Default'],
      userContent: content,
      generatedContent: generated,
      timestamp: Date.now()
    };

    const updatedHistory = [newEntry, ...recentPrompts].slice(0, 5); 
    setRecentPrompts(updatedHistory);
    localStorage.setItem('recent_prompts', JSON.stringify(updatedHistory));
    
    // Google Integration Hook 🔥
    syncWithGoogleAppsScript(newEntry);
  }, [recentPrompts, syncWithGoogleAppsScript]);

  const triggerCelebration = () => {
    const joyfulColors = ['#FF6B9D', '#FF8E53', '#6B7BFF', '#FF3D7F', '#FFB3C6'];
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: joyfulColors, disableForReducedMotion: true });

    let count = 0;
    const interval = setInterval(() => {
      if (count > 2) return clearInterval(interval);
      confetti({ particleCount: 20, angle: 60, spread: 55, origin: { x: 0 }, colors: joyfulColors });
      confetti({ particleCount: 20, angle: 120, spread: 55, origin: { x: 1 }, colors: joyfulColors });
      count++;
    }, 400);
  };

  /**
   * Generates standard prompt by concatenating templates and appending configurations
   */
  const handleGenerate = useCallback(() => {
    if (!userContent.trim()) return;

    setIsLoading(true);
    
    // Simulate slight delay for perceived compilation
    setTimeout(() => {
      try {
        let finalPrompt = '';
        let templateForHistory = templates[0]; // fallback

        const activeTemplates = selectedTemplateIds.length > 0
          ? templates.filter(t => selectedTemplateIds.includes(t.id))
          : [{ content: '{{content}}', name: 'Default', id: 'none', placeholderTrigger: '{{content}}', isCustom: false }];

        templateForHistory = activeTemplates[0] as PromptTemplate;

        // If multiple templates selected, we join their final templates for local "handleGenerate" 
        // to show them together. This is mostly a fallback for manual generation.
        finalPrompt = activeTemplates.map(template => {
          const placeholder = template.placeholderTrigger || "{{content}}"; 
          if (template.content.includes(placeholder)) {
            return template.content.replace(placeholder, userContent);
          } else {
            return `${template.content}\n\n${userContent}`;
          }
        }).join('\n\n================\n\n');

        if (includeExamples) {
          finalPrompt += `\n\n### Requirement: Multiple Options\nPlease provide 4 distinct numbered versions (1-4) of the result, varying in tone, style, or approach to help me choose the best one.`;
        }

        if (charLimit) {
           finalPrompt += `\n\n### Requirement: Length Constraint\nStep 1: Carefully analyze meaning.\nStep 2: Rewrite text to EQUAL approximately ${charLimit} characters.`;
        }

        // Inject text style modifiers
        finalPrompt += getModifierPromptText();

        // Inject format style override if selected (The Lens)
        if (selectedFormatId && selectedFormatId !== 'none') {
          const formatStyle = FORMAT_STYLES.find(f => f.id === selectedFormatId);
          if (formatStyle) {
            finalPrompt += `\n\n[CRITICAL PRESENTATION REQUIREMENT — STRUCTURAL FORMAT OVERRIDE]\nIMPORTANT: Regardless of any formatting conventions implied or suggested within the primary directives above, you are strictly required to adhere to the following structural format when composing and delivering your final output. Do not deviate from this presentation architecture under any circumstances.\n\n${formatStyle.content}`;
          }
        }

        setOutputPayloads([]); // Clear any previous multi-payload state
        setGeneratedPrompt(finalPrompt);
        saveToHistory(templateForHistory, userContent, finalPrompt);
        triggerCelebration(); 
        showToastMessage('✨ Prompt Generated!');
      } catch (error) {
        console.error("Generation logic failed:", error);
        showToastMessage('Error generating prompt', 'error');
      } finally {
        setIsLoading(false);
      }
    }, 400); 
  }, [selectedTemplateIds, selectedFormatId, userContent, templates, includeExamples, charLimit, saveToHistory, showToastMessage, getModifierPromptText]);

  /**
   * Delegates prompt expansion to Gemini AI capabilities
   */
  const handleAIGenerate = useCallback(async (mode: 'smart' | 'fast' | 'thinking') => {
    if (!userContent.trim()) {
      showToastMessage('Please enter some content first', 'info');
      return;
    }

    setIsLoading(true);

    try {
      // Fetch active templates to spawn parallel tasks
      const activeTemplates = selectedTemplateIds.length > 0
        ? templates.filter(t => selectedTemplateIds.includes(t.id))
        : [{ id: 'none', name: 'Default Engine', content: 'Please process this text:\n\n{{content}}', placeholderTrigger: '{{content}}' } as PromptTemplate];

      templateForHistory = activeTemplates[0];

      // Build base configurations shared across all pipelines
      let basePromptText = "";
      if (includeExamples) basePromptText += "\nRequirement: Provide 4 distinct numbered variations.";
      if (charLimit) basePromptText += `\nRequirement: Target length is approximately ${charLimit} characters.`;
      
      basePromptText += getModifierPromptText();

      // Output Architecture (Formats & Lenses)
      const outputArchLabels = resolveActiveEngineLabels();
      const formatLenses: { id: string; label: string; icon: string; instruction: string }[] = [...outputArchLabels];

      if (selectedFormatId && selectedFormatId !== 'none') {
        const formatStyle = FORMAT_STYLES.find(f => f.id === selectedFormatId);
        if (formatStyle) {
          formatLenses.push({
            id: `lens_${formatStyle.id}`,
            label: `${formatStyle.name} (Lens)`,
            icon: '🎛️',
            instruction: formatStyle.content,
          });
        }
      }

      // Attachments Processing
      const contentsParts: any[] = [];
      for (const att of attachments) {
        if (att.status !== 'ready') continue;
        if (att.type === 'file' && att.base64) {
          const b64Data = att.base64.split(',')[1];
          if (b64Data) {
            contentsParts.push({
              inlineData: {
                data: b64Data,
                mimeType: att.mimeType || 'application/octet-stream'
              }
            });
          }
        } else if (att.type === 'url' && att.urlContent) {
          contentsParts.push(`\n[BACKGROUND CONTEXT SCRAPED FROM URL: ${att.name}]\n${att.urlContent}\n[END URL CONTEXT]\n`);
        }
      }
      const initialTasks = activeTemplates.map(t => ({
         templateId: t.id,
         templateName: t.name,
         status: 'queued' as const
      }));
      setPromptTasks(initialTasks);
      setOutputPayloads([]); // Clear active outputs to switch focus to progress panel

      const results = await Promise.allSettled(activeTemplates.map(async (template) => {
         setPromptTasks(prev => prev.map(pt => pt.templateId === template.id ? { ...pt, status: 'processing' } : pt));

         let promptText = "";
         const placeholder = template.placeholderTrigger || "{{content}}";
         if (template.content.includes(placeholder)) {
           promptText = template.content.replace(placeholder, userContent);
         } else {
           promptText = `${template.content}\n\n[USER CONTENT]\n${userContent}\n[/USER CONTENT]`;
         }

         promptText += basePromptText;

         const currentPayloadLabels = [{
            id: `engine_${template.id}`,
            label: template.name,
            icon: '⚡',
            instruction: 'Execute the primary transformation.'
         }, ...formatLenses];

         const isMultiPayload = currentPayloadLabels.length > 1;

         if (isMultiPayload) {
            const payloadInstructions = currentPayloadLabels.map((label, i) => 
               `${i + 1}. **${label.label}**: ${label.instruction}`
            ).join('\n');
            const delimiterExamples = currentPayloadLabels.map(label => 
               `===BEGIN_PAYLOAD: ${label.label}===\n[Your ${label.label} output here]\n===END_PAYLOAD: ${label.label}===`
            ).join('\n\n');
            
            promptText += `\n\n[UNIVERSAL ENGINE — MULTI-PAYLOAD OUTPUT SCHEMATICS]\nCRITICAL: You are generating MULTIPLE SEPARATE output payloads. Each payload MUST be wrapped in EXACT delimiter markers as shown below.\n\nRequired Output Types:\n${payloadInstructions}\n\nMANDATORY OUTPUT STRUCTURE:\n${delimiterExamples}`;
         } else if (formatLenses.length === 1) {
            promptText += `\n\n[UNIVERSAL ENGINE — OUTPUT SCHEMATICS]\nIMPORTANT: You must fulfill the following architectural requirement in your output:\n- ${formatLenses[0].instruction}`;
         }

         promptText += `\n\n[CRITICAL SYSTEM DIRECTIVE — FINAL OUTPUT ISOLATION]\nIMPORTANT: You MUST return ONLY the finalized, transformed result. DO NOT include any conversational filler.`;

         const pipelineContents = [...contentsParts, promptText];
         try {
           const API_URL = "https://smart-prompt-builder-engine-825046261103.us-central1.run.app/api/v1/generate/batch";
           const response = await fetch(API_URL, {
             method: 'POST',
             headers: {
               'Content-Type': 'application/json'
             },
             body: JSON.stringify({
               model_name: model,
               tasks: [
                 { id: template.id, contents: pipelineContents }
               ]
             })
           });

           if (!response.ok) throw new Error(`Backend Error: ${response.status}`);
           
           const data = await response.json();
           const result = data.results[0];

           if (result.status === 'failed') throw new Error(result.error || "Generation failed on server");
           
           const rawText = result.raw_text;
           if (!rawText) throw new Error("No output generated from AI backend");
           
           const payloads = isMultiPayload ? parsePayloads(rawText, currentPayloadLabels) : [];
           
           setPromptTasks(prev => prev.map(pt => pt.templateId === template.id ? { ...pt, status: 'completed' } : pt));
           
           return {
             id: template.id,
             isMultiPayload,
             payloads,
             rawText: rawText
           };
         } catch (err: any) {
           setPromptTasks(prev => prev.map(pt => pt.templateId === template.id ? { ...pt, status: 'failed', error: err.message || 'Generation failed' } : pt));
           throw err;
         }
      }));

      // Gather all outputs from the parallel runs
      const aggPayloads: OutputPayload[] = [];
      const aggSingleTexts: string[] = [];

      results.forEach(res => {
         if (res.status === 'fulfilled') {
           if (res.value.isMultiPayload && res.value.payloads.length > 0) {
              aggPayloads.push(...res.value.payloads);
           } else {
              aggSingleTexts.push(res.value.rawText);
           }
         } else {
           console.error("Task failed:", res.reason);
           showToastMessage(`One or more pipelines failed!`, 'error');
         }
      });

      if (aggPayloads.length > 0) {
        setOutputPayloads(aggPayloads);
        const combinedSingle = aggSingleTexts.join('\n\n---\n\n');
        setGeneratedPrompt(combinedSingle ? combinedSingle : null);
      } else {
        setGeneratedPrompt(aggSingleTexts.join('\n\n---\n\n'));
        setOutputPayloads([]);
      }

      const allSuccess = results.every(r => r.status === 'fulfilled');
      if (allSuccess) {
        triggerCelebration(); 
        showToastMessage(`Generated dynamically with ${mode.toUpperCase()} mode! 🧠`);
      }
      saveToHistory(templateForHistory, userContent, "Rendered dynamic payloads");
      
      // Clear progress tasks after a short delay so the success states are briefly visible
      setTimeout(() => {
        setPromptTasks([]);
      }, 2000);
    } catch (error: any) {
      console.error("AI Generation Runtime Error:", error);
      showToastMessage(`AI Exception: ${error.message || 'Engine failed'}`, 'error');
      setPromptTasks(prev => prev.map(pt => pt.status === 'processing' || pt.status === 'queued' ? { ...pt, status: 'failed', error: error.message } : pt));
    } finally {
      setIsLoading(false);
    }
  }, [userContent, selectedTemplateIds, selectedFormatId, selectedEngineFormats, attachments, templates, includeExamples, charLimit, saveToHistory, showToastMessage, getModifierPromptText, resolveActiveEngineLabels, parsePayloads]);

  /**
   * Intelligently expands or compresses the raw user content in-place using AI.
   */
  const handleAIRewriteContent = useCallback(async (action: 'expand' | 'compress') => {
    if (!userContent.trim()) {
      showToastMessage('Please enter some content to rewrite', 'info');
      return;
    }

    setIsLoading(true);
    let apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;

    try {
      if (!apiKey && typeof google !== 'undefined' && google.script && google.script.run) {
        apiKey = await new Promise<string>((resolve, reject) => {
          google.script.run
            .withSuccessHandler((key: string) => resolve(key))
            .withFailureHandler((err: any) => reject(err))
            .getApiKey();
        });
      }

      if (!apiKey) throw new Error("API Key not securely configured in environment properties.");

      const ai = new GoogleGenAI({ apiKey });
      const promptMap = {
        'expand': 'You are a master editor. Your sole objective is to take the following text and systematically EXPAND it. Elaborate on the core concepts, add rich descriptive detail, and increase the depth of the content without hallucinating false information or adding conversational filler. Return ONLY the expanded text.',
        'compress': 'You are a master editor. Your sole objective is to take the following text and systematically COMPRESS it. Summarize the core concepts, remove fluff, and drastically decrease the length while retaining all primary meaning. Do not add conversational filler. Return ONLY the compressed text.'
      };

      const response = await ai.models.generateContent({
        model: modelFamily === '3.1' ? 'gemini-3-flash-preview' : 'gemini-2.5-flash',
        contents: `${promptMap[action]}\n\n[TEXT_TO_${action.toUpperCase()}]\n${userContent}\n[/TEXT_TO_${action.toUpperCase()}]`,
      });

      if (response.text) {
        setUserContent(response.text);
        showToastMessage(`Content successfully ${action}ed! 🪄`);
      } else {
        throw new Error("Received empty response from AI engine.");
      }
    } catch (error: any) {
      console.error("AI Rewrite Error:", error);
      showToastMessage(`Rewrite Exception: ${error.message || 'Engine failed'}`, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [userContent, showToastMessage]);

  // --- Output Interactions ---

  const handleInsertTag = useCallback((tagName: string) => {
    const textarea = document.getElementById('content') as HTMLTextAreaElement;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = userContent.substring(start, end);

    let newText = '';
    if (selectedText) {
      newText = `${userContent.substring(0, start)}<${tagName}>\n${selectedText}\n</${tagName}>${userContent.substring(end)}`;
    } else {
      newText = `${userContent.substring(0, start)}<${tagName}>\n\n</${tagName}>${userContent.substring(end)}`;
    }
    
    setUserContent(newText);
    
    setTimeout(() => {
      textarea.focus();
      if (selectedText) {
         textarea.setSelectionRange(start + tagName.length + 3, start + tagName.length + 3 + selectedText.length + 1);
      } else {
         const newPos = start + tagName.length + 3;
         textarea.setSelectionRange(newPos, newPos);
      }
    }, 10);
  }, [userContent]);

  const handleCopy = useCallback(async () => {
    if (!generatedPrompt) return;
    try {
      await navigator.clipboard.writeText(generatedPrompt);
      showToastMessage('Copied! ✅');
      confetti({ particleCount: 40, spread: 70, origin: { y: 0.6 }, colors: ['#6B7BFF', '#A5B4FC'], disableForReducedMotion: true });
    } catch (err) {
      showToastMessage('Failed to trigger native copy protocol', 'error');
    }
  }, [generatedPrompt, showToastMessage]);

  const handleExport = useCallback((format: 'txt' | 'md') => {
    if (!generatedPrompt) return;
    
    // ISO string formatting for file name consistency
    const timestamp = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14);
    const blob = new Blob([generatedPrompt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `smart_prompt_${timestamp}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToastMessage(`Exported securely as .${format}`);
  }, [generatedPrompt, showToastMessage]);

  const handleSaveTemplate = useCallback((name: string, description: string, content: string) => {
    const customTemplates = templates.filter(t => t.isCustom);
    if (customTemplates.length >= 10) {
      showToastMessage('Quota exceeded: Maximum of 10 custom templates allowed.', 'error');
      return;
    }

    const newTemplate: PromptTemplate = {
      id: `custom-${Date.now()}`,
      name,
      description,
      content,
      isCustom: true,
      placeholderTrigger: '{{content}}'
    };

    const updatedTemplates = [...templates, newTemplate];
    setTemplates(updatedTemplates);
    setSelectedTemplateIds(prev => [...prev, newTemplate.id]); 
    
    localStorage.setItem('custom_templates', JSON.stringify(updatedTemplates.filter(t => t.isCustom)));
    setIsModalOpen(false);
    showToastMessage('Template successfully documented! ★');
  }, [templates, showToastMessage]);

  const handleDeleteTemplate = useCallback((id: string) => {
    const updatedTemplates = templates.filter(t => t.id !== id);
    setTemplates(updatedTemplates);
    setSelectedTemplateIds(prev => prev.filter(t => t !== id));
    
    localStorage.setItem('custom_templates', JSON.stringify(updatedTemplates.filter(t => t.isCustom)));
    showToastMessage('Template purged from environment.');
  }, [templates, showToastMessage]);

  const handleRestoreFromHistory = useCallback((prompt: RecentPrompt) => {
      if (prompt.templateIds && prompt.templateIds.length > 0) {
        const existingIds = prompt.templateIds.filter(id => templates.some(t => t.id === id));
        if (existingIds.length > 0) {
          setSelectedTemplateIds(existingIds);
        } else {
          showToastMessage('Orphaned templates: Restoring isolated prompt content context.', 'info');
        }
      } else {
        // Fallback for legacy history objects
        const legacyId = (prompt as any).templateId;
        if (legacyId && templates.some(t => t.id === legacyId)) {
          setSelectedTemplateIds([legacyId]);
        } else {
          showToastMessage('Orphaned template: Restoring isolated prompt content context.', 'info');
        }
      }
      
      setUserContent(prompt.userContent);
      setGeneratedPrompt(prompt.generatedContent);
      setOutputPayloads([]); // Clear active multi-payloads, as history currently saves text
      
      showToastMessage('Memory block retrieved and injected.');
      if (!isSidebarOpen) setIsSidebarOpen(true);
  }, [templates, isSidebarOpen, showToastMessage]);

  return (
    <div className="min-h-screen relative flex flex-col md:flex-row">
      <button 
        onClick={() => setIsSidebarOpen(true)}
        className={`fixed top-3 right-3 sm:top-4 sm:right-4 z-30 p-2.5 bg-slate-900/80 backdrop-blur rounded-full shadow-[0_0_15px_rgba(168,85,247,0.2)] border border-slate-700 text-slate-400 hover:text-pink-400 hover:border-pink-500 hover:scale-110 transition-all active:scale-95 ${isSidebarOpen ? 'hidden' : 'block'}`}
        title="Recent Prompts"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>

      <div className="flex-grow py-6 px-3 sm:py-8 sm:px-6 lg:px-8 transition-all duration-300">
        <div className="max-w-3xl mx-auto w-full">
          <Header />
          <main>
            <PromptForm
              templates={templates}
              selectedTemplateIds={selectedTemplateIds}
              selectedFormatId={selectedFormatId}
              userContent={userContent}
              includeExamples={includeExamples}
              charLimit={charLimit}
              onTemplateToggle={(id) => setSelectedTemplateIds(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id])}
              onFormatChange={(e) => setSelectedFormatId(e.target.value)}
              onContentChange={(e) => setUserContent(e.target.value)}
              onExamplesChange={(e) => setIncludeExamples(e.target.checked)}
              onCharLimitChange={setCharLimit}
              onGenerate={handleGenerate}
              onAIGenerate={handleAIGenerate}
              isLoading={isLoading}
              onNewTemplate={() => setIsModalOpen(true)}
              onAIRewrite={handleAIRewriteContent}
              onLoadSyntaxTest={() => {
                if (templates.some(t => t.id === 'direct-message')) setSelectedTemplateIds(['direct-message']);
                setUserContent(SYNTAX_TEST_DATA);
                showToastMessage('Validation syntax payload loaded against scope.');
              }}
              onDeleteTemplate={handleDeleteTemplate}
              selectedModifiers={selectedModifiers}
              onModifierChange={handleModifierChange}
              selectedEngineSource={selectedEngineSource}
              onEngineSourceChange={setSelectedEngineSource}
              selectedEngineFormats={selectedEngineFormats}
              onEngineFormatToggle={handleEngineFormatToggle}
              onEngineFormatQuantityChange={handleEngineFormatQuantityChange}
              attachments={attachments}
              onAttachmentsChange={setAttachments}
              onInsertTag={handleInsertTag}
              modelFamily={modelFamily}
              onModelFamilyChange={setModelFamily}
            />

            {/* In-Flight Asynchronous Task State Tracker */}
            {promptTasks.length > 0 && (
              <TaskProgressPanel tasks={promptTasks} />
            )}

            {/* Multi-Payload Output — renders when multiple engine formats were selected */}
            {outputPayloads.length > 0 && (
              <MultiOutputCard
                payloads={outputPayloads}
                onClear={() => { setOutputPayloads([]); setGeneratedPrompt(null); setUserContent(''); }}
                onExport={handleExport}
                showToast={showToastMessage}
              />
            )}

            {/* Single Payload Output — legacy card for single or no engine format */}
            {outputPayloads.length === 0 && (
              <OutputCard
                content={generatedPrompt}
                onCopy={handleCopy}
                onClear={() => { setGeneratedPrompt(null); setUserContent(''); }}
                onExport={handleExport}
              />
            )}
          </main>
          <Footer />
          <ResourceFooter />
        </div>
      </div>

      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        recentPrompts={recentPrompts}
        onRestore={handleRestoreFromHistory}
      />

      <TemplateModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveTemplate} 
      />
      
      <Toast toast={toast} />
    </div>
  );
};

export default App;