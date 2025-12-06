"use client";

import React from "react";
import { Market, User } from "../types";
import { MarketCard } from "./MarketCard";
import { DollarSign, Award } from "lucide-react";
import { Button } from "./Button";

interface HomeProps {
  markets: Market[];
  user: User;
  onMarketClick: (market: Market) => void;
  onExplore: () => void;
  searchTerm: string;
  activeTopic: string;
  onQuickTrade: (market: Market, outcome: "YES" | "NO") => void;
}

export const Home: React.FC<HomeProps> = ({
  markets,
  user,
  onMarketClick,
  onExplore,
  searchTerm,
  activeTopic,
  onQuickTrade,
}) => {
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
              onQuickTrade={onQuickTrade}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
