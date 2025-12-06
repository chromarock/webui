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
}

export const MarketDetail: React.FC<MarketDetailProps> = ({
  market,
  user,
  onBack,
  onTrade,
  onRequestLogin,
}) => {
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
          <div className="space-y-3">
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

        {/* CENTER COLUMN: Chart & Content (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Chart Container */}
          <div className="h-[400px] bg-brand-surface border border-brand-border rounded-2xl p-6 relative overflow-hidden group shadow-sm">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-accent to-emerald-400 opacity-70"></div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium text-text-secondary">
                Price History (Implied Probability)
              </h3>
              <div className="flex gap-2">
                {["1H", "1D", "1W", "All"].map((t) => (
                  <button
                    key={t}
                    className="px-2 py-1 text-xs rounded hover:bg-brand-darker text-text-tertiary hover:text-text-primary transition-colors"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <MarketChart
              data={market.history}
              height={320}
              showGradient={true}
              strokeWidth={3}
            />
          </div>

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
          {/* Trade Box */}
          <div className="bg-brand-surface border border-brand-border rounded-2xl p-5 shadow-md">
            <div className="flex bg-brand-darker rounded-lg p-1 mb-4 border border-brand-border">
              <button
                onClick={() => setOutcome("YES")}
                className={`flex-1 py-2 text-sm font-bold rounded transition-all ${
                  outcome === "YES"
                    ? "bg-market-yes text-white shadow"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                YES
              </button>
              <button
                onClick={() => setOutcome("NO")}
                className={`flex-1 py-2 text-sm font-bold rounded transition-all ${
                  outcome === "NO"
                    ? "bg-market-no text-white shadow"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                NO
              </button>
            </div>

            <div className="space-y-4 mb-6">
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
            </div>

            <Button
              variant={outcome === "YES" ? "success" : "danger"}
              className="w-full py-3 text-base font-bold"
              onClick={handleTrade}
              disabled={!amount || parseFloat(amount) <= 0}
            >
              {user.isLoggedIn ? "Place Trade" : "Log In to Trade"}
            </Button>
            <div className="mt-3 text-center text-[10px] text-text-tertiary">
              Max position limit: $500.00
            </div>
          </div>

          {/* AI Copilot Panel */}
          <div className="bg-gradient-to-br from-brand-surface to-brand-darker border border-brand-border rounded-2xl overflow-hidden flex flex-col h-[500px] shadow-sm">
            <div className="p-3 bg-brand-darker border-b border-brand-border flex items-center justify-between">
              <span className="text-xs font-bold text-brand-accent uppercase tracking-wider">
                Chromarock AI Copilot
              </span>
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            </div>
            <div className="flex-1 overflow-hidden">
              <MarketChat market={market} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
