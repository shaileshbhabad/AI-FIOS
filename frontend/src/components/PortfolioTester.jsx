import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  ShieldAlert, 
  TrendingUp, 
  TrendingDown, 
  RefreshCw 
} from 'lucide-react';

export default function PortfolioTester({ currency = 'INR' }) {
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchPortfolio = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/portfolio?currency=${currency}`);
      if (res.ok) {
        const data = await res.json();
        setPortfolio(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, [currency]);

  if (!portfolio) {
    return (
      <div className="terminal-card p-8 rounded-xl text-center text-slate-500 font-mono text-xs">
        Loading institutional portfolio stress test...
      </div>
    );
  }

  const isProfit = portfolio.total_unrealized_pnl >= 0;
  const currSym = portfolio.currency_symbol || (currency === 'INR' ? '₹' : '$');

  return (
    <div className="flex flex-col gap-4 font-mono text-xs">
      {/* Portfolio Performance Summary Ribbon in ₹ INR */}
      <div className="terminal-card p-6 rounded-2xl border border-cyan-500/30">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Briefcase className="w-4 h-4 text-cyan-400" />
              <span className="font-bold text-slate-400 uppercase tracking-wider text-[11px]">
                INSTITUTIONAL MULTI-ASSET PORTFOLIO INTELLIGENCE ({currency})
              </span>
            </div>

            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-3xl font-black text-slate-100">
                {currSym}{portfolio.total_portfolio_value?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className={`text-base font-bold flex items-center ${isProfit ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isProfit ? <TrendingUp className="w-4 h-4 mr-0.5 inline" /> : <TrendingDown className="w-4 h-4 mr-0.5 inline" />}
                {isProfit ? '+' : ''}{currSym}{portfolio.total_unrealized_pnl?.toLocaleString()} ({isProfit ? '+' : ''}{portfolio.total_pnl_percent}%)
              </span>
            </div>
          </div>

          {/* Core Risk Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-500 text-[10px]">WEIGHTED BETA</span>
              <div className="text-cyan-400 font-bold text-sm mt-0.5">{portfolio.portfolio_beta}</div>
            </div>

            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-500 text-[10px]">DAILY 95% VAR</span>
              <div className="text-rose-400 font-bold text-sm mt-0.5">
                -{currSym}{portfolio.estimated_daily_var_95?.toLocaleString()}
              </div>
            </div>

            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-500 text-[10px]">ANN. VOLATILITY</span>
              <div className="text-amber-400 font-bold text-sm mt-0.5">{portfolio.annualized_volatility}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Allocations & Hedging Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Holdings Table */}
        <div className="lg:col-span-8 terminal-card p-5 rounded-2xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
            <span className="font-bold text-slate-200 uppercase tracking-wider text-xs">
              Live Holdings & Mark-to-Market Valuations ({currSym})
            </span>
            <button
              onClick={fetchPortfolio}
              disabled={loading}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono">
              <thead>
                <tr className="text-[10px] text-slate-500 border-b border-slate-800 pb-2">
                  <th className="pb-2">ASSET</th>
                  <th className="pb-2">SHARES</th>
                  <th className="pb-2">AVG COST</th>
                  <th className="pb-2">CURRENT PRICE</th>
                  <th className="pb-2">VALUE ({currency})</th>
                  <th className="pb-2">WEIGHT</th>
                  <th className="pb-2">UNREALIZED P&L</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {portfolio.positions?.map((pos) => {
                  const pnlPos = pos.unrealized_pnl >= 0;
                  return (
                    <tr key={pos.symbol} className="hover:bg-slate-900/40">
                      <td className="py-3 font-bold text-slate-200">
                        {pos.symbol}
                        <span className="block text-[10px] text-slate-500 font-normal">{pos.sector}</span>
                      </td>
                      <td className="py-3 text-slate-300">{pos.shares}</td>
                      <td className="py-3 text-slate-400">{currSym}{pos.cost_basis?.toLocaleString()}</td>
                      <td className="py-3 text-slate-200 font-bold">{currSym}{pos.current_price?.toLocaleString()}</td>
                      <td className="py-3 text-slate-200 font-semibold">{currSym}{pos.value?.toLocaleString()}</td>
                      <td className="py-3 text-cyan-400 font-bold">{pos.weight_pct}%</td>
                      <td className={`py-3 font-bold ${pnlPos ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {pnlPos ? '+' : ''}{currSym}{pos.unrealized_pnl?.toLocaleString()} ({pnlPos ? '+' : ''}{pos.pnl_percent}%)
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Breakdown & Hedging Recommendations */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="terminal-card p-5 rounded-2xl">
            <span className="font-bold text-slate-200 uppercase tracking-wider text-xs block mb-3">
              Sector Concentration
            </span>

            <div className="flex flex-col gap-3">
              {portfolio.sector_breakdown?.map((sec, i) => (
                <div key={i} className="flex flex-col gap-1 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-300">{sec.sector}</span>
                    <span className="text-cyan-400 font-bold">{sec.weight}%</span>
                  </div>
                  <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${sec.weight}%` }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-4 border-t border-slate-800">
              <span className="font-bold text-slate-200 uppercase tracking-wider text-xs block mb-2">
                Geographic Dispersion
              </span>
              <div className="flex items-center gap-2 text-[11px]">
                {portfolio.geographic_breakdown?.map((geo, i) => (
                  <div key={i} className="flex-1 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 text-center">
                    <span className="text-slate-500 text-[10px] block">{geo.geography}</span>
                    <span className="text-slate-200 font-bold">{geo.weight}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="terminal-card p-5 rounded-2xl border-l-4 border-l-emerald-500">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs mb-2.5">
              <ShieldAlert className="w-4 h-4" />
              DYNAMIC HEDGING RECOMMENDATIONS
            </div>

            <div className="flex flex-col gap-2.5">
              {portfolio.hedging_recommendations?.map((hedge, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-[11px] text-slate-300 leading-relaxed">
                  {hedge}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
