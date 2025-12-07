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
      <div className="relative overflow-hidden rounded-3xl border border-brand-border bg-gradient-to-br from-brand-surface/95 via-white/80 to-brand-darker/40 dark:from-brand-darker/90 dark:via-brand-darker/80 dark:to-brand-dark/70 backdrop-blur-xl shadow-[0_18px_48px_rgba(0,0,0,0.22)] dark:shadow-[0_14px_42px_rgba(0,0,0,0.5)] p-5 sm:p-6 lg:p-7">
        <div className="absolute -right-20 -top-24 w-56 h-56 bg-brand-accent/25 dark:bg-brand-accent/20 blur-3xl rounded-full" />
        <div className="absolute -left-10 bottom-0 w-48 h-48 bg-brand-accent-2/20 dark:bg-brand-accent-2/15 blur-3xl rounded-full" />

        <div className="relative flex flex-col lg:flex-row gap-5 lg:gap-6 lg:items-center justify-between">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-brand-border bg-white/70 dark:bg-brand-surface/20 text-xs font-semibold text-text-secondary dark:text-text-primary shadow-inner">
              <Sparkles size={14} className="text-brand-accent" />
              Curated social pools
            </div>

            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-2xl bg-brand-accent/10 dark:bg-brand-accent/15 border border-brand-border flex items-center justify-center text-brand-accent shadow-inner">
                <Users size={20} />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-text-primary dark:text-white leading-tight">
                  Social Markets
                </h1>
                <p className="text-sm text-text-secondary mt-1">
                  Bet with friends on office pools, personal goals, and inside
                  jokes — private, playful, and risk bounded.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1.5 rounded-full text-[11px] font-semibold bg-brand-darker text-text-secondary border border-brand-border dark:bg-brand-surface/10 dark:text-text-primary">
                Private rooms
              </span>
              <span className="px-3 py-1.5 rounded-full text-[11px] font-semibold bg-brand-accent/10 text-brand-accent border border-brand-accent/40 dark:bg-brand-accent/15">
                Instant settlement
              </span>
              <span className="px-3 py-1.5 rounded-full text-[11px] font-semibold bg-brand-accent-2/10 text-brand-accent-2 border border-brand-accent-2/40 flex items-center gap-1 dark:bg-brand-accent-2/15">
                <ShieldCheck size={14} />
                Secure by design
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Button
                onClick={onCreate}
                className="bg-brand-accent hover:opacity-95 text-black dark:text-white shadow-lg shadow-brand-accent/35 px-5 py-2.5"
              >
                <Plus size={16} className="mr-2" />
                Create Social Market
              </Button>
              <div className="flex items-center gap-3 text-xs text-text-secondary dark:text-text-primary/80">
                <div className="flex items-center gap-1">
                  <div className="h-2.5 w-2.5 rounded-full bg-brand-accent" />
                  <span>Real-time odds</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-2.5 w-2.5 rounded-full bg-brand-accent-2" />
                  <span>Invite-only access</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
            <div className="rounded-2xl border border-brand-border bg-white/70 dark:bg-brand-surface/10 backdrop-blur-md p-3.5 shadow-inner">
              <p className="text-[11px] uppercase font-semibold text-text-tertiary">
                Active pools
              </p>
              <p className="text-2xl font-bold text-text-primary dark:text-white mt-1">
                128
              </p>
              <p className="text-xs text-text-secondary mt-1">
                Live with friends
              </p>
            </div>
            <div className="rounded-2xl border border-brand-border bg-white/70 dark:bg-brand-surface/10 backdrop-blur-md p-3.5 shadow-inner">
              <p className="text-[11px] uppercase font-semibold text-text-tertiary">
                Avg pot
              </p>
              <p className="text-2xl font-bold text-text-primary dark:text-white mt-1">
                $820
              </p>
              <p className="text-xs text-text-secondary mt-1">
                Community stakes
              </p>
            </div>
            <div className="rounded-2xl border border-brand-border bg-white/70 dark:bg-brand-surface/10 backdrop-blur-md p-3.5 shadow-inner col-span-2">
              <p className="text-[11px] uppercase font-semibold text-text-tertiary">
                Settled this week
              </p>
              <p className="text-2xl font-bold text-text-primary dark:text-white mt-1">
                46
              </p>
              <p className="text-xs text-text-secondary mt-1">
                Fast resolutions, no drama
              </p>
            </div>
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
