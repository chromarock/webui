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
      {/* Stats (hero removed per request) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
