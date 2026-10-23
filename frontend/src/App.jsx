import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import TickerTape from './components/TickerTape';
import MarketChart from './components/MarketChart';
import AgentDebateArena from './components/AgentDebateArena';
import CausalKnowledgeGraph from './components/CausalKnowledgeGraph';
import ExplainabilityPanel from './components/ExplainabilityPanel';
import HistoricalAnalogMatcher from './components/HistoricalAnalogMatcher';
import ScenarioSimulator from './components/ScenarioSimulator';
import PortfolioTester from './components/PortfolioTester';
import ResearchMemoViewer from './components/ResearchMemoViewer';
import CommandPalette from './components/CommandPalette';
import FavoritesTab from './components/FavoritesTab';

export default function App() {
  const [activeTab, setActiveTab] = useState('terminal');
  const [selectedAsset, setSelectedAsset] = useState('RELIANCE.NS'); // Default Indian Leader
  const [timeframe, setTimeframe] = useState('1M');
  const [currency, setCurrency] = useState('INR'); // Default INR ₹
  const [marketFilter, setMarketFilter] = useState('All');
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  // Favorites Watchlist with LocalStorage Persistence
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('ai_fios_favorites');
      return saved ? JSON.parse(saved) : ['RELIANCE.NS', 'TCS.NS', 'HDFCBANK.NS', 'NVDA', 'GC=F'];
    } catch {
      return ['RELIANCE.NS', 'TCS.NS', 'HDFCBANK.NS', 'NVDA', 'GC=F'];
    }
  });

  const toggleFavorite = (symbol) => {
    setFavorites((prev) => {
      const next = prev.includes(symbol)
        ? prev.filter((s) => s !== symbol)
        : [...prev, symbol];
      try {
        localStorage.setItem('ai_fios_favorites', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  // API Data States
  const [watchlist, setWatchlist] = useState([]);
  const [summary, setSummary] = useState(null);
  const [candles, setCandles] = useState([]);
  const [orderBook, setOrderBook] = useState(null);
  const [debateData, setDebateData] = useState(null);
  const [graphData, setGraphData] = useState(null);
  const [analogsData, setAnalogsData] = useState(null);

  const [loadingDebate, setLoadingDebate] = useState(false);
  const [loadingMarket, setLoadingMarket] = useState(false);

  // 1. Initial Load: Watchlist, Causal Graph, Historical Analogs
  useEffect(() => {
    fetchWatchlist(marketFilter, currency);
    fetchKnowledgeGraph();
    fetchHistoricalAnalogs();

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws/stream`;
    let ws;

    try {
      ws = new WebSocket(wsUrl);
      ws.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.type === 'TICKER_STREAM' && Array.isArray(payload.data)) {
            setWatchlist((prev) => {
              if (!prev || prev.length === 0) return payload.data;
              const map = new Map(payload.data.map(i => [i.symbol, i]));
              return prev.map(item => map.get(item.symbol) || item);
            });
          }
        } catch (e) {
          // ignore parsing error
        }
      };
    } catch (e) {
      console.warn('WebSocket connection error:', e);
    }

    return () => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, []);

  // 2. Fetch data when selectedAsset or currency changes
  useEffect(() => {
    if (selectedAsset) {
      fetchAssetSummary(selectedAsset, currency);
      fetchCandles(selectedAsset, timeframe, currency);
      fetchOrderBook(selectedAsset, currency);
      fetchDebate(selectedAsset, currency);
    }
  }, [selectedAsset, currency]);

  // 3. Timeframe change
  useEffect(() => {
    if (selectedAsset) {
      fetchCandles(selectedAsset, timeframe, currency);
    }
  }, [timeframe]);

  // 4. Market filter or currency change updates watchlist
  useEffect(() => {
    fetchWatchlist(marketFilter, currency);
  }, [marketFilter, currency]);

  const fetchWatchlist = async (filter, curr) => {
    try {
      const catParam = filter !== 'All' ? `&category=${encodeURIComponent(filter)}` : '';
      const res = await fetch(`/api/watchlist?currency=${curr}${catParam}`);
      if (res.ok) {
        const data = await res.json();
        setWatchlist(data);
      }
    } catch (err) {
      console.error('Watchlist fetch error:', err);
    }
  };

  const fetchAssetSummary = async (sym, curr) => {
    setLoadingMarket(true);
    try {
      const res = await fetch(`/api/asset/${sym}/summary?currency=${curr}`);
      if (res.ok) {
        const data = await res.json();
        setSummary(data);
      }
    } catch (err) {
      console.error('Summary fetch error:', err);
    } finally {
      setLoadingMarket(false);
    }
  };

  const fetchCandles = async (sym, tf, curr) => {
    try {
      const res = await fetch(`/api/asset/${sym}/candles?timeframe=${tf}&currency=${curr}`);
      if (res.ok) {
        const data = await res.json();
        setCandles(data);
      }
    } catch (err) {
      console.error('Candles fetch error:', err);
    }
  };

  const fetchOrderBook = async (sym, curr) => {
    try {
      const res = await fetch(`/api/asset/${sym}/orderbook?currency=${curr}`);
      if (res.ok) {
        const data = await res.json();
        setOrderBook(data);
      }
    } catch (err) {
      console.error('Orderbook fetch error:', err);
    }
  };

  const fetchDebate = async (sym, curr) => {
    setLoadingDebate(true);
    try {
      const res = await fetch(`/api/asset/${sym}/debate?currency=${curr}`);
      if (res.ok) {
        const data = await res.json();
        setDebateData(data);
      }
    } catch (err) {
      console.error('Debate fetch error:', err);
    } finally {
      setLoadingDebate(false);
    }
  };

  const fetchKnowledgeGraph = async () => {
    try {
      const res = await fetch('/api/knowledge-graph');
      if (res.ok) {
        const data = await res.json();
        setGraphData(data);
      }
    } catch (err) {
      console.error('Graph fetch error:', err);
    }
  };

  const fetchHistoricalAnalogs = async () => {
    try {
      const res = await fetch('/api/historical-analogs');
      if (res.ok) {
        const data = await res.json();
        setAnalogsData(data);
      }
    } catch (err) {
      console.error('Analogs fetch error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#060a12] text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedAsset={selectedAsset}
        setSelectedAsset={setSelectedAsset}
        watchlist={watchlist}
        currency={currency}
        setCurrency={setCurrency}
        marketFilter={marketFilter}
        setMarketFilter={setMarketFilter}
        onOpenCommandPalette={setIsCommandOpen}
        favorites={favorites}
      />

      {/* Global Command Palette (Ctrl + K) */}
      <CommandPalette
        isOpen={isCommandOpen}
        onClose={setIsCommandOpen}
        onSelectAsset={(sym) => setSelectedAsset(sym)}
        onSelectTab={(tabId) => setActiveTab(tabId)}
        watchlist={watchlist}
        currency={currency}
        onToggleCurrency={() => setCurrency(currency === 'INR' ? 'USD' : 'INR')}
        onTriggerVoice={() => {
          setActiveTab('debate');
        }}
      />

      {/* Real-Time Ticker Tape with ₹ INR formatting */}
      <TickerTape
        watchlist={watchlist}
        selectedAsset={selectedAsset}
        onSelectAsset={(sym) => setSelectedAsset(sym)}
        currency={currency}
      />

      {/* Main Terminal Viewport */}
      <main className="flex-1 px-3 sm:px-6 py-3.5 sm:py-6 max-w-[1720px] w-full mx-auto">
        {activeTab === 'terminal' && (
          <div className="flex flex-col gap-6">
            <MarketChart
              candles={candles}
              summary={summary}
              timeframe={timeframe}
              setTimeframe={setTimeframe}
              orderBook={orderBook}
              currency={currency}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
            />

            {/* Quick Agent Synthesis Preview inside Terminal */}
            {debateData && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                <div className="lg:col-span-8">
                  <ExplainabilityPanel
                    explainabilityData={debateData.explainability}
                    symbol={selectedAsset}
                    currency={currency}
                  />
                </div>
                <div className="lg:col-span-4 flex flex-col gap-3">
                  <div className="terminal-card p-5 rounded-2xl border-l-4 border-l-cyan-500 font-mono text-xs">
                    <span className="font-bold text-slate-200 uppercase tracking-wider block mb-1">
                      Quick Action Directives ({currency})
                    </span>
                    <p className="text-slate-300 leading-relaxed mb-4">
                      {debateData.judge_verdict?.judge_synthesis}
                    </p>
                    <button
                      onClick={() => setActiveTab('debate')}
                      className="w-full py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-bold transition-all text-xs cursor-pointer shadow-[0_0_10px_rgba(6,182,212,0.2)]"
                    >
                      Enter Multi-Agent Live Arena ➔
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'favorites' && (
          <FavoritesTab
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            watchlist={watchlist}
            onSelectAsset={(sym) => setSelectedAsset(sym)}
            onNavigateTab={(tabId) => setActiveTab(tabId)}
            currency={currency}
          />
        )}

        {activeTab === 'debate' && (
          <AgentDebateArena
            symbol={selectedAsset}
            debateData={debateData}
            loading={loadingDebate}
            onRunDebate={() => fetchDebate(selectedAsset, currency)}
            currency={currency}
          />
        )}

        {activeTab === 'graph' && (
          <CausalKnowledgeGraph
            graphData={graphData}
            selectedAsset={selectedAsset}
            onSelectNode={(nodeId) => {
              if (watchlist.some((w) => w.symbol === nodeId)) {
                setSelectedAsset(nodeId);
              }
            }}
          />
        )}

        {activeTab === 'explainability' && (
          <ExplainabilityPanel
            explainabilityData={debateData?.explainability}
            symbol={selectedAsset}
            currency={currency}
          />
        )}

        {activeTab === 'analogs' && (
          <HistoricalAnalogMatcher analogsData={analogsData} />
        )}

        {activeTab === 'scenario' && (
          <ScenarioSimulator />
        )}

        {activeTab === 'portfolio' && (
          <PortfolioTester currency={currency} />
        )}

        {activeTab === 'report' && (
          <ResearchMemoViewer symbol={selectedAsset} currency={currency} />
        )}
      </main>

      {/* Terminal Footer */}
      <footer className="border-t border-slate-900 bg-[#04070d] px-6 py-3 text-[10px] font-mono text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="text-emerald-500 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            ALL 8 LAYERS OPERATIONAL
          </span>
          <span>·</span>
          <span>CURRENCY: {currency} (₹ DEFAULT)</span>
          <span>·</span>
          <span>40+ ASSETS TRACKED</span>
          <span>·</span>
          <span>CAUSAL SHOCK ENGINE ACTIVE</span>
        </div>
        <div className="flex items-center gap-2">
          <span>AI-FIOS FINANCIAL INTELLIGENCE OPERATING SYSTEM</span>
          <span>·</span>
          <span className="text-slate-400">INSTITUTIONAL FLAGSHIP EDITION</span>
        </div>
      </footer>
    </div>
  );
}
