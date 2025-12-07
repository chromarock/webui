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
    imageUrl: "https://picsum.photos/400/300?random=1",
    probability: 65,
    volume: 1250000,
    category: "Economics",
    endDate: "2025-03-20",
    refreshCadence: "daily",
    history: [40, 42, 45, 43, 50, 55, 52, 58, 60, 62, 65],
    isAiGenerated: false,
    type: "global",
    aiInsight:
      "Market pricing in a 65% chance of a cut due to recent CPI data misses.",
    bullCase: ["CPI lower than expected", "Job growth slowing"],
    bearCase: ["Fed Chair signals caution", "Oil prices rising"],
  },
  {
    id: "14",
    title: "Which countries will Trump visit in 2025?",
    description:
      "Predict the first international trips on the calendar for 2025. Each country has its own odds.",
    imageUrl: "https://picsum.photos/400/300?random=14",
    probability: 64, // lead choice probability for compatibility
    volume: 980000,
    category: "Politics",
    endDate: "2025-12-31",
    refreshCadence: "weekly",
    history: [35, 42, 44, 50, 53, 60, 64],
    isAiGenerated: true,
    type: "global",
    mode: "multi",
    choices: [
      {
        id: "china",
        label: "China",
        probability: 64,
        description: "Trade reset speculation lifts odds.",
      },
      {
        id: "india",
        label: "India",
        probability: 48,
        description: "Quad summit window in late Q2.",
      },
      {
        id: "denmark",
        label: "Denmark",
        probability: 22,
        description: "NATO and Greenland chatter.",
      },
      {
        id: "uae",
        label: "UAE",
        probability: 31,
        description: "Energy and investment forum invite.",
      },
      {
        id: "mexico",
        label: "Mexico",
        probability: 40,
        description: "Border negotiations headline agenda.",
      },
    ],
    aiInsight:
      "Itinerary chatter points to Asia-first, with India and China leading whispers; Europe stops look lower probability unless tied to NATO summitry.",
  },
  {
    id: "2",
    title: "Bitcoin above $100k by Q3 2025",
    description:
      "Will Bitcoin trade above $100,000 USD on any major exchange before July 1st, 2025?",
    imageUrl: "https://picsum.photos/400/300?random=2",
    probability: 32,
    volume: 4500000,
    category: "Crypto",
    endDate: "2025-07-01",
    refreshCadence: "hourly",
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
  {
    id: "4",
    title: "US presidential approval above 50% in June 2025",
    description:
      "Will the sitting US president record a Gallup approval rating above 50% at any point in June 2025?",
    imageUrl: "https://picsum.photos/400/300?random=4",
    probability: 41,
    volume: 780000,
    category: "Politics",
    endDate: "2025-06-30",
    history: [33, 35, 34, 37, 39, 41],
    isAiGenerated: true,
    type: "global",
    aiInsight:
      "Soft-landing narrative is helping sentiment, but border policy noise keeps upside capped.",
    bullCase: [
      "Inflation keeps easing",
      "Foreign policy wins boost favorables",
    ],
    bearCase: [
      "Persistent cost of living",
      "Hill gridlock dominates headlines",
    ],
  },
  {
    id: "5",
    title: "OpenAI ships GPT-5 API by August 2025",
    description:
      "Will OpenAI publicly release a GPT-5 API endpoint for developers before August 31, 2025?",
    imageUrl: "https://picsum.photos/400/300?random=5",
    probability: 58,
    volume: 1320000,
    category: "Tech",
    endDate: "2025-08-31",
    history: [45, 48, 50, 53, 55, 58],
    isAiGenerated: true,
    type: "global",
    aiInsight:
      "Hiring signals and partner briefings point to a mid-year model drop if safety reviews stay on track.",
    bullCase: [
      "Red-teaming milestones hit",
      "Enterprise demand pressures launch",
    ],
    bearCase: ["Regulatory scrutiny slows release", "Compute costs delay GA"],
  },
  {
    id: "6",
    title: "Ethereum trades above $5k before May 2025",
    description:
      "Will ETH print a daily close above $5,000 on any major exchange before May 1, 2025?",
    imageUrl: "https://picsum.photos/400/300?random=6",
    probability: 37,
    volume: 2120000,
    category: "Crypto",
    endDate: "2025-05-01",
    history: [28, 30, 32, 31, 35, 37],
    isAiGenerated: true,
    type: "global",
    aiInsight:
      "Staking yields and ETF chatter help, but macro liquidity and BTC dominance remain headwinds.",
    bullCase: ["ETF approvals expand access", "L2 activity sustains fees"],
    bearCase: ["Macro risk-off", "Regulatory pressure on staking"],
  },
  {
    id: "7",
    title: "SpaceX Starship reflies the same booster in 2025",
    description:
      "Will SpaceX achieve a successful Starship launch using a previously flown Super Heavy booster before December 31, 2025?",
    imageUrl: "https://picsum.photos/400/300?random=7",
    probability: 62,
    volume: 960000,
    category: "Science",
    endDate: "2025-12-31",
    history: [48, 50, 55, 58, 60, 62],
    isAiGenerated: true,
    type: "global",
    aiInsight:
      "Rapid cadence on test hardware and FAA coordination suggest reusability trials stay on schedule.",
    bullCase: ["FAA approvals accelerate", "Raptor supply chain steady"],
    bearCase: ["Thermal issues persist", "Pad refurbishment slows cadence"],
  },
  {
    id: "8",
    title: "Apple announces Vision Pro 2 at WWDC 2025",
    description:
      "Will Apple preview or announce a second-generation Vision Pro headset during WWDC 2025?",
    imageUrl: "https://picsum.photos/400/300?random=8",
    probability: 54,
    volume: 540000,
    category: "Tech",
    endDate: "2025-06-15",
    history: [42, 45, 47, 50, 52, 54],
    isAiGenerated: true,
    type: "global",
    aiInsight:
      "Developer kit rumors and supply chain checks point to a slimmer refresh, but pricing could slip.",
    bullCase: ["Manufacturing yields improve", "Competition pressures roadmap"],
    bearCase: ["Component shortages", "Focus shifts to software features"],
  },
  {
    id: "9",
    title: "Global CPI inflation falls below 2.5% YoY by Dec 2025",
    description:
      "Will aggregated G20 CPI inflation land under 2.5% year-over-year by the December 2025 print?",
    imageUrl: "https://picsum.photos/400/300?random=9",
    probability: 36,
    volume: 880000,
    category: "Economics",
    endDate: "2026-01-31",
    history: [30, 31, 32, 34, 35, 36],
    isAiGenerated: true,
    type: "global",
    aiInsight:
      "Energy base effects help, but services inflation and wage stickiness keep odds below 40%.",
    bullCase: ["Oil stays range-bound", "Productivity uptick tempers wages"],
    bearCase: ["Geopolitical supply shocks", "Services inflation stays sticky"],
  },
  {
    id: "10",
    title: "Los Angeles Lakers reach the 2025 NBA Finals",
    description:
      "Will the Lakers win the Western Conference and appear in the 2025 NBA Finals?",
    imageUrl: "https://picsum.photos/400/300?random=10",
    probability: 28,
    volume: 350000,
    category: "Sports",
    endDate: "2025-06-15",
    history: [22, 24, 25, 26, 27, 28],
    isAiGenerated: true,
    type: "global",
    aiInsight:
      "Healthy minutes from stars boost ceiling, but depth and defense rank middle of the pack.",
    bullCase: ["Roster stays healthy", "Trade deadline upgrade hits"],
    bearCase: ["Defense leaks on perimeter", "Older roster fatigue risk"],
  },
  {
    id: "11",
    title: "EU AI Act enforcement begins before Q4 2025",
    description:
      "Will core enforcement provisions of the EU AI Act be in effect before October 1, 2025?",
    imageUrl: "https://picsum.photos/400/300?random=11",
    probability: 52,
    volume: 610000,
    category: "Politics",
    endDate: "2025-10-01",
    history: [44, 46, 48, 50, 51, 52],
    isAiGenerated: true,
    type: "global",
    aiInsight:
      "Member states are lining up oversight bodies, but guidance on foundation models could slide timelines.",
    bullCase: ["Consensus on risk tiers", "Political momentum pre-elections"],
    bearCase: ["Legal challenges", "Implementation guidance delayed"],
  },
  {
    id: "12",
    title: "NVIDIA guides FY2026 revenue above $120B",
    description:
      "Will NVIDIA issue FY2026 revenue guidance exceeding $120 billion in its next full-year outlook?",
    imageUrl: "https://picsum.photos/400/300?random=12",
    probability: 57,
    volume: 1750000,
    category: "Tech",
    endDate: "2025-12-15",
    history: [48, 50, 52, 54, 55, 57],
    isAiGenerated: true,
    type: "global",
    aiInsight:
      "Hyperscaler capex plans stay elevated, but supply constraints and China controls are watch-outs.",
    bullCase: ["AI server demand persists", "New GPU ramp hits yield targets"],
    bearCase: ["Export controls expand", "Capex digestion in late 2025"],
  },
  {
    id: "13",
    title: "India flies a crewed Gaganyaan mission before 2026",
    description:
      "Will ISRO complete its first crewed Gaganyaan orbital mission before January 1, 2026?",
    imageUrl: "https://picsum.photos/400/300?random=13",
    probability: 35,
    volume: 420000,
    category: "Science",
    endDate: "2025-12-31",
    history: [28, 30, 31, 33, 34, 35],
    isAiGenerated: true,
    type: "global",
    aiInsight:
      "Pad abort tests are promising, but crew module life-support timelines keep odds under 40%.",
    bullCase: ["Successful uncrewed re-entry", "Budget approvals intact"],
    bearCase: ["Schedule slips on escape system", "Supplier delays"],
  },
  {
    id: "15",
    title: "US economy enters a recession in 2025",
    description:
      "Will the NBER declare a recession with a 2025 start date by year-end revisions?",
    imageUrl: "https://picsum.photos/400/300?random=15",
    probability: 38,
    volume: 1500000,
    category: "Economics",
    endDate: "2025-12-31",
    history: [28, 30, 32, 31, 35, 36, 38],
    isAiGenerated: true,
    type: "global",
    aiInsight:
      "Goods disinflation helps, but rising unemployment claims and tighter credit keep downside odds elevated.",
  },
  {
    id: "16",
    title: "SEC approves a spot ETH ETF by June 2025",
    description:
      "Will the SEC approve any spot Ethereum ETF application before June 30, 2025?",
    imageUrl: "https://picsum.photos/400/300?random=16",
    probability: 47,
    volume: 2200000,
    category: "Crypto",
    endDate: "2025-06-30",
    history: [34, 38, 40, 42, 45, 47],
    isAiGenerated: true,
    type: "global",
    aiInsight:
      "Court precedent narrows denial options, but staking clarity and market structure questions keep odds under 50%.",
  },
  {
    id: "17",
    title: "Apple hits a $4T market cap in 2025",
    description:
      "Will Apple close any trading day in 2025 with a market capitalization above $4 trillion?",
    imageUrl: "https://picsum.photos/400/300?random=17",
    probability: 29,
    volume: 1800000,
    category: "Tech",
    endDate: "2025-12-31",
    history: [20, 22, 24, 26, 27, 29],
    isAiGenerated: true,
    type: "global",
    aiInsight:
      "Vision Pro ramp and AI features help sentiment, but valuation and hardware cycle risk cap upside.",
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
const QUICK_TRADE_COST = 10;

function App() {
  const [view, setView] = useState<ViewState>(ViewState.HOME);
  const [markets, setMarkets] = useState<Market[]>(INITIAL_MARKETS);
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);
  const [user, setUser] = useState<User>(INITIAL_USER);
  const [theme, setTheme] = useState<ThemeMode>("dark");
  const [homeSearchTerm, setHomeSearchTerm] = useState("");
  const [homeActiveTopic, setHomeActiveTopic] = useState("For you");

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

  const handleQuickTrade = (market: Market, outcome: "YES" | "NO") => {
    if (!user.isLoggedIn) {
      setView(ViewState.LOGIN);
      return;
    }
    const price =
      outcome === "YES" ? market.probability : 100 - market.probability;
    const shares = Math.max(1, Math.floor(QUICK_TRADE_COST / (price / 100)));
    handleTrade(market.id, outcome, shares, QUICK_TRADE_COST);
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
            searchTerm={homeSearchTerm}
            activeTopic={homeActiveTopic}
            onQuickTrade={handleQuickTrade}
          />
        );
      case ViewState.EXPLORE:
        return (
          <Explore
            markets={markets}
            onMarketClick={handleMarketClick}
            onQuickTrade={handleQuickTrade}
          />
        );
      case ViewState.FRIENDS:
        return (
          <Friends
            markets={markets}
            onMarketClick={handleMarketClick}
            onCreate={() => setView(ViewState.CREATE)}
            onQuickTrade={handleQuickTrade}
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
            searchTerm={homeSearchTerm}
            activeTopic={homeActiveTopic}
            onQuickTrade={handleQuickTrade}
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
      homeSearchTerm={homeSearchTerm}
      homeActiveTopic={homeActiveTopic}
      onHomeSearchChange={setHomeSearchTerm}
      onHomeTopicChange={setHomeActiveTopic}
    >
      {renderContent()}
    </Layout>
  );
}

export default App;
