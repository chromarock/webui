import React from "react";
import { Market } from "../types";
import { MarketChart } from "./MarketChart";
import {
  TrendingUp,
  Sparkles,
  MoreHorizontal,
  Heart,
  Share2,
} from "lucide-react";

interface MarketCardProps {
  market: Market;
  onClick: (market: Market) => void;
}

export const MarketCard: React.FC<MarketCardProps> = ({ market, onClick }) => {
  const isSocial = market.type === "social";
  const isUp = market.history[market.history.length - 1] >= market.history[0];
  const yesProb = market.probability;
  const noProb = 100 - yesProb;
  const totalVolumeK = (market.volume / 1000).toFixed(1);
  const primaryTag = market.category;
  const hasAiTag = !!market.aiInsight || market.isAiGenerated;

  return (
    <div
      onClick={() => onClick(market)}
      className="group relative bg-brand-surface border border-brand-border rounded-2xl overflow-hidden cursor-pointer hover:border-brand-accent/60 transition-all duration-200 hover:shadow-2xl hover:-translate-y-1 flex flex-col h-full"
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-accent via-brand-accent-2 to-brand-accent-3 opacity-70"></div>
      {/* Top Row */}
      <div className="p-4 flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-darker border border-brand-border flex items-center justify-center text-sm font-bold text-text-primary shadow-inner">
            {primaryTag?.charAt(0) || "M"}
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold rounded-full bg-brand-darker text-text-secondary border border-brand-border">
                {primaryTag}
              </span>
              {hasAiTag && (
                <span className="px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold rounded-full bg-brand-accent/10 text-brand-accent border border-brand-accent/30">
                  AI Picks
                </span>
              )}
              {market.volume > 10000 && (
                <span className="flex items-center gap-1 px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold rounded-full bg-brand-accent-2/10 text-brand-accent-2 border border-brand-accent-2/30">
                  <TrendingUp size={10} /> Trending
                </span>
              )}
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-text-primary leading-tight line-clamp-2 group-hover:text-brand-accent transition-colors">
              {market.title}
            </h3>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 rounded-full text-[11px] font-semibold bg-brand-darker text-text-secondary border border-brand-border">
            Active
          </span>
          <button className="text-text-tertiary hover:text-text-primary transition-colors">
            <MoreHorizontal size={16} />
          </button>
        </div>
      </div>

      {/* Probability Bars */}
      <div className="px-4 space-y-3">
        <div className="bg-brand-darker border border-brand-border rounded-xl p-3 shadow-inner">
          <div className="flex justify-between text-[11px] font-semibold text-text-secondary mb-2">
            <span>Probability</span>
            <span className="text-text-tertiary">Implied</span>
          </div>
          <div className="relative h-3 rounded-full bg-brand-border overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full bg-market-yes"
              style={{ width: `${yesProb}%` }}
            ></div>
            <div
              className="absolute right-0 top-0 h-full bg-market-no"
              style={{ width: `${noProb}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-[11px] font-mono mt-2">
            <span className="text-market-yes font-bold">Yes {yesProb}%</span>
            <span className="text-market-no font-bold">No {noProb}%</span>
          </div>
        </div>

        {/* Buttons row */}
        <div className="flex gap-3">
          <div className="flex-1 bg-brand-darker border border-brand-border rounded-lg px-3 py-2 flex items-center justify-between">
            <span className="text-xs font-semibold text-text-secondary uppercase">
              Yes
            </span>
            <span className="text-base font-mono font-bold text-market-yes">
              {yesProb}%
            </span>
          </div>
          <div className="flex-1 bg-brand-darker border border-brand-border rounded-lg px-3 py-2 flex items-center justify-between">
            <span className="text-xs font-semibold text-text-secondary uppercase">
              No
            </span>
            <span className="text-base font-mono font-bold text-market-no">
              {noProb}%
            </span>
          </div>
        </div>
      </div>

      {/* Footer / AI Insight */}
      <div className="bg-brand-darker border-t border-brand-border p-3 mt-4">
        <div className="flex items-start gap-2">
          <Sparkles size={14} className="text-brand-accent mt-0.5 shrink-0" />
          <p className="text-xs text-text-secondary leading-snug line-clamp-2">
            {market.aiInsight || "AI analyzing market sentiment..."}
          </p>
        </div>
        <div className="flex justify-between items-center mt-3 text-[11px] text-text-tertiary font-medium">
          <span>Total deposits: ${totalVolumeK}k</span>
          <div className="flex items-center gap-3 text-text-secondary">
            <div className="flex items-center gap-1">
              <Heart size={13} className="text-market-no" />
              <span>12.4k</span>
            </div>
            <div className="flex items-center gap-1">
              <Share2 size={13} />
              <span>9.2k</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
