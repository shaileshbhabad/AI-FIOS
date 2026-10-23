import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function TickerTape({ 
  watchlist = [], 
  selectedAsset, 
  onSelectAsset,
  currency = 'INR'
}) {
  if (!watchlist || watchlist.length === 0) return null;

  const currSym = currency === 'INR' ? '₹' : '$';

  return (
    <div className="bg-[#04070d] border-b border-slate-800/80 overflow-hidden select-none py-1.5 px-3">
      <div className="flex items-center gap-4 overflow-x-auto scrollbar-none py-0.5">
        <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 px-2.5 py-1 rounded-md uppercase tracking-wider shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.2)]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          REAL-TIME TICKER ({currency})
        </div>

        {watchlist.map((item) => {
          const isSelected = selectedAsset === item.symbol;
          const isPositive = (item.change_percent ?? item.change ?? 0) >= 0;
          const itemSymbol = item.currency === '%' ? '' : (item.currency_symbol || currSym);
          const unit = item.currency === '%' ? '%' : '';

          return (
            <button
              key={item.symbol}
              onClick={() => onSelectAsset(item.symbol)}
              className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-all shrink-0 font-mono text-xs cursor-pointer ${
                isSelected
                  ? 'bg-slate-800 border border-cyan-500/60 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                  : 'bg-slate-900/50 border border-slate-800/50 hover:bg-slate-800/50 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-1">
                <span className="font-bold text-slate-200">{item.symbol}</span>
                {item.country === 'IN' && <span className="text-[10px]">🇮🇳</span>}
                {item.country === 'US' && <span className="text-[10px]">🇺🇸</span>}
              </div>

              <span className="text-slate-300 font-semibold">
                {itemSymbol}{typeof item.price === 'number' ? item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : item.price}{unit}
              </span>

              <span className={`flex items-center text-[11px] font-bold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isPositive ? <TrendingUp className="w-3 h-3 mr-0.5 inline" /> : <TrendingDown className="w-3 h-3 mr-0.5 inline" />}
                {isPositive ? '+' : ''}{item.change_percent}%
              </span>

              {item.signal && (
                <span className={`text-[8px] px-1 py-0.2 rounded font-sans uppercase font-bold tracking-tight ${
                  item.signal === 'BULLISH'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                    : item.signal === 'BEARISH'
                    ? 'bg-rose-950 text-rose-300 border border-rose-800/60'
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {item.signal}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
