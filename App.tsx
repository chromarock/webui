"use client";

import React, { useState, useEffect } from "react";
import { Layout } from "./components/Layout";
import { Home } from "./components/Home";
import { Explore } from "./components/Explore";
import { Portfolio } from "./components/Portfolio";
import { Friends } from "./components/Friends";
import { MarketDetail } from "./components/MarketDetail";
import { CreateMarket } from "./components/CreateMarket";
import { Auth } from "./components/Auth";
import { Market, User, ViewState } from "./types";
import { suggestTrendingMarkets } from "./services/geminiService";

// Initial Mock Data
const INITIAL_MARKETS: Market[] = [
  {
    id: "1",
    title: "Fed Interest Rate Decision: March 2025",
    description:
      "Will the Federal Reserve cut interest rates at the March meeting? Current economic indicators suggest a cooling inflation rate, but labor markets remain tight.",
    imageUrl: "https://picsum.photos/400/300?grayscale&random=1",
    probability: 65,
    volume: 1250000,
    category: "Economics",
    endDate: "2025-03-20",
    history: [40, 42, 45, 43, 50, 55, 52, 58, 60, 62, 65],
    isAiGenerated: false,
    type: "global",
    aiInsight:
      "Market pricing in a 65% chance of a cut due to recent CPI data misses.",
    bullCase: ["CPI lower than expected", "Job growth slowing"],
    bearCase: ["Fed Chair signals caution", "Oil prices rising"],
  },
  {
    id: "2",
    title: "Bitcoin above $100k by Q3 2025",
    description:
      "Will Bitcoin trade above $100,000 USD on any major exchange before July 1st, 2025?",
    imageUrl: "https://picsum.photos/400/300?grayscale&random=2",
    probability: 32,
    volume: 4500000,
    category: "Crypto",
    endDate: "2025-07-01",
    history: [20, 25, 22, 28, 30, 29, 31, 32],
    isAiGenerated: false,
    type: "global",
    aiInsight:
      "Institutional inflows have slowed, reducing short-term upside probability.",
    bullCase: ["ETF Inflows increasing", "Halving supply shock"],
    bearCase: ["Regulatory headwinds", "Macro liquidity tightening"],
  },
  {
    id: "3",
    title: "Will Chris get a Girlfriend?",
    description:
      "Will Chris officially announce a relationship status change on Facebook before Dec 31st?",
    imageUrl: "https://picsum.photos/400/300?random=3",
    probability: 15,
    volume: 450,
    category: "Personal",
    endDate: "2025-12-31",
    history: [10, 10, 12, 11, 15],
    isAiGenerated: false,
    type: "social",
    creator: "Alex M.",
  },
];

const INITIAL_USER: User = {
  username: "",
  isLoggedIn: false,
  balance: 5000.0,
  portfolio: [],
  winRate: 0,
  pnlDay: 0,
};

type ThemeMode = "light" | "dark";

function App() {
  const [view, setView] = useState<ViewState>(ViewState.HOME);
  const [markets, setMarkets] = useState<Market[]>(INITIAL_MARKETS);
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);
  const [user, setUser] = useState<User>(INITIAL_USER);
  const [theme, setTheme] = useState<ThemeMode>("light");

  // Load trending markets on mount
  useEffect(() => {
    const fetchTrending = async () => {
      const newMarkets = await suggestTrendingMarkets();
      if (newMarkets.length > 0) {
        setMarkets((prev) => {
          const existingIds = new Set(prev.map((m) => m.title));
          const filteredNew = newMarkets.filter(
            (m) => !existingIds.has(m.title)
          );
          return [...prev, ...filteredNew];
        });
      }
    };
    fetchTrending();
  }, []);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const handleMarketClick = (market: Market) => {
    setSelectedMarket(market);
    setView(ViewState.MARKET_DETAIL);
  };

  const handleCreateMarket = (newMarket: Market) => {
    setMarkets([newMarket, ...markets]);
    setSelectedMarket(newMarket);
    setView(ViewState.MARKET_DETAIL);
  };

  const handleLoginSuccess = (username: string) => {
    setUser({
      ...user,
      username,
      isLoggedIn: true,
      winRate: 68,
      pnlDay: 124.5,
    });
    setView(ViewState.HOME);
  };

  const handleLogout = () => {
    setUser(INITIAL_USER);
    setView(ViewState.HOME);
  };

  const handleTrade = (
    marketId: string,
    outcome: "YES" | "NO",
    shares: number,
    cost: number
  ) => {
    setUser((prev) => {
      const newBalance = prev.balance - cost;
      const existingItemIndex = prev.portfolio.findIndex(
        (p) => p.marketId === marketId && p.outcome === outcome
      );
      let newPortfolio = [...prev.portfolio];

      if (existingItemIndex >= 0) {
        const item = newPortfolio[existingItemIndex];
        const totalShares = item.shares + shares;
        const totalCost = item.shares * item.avgPrice + cost;
        newPortfolio[existingItemIndex] = {
          ...item,
          shares: totalShares,
          avgPrice: totalCost / totalShares,
        };
      } else {
        newPortfolio.push({
          marketId,
          outcome,
          shares,
          avgPrice: cost / shares,
        });
      }

      return {
        ...prev,
        balance: newBalance,
        portfolio: newPortfolio,
      };
    });
  };

  // View Routing
  const renderContent = () => {
    switch (view) {
      case ViewState.HOME:
        return (
          <Home
            markets={markets}
            user={user}
            onMarketClick={handleMarketClick}
            onExplore={() => setView(ViewState.EXPLORE)}
          />
        );
      case ViewState.EXPLORE:
        return <Explore markets={markets} onMarketClick={handleMarketClick} />;
      case ViewState.FRIENDS:
        return (
          <Friends
            markets={markets}
            onMarketClick={handleMarketClick}
            onCreate={() => setView(ViewState.CREATE)}
          />
        );
      case ViewState.PORTFOLIO:
        return (
          <Portfolio
            user={user}
            markets={markets}
            onMarketClick={handleMarketClick}
            onLogin={() => setView(ViewState.LOGIN)}
          />
        );
      case ViewState.CREATE:
        return (
          <CreateMarket
            onMarketCreated={handleCreateMarket}
            onCancel={() => setView(ViewState.HOME)}
          />
        );
      case ViewState.MARKET_DETAIL:
        return selectedMarket ? (
          <MarketDetail
            market={selectedMarket}
            user={user}
            onBack={() => setView(ViewState.HOME)}
            onTrade={handleTrade}
            onRequestLogin={() => setView(ViewState.LOGIN)}
            theme={theme}
          />
        ) : null;
      case ViewState.LOGIN:
      case ViewState.SIGNUP:
        return (
          <Auth view={view} onSuccess={handleLoginSuccess} onSwitch={setView} />
        );
      default:
        return (
          <Home
            markets={markets}
            user={user}
            onMarketClick={handleMarketClick}
            onExplore={() => setView(ViewState.EXPLORE)}
          />
        );
    }
  };

  return (
    <Layout
      currentView={view}
      onChangeView={setView}
      user={user}
      onLogout={handleLogout}
      theme={theme}
      onToggleTheme={toggleTheme}
    >
      {renderContent()}
    </Layout>
  );
}

export default App;
