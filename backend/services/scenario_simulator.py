"""
AI-FIOS Scenario Simulation Engine ("What-If" Macroeconomic Stress Tester)
"""

from typing import Dict, Any, List


class ScenarioSimulator:
    def __init__(self):
        self.presets = {
            "oil_120": {
                "name": "Crude Oil Spikes to $120/bbl (Strait of Hormuz Shock)",
                "description": "Geopolitical disruption cuts tanker flows through Persian Gulf, sending WTI and Brent to $120/bbl.",
                "params": {"oil_price": 120.0, "rate_shift_bps": 25, "inflation_rate": 5.2, "geo_tension": 9.2, "tariff_rate": 15}
            },
            "fed_rate_hike_75": {
                "name": "Federal Reserve Emergency Rate Hike (+75 bps)",
                "description": "Sticky core services inflation forces the FOMC into an unscheduled 75 bps benchmark hike.",
                "params": {"oil_price": 75.0, "rate_shift_bps": 75, "inflation_rate": 4.5, "geo_tension": 4.0, "tariff_rate": 10}
            },
            "fed_pivot_easing": {
                "name": "Central Bank Aggressive Easing Pivot (-100 bps)",
                "description": "Synchronized rate cuts across Fed and global central banks to avert recessionary labor cooling.",
                "params": {"oil_price": 72.0, "rate_shift_bps": -100, "inflation_rate": 2.2, "geo_tension": 3.5, "tariff_rate": 5}
            },
            "us_china_tech_embargo": {
                "name": "US-China Semiconductor & Trade Embargo Expansion",
                "description": "Bilateral trade restrictions on silicon lithography, rare earths, and electronics cross-tariffs reach 45%.",
                "params": {"oil_price": 82.0, "rate_shift_bps": 0, "inflation_rate": 3.8, "geo_tension": 8.8, "tariff_rate": 45}
            },
            "global_stagflation": {
                "name": "Global Stagflationary Contraction",
                "description": "Simultaneous supply chain friction, high borrowing costs, and negative GDP revisions across G7.",
                "params": {"oil_price": 105.0, "rate_shift_bps": 50, "inflation_rate": 6.0, "geo_tension": 8.0, "tariff_rate": 25}
            }
        }

    def simulate(
        self,
        oil_price: float = 78.0,
        rate_shift_bps: int = 0,
        inflation_rate: float = 3.0,
        geo_tension: float = 5.0,
        tariff_rate: float = 10.0
    ) -> Dict[str, Any]:
        """
        Calculates macroeconomic transmission, sector performance,
        and stock re-pricing under specified what-if conditions.
        """
        # Baseline reference: Oil $75, Rate shift 0, Inflation 2.5%, Geo 4.0, Tariff 10%
        oil_delta = (oil_price - 75.0) / 75.0
        rate_delta_pct = rate_shift_bps / 100.0
        inf_delta = (inflation_rate - 2.5) / 2.5
        geo_delta = (geo_tension - 4.0) / 6.0
        tariff_delta = (tariff_rate - 10.0) / 40.0

        # 1. Macro Cascades
        gdp_impact_pct = round(-0.4 * max(0, oil_delta) - 0.5 * (rate_shift_bps / 100.0) - 0.3 * geo_delta, 2)
        cpi_impact_pct = round(0.55 * oil_delta + 0.3 * inf_delta + 0.25 * tariff_delta, 2)
        yield_10y_shift_bps = int(rate_shift_bps * 0.75 + (cpi_impact_pct * 35))
        us_inr_depreciation = round(oil_delta * 3.5 + (rate_shift_bps / 100.0) * 1.8, 2)

        # 2. Sector Re-pricing (% expected move)
        sectors = {
            "Semiconductors & AI Hardware": round(-4.5 * (rate_shift_bps / 100.0) - 8.0 * tariff_delta + 3.0 * (1 - geo_delta), 1),
            "Airlines & Logistics": round(-14.0 * oil_delta - 4.0 * (rate_shift_bps / 100.0), 1),
            "Energy Refining & Exploration": round(18.0 * oil_delta - 2.0 * (rate_shift_bps / 100.0), 1),
            "Commercial Banking": round(4.5 * (rate_shift_bps / 100.0) - 3.0 * geo_delta, 1),
            "Cloud & Enterprise Software": round(-6.0 * (rate_shift_bps / 100.0) - 2.0 * inf_delta, 1),
            "Indian IT Exporters": round(2.5 * us_inr_depreciation - 3.5 * (rate_shift_bps / 100.0), 1),
            "Precious Metals / Gold": round(12.0 * geo_delta + 8.0 * inf_delta - 5.0 * (rate_shift_bps / 100.0), 1)
        }

        # 3. Specific Asset Price Adjustments
        asset_impacts = [
            {
                "symbol": "NVDA",
                "name": "NVIDIA Corp",
                "expected_impact_pct": round(-5.2 * (rate_shift_bps / 100.0) - 9.5 * tariff_delta, 1),
                "rationale": "High-multiple tech valuation compression from higher discount rates combined with potential export curbs."
            },
            {
                "symbol": "AAPL",
                "name": "Apple Inc.",
                "expected_impact_pct": round(-2.8 * (rate_shift_bps / 100.0) - 7.0 * tariff_delta - 1.5 * inf_delta, 1),
                "rationale": "Hardware supply-chain logistics friction and consumer upgrade cycle elongation."
            },
            {
                "symbol": "TSLA",
                "name": "Tesla Inc.",
                "expected_impact_pct": round(-8.5 * (rate_shift_bps / 100.0) - 5.0 * tariff_delta - 3.0 * geo_delta, 1),
                "rationale": "High beta sensitivity to auto loan financing interest rates and lithium/battery supply tariffs."
            },
            {
                "symbol": "MSFT",
                "name": "Microsoft Corp",
                "expected_impact_pct": round(-3.5 * (rate_shift_bps / 100.0) - 1.5 * inf_delta, 1),
                "rationale": "Resilient enterprise cloud revenue cushions macro shocks, though multiples contract under higher yields."
            },
            {
                "symbol": "RELIANCE.NS",
                "name": "Reliance Industries",
                "expected_impact_pct": round(9.5 * oil_delta - 2.0 * us_inr_depreciation, 1),
                "rationale": "Favorable Gross Refining Margins (GRMs) on oil surges offset higher crude import bill."
            },
            {
                "symbol": "TCS.NS",
                "name": "Tata Consultancy Services",
                "expected_impact_pct": round(2.2 * us_inr_depreciation - 2.5 * (rate_shift_bps / 100.0), 1),
                "rationale": "Rupee depreciation boosts USD revenue realizations, balanced against US BFSI IT discretionary spend."
            },
            {
                "symbol": "HDFCBANK.NS",
                "name": "HDFC Bank",
                "expected_impact_pct": round(3.2 * (rate_shift_bps / 100.0) - 2.0 * oil_delta, 1),
                "rationale": "Lending yield expansion offset by macro inflation squeeze on household deposit savings."
            },
            {
                "symbol": "GC=F",
                "name": "Gold Bullion",
                "expected_impact_pct": round(14.0 * geo_delta + 9.0 * inf_delta - 6.0 * (rate_shift_bps / 100.0), 1),
                "rationale": "Classical sovereign central bank diversification and geopolitical hedge."
            },
            {
                "symbol": "CL=F",
                "name": "Crude Oil (WTI)",
                "expected_impact_pct": round(oil_delta * 100, 1),
                "rationale": "Direct commodity benchmark repricing reflecting physical tightness."
            }
        ]

        # Causal Chain Explanation
        causal_steps = []
        if oil_price > 95:
            causal_steps.append("Crude surge elevates crack spreads and petrochemical feedstocks (+28%).")
            causal_steps.append("Jet fuel and overland freight surcharges compress transport & retail margins (-15%).")
        if rate_shift_bps > 25:
            causal_steps.append(f"Fed tightening by +{rate_shift_bps} bps elevates terminal risk-free discount rate.")
            causal_steps.append("High forward P/E equity multiples undergo DCF compression.")
        if tariff_rate > 20:
            causal_steps.append(f"Tariff baseline at {tariff_rate}% introduces cross-border component friction in hardware.")
        if not causal_steps:
            causal_steps.append("Macro environment remains in balanced equilibrium; earnings fundamentals dominate.")

        return {
            "inputs": {
                "oil_price": oil_price,
                "rate_shift_bps": rate_shift_bps,
                "inflation_rate": inflation_rate,
                "geo_tension": geo_tension,
                "tariff_rate": tariff_rate
            },
            "macro_cascade": {
                "gdp_impact_pct": gdp_impact_pct,
                "cpi_inflation_delta_pct": cpi_impact_pct,
                "yield_10y_shift_bps": yield_10y_shift_bps,
                "usd_inr_depreciation_pct": us_inr_depreciation
            },
            "sector_impacts": sectors,
            "asset_impacts": asset_impacts,
            "causal_transmission_narrative": " ➔ ".join(causal_steps)
        }

    def get_presets(self) -> Dict[str, Any]:
        return self.presets


scenario_simulator = ScenarioSimulator()
