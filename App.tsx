import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { GoogleGenAI } from "@google/genai";

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import PromptForm from './components/PromptForm';
import OutputCard from './components/OutputCard';
import MultiOutputCard, { OutputPayload } from './components/MultiOutputCard';
import Toast from './components/Toast';
import Sidebar from './components/Sidebar';
import TemplateModal from './components/TemplateModal';

// Types & Constants
import { TEMPLATES as DEFAULT_TEMPLATES, FORMAT_STYLES } from './constants';
import { ToastState, PromptTemplate, RecentPrompt } from './types';
import { MODIFIER_CATEGORIES } from './textModifiers';
import { OUTPUT_CATEGORIES } from './engineConstants';
import { OutputFormatOption } from './types';
import { SelectedModifiers } from './components/TextStyleToolbar';
import { OutputConfigurator } from './components/OutputConfigurator';

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
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('none');
  const [selectedFormatId, setSelectedFormatId] = useState<string>('none');
  const [userContent, setUserContent] = useState<string>('');
  const [includeExamples, setIncludeExamples] = useState<boolean>(false);
  const [charLimit, setCharLimit] = useState<number | null>(null);
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: 'success' });
  
  // Universal Output Engine States
  const [selectedEngineSource, setSelectedEngineSource] = useState<string>('conversation');
  const [selectedEngineFormats, setSelectedEngineFormats] = useState<string[]>([]);
  const [outputPayloads, setOutputPayloads] = useState<OutputPayload[]>([]);
  
  // UI States
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [recentPrompts, setRecentPrompts] = useState<RecentPrompt[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Text Style Modifier States
  const [selectedModifiers, setSelectedModifiers] = useState<SelectedModifiers>({
    font: null, emoji: null, ascii: null, xml: null
  });

  /** Resolves all active modifier prompts into a single appended instruction block */
  const getModifierPromptText = useCallback((): string => {
    const parts: string[] = [];
    for (const cat of MODIFIER_CATEGORIES) {
      const modId = selectedModifiers[cat.id];
      if (!modId) continue;
      const mod = cat.modifiers.find(m => m.id === modId);
      if (mod) {
        let cleanPrompt = mod.prompt;
        cleanPrompt = cleanPrompt.split('\nApply the ')[0].split('\nExtract text from ')[0];
        parts.push(cleanPrompt.trim());
      }
    }
    return parts.length > 0 ? '\n\n[CRITICAL ADDITIONAL DIRECTIVE — TEXT STYLING RULES]\nPlease rigorously enforce the following formatting rules onto your finalized string:\n' + parts.join('\n\n---\n\n') : '';
  }, [selectedModifiers]);

  const handleModifierChange = useCallback((categoryId: 'font' | 'emoji' | 'ascii' | 'xml', modifierId: string | null) => {
    setSelectedModifiers(prev => ({ ...prev, [categoryId]: modifierId }));
  }, []);

  const handleEngineFormatToggle = useCallback((formatId: string) => {
    setSelectedEngineFormats(prev => 
      prev.includes(formatId) 
        ? prev.filter(id => id !== formatId)
        : [...prev, formatId]
    );
  }, []);

  /**
   * Resolves currently selected engine format IDs into their display labels and icons.
   * Includes sub-options with their parent label for clarity.
   */
  const resolveActiveEngineLabels = useCallback((): { id: string; label: string; icon: string; instruction: string }[] => {
    const labels: { id: string; label: string; icon: string; instruction: string }[] = [];
    for (const cat of OUTPUT_CATEGORIES) {
      for (const opt of cat.options) {
        if (selectedEngineFormats.includes(opt.id)) {
          // Check if any sub-options are also selected
          const activeSubs = opt.subOptions?.filter(sub => selectedEngineFormats.includes(sub.id)) || [];
          
          if (activeSubs.length > 0) {
            // If sub-options are selected, create a label per sub-option
            for (const sub of activeSubs) {
              labels.push({
                id: sub.id,
                label: `${opt.name} — ${sub.name}`,
                icon: opt.icon,
                instruction: `${opt.instruction} ${sub.instructionModifier}`,
              });
            }
          } else {
            // No sub-options selected, use the parent option
            labels.push({
              id: opt.id,
              label: opt.name,
              icon: opt.icon,
              instruction: opt.instruction,
            });
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
      if (latest.templateId === template.id && latest.userContent === content) {
        return; // Prevent duplicate consecutive saves
      }
    }

    const newEntry: RecentPrompt = {
      id: Date.now().toString(),
      templateId: template.id,
      templateName: template.name,
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

        if (selectedTemplateId === 'none') {
          finalPrompt = userContent;
        } else {
          const template = templates.find(t => t.id === selectedTemplateId);
          if (!template) throw new Error("Template mapping failure.");
          templateForHistory = template;

          const placeholder = template.placeholderTrigger || "{{content}}"; 
          if (template.content.includes(placeholder)) {
            finalPrompt = template.content.replace(placeholder, userContent);
          } else {
            finalPrompt = `${template.content}\n\n${userContent}`;
          }
        }

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
  }, [selectedTemplateId, selectedFormatId, userContent, templates, includeExamples, charLimit, saveToHistory, showToastMessage, getModifierPromptText]);

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
      let templateForHistory = templates[0];
      let promptText = '';

      if (selectedTemplateId === 'none') {
         promptText = `Please process this text:\n\n${userContent}`;
      } else {
        const template = templates.find(t => t.id === selectedTemplateId);
        if (!template) throw new Error("Template not found");
        templateForHistory = template;
        
        const placeholder = template.placeholderTrigger || "{{content}}";
        if (template.content.includes(placeholder)) {
          promptText = template.content.replace(placeholder, userContent);
        } else {
          promptText = `${template.content}\n\n[USER CONTENT]\n${userContent}\n[/USER CONTENT]`;
        }
      }
      
      let apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
      
      // If we are deployed on Apps Script, dynamically fetch the secure key from Script Properties
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
      
      const modelMap = {
        'fast': 'gemini-2.5-flash',
        'smart': 'gemini-2.5-flash',
        'thinking': 'gemini-2.5-pro'
      };
      
      const model = modelMap[mode];
      const config: any = {
        systemInstruction: "You are a highly capable AI execution engine. Your sole objective is to flawlessly execute the user's instructions and strictly adhere to the provided formatting requirements. Do not provide commentary.",
      };

      if (mode === 'thinking') config.thinkingConfig = { thinkingBudget: 1024 }; // Optimized budget for 2.5 Pro

      if (includeExamples) promptText += "\nRequirement: Provide 4 distinct numbered variations.";
      if (charLimit) promptText += `\nRequirement: Target length is approximately ${charLimit} characters.`;
      // UI-Selected Modifiers
      promptText += getModifierPromptText();

      // Universal Engine Schema/Format Injections — Multi-Payload Architecture
      const activeLabels = resolveActiveEngineLabels();
      const isMultiPayload = activeLabels.length > 1;
      
      if (activeLabels.length > 0) {
        if (isMultiPayload) {
          // ═══ MULTI-PAYLOAD MODE ═══
          // Instruct AI to output each format in clearly delimited sections
          const payloadInstructions = activeLabels.map((label, i) => 
            `${i + 1}. **${label.label}**: ${label.instruction}`
          ).join('\n');
          
          const delimiterExamples = activeLabels.map(label => 
            `===BEGIN_PAYLOAD: ${label.label}===\n[Your ${label.label} output here]\n===END_PAYLOAD: ${label.label}===`
          ).join('\n\n');
          
          promptText += `\n\n[UNIVERSAL ENGINE — MULTI-PAYLOAD OUTPUT SCHEMATICS]\nCRITICAL: You are generating MULTIPLE SEPARATE output payloads. Each payload MUST be wrapped in EXACT delimiter markers as shown below. Do NOT merge payloads together. Each payload is an independent, self-contained output block.\n\nRequired Output Types:\n${payloadInstructions}\n\nMANDATORY OUTPUT STRUCTURE — Use these EXACT delimiters (copy them character-for-character):\n${delimiterExamples}\n\nRULES:\n- Each payload must be complete and self-contained\n- Do NOT include any text outside the delimiter blocks\n- Do NOT add introductions, summaries, or commentary between payloads\n- The delimiter lines must appear EXACTLY as shown above (with the === markers)`;
        } else {
          // ═══ SINGLE-PAYLOAD MODE ═══
          // Standard single-format injection (legacy behavior)
          const singleLabel = activeLabels[0];
          promptText += `\n\n[UNIVERSAL ENGINE — OUTPUT SCHEMATICS]\nIMPORTANT: You must fulfill the following architectural requirement in your output:\n- ${singleLabel.instruction}`;
        }
      }

      // Inject format style override if selected (The Lens)
      if (selectedFormatId && selectedFormatId !== 'none') {
        const formatStyle = FORMAT_STYLES.find(f => f.id === selectedFormatId);
        if (formatStyle) {
          promptText += `\n\n[CRITICAL PRESENTATION REQUIREMENT — STRUCTURAL FORMAT OVERRIDE]\nIMPORTANT: Regardless of any formatting conventions implied or suggested within the primary directives above, you are strictly required to adhere to the following structural format when composing and delivering your final output. Do not deviate from this presentation architecture under any circumstances.\n\n${formatStyle.content}`;
        }
      }

      // CRITICAL DIRECTIVE: Strip diagnostic commentary
      promptText += `\n\n[CRITICAL SYSTEM DIRECTIVE — FINAL OUTPUT ISOLATION]\nIMPORTANT: You MUST return ONLY the finalized, transformed result. DO NOT include any conversational filler, analytical commentary, reasoning steps, structural scaffolding, "Here is your output" introductions, or debugging logs. Your entire response must consist strictly of the exact text the user will copy and paste, formatted dynamically based on the requested presentation style.`;

      const response = await ai.models.generateContent({
        model,
        contents: promptText,
        config
      });

      if (response.text) {
        // Parse multi-payload response if applicable
        if (isMultiPayload && activeLabels.length > 1) {
          const parsed = parsePayloads(response.text, activeLabels);
          setOutputPayloads(parsed);
          setGeneratedPrompt(null); // Clear single-card output
        } else {
          setGeneratedPrompt(response.text);
          setOutputPayloads([]); // Clear multi-card output
        }
        saveToHistory(templateForHistory, userContent, response.text);
        triggerCelebration();
        showToastMessage(`Generated with ${mode.toUpperCase()} mode! 🧠`);
      } else {
        throw new Error("Received empty response from AI engine.");
      }
    } catch (error: any) {
      console.error("AI Generation Runtime Error:", error);
      showToastMessage(`AI Exception: ${error.message || 'Engine failed'}`, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [userContent, selectedTemplateId, selectedFormatId, selectedEngineFormats, templates, includeExamples, charLimit, saveToHistory, showToastMessage, getModifierPromptText, resolveActiveEngineLabels, parsePayloads]);

  // --- Output Interactions ---

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
    setSelectedTemplateId(newTemplate.id); 
    
    localStorage.setItem('custom_templates', JSON.stringify(updatedTemplates.filter(t => t.isCustom)));
    setIsModalOpen(false);
    showToastMessage('Template successfully documented! ★');
  }, [templates, showToastMessage]);

  const handleDeleteTemplate = useCallback((id: string) => {
    const updatedTemplates = templates.filter(t => t.id !== id);
    setTemplates(updatedTemplates);
    if (selectedTemplateId === id) setSelectedTemplateId(DEFAULT_TEMPLATES[0].id);
    
    localStorage.setItem('custom_templates', JSON.stringify(updatedTemplates.filter(t => t.isCustom)));
    showToastMessage('Template purged from environment.');
  }, [templates, selectedTemplateId, showToastMessage]);

  const handleRestoreFromHistory = useCallback((prompt: RecentPrompt) => {
      const templateExists = templates.some(t => t.id === prompt.templateId);
      if (templateExists) {
        setSelectedTemplateId(prompt.templateId);
      } else {
        showToastMessage('Orphaned template: Restoring isolated prompt content context.', 'info');
      }
      
      setUserContent(prompt.userContent);
      setGeneratedPrompt(prompt.generatedContent);
      if (window.innerWidth < 1024) setIsSidebarOpen(false);
      showToastMessage('State restored from history ledger! 🕒');
  }, [templates, showToastMessage]);

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
              selectedTemplateId={selectedTemplateId}
              selectedFormatId={selectedFormatId}
              userContent={userContent}
              includeExamples={includeExamples}
              charLimit={charLimit}
              onTemplateChange={(e) => setSelectedTemplateId(e.target.value)}
              onFormatChange={(e) => setSelectedFormatId(e.target.value)}
              onContentChange={(e) => setUserContent(e.target.value)}
              onExamplesChange={(e) => setIncludeExamples(e.target.checked)}
              onCharLimitChange={setCharLimit}
              onGenerate={() => handleAIGenerate('smart')}
              onAIGenerate={handleAIGenerate}
              isLoading={isLoading}
              onNewTemplate={() => setIsModalOpen(true)}
              onLoadSyntaxTest={() => {
                if (templates.some(t => t.id === 'direct-message')) setSelectedTemplateId('direct-message');
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
            />

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