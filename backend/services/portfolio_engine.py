"""
AI-FIOS Portfolio Intelligence & Stress Testing Engine
Layer 4 / Slide 11: Real-time risk exposure, concentration, and hedging with ₹ INR base
"""

from typing import Dict, Any, List
from services.market_data import market_service


class PortfolioIntelligenceEngine:
    def __init__(self):
        # Default institutional sample portfolio (Balanced Indian & Global Leaders)
        self.default_holdings = [
            {"symbol": "RELIANCE.NS", "shares": 60, "cost_basis": 2750.0},
            {"symbol": "TCS.NS", "shares": 35, "cost_basis": 3850.0},
            {"symbol": "HDFCBANK.NS", "shares": 90, "cost_basis": 1580.0},
            {"symbol": "TATAMOTORS.NS", "shares": 120, "cost_basis": 890.0},
            {"symbol": "NVDA", "shares": 15, "cost_basis": 115.0},
            {"symbol": "GC=F", "shares": 3, "cost_basis": 2550.0}
        ]

    def analyze_portfolio(self, holdings: List[Dict[str, Any]] = None, currency: str = "INR") -> Dict[str, Any]:
        if not holdings:
            holdings = self.default_holdings

        total_value = 0.0
        total_cost = 0.0
        analyzed_positions = []
        sector_weights = {}
        geo_weights = {"India": 0.0, "US": 0.0, "Global Commodities": 0.0}

        curr_sym = "₹" if currency == "INR" else "$"

        for item in holdings:
            sym = item["symbol"]
            shares = float(item["shares"])
            cost = float(item.get("cost_basis", 100.0))

            summary = market_service.get_asset_summary(sym, currency=currency)
            curr_price = summary.get("display_price", cost)

            pos_val = curr_price * shares
            pos_cost = cost * shares
            pnl = pos_val - pos_cost
            pnl_pct = round((pnl / max(1.0, pos_cost)) * 100, 2)

            total_value += pos_val
            total_cost += pos_cost

            sector = "Energy & Petrochem" if "RELIANCE" in sym else (
                "IT Services" if "TCS" in sym or "INFY" in sym else (
                    "Banking & Finance" if "HDFC" in sym or "ICICI" in sym or "SBIN" in sym else (
                        "Automotive" if "TATA" in sym or "MARUTI" in sym or "TSLA" in sym else (
                            "Semiconductors & AI" if "NVDA" in sym or "AMD" in sym else (
                                "Precious Metals" if "GC=F" in sym or "SI=F" in sym else "Diversified"
                            )
                        )
                    )
                )
            )

            geo = "India" if ".NS" in sym else ("Global Commodities" if sym in ("GC=F", "CL=F", "SI=F") else "US")

            analyzed_positions.append({
                "symbol": sym,
                "name": summary.get("name", sym),
                "shares": shares,
                "cost_basis": cost,
                "current_price": curr_price,
                "value": round(pos_val, 2),
                "unrealized_pnl": round(pnl, 2),
                "pnl_percent": pnl_pct,
                "sector": sector,
                "geography": geo,
                "beta": summary.get("beta", 1.0)
            })

        # Calculate Weights & Risk
        weighted_beta = 0.0
        for pos in analyzed_positions:
            w = pos["value"] / max(1.0, total_value)
            pos["weight_pct"] = round(w * 100, 1)
            weighted_beta += w * pos["beta"]

            sector_weights[pos["sector"]] = sector_weights.get(pos["sector"], 0.0) + (w * 100)
            geo_weights[pos["geography"]] = geo_weights.get(pos["geography"], 0.0) + (w * 100)

        total_pnl = total_value - total_cost
        total_pnl_pct = round((total_pnl / max(1.0, total_cost)) * 100, 2)
        portfolio_vol = round(weighted_beta * 18.5, 1)
        daily_var_95 = round(total_value * 0.0165 * weighted_beta, 2)

        hedges = []
        max_sector = max(sector_weights.items(), key=lambda x: x[1]) if sector_weights else ("None", 0)
        if max_sector[1] > 40.0:
            hedges.append(f"Sector Concentration Alert: {max_sector[0]} constitutes {round(max_sector[1], 1)}% of total capital. Consider hedging with NIFTY Put Options.")
        if geo_weights.get("Global Commodities", 0) < 8.0:
            hedges.append("Precious Metals Underweight: Increase Gold / Silver allocation to 10% to establish non-correlated drawdown insurance.")
        if weighted_beta > 1.25:
            hedges.append(f"High-Beta Stance ({round(weighted_beta, 2)}): Portfolio is sensitive to broad-market pullbacks. Recommend trimming high-volatility holdings.")
        if not hedges:
            hedges.append("Optimal Diversification: Asset weights are well-dispersed across defensive and high-growth segments.")

        return {
            "total_portfolio_value": round(total_value, 2),
            "total_unrealized_pnl": round(total_pnl, 2),
            "total_pnl_percent": total_pnl_pct,
            "currency_symbol": curr_sym,
            "portfolio_beta": round(weighted_beta, 2),
            "estimated_daily_var_95": daily_var_95,
            "annualized_volatility": portfolio_vol,
            "sharpe_ratio": round((total_pnl_pct - 6.5) / max(1.0, portfolio_vol), 2),
            "positions": analyzed_positions,
            "sector_breakdown": [{"sector": k, "weight": round(v, 1)} for k, v in sector_weights.items()],
            "geographic_breakdown": [{"geography": k, "weight": round(v, 1)} for k, v in geo_weights.items()],
            "hedging_recommendations": hedges
        }


portfolio_engine = PortfolioIntelligenceEngine()
