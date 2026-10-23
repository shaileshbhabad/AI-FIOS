import React, { useState } from 'react';
import { 
  Star, 
  Plus, 
  Trash2, 
  TrendingUp, 
  TrendingDown, 
  ExternalLink, 
  Cpu, 
  Activity, 
  Search, 
  Zap, 
  Check, 
  X,
  Layers,
  Sparkles
} from 'lucide-react';

export default function FavoritesTab({ 
  favorites = [], 
  onToggleFavorite, 
  watchlist = [], 
  onSelectAsset, 
  onNavigateTab, 
  currency = 'INR' 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const currSym = currency === 'INR' ? '₹' : '$';

  // Get full data for favorite symbols from watchlist
  const favoriteAssets = favorites.map((sym) => {
    const found = watchlist.find((w) => w.symbol === sym);
    return found || { symbol: sym, name: sym, price: 0, change: 0, change_percent: 0, sector: 'Equities', currency_symbol: currSym };
  });

  // Calculate average daily performance of favorite basket
  const avgPerf = favoriteAssets.length > 0
    ? (favoriteAssets.reduce((acc, curr) => acc + (curr.change_percent || 0), 0) / favoriteAssets.length).toFixed(2)
    : '0.00';
  const isBasketPositive = parseFloat(avgPerf) >= 0;

  // Assets available to add (not already in favorites)
  const availableToAdd = watchlist.filter(
    (w) => !favorites.includes(w.symbol) &&
    (w.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
     w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     w.sector.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex flex-col gap-5 font-mono text-xs">
      {/* Top Banner Ribbon */}
      <div className="terminal-card p-6 rounded-2xl border border-amber-500/30 bg-gradient-to-r from-[#120e06] via-[#0b0e17] to-[#120e06] relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40">
                <Star className="w-4 h-4 fill-current" />
              </div>
              <span className="text-xs font-bold tracking-widest text-amber-400 uppercase">
                CURATED FAVORITES & PRIORITY WATCHLIST
              </span>
            </div>

            <div className="flex items-baseline gap-3 flex-wrap">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-wide">
                {favorites.length} Tracked Assets
              </h2>
              <span className={`text-xs px-2.5 py-1 rounded-md font-bold flex items-center ${
                isBasketPositive ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
              }`}>
                {isBasketPositive ? <TrendingUp className="w-3.5 h-3.5 mr-1" /> : <TrendingDown className="w-3.5 h-3.5 mr-1" />}
                Basket Avg: {isBasketPositive ? '+' : ''}{avgPerf}% Today
              </span>
            </div>

            <p className="text-xs text-slate-400 mt-2 max-w-2xl leading-relaxed">
              Your customized financial workspace. Pin high-conviction securities here to monitor real-time prices, run committee debates, and audit risk in {currency}.
            </p>
          </div>

          {/* Add Asset Button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 font-black text-xs tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            ADD STOCK TO FAVORITES
          </button>
        </div>
      </div>

      {/* Favorites Assets Grid */}
      {favoriteAssets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {favoriteAssets.map((asset) => {
            const isPos = (asset.change_percent ?? asset.change ?? 0) >= 0;
            const itemSym = asset.currency_symbol || currSym;

            return (
              <div
                key={asset.symbol}
                className="terminal-card p-5 rounded-2xl border border-slate-800 hover:border-amber-500/50 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)] transition-all flex flex-col justify-between gap-4 group"
              >
                {/* Card Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-black text-slate-100 font-mono tracking-wide">
                        {asset.symbol}
                      </h3>
                      {asset.country === 'IN' && <span className="text-xs">🇮🇳</span>}
                      {asset.country === 'US' && <span className="text-xs">🇺🇸</span>}
                    </div>
                    <span className="text-xs text-slate-400 block mt-0.5 font-sans">
                      {asset.name}
                    </span>
                    <span className="inline-block text-[10px] text-slate-500 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 mt-1.5">
                      {asset.sector}
                    </span>
                  </div>

                  {/* Remove / Star Button */}
                  <button
                    onClick={() => onToggleFavorite(asset.symbol)}
                    className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-rose-500/20 hover:text-rose-400 hover:border-rose-500/40 transition-colors cursor-pointer"
                    title="Remove from favorites"
                  >
                    <Star className="w-4 h-4 fill-current" />
                  </button>
                </div>

                {/* Price & Change Display */}
                <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 flex items-baseline justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">SPOT PRICE</span>
                    <span className="text-2xl font-black text-slate-100">
                      {itemSym}{typeof asset.price === 'number' ? asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : asset.price}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 uppercase block">24H CHANGE</span>
                    <span className={`text-sm font-bold flex items-center justify-end ${isPos ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {isPos ? <TrendingUp className="w-3.5 h-3.5 mr-0.5 inline" /> : <TrendingDown className="w-3.5 h-3.5 mr-0.5 inline" />}
                      {isPos ? '+' : ''}{asset.change_percent}%
                    </span>
                  </div>
                </div>

                {/* Quick Diagnostics */}
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 rounded bg-slate-900/40 border border-slate-800">
                    <span className="text-slate-500 text-[10px] block">RSI (14)</span>
                    <span className="text-slate-300 font-bold">{asset.rsi ?? 52.0}</span>
                  </div>
                  <div className="p-2 rounded bg-slate-900/40 border border-slate-800">
                    <span className="text-slate-500 text-[10px] block">SIGNAL</span>
                    <span className={`font-bold ${asset.signal === 'BULLISH' ? 'text-emerald-400' : (asset.signal === 'BEARISH' ? 'text-rose-400' : 'text-slate-400')}`}>
                      {asset.signal || 'NEUTRAL'}
                    </span>
                  </div>
                </div>

                {/* Quick Action Navigation Buttons */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                  <button
                    onClick={() => {
                      onSelectAsset(asset.symbol);
                      onNavigateTab('terminal');
                    }}
                    className="flex-1 py-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold text-center flex items-center justify-center gap-1 cursor-pointer transition-all"
                  >
                    <Activity className="w-3.5 h-3.5" />
                    Open Chart
                  </button>

                  <button
                    onClick={() => {
                      onSelectAsset(asset.symbol);
                      onNavigateTab('debate');
                    }}
                    className="flex-1 py-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold text-center flex items-center justify-center gap-1 cursor-pointer transition-all"
                  >
                    <Cpu className="w-3.5 h-3.5" />
                    Run Debate
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="terminal-card p-12 rounded-2xl text-center flex flex-col items-center justify-center gap-3">
          <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Star className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-200">No Favorites Added Yet</h3>
          <p className="text-slate-400 max-w-md text-xs leading-relaxed">
            Click the "ADD STOCK TO FAVORITES" button above or click the star icon next to any stock symbol to build your priority watchlist.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold mt-2 cursor-pointer hover:bg-amber-400"
          >
            Add First Stock
          </button>
        </div>
      )}

      {/* Add Asset Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="terminal-card p-6 rounded-2xl max-w-xl w-full border border-amber-500/40 shadow-2xl bg-[#080d19]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-400 fill-current" />
                <h3 className="text-base font-bold text-slate-100">Add Stock to Favorites</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-100 cursor-pointer text-xs"
              >
                ✕ Close
              </button>
            </div>

            {/* Search Filter inside modal */}
            <div className="relative mb-4">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                autoFocus
                type="text"
                placeholder="Search by company or ticker (e.g. Reliance, TCS, Apple, NVDA, Gold)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* List of Available Assets */}
            <div className="max-h-80 overflow-y-auto flex flex-col gap-1.5 pr-1">
              {availableToAdd.length > 0 ? (
                availableToAdd.map((item) => (
                  <div
                    key={item.symbol}
                    className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between hover:bg-slate-800/60 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-100">{item.symbol}</span>
                        {item.country === 'IN' && <span className="text-[10px]">🇮🇳</span>}
                        {item.country === 'US' && <span className="text-[10px]">🇺🇸</span>}
                      </div>
                      <span className="text-[11px] text-slate-400 font-sans block">{item.name}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-bold text-slate-200">
                        {item.currency_symbol || currSym}{typeof item.price === 'number' ? item.price.toLocaleString() : item.price}
                      </span>
                      <button
                        onClick={() => {
                          onToggleFavorite(item.symbol);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/50 font-bold flex items-center gap-1 cursor-pointer transition-all text-[11px]"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-slate-500 py-8">
                  All matching assets are already in your favorites!
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 text-right">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 cursor-pointer font-bold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
