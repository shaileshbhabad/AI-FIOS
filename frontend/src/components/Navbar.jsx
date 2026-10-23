import React, { useState } from 'react';
import { 
  Activity, 
  Cpu, 
  Network, 
  Layers, 
  Compass, 
  Sliders, 
  Briefcase, 
  FileText, 
  Search,
  Zap,
  Globe2,
  Key,
  IndianRupee,
  DollarSign,
  Check,
  X
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  selectedAsset, 
  setSelectedAsset, 
  watchlist = [],
  currency = 'INR',
  setCurrency,
  marketFilter = 'All',
  setMarketFilter
}) {
  const [showSettings, setShowSettings] = useState(false);
  const [provider, setProvider] = useState('groq');
  const [apiKey, setApiKey] = useState('');
  const [savedKeyMsg, setSavedKeyMsg] = useState('');
  const [loadingSave, setLoadingSave] = useState(false);

  const tabs = [
    { id: 'terminal', label: 'Terminal', icon: Activity },
    { id: 'debate', label: 'Agent Arena', icon: Cpu },
    { id: 'graph', label: 'Causal Graph', icon: Network },
    { id: 'explainability', label: 'Trust & XAI', icon: Layers },
    { id: 'analogs', label: 'Historical Analogs', icon: Compass },
    { id: 'scenario', label: 'Scenario Studio', icon: Sliders },
    { id: 'portfolio', label: 'Portfolio Risk', icon: Briefcase },
    { id: 'report', label: 'Research Memos', icon: FileText }
  ];

  const handleSaveApiKey = async () => {
    setLoadingSave(true);
    try {
      const res = await fetch('/api/settings/llm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider, api_key: apiKey })
      });
      if (res.ok) {
        setSavedKeyMsg('API Key Connected Successfully!');
        setTimeout(() => {
          setSavedKeyMsg('');
          setShowSettings(false);
        }, 1500);
      }
    } catch (e) {
      setSavedKeyMsg('Failed to connect API key.');
    } finally {
      setLoadingSave(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#060a12]/95 backdrop-blur-md border-b border-slate-800/80 px-4 py-2.5">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        {/* Brand & Market Badges */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 via-cyan-500/20 to-blue-600/30 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <Zap className="w-5 h-5 text-emerald-400 animate-pulse" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#060a12]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-wider bg-gradient-to-r from-emerald-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
                  AI-FIOS
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold">
                  FLAGSHIP v2.0
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono hidden sm:block">
                AI FINANCIAL INTELLIGENCE OPERATING SYSTEM · REAL-TIME WORKSPACE
              </p>
            </div>
          </div>

          {/* Mobile Currency / Filter */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setCurrency(currency === 'INR' ? 'USD' : 'INR')}
              className="px-2 py-1 bg-slate-900 border border-slate-700 text-xs font-mono text-cyan-300 rounded font-bold"
            >
              {currency === 'INR' ? '₹ INR' : '$ USD'}
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Global Controls & Controls Ribbon */}
        <div className="hidden lg:flex items-center gap-2.5">
          {/* Dual Market Filter */}
          <div className="flex items-center bg-slate-900/90 border border-slate-800 rounded-lg p-0.5 text-xs font-mono">
            <button
              onClick={() => setMarketFilter('All')}
              className={`px-2 py-1 rounded transition-colors ${marketFilter === 'All' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
            >
              All
            </button>
            <button
              onClick={() => setMarketFilter('Indian Equities')}
              className={`px-2 py-1 rounded transition-colors flex items-center gap-1 ${marketFilter === 'Indian Equities' ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
            >
              🇮🇳 India
            </button>
            <button
              onClick={() => setMarketFilter('US Equities')}
              className={`px-2 py-1 rounded transition-colors flex items-center gap-1 ${marketFilter === 'US Equities' ? 'bg-blue-500/20 text-blue-300 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
            >
              🇺🇸 US
            </button>
          </div>

          {/* Currency Toggle (Default INR ₹) */}
          <button
            onClick={() => setCurrency(currency === 'INR' ? 'USD' : 'INR')}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold hover:bg-emerald-500/20 transition-all cursor-pointer shadow-[0_0_10px_rgba(16,185,129,0.15)]"
            title="Toggle Currency (Default: Indian Rupee ₹)"
          >
            {currency === 'INR' ? <IndianRupee className="w-3.5 h-3.5" /> : <DollarSign className="w-3.5 h-3.5" />}
            <span>{currency === 'INR' ? '₹ INR (Default)' : '$ USD'}</span>
          </button>

          {/* Search Asset Dropdown */}
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
            <select
              value={selectedAsset}
              onChange={(e) => setSelectedAsset(e.target.value)}
              className="pl-8 pr-4 py-1.5 bg-slate-900/90 border border-slate-700 hover:border-slate-600 text-xs text-slate-200 rounded-lg font-mono focus:outline-none focus:border-cyan-500 transition-colors cursor-pointer max-w-[190px]"
            >
              <optgroup label="🇮🇳 Indian Bluechips (Nifty 50)">
                <option value="RELIANCE.NS">RELIANCE.NS · Reliance</option>
                <option value="TCS.NS">TCS.NS · Tata Consultancy</option>
                <option value="HDFCBANK.NS">HDFCBANK.NS · HDFC Bank</option>
                <option value="INFY.NS">INFY.NS · Infosys</option>
                <option value="ICICIBANK.NS">ICICIBANK.NS · ICICI Bank</option>
                <option value="SBIN.NS">SBIN.NS · State Bank of India</option>
                <option value="BHARTIARTL.NS">BHARTIARTL.NS · Airtel</option>
                <option value="ITC.NS">ITC.NS · ITC Ltd</option>
                <option value="LT.NS">LT.NS · Larsen & Toubro</option>
                <option value="AXISBANK.NS">AXISBANK.NS · Axis Bank</option>
                <option value="KOTAKBANK.NS">KOTAKBANK.NS · Kotak Bank</option>
                <option value="MARUTI.NS">MARUTI.NS · Maruti Suzuki</option>
                <option value="BAJFINANCE.NS">BAJFINANCE.NS · Bajaj Fin</option>
                <option value="HCLTECH.NS">HCLTECH.NS · HCL Tech</option>
                <option value="ASIANPAINT.NS">ASIANPAINT.NS · Asian Paints</option>
                <option value="^NSEI">^NSEI · NIFTY 50</option>
                <option value="^BSESN">^BSESN · SENSEX</option>
              </optgroup>
              <optgroup label="🇺🇸 US Mega-Caps">
                <option value="NVDA">NVDA · NVIDIA</option>
                <option value="AAPL">AAPL · Apple</option>
                <option value="MSFT">MSFT · Microsoft</option>
                <option value="TSLA">TSLA · Tesla</option>
                <option value="GOOGL">GOOGL · Alphabet</option>
                <option value="AMZN">AMZN · Amazon</option>
                <option value="META">META · Meta</option>
              </optgroup>
              <optgroup label="🌐 Global Commodities & FX">
                <option value="CL=F">CL=F · WTI Crude</option>
                <option value="GC=F">GC=F · Gold Futures</option>
                <option value="BTC-USD">BTC-USD · Bitcoin</option>
                <option value="^TNX">^TNX · US 10Y Yield</option>
                <option value="INR=X">INR=X · USD/INR</option>
              </optgroup>
            </select>
          </div>

          {/* Hybrid AI Model / API Key Button */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-500 text-xs font-mono text-cyan-300 transition-all cursor-pointer"
            title="Configure Hybrid LLM / Custom API Keys"
          >
            <Key className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI Models</span>
          </button>
        </div>
      </div>

      {/* Hybrid LLM Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 font-mono text-xs">
          <div className="terminal-card p-6 rounded-2xl max-w-md w-full border border-cyan-500/40 shadow-2xl relative">
            <button
              onClick={() => setShowSettings(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-100"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <Key className="w-5 h-5 text-cyan-400" />
              <h3 className="text-base font-bold text-slate-100">Hybrid AI Inference Settings</h3>
            </div>

            <p className="text-slate-400 text-[11px] leading-relaxed mb-4">
              AI-FIOS runs automatically with its built-in high-accuracy financial foundation model (zero configuration required). You can optionally plug in your own API key to power live generative agent debates!
            </p>

            <div className="flex flex-col gap-3">
              <div>
                <label className="text-slate-300 block mb-1">Select AI Provider:</label>
                <select
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="builtin">AI-FIOS Foundation Engine (Built-in, No Key Needed)</option>
                  <option value="groq">Groq (Llama-3.3 70B - Lightning Fast)</option>
                  <option value="openai">OpenAI (GPT-4o / GPT-4o-mini)</option>
                  <option value="deepseek">DeepSeek (DeepSeek-Chat / R1)</option>
                </select>
              </div>

              {provider !== 'builtin' && (
                <div>
                  <label className="text-slate-300 block mb-1">Enter API Key:</label>
                  <input
                    type="password"
                    placeholder="sk-..."
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-cyan-500 placeholder:text-slate-600"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Your API key is kept securely in memory for the active session.
                  </span>
                </div>
              )}

              {savedKeyMsg && (
                <div className="p-2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-center font-bold">
                  {savedKeyMsg}
                </div>
              )}

              <div className="flex justify-end gap-2 mt-2">
                <button
                  onClick={() => setShowSettings(false)}
                  className="px-3 py-1.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveApiKey}
                  disabled={loadingSave}
                  className="px-4 py-1.5 rounded bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 flex items-center gap-1.5 shadow-[0_0_10px_rgba(6,182,212,0.3)]"
                >
                  {loadingSave ? 'Connecting...' : 'Save & Activate'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
