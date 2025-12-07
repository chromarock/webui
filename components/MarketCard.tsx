"use client";

import React from "react";
import { Market } from "../types";
import { Sparkles, Heart, Users, Plus, RefreshCw } from "lucide-react";

interface MarketCardProps {
  market: Market;
  onClick: (market: Market) => void;
  onQuickTrade?: (market: Market, outcome: "YES" | "NO") => void;
}

export const MarketCard: React.FC<MarketCardProps> = ({
  market,
  onClick,
  onQuickTrade,
}) => {
  const refreshCadence = market.refreshCadence || "daily";
  const refreshLabel =
    refreshCadence.charAt(0).toUpperCase() + refreshCadence.slice(1);
  const yesProb = market.probability;
  const noProb = Math.max(0, 100 - yesProb);
  const totalVolumeK = (market.volume / 1000).toFixed(1);
  const isMulti = market.mode === "multi" && (market.choices?.length || 0) > 0;
  const topChoices = isMulti
    ? [...(market.choices || [])].sort(
        (a, b) => (b?.probability || 0) - (a?.probability || 0)
      )
    : [];
  const remainingChoices = Math.max(0, topChoices.length - 2);
  const previewStake = 100;
  const previewReturn = (prob: number) =>
    Math.round(previewStake * (1 + (prob / 100) * 0.25));

  return (
    <div
      onClick={() => onClick(market)}
      className="group relative bg-brand-surface border border-brand-border rounded-2xl overflow-hidden cursor-pointer hover:border-brand-accent/60 transition-all duration-200 hover:shadow-2xl hover:-translate-y-1 flex flex-col h-full"
    >
      <div className="absolute inset-x-0 top-0 h-1"></div>

      <div className="p-4 space-y-4 flex-1">
        {/* Header */}
        <div className="flex items-start justify-between gap-1">
          <div className="flex items-start gap-3">
            <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-brand-darker border border-brand-border shrink-0">
              <img
                src={market.imageUrl}
                alt={market.title}
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-green-500 border border-brand-surface shadow" />
            </div>
            <div className="space-y">
              <div className="flex items-center gap-2 text-[10px] uppercase text-text-tertiary tracking-wide">
                <span className="font-semibold">{market.category}</span>
              </div>
              <h3 className="text-sm sm:text-base text-text-primary leading-tight line-clamp-2 group-hover:text-brand-accent transition-colors">
                {market.title}
              </h3>
            </div>
          </div>

          {!isMulti && (
            <div className="text-right">
              <div className="text-xl font-mono font-normal text-text-primary leading-none">
                {yesProb}%
              </div>
            </div>
          )}
        </div>

        {/* Body */}
        {isMulti ? (
          <div className="bg-brand-surface border border-brand-border rounded-xl p-3 space-y-2">
            {topChoices.slice(0, 2).map((choice, idx) => (
              <div
                key={choice.id}
                className={`flex items-center gap-3 ${
                  idx !== Math.min(1, topChoices.length - 1)
                    ? "border-b border-brand-border pb-2"
                    : ""
                }`}
              >
                <div className="flex-1 text-sm font-normal text-text-primary">
                  {choice.label}
                </div>
                <div className="flex gap-2 flex-1 items-center">
                  <span className="text-xs text-text-secondary shrink-0">
                    {choice.probability}%
                  </span>
                  <div className="flex-1 rounded-lg px-3 py-1 text-xs font-normal text-center bg-[#02B8241a] text-[#02B824]">
                    Yes
                  </div>
                  <div className="flex-1 rounded-lg px-3 py-1 text-xs font-normal text-center bg-[#f90e1f1a] text-[#f90e1f]">
                    No
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3 text-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onQuickTrade?.(market, "YES");
                }}
                className="rounded-xl px-3 py-3 transition-colors flex flex-col items-center justify-center gap-1 bg-[#02B8241a] hover:bg-[#02B82433]"
              >
                <div className="text-sm font-semibold text-[#02B824]">Yes</div>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onQuickTrade?.(market, "NO");
                }}
                className="rounded-xl px-3 py-3 transition-colors flex flex-col items-center justify-center gap-1 bg-[#f90e1f1a] hover:bg-[#f90e1f33]"
              >
                <div className="text-sm font-semibold text-[#f90e1f]">No</div>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs text-text-secondary font-semibold text-center">
              <div className="flex items-center justify-center gap-2 px-1">
                <span>${previewStake}</span>
                <span className="text-sm font-semibold text-[#02B824]">
                  → ${previewReturn(yesProb)}
                </span>
              </div>
              <div className="flex items-center justify-center gap-2 px-1">
                <span>${previewStake}</span>
                <span className="text-sm font-semibold text-[#02B824]">
                  → ${previewReturn(noProb)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-brand-darker border-t border-brand-border p-3">
        <div className="flex justify-between items-center text-[11px] text-text-tertiary font-normal">
          <div className="flex items-center gap-2">
            <span>Vol: ${totalVolumeK}k</span>
            <span className="flex items-center gap-1 px-2 rounded-full border border-brand-border text-[10px] font-semibold text-text-secondary bg-brand-surface">
              <RefreshCw size={12} className="text-text-tertiary" />
              {refreshLabel.toUpperCase()}
            </span>
            {market.isAiGenerated && (
              <span className="flex items-center gap-1 px-2 rounded-full bg-brand-accent/10 text-brand-accent border border-brand-accent/40 text-[10px] uppercase font-semibold">
                <Sparkles size={12} />
                AI
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 text-text-secondary">
            <div className="flex items-center gap-1">
              <Users size={13} />
              <span>9.2k</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
