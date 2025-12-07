"use client";

import React, { useState, useEffect } from "react";
import { Market, User } from "../types";
import { MarketChart } from "./MarketChart";
import { Button } from "./Button";
import { analyzeMarket } from "../services/geminiService";
import { MarketChat } from "./MarketChat";
import {
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Info,
  AlertTriangle,
} from "lucide-react";

interface MarketDetailProps {
  market: Market;
  user: User;
  onBack: () => void;
  onTrade: (
    marketId: string,
    outcome: "YES" | "NO",
    shares: number,
    cost: number
  ) => void;
  onRequestLogin: () => void;
  theme?: "light" | "dark";
}

export const MarketDetail: React.FC<MarketDetailProps> = ({
  market,
  user,
  onBack,
  onTrade,
  onRequestLogin,
  theme = "dark",
}) => {
  const isDark = theme === "dark";
  const history = market.history || [];
  const currentPrice =
    history.length > 0 ? history[history.length - 1] : market.probability;
  const startPrice = history.length > 0 ? history[0] : market.probability;
  const priceDelta = currentPrice - startPrice;
  const priceDeltaPct =
    startPrice === 0 ? 0 : ((priceDelta / startPrice) * 100).toFixed(1);
  const isMulti = market.mode === "multi" && (market.choices?.length || 0) > 0;
  const [outcome, setOutcome] = useState<"YES" | "NO">("YES");
  const [amount, setAmount] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"Overview" | "Activity">(
    "Overview"
  );
  const [aiData, setAiData] = useState<{
    insight: string;
    bullCase: string[];
    bearCase: string[];
  } | null>(null);

  useEffect(() => {
    // Initial analysis fetch
    const fetchAnalysis = async () => {
      if (!market.isAiGenerated && !market.aiInsight) {
        const data = await analyzeMarket(market);
        setAiData(data);
      } else if (market.aiInsight) {
        // If we already have basic insight, maybe just fetch structured args if missing
        // For simplicity, let's just refetch or use mock
        setAiData({
          insight: market.aiInsight || "Analysis loading...",
          bullCase: market.bullCase || [
            "Positive sentiment growing",
            "Volume increasing",
          ],
          bearCase: market.bearCase || [
            "Resistance at 60%",
            "News cycle slowing",
          ],
        });
      } else {
        const data = await analyzeMarket(market);
        setAiData(data);
      }
    };
    fetchAnalysis();
  }, [market]);

  const price =
    outcome === "YES" ? market.probability : 100 - market.probability;
  const shares = amount ? Math.floor(parseFloat(amount) / (price / 100)) : 0;
  const potentialReturn = shares * 1;
  const potentialProfit = potentialReturn - parseFloat(amount || "0");
  const roi = amount
    ? ((potentialProfit / parseFloat(amount)) * 100).toFixed(1)
    : "0.0";

  const handleTrade = () => {
    if (!user.isLoggedIn) return onRequestLogin();
    if (!amount) return;
    onTrade(market.id, outcome, shares, parseFloat(amount));
    setAmount("");
  };

  return (
    <div className="max-w-[1600px] mx-auto animate-fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center text-xs text-text-tertiary mb-6">
        <button
          onClick={onBack}
          className="hover:text-text-primary transition-colors"
        >
          Markets
        </button>
        <ChevronRight size={12} className="mx-2" />
        <span className="text-text-secondary">{market.category}</span>
        <ChevronRight size={12} className="mx-2" />
        <span className="text-text-primary truncate max-w-[200px]">
          {market.title}
        </span>
      </div>

      {/* Chart + Trade (desktop) */}
      <div className="mb-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:items-stretch">
        <div
          className={`lg:col-span-9 h-full min-h-[420px] sm:min-h-[500px] relative overflow-hidden rounded-2xl border shadow-xl select-none ${
            isDark
              ? "border-brand-border bg-gradient-to-br from-brand-surface/80 via-brand-darker/70 to-brand-surface/60"
              : "border-brand-border/80 bg-gradient-to-br from-white via-brand-surface to-white"
          }`}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.12),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(16,185,129,0.12),transparent_30%),radial-gradient(circle_at_50%_80%,rgba(236,72,153,0.10),transparent_35%)] pointer-events-none" />
          <div
            className={`absolute inset-4 rounded-2xl backdrop-blur-sm ${
              isDark ? "border border-white/5" : "border border-black/5"
            }`}
          />

          <div className="relative h-full p-4 sm:p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between gap-2 sm:gap-3 flex-wrap text-xs sm:text-sm">
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <div className="px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-semibold bg-black/10 border border-white/10 text-text-primary">
                  Price history
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-semibold border ${
                    priceDelta >= 0
                      ? "bg-emerald-500/10 text-emerald-300 border-emerald-400/40"
                      : "bg-rose-500/10 text-rose-300 border-rose-400/40"
                  }`}
                >
                  {priceDelta >= 0 ? "+" : "-"}
                  {Math.abs(priceDelta).toFixed(1)} pts
                </span>
              </div>
              <div className="flex gap-1.5 sm:gap-2">
                {["1H", "1D", "1W", "All"].map((t) => (
                  <button
                    key={t}
                    className={`px-2.5 sm:px-3 py-1 text-[10px] sm:text-xs rounded-full border transition-all ${
                      isDark
                        ? "border-white/10 bg-white/5 text-text-secondary hover:text-text-primary hover:border-brand-accent/60"
                        : "border-black/10 bg-black/5 text-text-secondary hover:text-text-primary hover:border-brand-accent/60"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-6 flex-wrap text-xs sm:text-base">
              <div className="flex items-baseline gap-1.5 sm:gap-2">
                <span className="text-2xl sm:text-4xl font-mono font-bold text-text-primary">
                  {currentPrice.toFixed(1)}%
                </span>
                <span
                  className={`text-xs sm:text-sm font-semibold ${
                    priceDelta >= 0 ? "text-emerald-300" : "text-rose-300"
                  }`}
                >
                  {priceDelta >= 0 ? "+" : "-"}
                  {Math.abs(priceDelta).toFixed(1)} ({priceDeltaPct}%)
                </span>
              </div>
              <div className="text-[11px] sm:text-xs text-text-secondary">
                From {startPrice.toFixed(1)}% start · {history.length} pts
              </div>
            </div>

            <div
              className={`relative flex-1 rounded-xl border backdrop-blur-sm overflow-hidden ${
                isDark
                  ? "border-white/5 bg-black/10"
                  : "border-black/10 bg-white/60"
              }`}
            >
              <div className="h-full min-h-[320px]">
                <MarketChart
                  data={history}
                  height="100%"
                  showGradient={true}
                  strokeWidth={3}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Trade card beside chart on desktop */}
        <div className="hidden lg:block lg:col-span-3">
          <div className="h-full bg-brand-surface border border-brand-border rounded-2xl p-5 shadow-md space-y-4 flex flex-col">
            {/* Buy / Sell */}
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-market-yes/15 text-market-yes border border-market-yes/40">
                Buy
              </button>
              <button className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-darker text-text-secondary border border-brand-border">
                Sell
              </button>
              <span className="ml-auto text-[11px] text-text-secondary">
                Limit
              </span>
            </div>

            {/* Yes / No switch with price */}
            <div className="flex bg-brand-darker rounded-lg p-1 border border-brand-border">
              <button
                onClick={() => setOutcome("YES")}
                className={`flex-1 py-2 text-sm font-bold rounded transition-all flex items-center justify-center gap-1 ${
                  outcome === "YES"
                    ? "bg-market-yes text-white shadow"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                <span>YES</span>
                <span className="text-[11px] font-mono">
                  {market.probability}¢
                </span>
              </button>
              <button
                onClick={() => setOutcome("NO")}
                className={`flex-1 py-2 text-sm font-bold rounded transition-all flex items-center justify-center gap-1 ${
                  outcome === "NO"
                    ? "bg-market-no text-white shadow"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                <span>NO</span>
                <span className="text-[11px] font-mono">
                  {100 - market.probability}¢
                </span>
              </button>
            </div>

            {/* Amount & contracts */}
            <div className="space-y-3">
              <div>
                <label className="text-[10px] uppercase font-bold text-text-tertiary">
                  Amount ($)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-brand-darker border border-brand-border rounded-lg p-3 text-text-primary font-mono text-lg focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-brand-darker border border-brand-border rounded-lg p-3">
                  <div className="text-[11px] text-text-tertiary font-semibold">
                    Contracts
                  </div>
                  <div className="text-lg font-mono text-text-primary">
                    {shares}
                  </div>
                  <div className="text-[10px] text-text-tertiary">
                    Earn $1 if correct
                  </div>
                </div>
                <div className="bg-brand-darker border border-brand-border rounded-lg p-3">
                  <div className="text-[11px] text-text-tertiary font-semibold">
                    Limit price (¢)
                  </div>
                  <div className="text-lg font-mono text-text-primary">
                    {price}
                  </div>
                  <div className="text-[10px] text-text-tertiary">
                    You can adjust before submitting
                  </div>
                </div>
              </div>
            </div>

            {/* Expiration / order type */}
            <div className="space-y-2">
              <div className="text-[11px] uppercase text-text-tertiary font-bold">
                Expiration
              </div>
              <div className="flex flex-wrap gap-2">
                <button className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-darker text-text-secondary border border-brand-border hover:text-text-primary">
                  GTC
                </button>
                <button className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-darker text-text-secondary border border-brand-border hover:text-text-primary">
                  At event start
                </button>
                <button className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-darker text-text-secondary border border-brand-border hover:text-text-primary">
                  IOC
                </button>
              </div>
            </div>

            {/* Summary */}
            <div className="space-y-2 pt-2 border-t border-brand-border/50 mt-auto">
              <div className="flex justify-between text-xs">
                <span className="text-text-tertiary">Price</span>
                <span className="text-text-primary font-mono">{price}¢</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-text-tertiary">Est. Return</span>
                <span className="text-market-yes font-mono">
                  +${potentialProfit.toFixed(2)} ({roi}%)
                </span>
              </div>
            </div>

            <Button
              variant={outcome === "YES" ? "success" : "danger"}
              className="w-full py-3 text-base font-bold"
              onClick={handleTrade}
              disabled={!amount || parseFloat(amount) <= 0}
            >
              {user.isLoggedIn ? "Review Order" : "Log In to Trade"}
            </Button>
            <div className="text-center text-[10px] text-text-tertiary">
              Max position limit: $500.00
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: Summary (3 cols) */}
        <div className="lg:col-span-3 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-text-primary leading-tight mb-4">
              {market.title}
            </h1>
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="px-2 py-1 bg-market-yes/10 text-market-yes text-xs font-bold rounded border border-market-yes/20">
                OPEN
              </span>
              <span className="px-2 py-1 bg-brand-surface text-text-secondary text-xs font-bold rounded border border-brand-border">
                Ends {market.endDate}
              </span>
            </div>
          </div>

          {/* Probability Pills */}
          <div className="grid grid-cols-2 gap-3">
            <div
              className={`p-4 rounded-xl border transition-all ${
                market.probability >= 50
                  ? "bg-market-yes/10 border-market-yes/50"
                  : "bg-brand-surface border-brand-border opacity-60"
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-bold text-text-secondary">
                  YES
                </span>
                <ArrowUpRight
                  size={16}
                  className={
                    market.probability >= 50
                      ? "text-market-yes"
                      : "text-text-tertiary"
                  }
                />
              </div>
              <div
                className={`text-4xl font-mono font-bold ${
                  market.probability >= 50
                    ? "text-market-yes"
                    : "text-text-tertiary"
                }`}
              >
                {market.probability}%
              </div>
            </div>
            <div
              className={`p-4 rounded-xl border transition-all ${
                market.probability < 50
                  ? "bg-market-no/10 border-market-no/50"
                  : "bg-brand-surface border-brand-border opacity-60"
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-bold text-text-secondary">
                  NO
                </span>
                <ArrowDownRight
                  size={16}
                  className={
                    market.probability < 50
                      ? "text-market-no"
                      : "text-text-tertiary"
                  }
                />
              </div>
              <div
                className={`text-4xl font-mono font-bold ${
                  market.probability < 50
                    ? "text-market-no"
                    : "text-text-tertiary"
                }`}
              >
                {100 - market.probability}%
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 py-4 border-t border-brand-border">
            <div>
              <div className="text-[10px] uppercase text-text-tertiary font-bold">
                Volume
              </div>
              <div className="text-lg font-mono text-text-primary">
                ${(market.volume / 1000).toFixed(1)}k
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase text-text-tertiary font-bold">
                Creator
              </div>
              <div className="text-lg text-text-primary truncate">
                {market.creator || "Chromarock AI"}
              </div>
            </div>
          </div>
        </div>

        {/* CENTER COLUMN: Content (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Tabs */}
          <div className="flex border-b border-brand-border">
            <button
              onClick={() => setActiveTab("Overview")}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "Overview"
                  ? "border-brand-accent text-text-primary"
                  : "border-transparent text-text-secondary hover:text-text-primary"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("Activity")}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "Activity"
                  ? "border-brand-accent text-text-primary"
                  : "border-transparent text-text-secondary hover:text-text-primary"
              }`}
            >
              Activity
            </button>
          </div>

          {/* Tab Content */}
          <div className="min-h-[200px]">
            {activeTab === "Overview" ? (
              <div className="space-y-6 animate-fade-in">
                {isMulti && market.choices && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs uppercase font-bold text-text-tertiary">
                        All choices
                      </span>
                      <span className="text-[11px] text-text-secondary">
                        {market.choices.length} options · tap a card to trade
                      </span>
                    </div>
                    <div className="space-y-3">
                      {market.choices.map((choice) => (
                        <div
                          key={choice.id}
                          className="bg-brand-surface border border-brand-border rounded-lg p-3 shadow-sm"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-sm font-semibold text-text-primary">
                              {choice.label}
                            </span>
                            <span className="text-sm font-mono font-bold text-text-primary">
                              {choice.probability}%
                            </span>
                          </div>
                          <div className="relative h-2 bg-brand-darker rounded-full overflow-hidden mt-2">
                            <div
                              className="absolute left-0 top-0 h-full bg-market-yes"
                              style={{ width: `${choice.probability}%` }}
                            />
                          </div>
                          <div className="flex gap-2 mt-2 text-xs font-semibold">
                            <span className="px-2 py-1 rounded bg-market-yes/10 text-market-yes border border-market-yes/30">
                              Yes {choice.probability}%
                            </span>
                            <span className="px-2 py-1 rounded bg-market-no/10 text-market-no border border-market-no/30">
                              No {100 - choice.probability}%
                            </span>
                          </div>
                          {choice.description && (
                            <p className="text-xs text-text-secondary mt-2">
                              {choice.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <p className="text-text-secondary leading-relaxed text-lg">
                  {market.description}
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-brand-surface border border-brand-border rounded-lg p-4 shadow-sm">
                    <h4 className="text-market-yes text-sm font-bold mb-3 flex items-center gap-2">
                      <ArrowUpRight size={16} /> Bull Case (Yes)
                    </h4>
                    <ul className="space-y-2">
                      {aiData?.bullCase.map((arg, i) => (
                        <li
                          key={i}
                          className="text-sm text-text-secondary flex items-start gap-2"
                        >
                          <span className="w-1 h-1 bg-market-yes rounded-full mt-2 shrink-0"></span>
                          {arg}
                        </li>
                      )) || (
                        <span className="text-xs text-text-tertiary">
                          Loading analysis...
                        </span>
                      )}
                    </ul>
                  </div>
                  <div className="bg-brand-surface border border-brand-border rounded-lg p-4 shadow-sm">
                    <h4 className="text-market-no text-sm font-bold mb-3 flex items-center gap-2">
                      <ArrowDownRight size={16} /> Bear Case (No)
                    </h4>
                    <ul className="space-y-2">
                      {aiData?.bearCase.map((arg, i) => (
                        <li
                          key={i}
                          className="text-sm text-text-secondary flex items-start gap-2"
                        >
                          <span className="w-1 h-1 bg-market-no rounded-full mt-2 shrink-0"></span>
                          {arg}
                        </li>
                      )) || (
                        <span className="text-xs text-text-tertiary">
                          Loading analysis...
                        </span>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 text-text-tertiary animate-fade-in">
                <Info size={32} className="mx-auto mb-2 opacity-50" />
                <p>Recent trade activity will appear here.</p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Actions (3 cols) */}
        <div className="lg:col-span-3 space-y-6">
          {/* Trade Box (mobile/tablet) */}
          <div className="bg-brand-surface border border-brand-border rounded-2xl p-5 shadow-md lg:hidden space-y-4">
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-market-yes/15 text-market-yes border border-market-yes/40">
                Buy
              </button>
              <button className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-darker text-text-secondary border border-brand-border">
                Sell
              </button>
              <span className="ml-auto text-[11px] text-text-secondary">
                Limit
              </span>
            </div>

            <div className="flex bg-brand-darker rounded-lg p-1 border border-brand-border">
              <button
                onClick={() => setOutcome("YES")}
                className={`flex-1 py-2 text-sm font-bold rounded transition-all flex items-center justify-center gap-1 ${
                  outcome === "YES"
                    ? "bg-market-yes text-white shadow"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                <span>YES</span>
                <span className="text-[11px] font-mono">
                  {market.probability}¢
                </span>
              </button>
              <button
                onClick={() => setOutcome("NO")}
                className={`flex-1 py-2 text-sm font-bold rounded transition-all flex items-center justify-center gap-1 ${
                  outcome === "NO"
                    ? "bg-market-no text-white shadow"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                <span>NO</span>
                <span className="text-[11px] font-mono">
                  {100 - market.probability}¢
                </span>
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] uppercase font-bold text-text-tertiary">
                  Amount ($)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-brand-darker border border-brand-border rounded-lg p-3 text-text-primary font-mono text-lg focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-brand-darker border border-brand-border rounded-lg p-3">
                  <div className="text-[11px] text-text-tertiary font-semibold">
                    Contracts
                  </div>
                  <div className="text-lg font-mono text-text-primary">
                    {shares}
                  </div>
                  <div className="text-[10px] text-text-tertiary">
                    Earn $1 if correct
                  </div>
                </div>
                <div className="bg-brand-darker border border-brand-border rounded-lg p-3">
                  <div className="text-[11px] text-text-tertiary font-semibold">
                    Limit price (¢)
                  </div>
                  <div className="text-lg font-mono text-text-primary">
                    {price}
                  </div>
                  <div className="text-[10px] text-text-tertiary">
                    You can adjust before submitting
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-[11px] uppercase text-text-tertiary font-bold">
                Expiration
              </div>
              <div className="flex flex-wrap gap-2">
                <button className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-darker text-text-secondary border border-brand-border hover:text-text-primary">
                  GTC
                </button>
                <button className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-darker text-text-secondary border border-brand-border hover:text-text-primary">
                  At event start
                </button>
                <button className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-darker text-text-secondary border border-brand-border hover:text-text-primary">
                  IOC
                </button>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-brand-border/50">
              <div className="flex justify-between text-xs">
                <span className="text-text-tertiary">Price</span>
                <span className="text-text-primary font-mono">{price}¢</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-text-tertiary">Est. Return</span>
                <span className="text-market-yes font-mono">
                  +${potentialProfit.toFixed(2)} ({roi}%)
                </span>
              </div>
            </div>

            <Button
              variant={outcome === "YES" ? "success" : "danger"}
              className="w-full py-3 text-base font-bold"
              onClick={handleTrade}
              disabled={!amount || parseFloat(amount) <= 0}
            >
              {user.isLoggedIn ? "Review Order" : "Log In to Trade"}
            </Button>
            <div className="text-center text-[10px] text-text-tertiary">
              Max position limit: $500.00
            </div>
          </div>

          {/* AI Copilot Panel */}
          <div className="bg-gradient-to-br from-brand-surface to-brand-darker border border-brand-border rounded-2xl overflow-hidden flex flex-col min-h-[360px] sm:min-h-[420px] shadow-sm">
            <div className="p-3 bg-brand-darker border-b border-brand-border flex items-center justify-between">
              <span className="text-xs font-bold text-brand-accent uppercase tracking-wider">
                Chromarock AI Copilot
              </span>
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            </div>
            <div className="flex-1">
              <MarketChat market={market} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
