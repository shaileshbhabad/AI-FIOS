import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Terminal, 
  Cpu, 
  Network, 
  Layers, 
  Compass, 
  Sliders, 
  Briefcase, 
  FileText, 
  IndianRupee, 
  DollarSign, 
  Volume2, 
  X,
  TrendingUp,
  Zap
} from 'lucide-react';

export default function CommandPalette({ 
  isOpen, 
  onClose, 
  onSelectAsset, 
  onSelectTab, 
  watchlist = [], 
  onToggleCurrency,
  currency = 'INR',
  onTriggerVoice 
}) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClose(!isOpen);
      }
      if (e.key === 'Escape' && isOpen) {
        onClose(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredAssets = watchlist.filter((a) =>
    a.symbol.toLowerCase().includes(query.toLowerCase()) ||
    a.name.toLowerCase().includes(query.toLowerCase()) ||
    a.sector.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 8);

  const actions = [
    { id: 'tab-terminal', label: 'Go to Market Terminal & Charts', icon: Terminal, action: () => { onSelectTab('terminal'); onClose(false); } },
    { id: 'tab-debate', label: 'Go to Multi-Agent Debate Arena', icon: Cpu, action: () => { onSelectTab('debate'); onClose(false); } },
    { id: 'tab-graph', label: 'Go to Causal Knowledge Graph', icon: Network, action: () => { onSelectTab('graph'); onClose(false); } },
    { id: 'tab-xai', label: 'Go to Trust & Explainability (XAI)', icon: Layers, action: () => { onSelectTab('explainability'); onClose(false); } },
    { id: 'tab-scenario', label: 'Go to Macro Scenario Studio ("What-If")', icon: Sliders, action: () => { onSelectTab('scenario'); onClose(false); } },
    { id: 'tab-report', label: 'Go to Autonomous Research Memos', icon: FileText, action: () => { onSelectTab('report'); onClose(false); } },
    { id: 'toggle-curr', label: `Switch Currency to ${currency === 'INR' ? 'USD ($)' : 'INR (₹)'}`, icon: currency === 'INR' ? DollarSign : IndianRupee, action: () => { onToggleCurrency(); onClose(false); } },
    { id: 'voice-briefing', label: 'Read Executive Briefing Aloud (AI Voice)', icon: Volume2, action: () => { onTriggerVoice(); onClose(false); } }
  ].filter(a => a.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/80 backdrop-blur-md font-mono text-xs animate-fadeIn">
      <div className="terminal-card w-full max-w-2xl rounded-2xl border border-cyan-500/40 shadow-[0_0_50px_rgba(6,182,212,0.25)] overflow-hidden bg-[#070b14]">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 p-4 border-b border-slate-800 bg-slate-900/60">
          <Search className="w-5 h-5 text-cyan-400" />
          <input
            autoFocus
            type="text"
            placeholder="Type a stock symbol, company, action, or command (e.g. Reliance, TCS, Debate, USD)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-slate-100 placeholder:text-slate-500 focus:outline-none text-sm font-mono"
          />
          <kbd className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 border border-slate-700">ESC</kbd>
        </div>

        {/* Content Lists */}
        <div className="max-h-[420px] overflow-y-auto p-3 flex flex-col gap-3">
          {/* Matching Assets */}
          {filteredAssets.length > 0 && (
            <div>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block mb-1.5 px-2">
                Matching Assets & Securities
              </span>
              <div className="flex flex-col gap-1">
                {filteredAssets.map((asset) => (
                  <button
                    key={asset.symbol}
                    onClick={() => {
                      onSelectAsset(asset.symbol);
                      onClose(false);
                    }}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/70 border border-transparent hover:border-slate-700 transition-colors text-left cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Zap className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
                      <div>
                        <span className="font-bold text-slate-200">{asset.symbol}</span>
                        <span className="text-slate-400 text-[11px] ml-2">({asset.name})</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-300 font-bold">
                        {asset.currency_symbol}{asset.price?.toLocaleString()}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                        {asset.sector}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions & Navigation */}
          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block mb-1.5 px-2">
              System Actions & Workspaces
            </span>
            <div className="flex flex-col gap-1">
              {actions.map((act) => {
                const Icon = act.icon;
                return (
                  <button
                    key={act.id}
                    onClick={act.action}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/30 text-slate-300 hover:text-cyan-300 transition-all text-left cursor-pointer"
                  >
                    <Icon className="w-4 h-4 text-cyan-400" />
                    <span className="font-semibold text-xs">{act.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Shortcut Hints */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/60 flex items-center justify-between text-[10px] text-slate-500">
          <span>Navigate with mouse or arrow keys</span>
          <span>Press <kbd className="text-slate-400 font-bold">Ctrl + K</kbd> anytime to open</span>
        </div>
      </div>
    </div>
  );
}
