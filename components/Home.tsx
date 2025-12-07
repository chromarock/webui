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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
