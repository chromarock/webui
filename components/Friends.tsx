"use client";

import React from "react";
import { Market } from "../types";
import { MarketCard } from "./MarketCard";
import { Button } from "./Button";
import { Users, Plus } from "lucide-react";

interface FriendsProps {
  markets: Market[];
  onMarketClick: (market: Market) => void;
  onCreate: () => void;
  onQuickTrade?: (market: Market, outcome: "YES" | "NO") => void;
}

export const Friends: React.FC<FriendsProps> = ({
  markets,
  onMarketClick,
  onCreate,
  onQuickTrade,
}) => {
  const socialMarkets = markets.filter((m) => m.type === "social");

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      <div className="flex justify-between items-end bg-brand-surface border border-brand-border p-8 rounded-2xl shadow-sm">
        <div>
          <h1 className="text-3xl font-bold text-text-primary mb-2 flex items-center gap-3">
            <Users className="text-brand-accent" />
            Social Markets
          </h1>
          <p className="text-text-secondary max-w-xl">
            Prediction markets for your inner circle. Bet on office pools,
            personal goals, and inside jokes.
          </p>
        </div>
        <Button
          onClick={onCreate}
          className="bg-pink-600 hover:bg-pink-500 text-white shadow-lg shadow-pink-900/30"
        >
          <Plus size={16} className="mr-2" />
          Create Social Market
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {socialMarkets.length > 0 ? (
          socialMarkets.map((market) => (
            <MarketCard
              key={market.id}
              market={market}
              onClick={onMarketClick}
              onQuickTrade={onQuickTrade}
            />
          ))
        ) : (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-brand-border rounded-xl">
            <Users size={48} className="mx-auto text-text-tertiary mb-4" />
            <h3 className="text-lg font-medium text-text-secondary">
              No friend markets active
            </h3>
            <p className="text-sm text-text-tertiary mb-6">
              Be the first to challenge your friends.
            </p>
            <Button onClick={onCreate} variant="secondary">
              Create One
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
