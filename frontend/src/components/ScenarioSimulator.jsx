import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  Flame, 
  TrendingUp, 
  TrendingDown, 
  ShieldAlert, 
  Zap, 
  RotateCcw,
  Layers,
  ArrowRight
} from 'lucide-react';

export default function ScenarioSimulator() {
  const [params, setParams] = useState({
    oil_price: 78.0,
    rate_shift_bps: 0,
    inflation_rate: 3.0,
    geo_tension: 5.0,
    tariff_rate: 10.0
  });

  const [simulationResult, setSimulationResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const presets = [
    {
      id: 'oil_120',
      label: 'Crude Oil $120/bbl Shock',
      desc: 'Middle East chokepoint escalation',
      icon: Flame,
      params: { oil_price: 120.0, rate_shift_bps: 25, inflation_rate: 5.2, geo_tension: 9.2, tariff_rate: 15.0 }
    },
    {
      id: 'rate_hike_75',
      label: 'Fed Emergency Hike (+75 bps)',
      desc: 'Services inflation resurgence',
      icon: TrendingUp,
      params: { oil_price: 75.0, rate_shift_bps: 75, inflation_rate: 4.5, geo_tension: 4.0, tariff_rate: 10.0 }
    },
    {
      id: 'pivot_easing',
      label: 'Central Bank Easing (-100 bps)',
      desc: 'Synchronized rate cut pivot',
      icon: TrendingDown,
      params: { oil_price: 72.0, rate_shift_bps: -100, inflation_rate: 2.2, geo_tension: 3.5, tariff_rate: 5.0 }
    },
    {
      id: 'tech_tariffs',
      label: 'US-China Tech Tariffs (45%)',
      desc: 'Semiconductor export curbs',
      icon: ShieldAlert,
      params: { oil_price: 82.0, rate_shift_bps: 0, inflation_rate: 3.8, geo_tension: 8.8, tariff_rate: 45.0 }
    }
  ];

  const runSimulation = async (customParams = params) => {
    setLoading(true);
    try {
      const res = await fetch('/api/scenario-simulator/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customParams)
      });
      if (res.ok) {
        const data = await res.json();
        setSimulationResult(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runSimulation();
  }, []);

  const handlePreset = (preset) => {
    setParams(preset.params);
    runSimulation(preset.params);
  };

  const handleSliderChange = (key, value) => {
    const updated = { ...params, [key]: parseFloat(value) };
    setParams(updated);
    runSimulation(updated);
  };

  const macro = simulationResult?.macro_cascade || {};
  const sectors = simulationResult?.sector_impacts || {};
  const assets = simulationResult?.asset_impacts || [];

  return (
    <div className="flex flex-col gap-4 font-mono">
      {/* Header */}
      <div className="terminal-card p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-black text-slate-100 tracking-wider">
              MACROECONOMIC "WHAT-IF" SCENARIO SIMULATOR · LAYER 6
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Interactively inject geopolitical shocks, crude price surges, or central bank rate pivots to re-price global assets in real time.
          </p>
        </div>

        <button
          onClick={() => {
            const def = { oil_price: 78.0, rate_shift_bps: 0, inflation_rate: 3.0, geo_tension: 5.0, tariff_rate: 10.0 };
            setParams(def);
            runSimulation(def);
          }}
          className="px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1.5 w-fit"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Baseline
        </button>
      </div>

      {/* Preset Crisis Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {presets.map((preset) => {
          const Icon = preset.icon;
          return (
            <button
              key={preset.id}
              onClick={() => handlePreset(preset)}
              className="p-3 rounded-xl bg-[#0b101c] border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800/40 text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-slate-200">{preset.label}</span>
              </div>
              <p className="text-[11px] text-slate-500">{preset.desc}</p>
            </button>
          );
        })}
      </div>

      {/* Interactive Controls & Output Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Interactive Stress Sliders */}
        <div className="lg:col-span-5 terminal-card p-4 rounded-xl flex flex-col gap-4 text-xs">
          <span className="font-bold text-slate-300 uppercase tracking-wider pb-2 border-b border-slate-800">
            Interactive Parameter Controls
          </span>

          {/* Oil Price Slider */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between">
              <span className="text-slate-400">Crude Oil Price (WTI):</span>
              <span className="font-bold text-emerald-400">${params.oil_price} / bbl</span>
            </div>
            <input
              type="range"
              min="50"
              max="150"
              step="1"
              value={params.oil_price}
              onChange={(e) => handleSliderChange('oil_price', e.target.value)}
              className="w-full accent-emerald-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-600">
              <span>$50</span>
              <span>Baseline: $75</span>
              <span>$150 Peak</span>
            </div>
          </div>

          {/* Fed Rate Shift */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between">
              <span className="text-slate-400">Fed Funds Rate Shift:</span>
              <span className={`font-bold ${params.rate_shift_bps > 0 ? 'text-rose-400' : (params.rate_shift_bps < 0 ? 'text-emerald-400' : 'text-slate-300')}`}>
                {params.rate_shift_bps > 0 ? '+' : ''}{params.rate_shift_bps} bps
              </span>
            </div>
            <input
              type="range"
              min="-150"
              max="200"
              step="25"
              value={params.rate_shift_bps}
              onChange={(e) => handleSliderChange('rate_shift_bps', e.target.value)}
              className="w-full accent-cyan-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-600">
              <span>-150 bps (Pivot)</span>
              <span>0 (Neutral)</span>
              <span>+200 bps (Hawk)</span>
            </div>
          </div>

          {/* Headline Inflation CPI */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between">
              <span className="text-slate-400">Headline CPI Inflation:</span>
              <span className="font-bold text-amber-400">{params.inflation_rate}%</span>
            </div>
            <input
              type="range"
              min="1.5"
              max="9.0"
              step="0.1"
              value={params.inflation_rate}
              onChange={(e) => handleSliderChange('inflation_rate', e.target.value)}
              className="w-full accent-amber-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-600">
              <span>1.5%</span>
              <span>Target: 2.0%</span>
              <span>9.0% Shock</span>
            </div>
          </div>

          {/* Geopolitical Tension Index */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between">
              <span className="text-slate-400">Geopolitical Friction Index:</span>
              <span className="font-bold text-rose-400">{params.geo_tension} / 10</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="10.0"
              step="0.5"
              value={params.geo_tension}
              onChange={(e) => handleSliderChange('geo_tension', e.target.value)}
              className="w-full accent-rose-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-600">
              <span>1 (Calm)</span>
              <span>5 (Current)</span>
              <span>10 (Full War)</span>
            </div>
          </div>

          {/* Cross-Border Tariffs */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between">
              <span className="text-slate-400">Bilateral Tech Tariffs:</span>
              <span className="font-bold text-violet-400">{params.tariff_rate}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="5"
              value={params.tariff_rate}
              onChange={(e) => handleSliderChange('tariff_rate', e.target.value)}
              className="w-full accent-violet-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-600">
              <span>0% Free Trade</span>
              <span>25% Moderate</span>
              <span>50% Embargo</span>
            </div>
          </div>
        </div>

        {/* Right Column: Macro Cascades & Sector / Asset Re-pricing */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          {/* Macro Cascade Metrics Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            <div className="terminal-card p-3 rounded-lg border-l-2 border-l-cyan-500">
              <span className="text-slate-500 text-[10px]">EST. GDP DELTA</span>
              <div className={`font-bold text-base mt-0.5 ${macro.gdp_impact_pct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {macro.gdp_impact_pct >= 0 ? '+' : ''}{macro.gdp_impact_pct}%
              </div>
            </div>

            <div className="terminal-card p-3 rounded-lg border-l-2 border-l-amber-500">
              <span className="text-slate-500 text-[10px]">CPI INFLATION SHIFT</span>
              <div className="font-bold text-base mt-0.5 text-amber-400">
                {macro.cpi_inflation_delta_pct >= 0 ? '+' : ''}{macro.cpi_inflation_delta_pct}%
              </div>
            </div>

            <div className="terminal-card p-3 rounded-lg border-l-2 border-l-violet-500">
              <span className="text-slate-500 text-[10px]">10-YR YIELD SHIFT</span>
              <div className="font-bold text-base mt-0.5 text-violet-400">
                {macro.yield_10y_shift_bps >= 0 ? '+' : ''}{macro.yield_10y_shift_bps} bps
              </div>
            </div>

            <div className="terminal-card p-3 rounded-lg border-l-2 border-l-emerald-500">
              <span className="text-slate-500 text-[10px]">USD / INR FX DELTA</span>
              <div className="font-bold text-base mt-0.5 text-slate-200">
                {macro.usd_inr_depreciation_pct >= 0 ? '+' : ''}{macro.usd_inr_depreciation_pct}%
              </div>
            </div>
          </div>

          {/* Causal Narrative */}
          <div className="terminal-card p-3 rounded-lg bg-slate-900/40 text-[11px] text-slate-300">
            <span className="text-cyan-400 font-bold block mb-0.5">Transmission Mechanism:</span>
            {simulationResult?.causal_transmission_narrative || 'Transmission pathways in equilibrium.'}
          </div>

          {/* Asset Re-Pricing Table */}
          <div className="terminal-card p-4 rounded-xl flex-1">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-3">
              Asset Re-Pricing Projections Under Shock
            </span>

            <div className="flex flex-col gap-2 max-h-[320px] overflow-y-auto pr-1">
              {assets.map((ast, i) => {
                const isPos = ast.expected_impact_pct >= 0;
                return (
                  <div
                    key={i}
                    className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-200">{ast.symbol}</span>
                        <span className="text-[11px] text-slate-400">({ast.name})</span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-0.5">{ast.rationale}</p>
                    </div>

                    <div className={`font-bold font-mono text-sm shrink-0 ${isPos ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {isPos ? '+' : ''}{ast.expected_impact_pct}%
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
