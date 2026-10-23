import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Layers, 
  Sliders, 
  Eye, 
  EyeOff,
  Calculator,
  DollarSign,
  IndianRupee,
  Activity,
  Maximize2,
  Star
} from 'lucide-react';

export default function MarketChart({ 
  candles = [], 
  summary = {}, 
  timeframe = '1M', 
  setTimeframe, 
  orderBook = {},
  currency = 'INR',
  favorites = [],
  onToggleFavorite
}) {
  const [showSMA, setShowSMA] = useState(true);
  const [showBB, setShowBB] = useState(false);
  const [showVolume, setShowVolume] = useState(true);
  const [activeIndicator, setActiveIndicator] = useState('rsi');
  
  // Interactive Position & Profit Simulator State
  const [showCalculator, setShowCalculator] = useState(false);
  const [investedCapital, setInvestedCapital] = useState(100000); // 1 Lakh INR default
  const [targetMovePct, setTargetMovePct] = useState(10.0); // +10% target

  const currSymbol = summary?.currency_symbol || (currency === 'INR' ? '₹' : '$');
  const currentPrice = summary?.display_price ?? summary?.current_price ?? 0;
  const priceChange = summary?.display_change ?? summary?.price_change ?? 0;
  const changePct = summary?.change_percent ?? 0;
  const isPositive = priceChange >= 0;
  const unit = summary?.symbol === '^TNX' ? '%' : '';

  // Simulator Calculations
  const shareCount = currentPrice > 0 ? Math.floor(investedCapital / currentPrice) : 0;
  const simulatedTargetPrice = currentPrice * (1 + (targetMovePct / 100.0));
  const simulatedProfit = (simulatedTargetPrice - currentPrice) * shareCount;
  const stopLossPct = summary?.historical_volatility ? (summary.historical_volatility * 0.35) : 5.0;
  const maxRiskLoss = investedCapital * (stopLossPct / 100.0);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#090f1d]/95 border border-slate-700 p-3 rounded-xl shadow-2xl font-mono text-xs backdrop-blur-md">
          <div className="text-slate-400 font-semibold mb-1">{label}</div>
          <div className="text-emerald-400 font-bold text-sm">
            Close: {currSymbol}{data.close?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{unit}
          </div>
          <div className="text-slate-300 text-[11px] mt-0.5">
            High: {currSymbol}{data.high?.toLocaleString()} | Low: {currSymbol}{data.low?.toLocaleString()}
          </div>
          {data.sma20 && (
            <div className="text-cyan-400 text-[11px]">SMA 20: {currSymbol}{data.sma20?.toLocaleString()}</div>
          )}
          {data.rsi && (
            <div className="text-violet-400 text-[11px]">RSI(14): {data.rsi?.toFixed(1)}</div>
          )}
          {data.volume && (
            <div className="text-slate-400 text-[11px]">Vol: {(data.volume / 1e6).toFixed(2)}M</div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col gap-3.5 sm:gap-5">
      {/* Top Asset Header Card (Spacious on Mobile & Desktop) */}
      <div className="terminal-card p-4 sm:p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          {/* Row 1: Symbol + Favorite + Signal */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-wide font-mono">
              {summary?.symbol || 'RELIANCE.NS'}
            </h1>

            {/* Favorite Star Toggle Button */}
            {onToggleFavorite && (
              <button
                onClick={() => onToggleFavorite(summary?.symbol || 'RELIANCE.NS')}
                className={`p-2 rounded-xl border transition-all cursor-pointer active:scale-95 ${
                  favorites.includes(summary?.symbol || 'RELIANCE.NS')
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/50 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                    : 'bg-slate-900 text-slate-500 border-slate-800 hover:text-amber-400 hover:border-slate-700'
                }`}
                title={favorites.includes(summary?.symbol || 'RELIANCE.NS') ? 'Remove from Favorites' : 'Add to Favorites'}
              >
                <Star className={`w-4 h-4 ${favorites.includes(summary?.symbol || 'RELIANCE.NS') ? 'fill-current' : ''}`} />
              </button>
            )}

            <span className={`text-[11px] font-mono px-2.5 py-1 rounded-lg font-bold uppercase tracking-wider ${
              summary?.signal === 'BULLISH'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                : summary?.signal === 'BEARISH'
                ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                : 'bg-slate-800 text-slate-300'
            }`}>
              {summary?.signal || 'NEUTRAL'}
            </span>

            <span className="text-[11px] font-mono px-2 py-1 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">
              {currency} ({currSymbol})
            </span>
          </div>

          {/* Row 2: Company Name */}
          <div className="text-sm text-slate-300 font-medium">
            {summary?.name || 'Reliance Industries'}
          </div>

          {/* Row 3: Price Display + Daily Change */}
          <div className="flex items-baseline gap-3 sm:gap-4 mt-1 font-mono flex-wrap">
            <span className="text-3xl sm:text-4xl font-black text-slate-100 tracking-tight">
              {currSymbol}{typeof currentPrice === 'number' ? currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : currentPrice}{unit}
            </span>
            <span className={`text-sm sm:text-base font-bold flex items-center px-2 py-0.5 rounded-lg ${isPositive ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'}`}>
              {isPositive ? <TrendingUp className="w-4 h-4 mr-1 inline" /> : <TrendingDown className="w-4 h-4 mr-1 inline" />}
              {isPositive ? '+' : ''}{priceChange.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({isPositive ? '+' : ''}{changePct.toFixed(2)}%)
            </span>
            <span className="text-xs text-slate-500 font-mono hidden sm:inline">
              LIVE · {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>

        {/* Timeframe & Overlays Ribbon (Full Width on Mobile) */}
        <div className="flex flex-col gap-2.5 sm:gap-3 w-full md:w-auto">
          {/* Timeframes: Equal Stretch Buttons on Mobile */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 w-full md:w-auto">
            {['1D', '5D', '1M', '6M', '1Y'].map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`flex-1 md:flex-initial px-3 sm:px-3.5 py-2 text-xs font-mono rounded-lg font-bold transition-all cursor-pointer text-center active:scale-95 ${
                  timeframe === tf
                    ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Overlays & Calculator Toggle (Touch-Friendly) */}
          <div className="flex items-center gap-2 text-xs font-mono">
            <button
              onClick={() => setShowSMA(!showSMA)}
              className={`flex-1 md:flex-initial px-3 py-2 rounded-xl border transition-colors flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 ${
                showSMA
                  ? 'bg-cyan-950/70 text-cyan-300 border-cyan-800'
                  : 'bg-slate-900 text-slate-500 border-slate-800'
              }`}
            >
              SMA {showSMA ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => setShowBB(!showBB)}
              className={`flex-1 md:flex-initial px-3 py-2 rounded-xl border transition-colors flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 ${
                showBB
                  ? 'bg-violet-950/70 text-violet-300 border-violet-800'
                  : 'bg-slate-900 text-slate-500 border-slate-800'
              }`}
            >
              BBands {showBB ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => setShowCalculator(!showCalculator)}
              className={`flex-1 md:flex-initial px-3 py-2 rounded-xl border transition-all flex items-center justify-center gap-1.5 cursor-pointer font-bold active:scale-95 ${
                showCalculator
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                  : 'bg-slate-900 text-emerald-400 border-emerald-800/60 hover:bg-emerald-950/40'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Simulator</span>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Position P&L Simulator Drawer */}
      {showCalculator && (
        <div className="terminal-card p-4 sm:p-6 rounded-2xl border border-emerald-500/40 bg-[#07111c] animate-fadeIn font-mono text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <span className="font-bold text-emerald-400 flex items-center gap-2 text-sm uppercase tracking-wider">
              <Calculator className="w-4 h-4" />
              POSITION & PROFIT SIMULATOR ({currency})
            </span>
            <button
              onClick={() => setShowCalculator(false)}
              className="text-slate-400 hover:text-slate-200 cursor-pointer text-xs p-1"
            >
              ✕ Close
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {/* Capital Slider */}
            <div className="flex flex-col gap-2.5">
              <div className="flex justify-between items-baseline">
                <span className="text-slate-400">Position Capital:</span>
                <span className="text-slate-100 font-bold text-base">
                  {currSymbol}{investedCapital.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="10000"
                max="2000000"
                step="10000"
                value={investedCapital}
                onChange={(e) => setInvestedCapital(parseFloat(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-800 h-3 rounded-lg cursor-pointer"
              />
              <span className="text-[11px] text-slate-400">
                Purchases approximately <strong className="text-cyan-400">{shareCount} shares</strong> at {currSymbol}{currentPrice.toLocaleString()}
              </span>
            </div>

            {/* Target Move Slider */}
            <div className="flex flex-col gap-2.5">
              <div className="flex justify-between items-baseline">
                <span className="text-slate-400">Target Move Objective:</span>
                <span className={`font-bold text-base ${targetMovePct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {targetMovePct >= 0 ? '+' : ''}{targetMovePct}% (➔ {currSymbol}{simulatedTargetPrice.toFixed(2)})
                </span>
              </div>
              <input
                type="range"
                min="-20"
                max="50"
                step="1"
                value={targetMovePct}
                onChange={(e) => setTargetMovePct(parseFloat(e.target.value))}
                className="w-full accent-cyan-500 bg-slate-800 h-3 rounded-lg cursor-pointer"
              />
              <span className="text-[11px] text-slate-400">
                Adjust expected price target percentage
              </span>
            </div>

            {/* Projected P&L Display Card */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                  PROJECTED RETURN AT TARGET
                </span>
                <div className={`text-2xl font-black ${simulatedProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {simulatedProfit >= 0 ? '+' : ''}{currSymbol}{Math.round(simulatedProfit).toLocaleString()}
                </div>
              </div>
              <div className="flex justify-between text-xs text-slate-400 mt-2.5 pt-2 border-t border-slate-800">
                <span>Stop-Loss Risk (-{stopLossPct.toFixed(1)}%):</span>
                <span className="text-rose-400 font-bold">-{currSymbol}{Math.round(maxRiskLoss).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Candlestick / Area Chart Container */}
      <div className="terminal-card p-3 sm:p-5 rounded-2xl relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="h-[280px] sm:h-[390px] w-full relative z-10">
          {candles && candles.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={candles} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={isPositive ? '#10b981' : '#f43f5e'} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={isPositive ? '#10b981' : '#f43f5e'} stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.5} />
                <XAxis 
                  dataKey="time" 
                  stroke="#64748b" 
                  fontSize={10} 
                  fontFamily="monospace"
                  tickLine={false}
                />
                <YAxis 
                  domain={['auto', 'auto']} 
                  stroke="#64748b" 
                  fontSize={10} 
                  fontFamily="monospace"
                  tickLine={false}
                  tickFormatter={(val) => `${currSymbol}${val.toLocaleString()}`}
                />
                <Tooltip content={<CustomTooltip />} />
                
                {showVolume && (
                  <Bar dataKey="volume" yAxisId={1} fill="#334155" opacity={0.35} />
                )}

                <Area 
                  type="monotone" 
                  dataKey="close" 
                  stroke={isPositive ? '#10b981' : '#f43f5e'} 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#priceGradient)" 
                />

                {showSMA && (
                  <>
                    <Line type="monotone" dataKey="sma20" stroke="#06b6d4" strokeWidth={1.5} dot={false} strokeDasharray="4 4" />
                    <Line type="monotone" dataKey="sma50" stroke="#f59e0b" strokeWidth={1.5} dot={false} />
                  </>
                )}

                {showBB && (
                  <>
                    <Line type="monotone" dataKey="bb_upper" stroke="#8b5cf6" strokeWidth={1} strokeDasharray="2 2" dot={false} />
                    <Line type="monotone" dataKey="bb_lower" stroke="#8b5cf6" strokeWidth={1} strokeDasharray="2 2" dot={false} />
                  </>
                )}
              </ComposedChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-500 font-mono text-xs">
              Loading financial time-series streams...
            </div>
          )}
        </div>

        {/* Technical Sub-Panel: RSI & Momentum */}
        <div className="mt-3.5 pt-3 border-t border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                OSCILLATOR CONFLUENCE
              </span>
              <button
                onClick={() => setActiveIndicator('rsi')}
                className={`text-[10px] font-mono px-2 py-0.5 rounded cursor-pointer ${
                  activeIndicator === 'rsi' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold' : 'text-slate-500'
                }`}
              >
                RSI: {summary?.rsi ?? 50.0}
              </button>
              <button
                onClick={() => setActiveIndicator('macd')}
                className={`text-[10px] font-mono px-2 py-0.5 rounded cursor-pointer ${
                  activeIndicator === 'macd' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold' : 'text-slate-500'
                }`}
              >
                MACD: {summary?.macd ?? 0.0}
              </button>
            </div>

            <span className="text-[10px] font-mono text-slate-500">
              {summary?.rsi > 70 ? 'OVERBOUGHT ZONE (>70)' : summary?.rsi < 35 ? 'OVERSOLD ACCUMULATION (<35)' : 'NEUTRAL EQUILIBRIUM'}
            </span>
          </div>

          <div className="h-[80px] sm:h-[90px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={candles} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 2" stroke="#1e293b" opacity={0.4} />
                <YAxis domain={activeIndicator === 'rsi' ? [0, 100] : ['auto', 'auto']} stroke="#475569" fontSize={9} fontFamily="monospace" />
                {activeIndicator === 'rsi' ? (
                  <>
                    <ReferenceLine y={70} stroke="#f43f5e" strokeDasharray="3 3" opacity={0.6} />
                    <ReferenceLine y={30} stroke="#10b981" strokeDasharray="3 3" opacity={0.6} />
                    <Line type="monotone" dataKey="rsi" stroke="#06b6d4" strokeWidth={1.5} dot={false} />
                  </>
                ) : (
                  <>
                    <Bar dataKey="macd" fill="#f59e0b" opacity={0.7} />
                    <Line type="monotone" dataKey="macd_signal" stroke="#06b6d4" strokeWidth={1.2} dot={false} />
                  </>
                )}
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Fundamental & Institutional Metrics Ribbon in ₹ INR (Spacious 2-Col on Mobile) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3.5 font-mono text-xs">
        <div className="terminal-card p-3.5 sm:p-4 rounded-xl border-l-2 border-l-cyan-500">
          <span className="text-slate-500 text-[10px] uppercase font-bold">Trailing P/E</span>
          <div className="text-slate-100 font-bold text-sm sm:text-base mt-0.5">
            {summary?.pe_ratio ? `${summary.pe_ratio}x` : 'N/A'}
          </div>
          <span className="text-[10px] text-slate-400">Fwd: {summary?.forward_pe ?? 'N/A'}x</span>
        </div>

        <div className="terminal-card p-3.5 sm:p-4 rounded-xl border-l-2 border-l-emerald-500">
          <span className="text-slate-500 text-[10px] uppercase font-bold">Market Cap</span>
          <div className="text-slate-100 font-bold text-sm sm:text-base mt-0.5 truncate">
            {summary?.market_cap ? `${currSymbol}${(summary.market_cap / (currency === 'INR' ? 1e11 : 1e12)).toFixed(2)}${currency === 'INR' ? ' Lakh Cr' : 'T'}` : 'N/A'}
          </div>
          <span className="text-[10px] text-slate-400">Beta: {summary?.beta ?? 1.05}</span>
        </div>

        <div className="terminal-card p-3.5 sm:p-4 rounded-xl border-l-2 border-l-amber-500">
          <span className="text-slate-500 text-[10px] uppercase font-bold">52-Wk Range</span>
          <div className="text-slate-100 font-bold text-xs mt-0.5 truncate">
            {currSymbol}{summary?.display_low?.toLocaleString() ?? 0} - {currSymbol}{summary?.display_high?.toLocaleString() ?? 0}
          </div>
          <span className="text-[10px] text-slate-400 truncate block">Mean: {currSymbol}{summary?.display_target?.toLocaleString() ?? 0}</span>
        </div>

        <div className="terminal-card p-3.5 sm:p-4 rounded-xl border-l-2 border-l-violet-500">
          <span className="text-slate-500 text-[10px] uppercase font-bold">Volatility</span>
          <div className="text-slate-100 font-bold text-sm sm:text-base mt-0.5">
            {summary?.historical_volatility ?? 22.5}%
          </div>
          <span className="text-[10px] text-slate-400">VaR (95%): -{(summary?.historical_volatility ? (summary.historical_volatility * 0.103).toFixed(2) : '2.2')}%</span>
        </div>

        <div className="terminal-card p-3.5 sm:p-4 rounded-xl border-l-2 border-l-blue-500">
          <span className="text-slate-500 text-[10px] uppercase font-bold">PCR Ratio</span>
          <div className="text-slate-100 font-bold text-sm sm:text-base mt-0.5">
            {summary?.put_call_ratio ?? 0.82}
          </div>
          <span className="text-[10px] text-emerald-400 font-bold">Bullish Skew</span>
        </div>

        <div className="terminal-card p-3.5 sm:p-4 rounded-xl border-l-2 border-l-rose-500">
          <span className="text-slate-500 text-[10px] uppercase font-bold">Inst. Flow</span>
          <div className="text-slate-100 font-bold text-sm sm:text-base mt-0.5">
            {summary?.institutional_flow_score ?? 74}/100
          </div>
          <span className="text-[10px] text-cyan-400">FII / DII Inflows</span>
        </div>
      </div>
    </div>
  );
}
