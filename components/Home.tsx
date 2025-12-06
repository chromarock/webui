"use client";

import React from "react";
import { Market, User } from "../types";
import { MarketCard } from "./MarketCard";
import {
  DollarSign,
  Award,
  Search,
  SlidersHorizontal,
  Bookmark,
} from "lucide-react";
import { Button } from "./Button";

interface HomeProps {
  markets: Market[];
  user: User;
  onMarketClick: (market: Market) => void;
  onExplore: () => void;
}

export const Home: React.FC<HomeProps> = ({
  markets,
  user,
  onMarketClick,
  onExplore,
}) => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [activeTopic, setActiveTopic] = React.useState("For you");
  const pillScrollerRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(false);

  const updatePillScrollState = React.useCallback(() => {
    const el = pillScrollerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 4);
  }, []);

  React.useEffect(() => {
    updatePillScrollState();
    const el = pillScrollerRef.current;
    if (!el) return;
    const handleScroll = () => updatePillScrollState();
    const handleResize = () => updatePillScrollState();
    el.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    return () => {
      el.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [updatePillScrollState]);

  const topics = [
    "For you",
    "All",
    "Trump",
    "Fed",
    "Ukraine",
    "Venezuela",
    "Google Search",
    "Honduras Election",
    "Best of 2025",
    "Aztec",
    "Equities",
    "Epstein",
  ];

  const filtered = markets
    .filter((m) => m.type === "global")
    .filter((m) =>
      searchTerm
        ? m.title.toLowerCase().includes(searchTerm.toLowerCase())
        : true
    )
    .filter((m) =>
      activeTopic === "All" || activeTopic === "For you"
        ? true
        : m.title.toLowerCase().includes(activeTopic.toLowerCase())
    );

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Search + Topic Pills in one bar */}
      <div className="flex items-center gap-3 bg-brand-surface border border-brand-border rounded-2xl p-3 shadow-inner overflow-x-auto scrollbar-hide">
        <div className="flex items-center min-w-[220px] bg-brand-darker border border-brand-border rounded-xl px-3 py-2 flex-shrink-0">
          <Search size={16} className="text-text-tertiary mr-2" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search"
            className="w-full bg-transparent text-text-primary placeholder-text-tertiary focus:outline-none text-sm"
          />
        </div>
        <button className="p-2 rounded-lg border border-brand-border text-text-secondary hover:text-text-primary hover:border-brand-accent transition-colors flex-shrink-0">
          <SlidersHorizontal size={18} />
        </button>
        <button className="p-2 rounded-lg border border-brand-border text-text-secondary hover:text-text-primary hover:border-brand-accent transition-colors flex-shrink-0">
          <Bookmark size={18} />
        </button>
        <div className="relative flex-1 min-w-[200px]">
          <div
            className="flex items-center gap-2 flex-nowrap overflow-x-auto scrollbar-hide pr-14"
            ref={pillScrollerRef}
            onScroll={updatePillScrollState}
          >
            {topics.map((topic) => {
              const isActive = topic === activeTopic;
              return (
                <button
                  key={topic}
                  onClick={() => setActiveTopic(topic)}
                  className={`px-3 py-1.5 text-sm font-semibold rounded-full border transition-all flex-shrink-0 ${
                    isActive
                      ? "bg-brand-accent text-white border-brand-accent"
                      : "bg-brand-darker text-text-secondary border-brand-border hover:text-text-primary hover:border-brand-accent"
                  }`}
                >
                  {topic}
                </button>
              );
            })}
          </div>
          <div
            className={`pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-brand-surface via-brand-surface/80 to-transparent rounded-2xl transition-opacity ${
              canScrollRight ? "opacity-100" : "opacity-0"
            }`}
          ></div>
          <button
            aria-label="Scroll topics right"
            onClick={() =>
              pillScrollerRef.current?.scrollBy({
                left: 200,
                behavior: "smooth",
              })
            }
            className={`absolute inset-y-0 right-2 my-auto h-8 w-8 flex items-center justify-center rounded-full border border-brand-border bg-brand-surface text-text-secondary hover:text-text-primary hover:border-brand-accent transition-colors shadow-sm ${
              canScrollRight ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            ›
          </button>
          <button
            aria-label="Scroll topics left"
            onClick={() =>
              pillScrollerRef.current?.scrollBy({
                left: -200,
                behavior: "smooth",
              })
            }
            className={`absolute inset-y-0 left-2 my-auto h-8 w-8 flex items-center justify-center rounded-full border border-brand-border bg-brand-surface text-text-secondary hover:text-text-primary hover:border-brand-accent transition-colors shadow-sm ${
              canScrollLeft ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            ‹
          </button>
        </div>
      </div>

      {/* Hero / Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2 bg-brand-surface border border-brand-border rounded-3xl p-6 relative overflow-hidden group shadow-[0_24px_60px_rgba(0,0,0,0.35)]">
          <div className="absolute top-[-10%] right-[-10%] w-48 h-48 bg-brand-accent/30 blur-[90px] rounded-full"></div>
          <div className="absolute bottom-[-20%] left-[-10%] w-64 h-64 bg-brand-accent-2/25 blur-[100px] rounded-full"></div>
          <div className="relative z-10">
            <h1 className="text-2xl font-bold text-text-primary mb-1">
              {user.isLoggedIn
                ? `Welcome back, ${user.username}`
                : "Trade what you believe"}
            </h1>
            <p className="text-text-secondary text-sm mb-6 max-w-sm">
              Clean, focused, and fast—now with a Robinhood-inspired feel.
            </p>
            <div className="flex gap-3">
              <Button
                variant="accent"
                size="sm"
                onClick={onExplore}
                className="shadow-[0_15px_40px_rgba(241,153,63,0.35)]"
              >
                Explore Markets
              </Button>
              {!user.isLoggedIn && (
                <Button variant="secondary" size="sm" onClick={onExplore}>
                  See Pricing
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Mini Stat Cards */}
        <div className="bg-brand-surface border border-brand-border rounded-3xl p-5 flex flex-col justify-between hover:border-brand-accent/50 transition-colors shadow-[0_20px_45px_rgba(0,0,0,0.25)]">
          <div className="flex justify-between items-start">
            <span className="text-[10px] uppercase font-bold text-text-tertiary tracking-wide">
              Net P&L (24h)
            </span>
            <DollarSign size={16} className="text-market-yes" />
          </div>
          <div className="text-2xl font-mono font-bold text-text-primary mt-2">
            {user.isLoggedIn ? `+$${(user.pnlDay || 0).toFixed(2)}` : "---"}
          </div>
          <div className="w-full h-1.5 bg-brand-border mt-3 rounded-full overflow-hidden">
            <div className="h-full bg-market-yes w-[65%]"></div>
          </div>
        </div>

        <div className="bg-brand-surface border border-brand-border rounded-3xl p-5 flex flex-col justify-between hover:border-brand-accent/50 transition-colors shadow-[0_20px_45px_rgba(0,0,0,0.25)]">
          <div className="flex justify-between items-start">
            <span className="text-[10px] uppercase font-bold text-text-tertiary tracking-wide">
              Win Rate
            </span>
            <Award size={16} className="text-brand-accent" />
          </div>
          <div className="text-2xl font-mono font-bold text-text-primary mt-2">
            {user.isLoggedIn ? `${user.winRate || 0}%` : "---"}
          </div>
          <div className="w-full h-1.5 bg-brand-border mt-3 rounded-full overflow-hidden">
            <div className="h-full bg-brand-accent w-[42%]"></div>
          </div>
        </div>
      </div>

      {/* Main Feed */}
      <div>
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-xl font-bold text-text-primary">
            Trending Markets
          </h2>
          <button
            onClick={onExplore}
            className="text-sm text-brand-accent hover:text-text-primary transition-colors"
          >
            View All
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.slice(0, 6).map((market) => (
            <MarketCard
              key={market.id}
              market={market}
              onClick={onMarketClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
