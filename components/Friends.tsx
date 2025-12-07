"use client";

import React from "react";
import { Market } from "../types";
import { MarketCard } from "./MarketCard";
import { Button } from "./Button";
import { Users, Plus, Sparkles, ShieldCheck } from "lucide-react";

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
      <div className="rounded-2xl border border-brand-border bg-brand-surface dark:bg-brand-darker/70 px-5 sm:px-6 py-6 shadow-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="h-11 w-11 rounded-xl bg-brand-accent/10 dark:bg-brand-accent/15 border border-brand-border flex items-center justify-center text-brand-accent">
              <Users size={20} />
            </div>
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-brand-border text-[11px] font-semibold text-text-secondary dark:text-text-primary bg-white/70 dark:bg-brand-surface/40">
                <Sparkles size={13} className="text-brand-accent" />
                Social pools
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-text-primary dark:text-white leading-tight">
                Bet with your friends
              </h1>
              <p className="text-sm text-text-secondary dark:text-text-primary/80 max-w-2xl">
                Keep it simple: private rooms, quick settlements, inside jokes.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Button
              onClick={onCreate}
              className="bg-brand-accent hover:opacity-95 text-black dark:text-white px-5 py-2.5 shadow-brand-accent/25 shadow-lg"
            >
              <Plus size={16} className="mr-2" />
              Create Social Market
            </Button>
            <Button
              variant="secondary"
              onClick={onCreate}
              className="px-4 py-2.5"
            >
              Invite friends
            </Button>
          </div>
        </div>
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
