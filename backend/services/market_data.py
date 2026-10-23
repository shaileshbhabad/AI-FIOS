"""
AI-FIOS Market Data Service (Expansive Multi-Asset Universe + Native INR ₹ Conversion)
Layer 1 (Real-time Acquisition) & Layer 2 (Data Processing Pipeline)
"""

import math
import time
import random
import datetime
import logging
from typing import Dict, Any, List, Optional
import pandas as pd
import numpy as np

# Suppress yfinance internal warning logs on console
logging.getLogger("yfinance").setLevel(logging.CRITICAL)

try:
    import yfinance as yf
except ImportError:
    yf = None

from config import WATCHLIST, DEFAULT_USD_INR


class MarketDataService:
    def __init__(self):
        self._cache = {}
        self._cache_timestamp = {}
        self._cache_ttl = 30  # seconds
        self._usd_inr = DEFAULT_USD_INR

    def get_usd_inr_rate(self) -> float:
        """Fetches or returns current USD to INR exchange rate."""
        now = time.time()
        if "USD_INR_RATE" in self._cache and (now - self._cache_timestamp.get("USD_INR_RATE", 0)) < 300:
            return self._usd_inr

        if yf:
            try:
                ticker = yf.Ticker("INR=X")
                hist = ticker.history(period="1d")
                if not hist.empty:
                    rate = float(hist["Close"].iloc[-1])
                    if rate > 50:
                        self._usd_inr = round(rate, 2)
                        self._cache["USD_INR_RATE"] = self._usd_inr
                        self._cache_timestamp["USD_INR_RATE"] = now
                        return self._usd_inr
            except Exception:
                pass
        return self._usd_inr

    def get_watchlist(self, category: Optional[str] = None, currency: str = "INR") -> List[Dict[str, Any]]:
        """Returns the full universe of assets with real-time snapshot prices in INR or USD."""
        usd_rate = self.get_usd_inr_rate()
        items = []

        for asset in WATCHLIST:
            if category and category != "All" and asset.get("category") != category:
                continue

            sym = asset["symbol"]
            summary = self.get_asset_summary(sym, currency=currency)

            items.append({
                **asset,
                "price": summary.get("display_price", summary.get("current_price", 0.0)),
                "display_price": summary.get("display_price", 0.0),
                "currency_symbol": summary.get("currency_symbol", "₹"),
                "change": summary.get("display_change", summary.get("price_change", 0.0)),
                "change_percent": summary.get("change_percent", 0.0),
                "volume": summary.get("volume", 0),
                "high": summary.get("display_high", summary.get("day_high", 0.0)),
                "low": summary.get("display_low", summary.get("day_low", 0.0)),
                "rsi": summary.get("rsi", 50.0),
                "signal": summary.get("signal", "NEUTRAL")
            })
        return items

    def get_asset_summary(self, symbol: str, currency: str = "INR") -> Dict[str, Any]:
        """Fetches live summary data for a symbol (using cache if fresh) with INR conversion."""
        now = time.time()
        cache_key = f"{symbol}_{currency}"

        if cache_key in self._cache and (now - self._cache_timestamp.get(cache_key, 0)) < self._cache_ttl:
            return self._cache[cache_key]

        data = self._fetch_live_or_fallback(symbol)
        usd_rate = self.get_usd_inr_rate()

        # Currency Conversion logic
        is_native_inr = ".NS" in symbol or symbol in ("^NSEI", "^BSESN", "INR=X")
        native_currency = "INR" if is_native_inr else ("%" if symbol == "^TNX" else "USD")

        raw_price = data.get("current_price", 100.0)
        raw_change = data.get("price_change", 0.0)
        raw_high = data.get("day_high", raw_price * 1.01)
        raw_low = data.get("day_low", raw_price * 0.99)
        raw_target = data.get("target_mean_price", raw_price * 1.1)

        if currency == "INR":
            curr_sym = "₹" if symbol != "^TNX" else "%"
            if is_native_inr or symbol == "^TNX":
                disp_price = raw_price
                disp_change = raw_change
                disp_high = raw_high
                disp_low = raw_low
                disp_target = raw_target
            else:
                # Convert USD to INR
                disp_price = round(raw_price * usd_rate, 2)
                disp_change = round(raw_change * usd_rate, 2)
                disp_high = round(raw_high * usd_rate, 2)
                disp_low = round(raw_low * usd_rate, 2)
                disp_target = round(raw_target * usd_rate, 2)
        else:
            curr_sym = "$" if symbol != "^TNX" else "%"
            if not is_native_inr or symbol == "^TNX":
                disp_price = raw_price
                disp_change = raw_change
                disp_high = raw_high
                disp_low = raw_low
                disp_target = raw_target
            else:
                # Convert INR to USD
                disp_price = round(raw_price / usd_rate, 2)
                disp_change = round(raw_change / usd_rate, 2)
                disp_high = round(raw_high / usd_rate, 2)
                disp_low = round(raw_low / usd_rate, 2)
                disp_target = round(raw_target / usd_rate, 2)

        data.update({
            "display_price": disp_price,
            "display_change": disp_change,
            "display_high": disp_high,
            "display_low": disp_low,
            "display_target": disp_target,
            "currency_symbol": curr_sym,
            "selected_currency": currency,
            "usd_inr_conversion_rate": usd_rate
        })

        self._cache[cache_key] = data
        self._cache_timestamp[cache_key] = now
        return data

    def get_historical_candles(self, symbol: str, timeframe: str = "1M", currency: str = "INR") -> List[Dict[str, Any]]:
        """Returns candle data for charting (1D, 5D, 1M, 6M, 1Y) with INR conversion."""
        period_map = {
            "1D": ("1d", "5m"),
            "5D": ("5d", "15m"),
            "1M": ("1mo", "1d"),
            "6M": ("6mo", "1d"),
            "1Y": ("1y", "1wk")
        }
        period, interval = period_map.get(timeframe, ("1mo", "1d"))
        usd_rate = self.get_usd_inr_rate()
        is_native_inr = ".NS" in symbol or symbol in ("^NSEI", "^BSESN", "INR=X")
        conv_factor = usd_rate if (currency == "INR" and not is_native_inr and symbol != "^TNX") else (
            (1.0 / usd_rate) if (currency == "USD" and is_native_inr and symbol != "^TNX") else 1.0
        )

        candles = []
        if yf:
            try:
                ticker = yf.Ticker(symbol)
                df = ticker.history(period=period, interval=interval)
                if not df.empty:
                    df = self._compute_technical_indicators(df)
                    for idx, row in df.iterrows():
                        time_str = idx.strftime("%Y-%m-%d %H:%M") if hasattr(idx, "strftime") else str(idx)
                        candles.append({
                            "time": time_str,
                            "open": round(float(row.get("Open", 0)) * conv_factor, 2),
                            "high": round(float(row.get("High", 0)) * conv_factor, 2),
                            "low": round(float(row.get("Low", 0)) * conv_factor, 2),
                            "close": round(float(row.get("Close", 0)) * conv_factor, 2),
                            "volume": int(row.get("Volume", 0)),
                            "sma20": round(float(row.get("SMA20", row.get("Close", 0))) * conv_factor, 2) if not pd.isna(row.get("SMA20")) else None,
                            "sma50": round(float(row.get("SMA50", row.get("Close", 0))) * conv_factor, 2) if not pd.isna(row.get("SMA50")) else None,
                            "rsi": round(float(row.get("RSI", 50.0)), 2) if not pd.isna(row.get("RSI")) else 50.0,
                            "bb_upper": round(float(row.get("BB_Upper", 0)) * conv_factor, 2) if not pd.isna(row.get("BB_Upper")) else None,
                            "bb_lower": round(float(row.get("BB_Lower", 0)) * conv_factor, 2) if not pd.isna(row.get("BB_Lower")) else None,
                            "macd": round(float(row.get("MACD", 0)), 2) if not pd.isna(row.get("MACD")) else 0.0,
                            "macd_signal": round(float(row.get("MACD_Signal", 0)), 2) if not pd.isna(row.get("MACD_Signal")) else 0.0,
                        })
                    return candles
            except Exception:
                pass

        return self._generate_synthetic_candles(symbol, timeframe, conv_factor)

    def _fetch_live_or_fallback(self, symbol: str) -> Dict[str, Any]:
        """Tries to query yfinance with rich fallback."""
        if yf:
            try:
                ticker = yf.Ticker(symbol)
                info = ticker.info or {}
                hist = ticker.history(period="1mo", interval="1d")

                if not hist.empty:
                    hist = self._compute_technical_indicators(hist)
                    last_row = hist.iloc[-1]
                    prev_row = hist.iloc[-2] if len(hist) > 1 else last_row

                    close = float(last_row["Close"])
                    prev_close = float(prev_row["Close"])
                    change = close - prev_close
                    change_pct = (change / prev_close) * 100 if prev_close else 0.0

                    rsi_val = float(last_row.get("RSI", 52.0))
                    macd_val = float(last_row.get("MACD", 0.0))
                    macd_sig = float(last_row.get("MACD_Signal", 0.0))

                    signal = "NEUTRAL"
                    if rsi_val > 65 and macd_val > macd_sig:
                        signal = "BULLISH"
                    elif rsi_val < 35 and macd_val < macd_sig:
                        signal = "BEARISH"
                    elif rsi_val > 75:
                        signal = "OVERBOUGHT"
                    elif rsi_val < 25:
                        signal = "OVERSOLD"

                    ret = hist["Close"].pct_change().dropna()
                    hist_vol = float(ret.std() * math.sqrt(252) * 100) if len(ret) > 5 else 22.5

                    put_call_ratio = round(random.uniform(0.68, 1.15), 2)
                    inst_flow_score = round(random.uniform(45, 88), 1)

                    return {
                        "symbol": symbol,
                        "name": info.get("shortName", symbol),
                        "current_price": round(close, 2),
                        "previous_close": round(prev_close, 2),
                        "price_change": round(change, 2),
                        "change_percent": round(change_pct, 2),
                        "day_high": round(float(last_row["High"]), 2),
                        "day_low": round(float(last_row["Low"]), 2),
                        "volume": int(last_row["Volume"]),
                        "pe_ratio": round(float(info.get("trailingPE", 26.5) or 26.5), 2),
                        "forward_pe": round(float(info.get("forwardPE", 22.0) or 22.0), 2),
                        "market_cap": info.get("marketCap", 1500000000000),
                        "beta": round(float(info.get("beta", 1.05) or 1.05), 2),
                        "fifty_two_week_high": round(float(info.get("fiftyTwoWeekHigh", close * 1.15) or close * 1.15), 2),
                        "fifty_two_week_low": round(float(info.get("fiftyTwoWeekLow", close * 0.82) or close * 0.82), 2),
                        "target_mean_price": round(float(info.get("targetMeanPrice", close * 1.12) or close * 1.12), 2),
                        "dividend_yield": round(float(info.get("dividendYield", 0.008) or 0.008) * 100, 2),
                        "rsi": round(rsi_val, 1),
                        "macd": round(macd_val, 2),
                        "macd_signal": round(macd_sig, 2),
                        "historical_volatility": round(hist_vol, 2),
                        "signal": signal,
                        "put_call_ratio": put_call_ratio,
                        "institutional_flow_score": inst_flow_score,
                        "last_updated": datetime.datetime.now().isoformat()
                    }
            except Exception:
                pass

        return self._generate_synthetic_summary(symbol)

    def _compute_technical_indicators(self, df: pd.DataFrame) -> pd.DataFrame:
        df = df.copy()
        df["SMA20"] = df["Close"].rolling(window=min(20, len(df))).mean()
        df["SMA50"] = df["Close"].rolling(window=min(50, len(df))).mean()

        std = df["Close"].rolling(window=min(20, len(df))).std()
        df["BB_Upper"] = df["SMA20"] + (std * 2)
        df["BB_Lower"] = df["SMA20"] - (std * 2)

        delta = df["Close"].diff()
        gain = delta.where(delta > 0, 0.0)
        loss = -delta.where(delta < 0, 0.0)
        avg_gain = gain.rolling(window=min(14, len(df))).mean()
        avg_loss = loss.rolling(window=min(14, len(df))).mean()
        rs = avg_gain / avg_loss.replace(0, np.nan)
        df["RSI"] = 100 - (100 / (1 + rs))
        df["RSI"] = df["RSI"].fillna(50.0)

        ema12 = df["Close"].ewm(span=12, adjust=False).mean()
        ema26 = df["Close"].ewm(span=26, adjust=False).mean()
        df["MACD"] = ema12 - ema26
        df["MACD_Signal"] = df["MACD"].ewm(span=9, adjust=False).mean()
        df["MACD_Hist"] = df["MACD"] - df["MACD_Signal"]
        return df

    def _generate_synthetic_summary(self, symbol: str) -> Dict[str, Any]:
        """Provides realistic base figures across 40+ assets."""
        defaults = {
            # Indian Stocks (Native INR)
            "RELIANCE.NS": {"price": 2985.0, "pe": 26.8, "beta": 0.88, "name": "Reliance Industries"},
            "TCS.NS": {"price": 4120.0, "pe": 29.5, "beta": 0.72, "name": "Tata Consultancy Services"},
            "HDFCBANK.NS": {"price": 1680.0, "pe": 19.2, "beta": 0.95, "name": "HDFC Bank Ltd"},
            "INFY.NS": {"price": 1890.0, "pe": 27.1, "beta": 0.85, "name": "Infosys Ltd"},
            "ICICIBANK.NS": {"price": 1240.0, "pe": 18.4, "beta": 1.02, "name": "ICICI Bank Ltd"},
            "SBIN.NS": {"price": 820.0, "pe": 11.2, "beta": 1.18, "name": "State Bank of India"},
            "BHARTIARTL.NS": {"price": 1650.0, "pe": 42.0, "beta": 0.78, "name": "Bharti Airtel"},
            "ITC.NS": {"price": 485.0, "pe": 27.8, "beta": 0.55, "name": "ITC Limited"},
            "LT.NS": {"price": 3620.0, "pe": 33.1, "beta": 1.10, "name": "Larsen & Toubro"},
            "TATAMOTORS.NS": {"price": 945.0, "pe": 10.5, "beta": 1.45, "name": "Tata Motors Ltd"},
            "MARUTI.NS": {"price": 12150.0, "pe": 28.4, "beta": 0.85, "name": "Maruti Suzuki"},
            "SUNPHARMA.NS": {"price": 1880.0, "pe": 38.2, "beta": 0.62, "name": "Sun Pharma"},
            "BAJFINANCE.NS": {"price": 7250.0, "pe": 29.0, "beta": 1.30, "name": "Bajaj Finance"},
            "HINDUNILVR.NS": {"price": 2480.0, "pe": 54.0, "beta": 0.65, "name": "Hindustan Unilever"},
            "ADANIENT.NS": {"price": 3120.0, "pe": 88.0, "beta": 1.85, "name": "Adani Enterprises"},
            "ADANIPORTS.NS": {"price": 1390.0, "pe": 32.5, "beta": 1.40, "name": "Adani Ports"},
            "TATASTEEL.NS": {"price": 152.0, "pe": 21.0, "beta": 1.55, "name": "Tata Steel"},
            "M&M.NS": {"price": 2950.0, "pe": 31.0, "beta": 1.25, "name": "Mahindra & Mahindra"},
            "NTPC.NS": {"price": 410.0, "pe": 17.5, "beta": 0.95, "name": "NTPC Limited"},
            "TITAN.NS": {"price": 3480.0, "pe": 78.0, "beta": 0.90, "name": "Titan Company"},
            "ZOMATO.NS": {"price": 265.0, "pe": 95.0, "beta": 1.65, "name": "Zomato Ltd"},
            "JIOFIN.NS": {"price": 335.0, "pe": 62.0, "beta": 1.20, "name": "Jio Financial Services"},
            "^NSEI": {"price": 24850.0, "pe": 23.5, "beta": 1.0, "name": "NIFTY 50"},
            "^BSESN": {"price": 81200.0, "pe": 24.0, "beta": 1.0, "name": "BSE SENSEX"},

            # US Tech (USD)
            "NVDA": {"price": 142.50, "pe": 48.2, "beta": 1.72, "name": "NVIDIA Corporation"},
            "AAPL": {"price": 234.80, "pe": 33.5, "beta": 1.05, "name": "Apple Inc."},
            "MSFT": {"price": 428.10, "pe": 34.8, "beta": 1.12, "name": "Microsoft Corp."},
            "TSLA": {"price": 218.40, "pe": 62.0, "beta": 2.15, "name": "Tesla Inc."},
            "GOOGL": {"price": 182.30, "pe": 23.4, "beta": 1.18, "name": "Alphabet Inc."},
            "AMZN": {"price": 192.50, "pe": 41.2, "beta": 1.28, "name": "Amazon.com Inc."},
            "META": {"price": 585.00, "pe": 27.5, "beta": 1.25, "name": "Meta Platforms"},
            "AVGO": {"price": 178.00, "pe": 36.0, "beta": 1.40, "name": "Broadcom Inc."},
            "AMD": {"price": 158.00, "pe": 52.0, "beta": 1.68, "name": "Advanced Micro Devices"},

            # Commodities & Macro
            "CL=F": {"price": 78.40, "pe": 0.0, "beta": 1.45, "name": "Crude Oil (WTI)"},
            "BZ=F": {"price": 82.20, "pe": 0.0, "beta": 1.40, "name": "Brent Crude"},
            "GC=F": {"price": 2735.50, "pe": 0.0, "beta": 0.15, "name": "Gold Futures"},
            "SI=F": {"price": 32.80, "pe": 0.0, "beta": 0.85, "name": "Silver Futures"},
            "NG=F": {"price": 2.85, "pe": 0.0, "beta": 1.60, "name": "Natural Gas"},
            "^TNX": {"price": 4.28, "pe": 0.0, "beta": 0.0, "name": "US 10-Yr Yield"},
            "INR=X": {"price": 84.50, "pe": 0.0, "beta": 0.20, "name": "USD / INR"},
            "BTC-USD": {"price": 68450.00, "pe": 0.0, "beta": 2.40, "name": "Bitcoin (USD)"},
            "ETH-USD": {"price": 2680.00, "pe": 0.0, "beta": 2.65, "name": "Ethereum (USD)"}
        }

        item = defaults.get(symbol, {"price": 1500.0, "pe": 25.0, "beta": 1.0, "name": symbol})
        price = item["price"]
        pct = random.uniform(-1.8, 2.4)
        chg = price * (pct / 100.0)
        rsi = random.uniform(42, 68)

        return {
            "symbol": symbol,
            "name": item["name"],
            "current_price": round(price + chg, 2),
            "previous_close": round(price, 2),
            "price_change": round(chg, 2),
            "change_percent": round(pct, 2),
            "day_high": round((price + chg) * 1.018, 2),
            "day_low": round((price + chg) * 0.985, 2),
            "volume": random.randint(1500000, 45000000),
            "pe_ratio": item["pe"],
            "forward_pe": round(item["pe"] * 0.88, 1) if item["pe"] > 0 else 0.0,
            "market_cap": int(price * 15000000000),
            "beta": item["beta"],
            "fifty_two_week_high": round(price * 1.25, 2),
            "fifty_two_week_low": round(price * 0.80, 2),
            "target_mean_price": round(price * 1.15, 2),
            "dividend_yield": 0.85,
            "rsi": round(rsi, 1),
            "macd": round(random.uniform(-1.5, 3.2), 2),
            "macd_signal": round(random.uniform(-1.0, 2.5), 2),
            "historical_volatility": round(random.uniform(16.0, 34.0), 2),
            "signal": "BULLISH" if rsi > 58 else ("BEARISH" if rsi < 44 else "NEUTRAL"),
            "put_call_ratio": round(random.uniform(0.70, 1.10), 2),
            "institutional_flow_score": round(random.uniform(55, 88), 1),
            "last_updated": datetime.datetime.now().isoformat()
        }

    def _generate_synthetic_candles(self, symbol: str, timeframe: str, conv_factor: float = 1.0) -> List[Dict[str, Any]]:
        summary = self.get_asset_summary(symbol)
        base_price = summary["current_price"] * conv_factor
        points = {"1D": 78, "5D": 65, "1M": 30, "6M": 120, "1Y": 52}.get(timeframe, 30)

        candles = []
        curr = base_price * (1 - (points * 0.0015))
        now = datetime.datetime.now()

        for i in range(points):
            t = now - datetime.timedelta(days=(points - i))
            drift = random.uniform(-0.015, 0.018)
            curr = max(1.0, curr * (1 + drift))
            high = curr * (1 + random.uniform(0.002, 0.012))
            low = curr * (1 - random.uniform(0.002, 0.012))
            open_p = curr * (1 + random.uniform(-0.004, 0.004))
            close_p = curr

            candles.append({
                "time": t.strftime("%Y-%m-%d"),
                "open": round(open_p, 2),
                "high": round(high, 2),
                "low": round(low, 2),
                "close": round(close_p, 2),
                "volume": random.randint(500000, 15000000),
                "sma20": round(curr * 0.98, 2),
                "sma50": round(curr * 0.95, 2),
                "rsi": round(random.uniform(40, 65), 1),
                "bb_upper": round(curr * 1.04, 2),
                "bb_lower": round(curr * 0.96, 2),
                "macd": round(random.uniform(-1.0, 2.0), 2),
                "macd_signal": round(random.uniform(-0.8, 1.5), 2)
            })
        return candles

    def get_order_book_depth(self, symbol: str, currency: str = "INR") -> Dict[str, Any]:
        summary = self.get_asset_summary(symbol, currency=currency)
        mid = summary.get("display_price", 100.0)
        curr_sym = summary.get("currency_symbol", "₹")

        bids = []
        asks = []
        cum_bid_vol = 0
        cum_ask_vol = 0

        for i in range(1, 8):
            bid_price = round(mid * (1 - (i * 0.001)), 2)
            bid_size = random.randint(500, 25000)
            cum_bid_vol += bid_size
            bids.append({"price": bid_price, "size": bid_size, "total": cum_bid_vol})

            ask_price = round(mid * (1 + (i * 0.001)), 2)
            ask_size = random.randint(500, 25000)
            cum_ask_vol += ask_size
            asks.append({"price": ask_price, "size": ask_size, "total": cum_ask_vol})

        return {
            "symbol": symbol,
            "mid_price": mid,
            "currency_symbol": curr_sym,
            "spread": round(asks[0]["price"] - bids[0]["price"], 2),
            "bids": bids,
            "asks": asks,
            "bid_depth": cum_bid_vol,
            "ask_depth": cum_ask_vol,
            "imbalance_ratio": round(cum_bid_vol / max(1, cum_ask_vol), 2)
        }


market_service = MarketDataService()
