"""
AI-FIOS Historical Analog Engine
Matches current market regimes against historic macroeconomic crises
"""

import math
from typing import Dict, Any, List
from config import HISTORICAL_CRISES


class HistoricalAnalogEngine:
    def __init__(self):
        self.crises = HISTORICAL_CRISES

    def match_regime(
        self,
        current_vix: float = 22.5,
        current_pe: float = 27.0,
        rate_environment: str = "restrictive",  # "restrictive", "easing", "zero_bound"
        inflation_level: float = 3.2,
        geopolitical_stress: float = 7.5  # 1 to 10
    ) -> Dict[str, Any]:
        """
        Evaluates current macro setup against the 6 historic shock periods
        and returns ranked analogs with similarity scoring and tactical takeaways.
        """
        matches = []

        # Reference profiles for each crisis
        profiles = {
            "covid_2020": {"vix": 65.0, "pe": 22.0, "rate": "easing", "inflation": 1.5, "geo": 5.0},
            "gfc_2008": {"vix": 55.0, "pe": 19.5, "rate": "easing", "inflation": 3.8, "geo": 3.0},
            "inflation_ukraine_2022": {"vix": 32.0, "pe": 23.0, "rate": "restrictive", "inflation": 8.5, "geo": 9.0},
            "dotcom_2000": {"vix": 35.0, "pe": 34.0, "rate": "restrictive", "inflation": 3.4, "geo": 2.5},
            "oil_shock_1973": {"vix": 42.0, "pe": 16.0, "rate": "restrictive", "inflation": 11.0, "geo": 9.5},
            "asian_crisis_1997": {"vix": 38.0, "pe": 24.0, "rate": "restrictive", "inflation": 2.8, "geo": 6.0}
        }

        for crisis in self.crises:
            cid = crisis["id"]
            prof = profiles.get(cid, {})

            # Multi-dimensional Euclidean similarity
            vix_diff = abs(current_vix - prof["vix"]) / 60.0
            pe_diff = abs(current_pe - prof["pe"]) / 30.0
            inf_diff = abs(inflation_level - prof["inflation"]) / 10.0
            geo_diff = abs(geopolitical_stress - prof["geo"]) / 10.0
            rate_match = 0.0 if rate_environment == prof["rate"] else 0.35

            distance = math.sqrt(
                0.25 * (vix_diff ** 2) +
                0.25 * (pe_diff ** 2) +
                0.20 * (inf_diff ** 2) +
                0.20 * (geo_diff ** 2) +
                0.10 * (rate_match ** 2)
            )

            similarity_pct = max(10.0, min(96.0, round((1.0 - min(distance, 1.0)) * 100, 1)))

            # Trajectory curve simulation (T-0 to T+12 months)
            trajectory = self._generate_crisis_trajectory(crisis["max_drawdown"], crisis["recovery_months"])

            matches.append({
                **crisis,
                "similarity_score": similarity_pct,
                "current_vs_historic": {
                    "vix": {"current": current_vix, "historic_peak": prof["vix"]},
                    "pe_multiple": {"current": current_pe, "historic": prof["pe"]},
                    "inflation": {"current": inflation_level, "historic": prof["inflation"]},
                    "rate_regime": {"current": rate_environment, "historic": prof["rate"]}
                },
                "recovery_trajectory": trajectory,
                "tactical_implication": self._get_tactical_advice(cid)
            })

        matches.sort(key=lambda m: m["similarity_score"], reverse=True)

        return {
            "top_match": matches[0],
            "all_analogs": matches,
            "synthesis": (
                f"Current macro setup shares {matches[0]['similarity_score']}% structural similarity "
                f"with the {matches[0]['name']}. Key overlapping vulnerabilities include "
                f"{', '.join(matches[0]['analog_triggers'][:3])}."
            )
        }

    def _generate_crisis_trajectory(self, max_drawdown: float, recovery_months: int) -> List[Dict[str, Any]]:
        """Generates month-by-month trajectory from crash to bottom to recovery."""
        curve = []
        months = [0, 1, 2, 3, 4, 6, 9, 12, 18, 24]
        for m in months:
            if m == 0:
                val = 100.0
            elif m <= 3:
                # Trough phase
                trough_pct = max_drawdown * (m / 3.0)
                val = 100.0 + trough_pct
            else:
                # Recovery phase
                progress = min(1.0, (m - 3) / max(1, recovery_months - 3))
                val = (100.0 + max_drawdown) + (abs(max_drawdown) * progress)
            curve.append({"month": f"M+{m}", "index_level": round(val, 1)})
        return curve

    def _get_tactical_advice(self, crisis_id: str) -> str:
        advice = {
            "inflation_ukraine_2022": "Under high commodity friction and central bank tightening, emphasize pricing-power monopolies, high free-cash-flow yielders, and energy hedges over speculative long-duration multiples.",
            "dotcom_2000": "Scrutinize GAAP profitability and capital reinvestment ROIC. High revenue multiples without net cash flows experience severe multiple contraction during liquidity droughts.",
            "covid_2020": "Liquidity-driven volatility produces rapid mean-reversion. Quality growth balance sheets rebound first once central bank monetary intervention is signaled.",
            "gfc_2008": "Prioritize fortress balance sheets with minimal short-term refinancing roll-over risk. Credit spreads and interbank liquidity are paramount.",
            "oil_shock_1973": "Stagflationary environments favor real assets, physical commodities, gold bullion, and infrastructure operators capable of passing through energy surcharges.",
            "asian_crisis_1997": "Monitor foreign-exchange reserves and currency peg sustainability in emerging markets. Dollar strength penalizes USD-debt-laden offshore corporates."
        }
        return advice.get(crisis_id, "Maintain defensive liquidity and focus on quality balance sheets.")


historical_analog_engine = HistoricalAnalogEngine()
