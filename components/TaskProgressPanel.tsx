import React from 'react';
import { PromptTaskState } from '../types';

interface Props {
  tasks: PromptTaskState[];
}

const TaskProgressPanel: React.FC<Props> = ({ tasks }) => {
  return (
    <div className="mb-8 w-full glass-panel p-5 rounded-2xl animate-fade-in-up border border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.1)]">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl animate-spin-slow inline-block">⚙️</span>
        <h3 className="text-lg font-bold bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(135deg, #FF6B9D, #A855F7, #22D3EE)' }}>
          Processing Pipelines
        </h3>
        <span className="ml-auto text-xs font-bold px-3 py-1 bg-slate-800/80 rounded-lg text-slate-400 border border-slate-700/50 font-mono shadow-[inset_0_2px_10px_rgba(0,0,0,0.3)]">
          {tasks.filter(t => t.status === 'completed').length} / {tasks.length} COMPLETE
        </span>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {tasks.map(task => (
          <div key={task.templateId} className={`bg-slate-800/80 border rounded-xl p-3 flex items-center justify-between relative overflow-hidden group transition-all duration-300
            ${task.status === 'processing' ? 'border-indigo-500/40 shadow-[0_0_15px_rgba(99,102,241,0.15)] scale-[1.02]' : 'border-slate-700'}
            ${task.status === 'completed' ? 'border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.1)]' : ''}
            ${task.status === 'failed' ? 'border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.1)]' : ''}
          `}>
            {task.status === 'processing' && (
              <div className="absolute bottom-0 left-0 h-[2px] bg-indigo-500 w-1/2 animate-pulse transition-all"></div>
            )}
            {task.status === 'completed' && (
              <div className="absolute bottom-0 left-0 h-[2px] bg-emerald-500 w-full transition-all duration-500"></div>
            )}
            {task.status === 'failed' && (
              <div className="absolute bottom-0 left-0 h-[2px] bg-red-500 w-full transition-all"></div>
            )}
            
            <div className="flex flex-col z-10 w-[85%]">
              <span className="text-sm font-bold text-slate-200 truncate">{task.templateName}</span>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider
                  ${task.status === 'queued' ? 'bg-slate-700/50 text-slate-400' : ''}
                  ${task.status === 'processing' ? 'bg-indigo-500/20 text-indigo-300 animate-pulse border border-indigo-500/30' : ''}
                  ${task.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : ''}
                  ${task.status === 'failed' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : ''}
                `}>
                  {task.status}
                </span>
                {task.error && (
                  <span className="text-[10px] text-red-400 truncate opacity-80" title={task.error}>
                    {task.error}
                  </span>
                )}
              </div>
            </div>
            
            <div className="h-8 w-8 rounded-full flex items-center justify-center bg-slate-900 border border-slate-700/50 flex-shrink-0 relative z-10 shadow-[inner_0_2px_5px_rgba(0,0,0,0.5)]">
              {task.status === 'queued' && <span className="text-[14px]">⏳</span>}
              {task.status === 'processing' && <span className="text-[14px] animate-spin-slow">☄️</span>}
              {task.status === 'completed' && <span className="text-[14px]">✨</span>}
              {task.status === 'failed' && <span className="text-[14px]">⚠️</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskProgressPanel;
