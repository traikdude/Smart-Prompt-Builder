import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { GoogleGenAI } from "@google/genai";

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import PromptForm from './components/PromptForm';
import OutputCard from './components/OutputCard';
import Toast from './components/Toast';
import Sidebar from './components/Sidebar';
import TemplateModal from './components/TemplateModal';

// Types & Constants
import { TEMPLATES as DEFAULT_TEMPLATES } from './constants';
import { ToastState, PromptTemplate, RecentPrompt } from './types';

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
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(DEFAULT_TEMPLATES[0].id);
  const [userContent, setUserContent] = useState<string>('');
  const [includeExamples, setIncludeExamples] = useState<boolean>(false);
  const [charLimit, setCharLimit] = useState<number | null>(null);
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: 'success' });
  
  // UI States
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [recentPrompts, setRecentPrompts] = useState<RecentPrompt[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

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
        const template = templates.find(t => t.id === selectedTemplateId);
        if (!template) throw new Error("Template mapping failure.");

        let finalPrompt = '';
        const placeholder = template.placeholderTrigger || "{{content}}"; 

        if (template.content.includes(placeholder)) {
          finalPrompt = template.content.replace(placeholder, userContent);
        } else {
          finalPrompt = `${template.content}\n\n${userContent}`;
        }

        if (includeExamples) {
          finalPrompt += `\n\n### Requirement: Multiple Options\nPlease provide 4 distinct numbered versions (1-4) of the result, varying in tone, style, or approach to help me choose the best one.`;
        }

        if (charLimit) {
           finalPrompt += `\n\n### Requirement: Length Constraint\nStep 1: Carefully analyze meaning.\nStep 2: Rewrite text to EQUAL approximately ${charLimit} characters.`;
        }

        setGeneratedPrompt(finalPrompt);
        saveToHistory(template, userContent, finalPrompt);
        triggerCelebration(); 
        showToastMessage('✨ Prompt Generated!');
      } catch (error) {
        console.error("Generation logic failed:", error);
        showToastMessage('Error generating prompt', 'error');
      } finally {
        setIsLoading(false);
      }
    }, 400); 
  }, [selectedTemplateId, userContent, templates, includeExamples, charLimit, saveToHistory, showToastMessage]);

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
      const template = templates.find(t => t.id === selectedTemplateId);
      if (!template) throw new Error("Template not found");
      
      const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error("API Key not found in environment securely.");
      
      const ai = new GoogleGenAI({ apiKey });
      
      const modelMap = {
        'fast': 'gemini-2.5-flash',
        'smart': 'gemini-2.5-flash',
        'thinking': 'gemini-2.5-pro'
      };
      
      const model = modelMap[mode];
      const config: any = {
        systemInstruction: "You are an expert prompt engineer. Your goal is to generate a high-quality, optimized prompt based on a given template and user input. The output should be ready to use.",
      };

      if (mode === 'thinking') config.thinkingConfig = { thinkingBudget: 1024 }; // Optimized budget for 2.5 Pro

      let promptText = `TASK: Transform User Content into a structured prompt based on the Template.\nTEMPLATE NAME: ${template.name}\nTEMPLATE STRUCTURE: \n${template.content}\nUSER CONTENT:\n${userContent}\nINSTRUCTIONS:\n1. Apply User Content to Template structure.\n2. Optimize phrasing for clarity.\n3. Ensure semantic flow.`;

      if (includeExamples) promptText += "\nRequirement: Provide 4 distinct numbered variations.";
      if (charLimit) promptText += `\nRequirement: Target length is approximately ${charLimit} characters.`;

      const response = await ai.models.generateContent({
        model,
        contents: promptText,
        config
      });

      if (response.text) {
        setGeneratedPrompt(response.text);
        saveToHistory(template, userContent, response.text);
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
  }, [userContent, selectedTemplateId, templates, includeExamples, charLimit, saveToHistory, showToastMessage]);

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
        className={`fixed top-3 right-3 sm:top-4 sm:right-4 z-30 p-2.5 bg-white/80 backdrop-blur rounded-full shadow-md text-gray-600 hover:text-purple-600 hover:scale-110 transition-all active:scale-95 ${isSidebarOpen ? 'hidden' : 'block'}`}
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
              userContent={userContent}
              includeExamples={includeExamples}
              charLimit={charLimit}
              onTemplateChange={(e) => setSelectedTemplateId(e.target.value)}
              onContentChange={(e) => setUserContent(e.target.value)}
              onExamplesChange={(e) => setIncludeExamples(e.target.checked)}
              onCharLimitChange={setCharLimit}
              onGenerate={handleGenerate}
              onAIGenerate={handleAIGenerate}
              isLoading={isLoading}
              onNewTemplate={() => setIsModalOpen(true)}
              onLoadSyntaxTest={() => {
                if (templates.some(t => t.id === 'direct-message')) setSelectedTemplateId('direct-message');
                setUserContent(SYNTAX_TEST_DATA);
                showToastMessage('Validation syntax payload loaded against scope.');
              }}
              onDeleteTemplate={handleDeleteTemplate}
            />

            <OutputCard
              content={generatedPrompt}
              onCopy={handleCopy}
              onClear={() => { setGeneratedPrompt(null); setUserContent(''); }}
              onExport={handleExport}
            />
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