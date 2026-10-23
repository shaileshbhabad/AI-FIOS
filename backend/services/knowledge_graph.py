"""
AI-FIOS Causal Knowledge Graph Engine
Layer 3 (Knowledge Graph & Entity Relationship Mapping)
Includes Interactive Causal Shock Simulator & Multi-Hop Path Tracer
"""

from typing import Dict, Any, List, Optional
import networkx as nx


class CausalKnowledgeGraphService:
    def __init__(self):
        self.graph = nx.DiGraph()
        self._build_graph()

    def _build_graph(self):
        """Constructs the financial & geopolitical causal graph."""
        nodes = [
            # Geopolitical & Macro Events
            {"id": "geo_mideast_conflict", "label": "Middle East Tensions", "type": "event", "group": "geopolitical", "impact": -0.4},
            {"id": "geo_red_sea_blockade", "label": "Red Sea Shipping Disruption", "type": "event", "group": "geopolitical", "impact": -0.5},
            {"id": "geo_us_china_tariffs", "label": "US-China Tech Tariffs", "type": "event", "group": "geopolitical", "impact": -0.6},
            {"id": "macro_fed_rate_hike", "label": "Fed Tightening / High Rates", "type": "event", "group": "macro", "impact": -0.5},
            {"id": "macro_rate_cut", "label": "Central Bank Rate Cuts", "type": "event", "group": "macro", "impact": 0.6},
            {"id": "geo_opec_cut", "label": "OPEC+ Crude Production Cuts", "type": "event", "group": "geopolitical", "impact": -0.3},
            {"id": "ai_infrastructure_boom", "label": "Enterprise GenAI Capex Wave", "type": "driver", "group": "structural", "impact": 0.8},

            # Commodities & Input Costs
            {"id": "comm_crude_oil", "label": "Crude Oil (WTI/Brent)", "type": "commodity", "group": "commodities", "impact": 0.0},
            {"id": "comm_natural_gas", "label": "Natural Gas", "type": "commodity", "group": "commodities", "impact": 0.0},
            {"id": "comm_gold", "label": "Gold (Safe Haven)", "type": "commodity", "group": "commodities", "impact": 0.4},
            {"id": "comm_semiconductors", "label": "Advanced Silicon Wafers", "type": "input", "group": "tech_supply", "impact": 0.3},
            {"id": "comm_freight_rates", "label": "Global Freight Rates", "type": "cost", "group": "logistics", "impact": -0.4},

            # Macro Factors & Transmission Channels
            {"id": "channel_fuel_costs", "label": "Jet Fuel & Transportation Costs", "type": "channel", "group": "channels", "impact": -0.3},
            {"id": "channel_discount_rate", "label": "Equity Discount Rate (WACC)", "type": "channel", "group": "channels", "impact": -0.5},
            {"id": "channel_cloud_capex", "label": "Hyperscaler Datacenter Capex", "type": "channel", "group": "channels", "impact": 0.7},
            {"id": "channel_fx_inr_depr", "label": "Rupee Volatility / USD Strength", "type": "channel", "group": "channels", "impact": -0.2},
            {"id": "channel_consumer_demand", "label": "Discretionary Consumer Demand", "type": "channel", "group": "channels", "impact": 0.2},

            # Sectors
            {"id": "sec_airlines", "label": "Global Aviation & Logistics", "type": "sector", "group": "sectors", "impact": 0.0},
            {"id": "sec_semiconductors", "label": "Semiconductor Equipment & Chips", "type": "sector", "group": "sectors", "impact": 0.5},
            {"id": "sec_cloud_software", "label": "Cloud & Enterprise Software", "type": "sector", "group": "sectors", "impact": 0.4},
            {"id": "sec_indian_it", "label": "Indian IT Services Exporters", "type": "sector", "group": "sectors", "impact": 0.3},
            {"id": "sec_energy_refining", "label": "Refining & Petrochemicals", "type": "sector", "group": "sectors", "impact": 0.4},
            {"id": "sec_banking", "label": "Commercial & Retail Banks", "type": "sector", "group": "sectors", "impact": 0.2},

            # Core Assets / Companies
            {"id": "NVDA", "label": "NVIDIA (NVDA)", "type": "asset", "group": "equities", "impact": 0.7},
            {"id": "AAPL", "label": "Apple (AAPL)", "type": "asset", "group": "equities", "impact": 0.4},
            {"id": "MSFT", "label": "Microsoft (MSFT)", "type": "asset", "group": "equities", "impact": 0.5},
            {"id": "TSLA", "label": "Tesla (TSLA)", "type": "asset", "group": "equities", "impact": 0.2},
            {"id": "RELIANCE.NS", "label": "Reliance Industries (RELIANCE)", "type": "asset", "group": "equities", "impact": 0.4},
            {"id": "TCS.NS", "label": "TCS (TCS.NS)", "type": "asset", "group": "equities", "impact": 0.3},
            {"id": "HDFCBANK.NS", "label": "HDFC Bank (HDFCBANK)", "type": "asset", "group": "equities", "impact": 0.3},
            {"id": "CL=F", "label": "Crude Oil WTI (CL=F)", "type": "asset", "group": "commodities", "impact": 0.1},
            {"id": "GC=F", "label": "Gold Futures (GC=F)", "type": "asset", "group": "commodities", "impact": 0.4}
        ]

        for n in nodes:
            self.graph.add_node(n["id"], **n)

        # Causal Edges: (Source, Target, weight, polarity, mechanism)
        edges = [
            ("geo_mideast_conflict", "comm_crude_oil", 0.85, 1, "Geopolitical risk premium elevates crude prices"),
            ("geo_opec_cut", "comm_crude_oil", 0.90, 1, "Supply constraint tightens global barrels"),
            ("geo_mideast_conflict", "comm_gold", 0.75, 1, "Flight to safe-haven assets boosts bullion demand"),
            ("geo_red_sea_blockade", "comm_freight_rates", 0.88, 1, "Cape of Good Hope rerouting adds 12 days sailing and bunker fuel"),
            ("geo_red_sea_blockade", "comm_crude_oil", 0.65, 1, "Tanker diversions raise transit risk premiums"),
            ("comm_crude_oil", "CL=F", 0.95, 1, "Direct benchmark price link"),
            ("comm_crude_oil", "channel_fuel_costs", 0.90, 1, "Distillate crack spreads elevate aviation jet fuel"),
            ("comm_crude_oil", "sec_energy_refining", 0.70, 1, "Higher refining margins on inventory gains"),
            ("sec_energy_refining", "RELIANCE.NS", 0.75, 1, "Gross Refining Margin (GRM) expansion aids Jamnagar refinery earnings"),
            ("channel_fuel_costs", "sec_airlines", 0.85, -1, "Fuel constitutes 32% of airline operating costs; compresses EBIT"),
            ("comm_freight_rates", "AAPL", 0.55, -1, "Extended hardware shipment lead-times and supply-chain logistics costs"),
            ("ai_infrastructure_boom", "channel_cloud_capex", 0.95, 1, "Hyperscalers allocate >$180B annualized capex to AI accelerators"),
            ("channel_cloud_capex", "sec_semiconductors", 0.90, 1, "Explosive demand for GPU clusters, HBM memory, and optical switches"),
            ("sec_semiconductors", "NVDA", 0.95, 1, "Dominant >80% market share in data center acceleration chips"),
            ("ai_infrastructure_boom", "MSFT", 0.85, 1, "Azure OpenAI integration and Copilot commercial monetization"),
            ("sec_semiconductors", "comm_semiconductors", 0.80, 1, "High silicon wafer consumption"),
            ("geo_us_china_tariffs", "sec_semiconductors", 0.75, -1, "Restrictions on advanced lithography and export license caps"),
            ("geo_us_china_tariffs", "NVDA", 0.70, -1, "Curbs on high-end chip shipments to Asian markets"),
            ("geo_us_china_tariffs", "AAPL", 0.65, -1, "Foxconn assembly exposure and tariff friction"),
            ("geo_us_china_tariffs", "TSLA", 0.60, -1, "Battery material tariffs and Shanghai gigafactory regulatory risks"),
            ("macro_fed_rate_hike", "channel_discount_rate", 0.90, 1, "Higher risk-free rate lifts DCF discount hurdle rates"),
            ("channel_discount_rate", "NVDA", 0.65, -1, "Higher discount rate pressures extreme long-duration multiples"),
            ("channel_discount_rate", "TSLA", 0.70, -1, "High borrowing rates curb automotive financing affordability"),
            ("macro_fed_rate_hike", "sec_banking", 0.60, 1, "Net Interest Margin (NIM) expansion on floating loan assets"),
            ("sec_banking", "HDFCBANK.NS", 0.70, 1, "Deposit franchise and credit growth repricing"),
            ("macro_rate_cut", "channel_discount_rate", 0.90, -1, "Eases borrowing costs and triggers tech multiple expansion"),
            ("macro_rate_cut", "sec_cloud_software", 0.75, 1, "Accelerates software buying cycles and SaaS budgets"),
            ("sec_cloud_software", "MSFT", 0.80, 1, "Enterprise cloud migrations accelerate"),
            ("channel_fx_inr_depr", "sec_indian_it", 0.75, 1, "US dollar billing generates currency tailwind for rupee earnings"),
            ("sec_indian_it", "TCS.NS", 0.85, 1, "BFSI digital transformation contracts in USD bolster EBITDA")
        ]

        for src, dst, wt, pol, mech in edges:
            self.graph.add_edge(src, dst, weight=wt, polarity=pol, mechanism=mech)

    def get_full_graph(self) -> Dict[str, Any]:
        nodes = []
        for n, data in self.graph.nodes(data=True):
            nodes.append({
                "id": n,
                "label": data.get("label", n),
                "type": data.get("type", "entity"),
                "group": data.get("group", "default"),
                "impact": data.get("impact", 0.0),
                "degree": self.graph.degree(n)
            })

        edges = []
        for u, v, data in self.graph.edges(data=True):
            edges.append({
                "source": u,
                "target": v,
                "weight": data.get("weight", 0.5),
                "polarity": data.get("polarity", 1),
                "mechanism": data.get("mechanism", "")
            })

        return {"nodes": nodes, "edges": edges}

    def trace_causal_chain(self, start_node: str, target_asset: str = None) -> List[Dict[str, Any]]:
        if start_node not in self.graph:
            return []

        chains = []
        targets = [target_asset] if target_asset and target_asset in self.graph else [
            n for n, d in self.graph.nodes(data=True) if d.get("type") in ("asset", "sector")
        ]

        for tgt in targets:
            if tgt == start_node:
                continue
            try:
                for path in nx.all_simple_paths(self.graph, source=start_node, target=tgt, cutoff=4):
                    chain_steps = []
                    cumulative_polarity = 1
                    cumulative_strength = 1.0

                    for i in range(len(path) - 1):
                        u = path[i]
                        v = path[i + 1]
                        edge_data = self.graph.get_edge_data(u, v)
                        pol = edge_data.get("polarity", 1)
                        wt = edge_data.get("weight", 0.5)
                        cumulative_polarity *= pol
                        cumulative_strength *= wt

                        chain_steps.append({
                            "from_id": u,
                            "from_label": self.graph.nodes[u].get("label", u),
                            "to_id": v,
                            "to_label": self.graph.nodes[v].get("label", v),
                            "mechanism": edge_data.get("mechanism", ""),
                            "weight": wt,
                            "polarity": "positive" if pol > 0 else "negative"
                        })

                    chains.append({
                        "path": [self.graph.nodes[p].get("label", p) for p in path],
                        "path_ids": path,
                        "steps": chain_steps,
                        "cumulative_impact": "positive" if cumulative_polarity > 0 else "negative",
                        "transmission_strength": round(cumulative_strength, 2)
                    })
            except Exception:
                continue

        chains.sort(key=lambda c: c["transmission_strength"], reverse=True)
        return chains[:8]

    def simulate_node_shock(self, node_id: str, intensity: float = 1.0) -> Dict[str, Any]:
        """
        Interactive Causal Shock Simulator:
        Propagates an exogenous shock from any node through the causal graph.
        """
        if node_id not in self.graph:
            return {"error": f"Node {node_id} not found in causal network."}

        origin_label = self.graph.nodes[node_id].get("label", node_id)
        origin_group = self.graph.nodes[node_id].get("group", "default")

        # BFS shock propagation
        visited = {node_id: {"delta_pct": 10.0 * intensity, "depth": 0, "polarity": 1}}
        queue = [(node_id, 10.0 * intensity, 0, 1)]

        impacted_nodes = []
        path_trails = []

        while queue:
            curr, curr_delta, depth, curr_pol = queue.pop(0)
            if depth >= 4:
                continue

            for neighbor in self.graph.successors(curr):
                edge_data = self.graph.get_edge_data(curr, neighbor)
                edge_pol = edge_data.get("polarity", 1)
                edge_wt = edge_data.get("weight", 0.5)

                new_pol = curr_pol * edge_pol
                transmitted_delta = round(curr_delta * edge_wt * edge_pol * 0.85, 1)

                if neighbor not in visited:
                    visited[neighbor] = {"delta_pct": transmitted_delta, "depth": depth + 1, "polarity": new_pol}
                    queue.append((neighbor, transmitted_delta, depth + 1, new_pol))

                    nbr_label = self.graph.nodes[neighbor].get("label", neighbor)
                    nbr_type = self.graph.nodes[neighbor].get("type", "entity")

                    impacted_nodes.append({
                        "id": neighbor,
                        "label": nbr_label,
                        "type": nbr_type,
                        "estimated_delta_pct": transmitted_delta,
                        "direction": "positive" if transmitted_delta >= 0 else "negative",
                        "depth": depth + 1,
                        "transmission_mechanism": edge_data.get("mechanism", "")
                    })

                    path_trails.append({
                        "from": self.graph.nodes[curr].get("label", curr),
                        "to": nbr_label,
                        "delta": transmitted_delta,
                        "mechanism": edge_data.get("mechanism", "")
                    })

        impacted_nodes.sort(key=lambda x: abs(x["estimated_delta_pct"]), reverse=True)

        return {
            "origin_id": node_id,
            "origin_label": origin_label,
            "origin_group": origin_group,
            "intensity": intensity,
            "impacted_entities_count": len(impacted_nodes),
            "impacted_entities": impacted_nodes,
            "transmission_trails": path_trails[:8],
            "executive_summary": (
                f"Simulating shock at '{origin_label}' triggers a cascade across {len(impacted_nodes)} "
                f"downstream sectors and equities. Major transmission impacts observed in "
                f"{', '.join([n['label'] for n in impacted_nodes[:3]])}."
            )
        }

    def get_asset_causal_neighborhood(self, asset_symbol: str) -> Dict[str, Any]:
        predecessors = list(self.graph.predecessors(asset_symbol)) if asset_symbol in self.graph else []
        incoming = []
        for p in predecessors:
            ed = self.graph.get_edge_data(p, asset_symbol)
            incoming.append({
                "source_id": p,
                "source_label": self.graph.nodes[p].get("label", p),
                "mechanism": ed.get("mechanism", ""),
                "polarity": ed.get("polarity", 1),
                "weight": ed.get("weight", 0.5)
            })

        all_events = [n for n, d in self.graph.nodes(data=True) if d.get("type") in ("event", "driver")]
        active_chains = []
        for ev in all_events:
            ch = self.trace_causal_chain(ev, asset_symbol)
            if ch:
                active_chains.extend(ch)

        active_chains.sort(key=lambda x: x["transmission_strength"], reverse=True)

        return {
            "asset": asset_symbol,
            "direct_drivers": incoming,
            "top_causal_chains": active_chains[:5]
        }


knowledge_graph_service = CausalKnowledgeGraphService()
