"use client";

import React from "react";
import { Market } from "../types";
import { MarketCard } from "./MarketCard";

interface ExploreProps {
  markets: Market[];
  onMarketClick: (market: Market) => void;
  onQuickTrade: (market: Market, outcome: "YES" | "NO") => void;
}

export const Explore: React.FC<ExploreProps> = ({
  markets,
  onMarketClick,
  onQuickTrade,
}) => {
  const filteredMarkets = markets.filter((m) => {
    return m.type === "global";
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Content */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredMarkets.length > 0 ? (
          filteredMarkets.map((market) => (
            <MarketCard
              key={market.id}
              market={market}
              onClick={onMarketClick}
              onQuickTrade={onQuickTrade}
            />
          ))
        ) : (
          <div className="py-20 text-center text-text-tertiary">
            No markets found. Try adjusting your filters.
          </div>
        )}
      </div>
    </div>
  );
};
