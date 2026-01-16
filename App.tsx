import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import Header from './components/Header';
import Footer from './components/Footer';
import PromptForm from './components/PromptForm';
import OutputCard from './components/OutputCard';
import Toast from './components/Toast';
import Sidebar from './components/Sidebar';
import TemplateModal from './components/TemplateModal';
import { TEMPLATES as DEFAULT_TEMPLATES } from './constants';
import { ToastState, PromptTemplate, RecentPrompt } from './types';

const SYNTAX_TEST_DATA = `python
def validate_highlighting():  
    """Verify syntax colors for keywords, strings, and comments."""  
    sample_data = {"key": "value", "numbers": [1, 2, 3]}  
    if sample_data:  
        print(f"Highlighted correctly! {sample_data['key']}")  
    # TODO: This comment should appear in muted gray  
    return True`;

const App: React.FC = () => {
  // --- State ---
  const [templates, setTemplates] = useState<PromptTemplate[]>(DEFAULT_TEMPLATES);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(DEFAULT_TEMPLATES[0].id);
  const [userContent, setUserContent] = useState<string>('');
  const [includeExamples, setIncludeExamples] = useState<boolean>(false);
  const [charLimit, setCharLimit] = useState<number | null>(null);
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: 'success' });
  
  // Sidebar & History
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [recentPrompts, setRecentPrompts] = useState<RecentPrompt[]>([]);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // --- Effects ---

  // Load Custom Templates & History from LocalStorage on mount
  useEffect(() => {
    const savedTemplates = localStorage.getItem('custom_templates');
    if (savedTemplates) {
      try {
        const parsed = JSON.parse(savedTemplates);
        // Deduplicate in case defaults changed or IDs collide
        const customOnly = parsed.filter((p: PromptTemplate) => p.isCustom);
        setTemplates([...DEFAULT_TEMPLATES, ...customOnly]);
      } catch (e) {
        console.error("Failed to parse custom templates", e);
      }
    }

    const savedHistory = localStorage.getItem('recent_prompts');
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        setRecentPrompts(parsed);
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  // Handle Toast Timeout
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast(prev => ({ ...prev, show: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  // --- Handlers ---

  const showToastMessage = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ show: true, message, type });
  };

  const saveToHistory = (template: PromptTemplate, content: string, generated: string) => {
    // Prevent duplicates: Check if the latest entry is identical
    if (recentPrompts.length > 0) {
      const latest = recentPrompts[0];
      if (latest.templateId === template.id && latest.userContent === content) {
        return; // Don't save duplicate consecutive prompts
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

    const updatedHistory = [newEntry, ...recentPrompts].slice(0, 5); // Keep last 5
    setRecentPrompts(updatedHistory);
    localStorage.setItem('recent_prompts', JSON.stringify(updatedHistory));
  };

  const triggerCelebration = () => {
    // Joyful UI Palette for Confetti
    const joyfulColors = ['#FF6B9D', '#FF8E53', '#6B7BFF', '#FF3D7F', '#FFB3C6'];

    // 1. Immediate central burst
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: joyfulColors,
      disableForReducedMotion: true
    });

    // 2. Sustained side cannons
    const duration = 2500;
    const end = Date.now() + duration;

    const frame = () => {
      // Left cannon
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: joyfulColors
      });
      // Right cannon
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: joyfulColors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  const handleGenerate = useCallback(() => {
    if (!userContent.trim()) return;

    setIsLoading(true);
    
    setTimeout(() => {
      const template = templates.find(t => t.id === selectedTemplateId);
      
      if (template) {
        let finalPrompt = '';
        
        // Use custom placeholder trigger if present, otherwise default replacement or append
        const placeholder = template.placeholderTrigger || "{{content}}"; // Support the placeholder from modal

        if (template.content.includes(placeholder)) {
          finalPrompt = template.content.replace(placeholder, userContent);
        } else if (template.placeholderTrigger && template.content.includes(template.placeholderTrigger)) {
             // Fallback to strict placeholder from constants if defined there
             finalPrompt = template.content.replace(template.placeholderTrigger, userContent);
        } else {
          // If no specific placeholder found (or strict logic applies), append to a logical place or end
          finalPrompt = `${template.content}\n\n${userContent}`;
        }

        // --- Examples Feature Logic ---
        if (includeExamples) {
          finalPrompt += `\n\n### Requirement: Multiple Options\nPlease provide 4 distinct numbered examples (1-4) of the result, varying in tone, style, or approach to help me choose the best one.`;
        }

        // --- Character Constraint Feature Logic ---
        if (charLimit) {
           finalPrompt += `\n\n### Requirement: Length Constraint
Step 1: Carefully analyze & review to understand the provided text (see above).
Step 2: Count how many characters that text has.
Step 3: Provide me with a revised version of the text by MAKING THE TEXT EQUAL TO approximately ${charLimit} characters, while preserving the original meaning of the provided text.
Step 4: Provide the user with their desired output based on the aforementioned instructions.`;
        }

        setGeneratedPrompt(finalPrompt);
        saveToHistory(template, userContent, finalPrompt);
        triggerCelebration(); // 🎉 Trigger Confetti!
        showToastMessage('✨ Prompt Generated!');
      } else {
        showToastMessage('Error finding template', 'error');
      }
      
      setIsLoading(false);
    }, 800); // Slightly longer delay to build anticipation
  }, [selectedTemplateId, userContent, templates, recentPrompts, includeExamples, charLimit]);

  const handleCopy = async () => {
    if (generatedPrompt) {
      try {
        await navigator.clipboard.writeText(generatedPrompt);
        showToastMessage('Copied! ✅');
        
        // Mini confetti on copy
        confetti({
          particleCount: 40,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#6B7BFF', '#A5B4FC'], // Cooler colors for copy action
          disableForReducedMotion: true
        });
      } catch (err) {
        showToastMessage('Failed to copy', 'error');
      }
    }
  };

  const handleExport = (format: 'txt' | 'md') => {
    if (!generatedPrompt) return;
    
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    
    const timestamp = `${year}${month}${day}_${hours}${minutes}`;
    const filename = `prompt_${timestamp}.${format}`;
    const blob = new Blob([generatedPrompt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToastMessage(`Exported as .${format}`);
  };

  const handleSaveTemplate = (name: string, description: string, content: string) => {
    const customTemplates = templates.filter(t => t.isCustom);
    if (customTemplates.length >= 10) {
      showToastMessage('Max 10 custom templates allowed.', 'error');
      return;
    }

    const newTemplate: PromptTemplate = {
      id: `custom-${Date.now()}`,
      name,
      description,
      content,
      isCustom: true,
      placeholderTrigger: '{{content}}' // Default placeholder for custom templates
    };

    const updatedTemplates = [...templates, newTemplate];
    setTemplates(updatedTemplates);
    setSelectedTemplateId(newTemplate.id); // Auto-select new template
    
    // Save only custom templates to local storage
    localStorage.setItem('custom_templates', JSON.stringify(updatedTemplates.filter(t => t.isCustom)));
    
    setIsModalOpen(false);
    showToastMessage('Template saved! ★');
  };

  const handleDeleteTemplate = (id: string) => {
    const updatedTemplates = templates.filter(t => t.id !== id);
    setTemplates(updatedTemplates);
    
    if (selectedTemplateId === id) {
      setSelectedTemplateId(DEFAULT_TEMPLATES[0].id);
    }

    localStorage.setItem('custom_templates', JSON.stringify(updatedTemplates.filter(t => t.isCustom)));
    showToastMessage('Template deleted.');
  };

  const handleRestoreFromHistory = (prompt: RecentPrompt) => {
      // Check if template exists
      const templateExists = templates.some(t => t.id === prompt.templateId);
      if (templateExists) {
        setSelectedTemplateId(prompt.templateId);
      } else {
        showToastMessage('Original template missing, restoring content only.', 'info');
      }
      
      setUserContent(prompt.userContent);
      setGeneratedPrompt(prompt.generatedContent);
      
      // Auto-open sidebar on mobile, keep open on desktop
      if (window.innerWidth < 1024) setIsSidebarOpen(false);
      
      showToastMessage('Restored from history! 🕒');
  };

  const handleLoadSyntaxTest = () => {
      const dmTemplate = templates.find(t => t.id === 'direct-message');
      if (dmTemplate) {
          setSelectedTemplateId('direct-message');
      }
      setUserContent(SYNTAX_TEST_DATA);
      showToastMessage('Test data loaded. Click Generate!');
  };

  const handleClear = () => {
    setGeneratedPrompt(null);
    setUserContent('');
  };

  // Keyboard shortcut: Ctrl + Enter to generate
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        if (userContent.trim()) {
          handleGenerate();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [userContent, handleGenerate]);

  return (
    <div className="min-h-screen relative flex flex-col md:flex-row">
      
      {/* Sidebar Toggle (Mobile/Desktop) */}
      <button 
        onClick={() => setIsSidebarOpen(true)}
        className={`fixed top-4 right-4 z-30 p-2 bg-white/80 backdrop-blur rounded-full shadow-md text-gray-600 hover:text-purple-600 hover:scale-110 transition-all ${isSidebarOpen ? 'hidden' : 'block'}`}
        title="Recent Prompts"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>

      <div className="flex-grow py-8 px-4 sm:px-6 lg:px-8 transition-all duration-300">
        <div className="max-w-3xl mx-auto">
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
              isLoading={isLoading}
              onNewTemplate={() => setIsModalOpen(true)}
              onLoadSyntaxTest={handleLoadSyntaxTest}
              onDeleteTemplate={handleDeleteTemplate}
            />

            <OutputCard
              content={generatedPrompt}
              onCopy={handleCopy}
              onClear={handleClear}
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