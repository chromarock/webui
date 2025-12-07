"use client";

import React from "react";
import { User, Market } from "../types";
import { Button } from "./Button";
import { ArrowUpRight, ArrowDownRight, Clock } from "lucide-react";

interface PortfolioProps {
  user: User;
  markets: Market[];
  onMarketClick: (market: Market) => void;
  onLogin: () => void;
}

export const Portfolio: React.FC<PortfolioProps> = ({
  user,
  markets,
  onMarketClick,
  onLogin,
}) => {
  if (!user.isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <h2 className="text-2xl font-bold text-text-primary">
          Track Your Performance
        </h2>
        <p className="text-text-secondary max-w-md">
          Log in to view your positions, track P&L, and analyze your prediction
          history.
        </p>
        <Button onClick={onLogin} variant="accent" size="lg">
          Log In
        </Button>
      </div>
    );
  }

  const getMarket = (id: string) => markets.find((m) => m.id === id);
  const historyItems =
    user.portfolio.length > 0
      ? user.portfolio
          .map((item, idx) => {
            const m = getMarket(item.marketId);
            if (!m) return null;
            const timestamp = new Date();
            timestamp.setDate(timestamp.getDate() - idx * 2);
            return {
              id: `${item.marketId}-${idx}`,
              market: m,
              outcome: item.outcome,
              shares: item.shares,
              avgPrice: item.avgPrice,
              timestamp,
            };
          })
          .filter(
            (
              entry
            ): entry is {
              id: string;
              market: Market;
              outcome: "YES" | "NO";
              shares: number;
              avgPrice: number;
              timestamp: Date;
            } => Boolean(entry)
          )
      : [];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      <h1 className="text-3xl font-bold text-text-primary">Portfolio</h1>

      {/* Summary Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-brand-surface border border-brand-border rounded-xl p-6">
          <span className="text-xs uppercase font-bold text-text-tertiary">
            Net P&L (24h)
          </span>
          <div className="text-3xl font-mono font-bold text-text-primary mt-2">
            {user.isLoggedIn ? `+$${(user.pnlDay || 0).toFixed(2)}` : "---"}
          </div>
          <div className="text-xs text-market-yes mt-1 flex items-center">
            <ArrowUpRight size={12} className="mr-1" /> 24h change
          </div>
        </div>
        <div className="bg-brand-surface border border-brand-border rounded-xl p-6">
          <span className="text-xs uppercase font-bold text-text-tertiary">
            Win Rate
          </span>
          <div className="text-3xl font-mono font-bold text-text-primary mt-2">
            {user.isLoggedIn ? `${user.winRate || 0}%` : "---"}
          </div>
          <div className="w-full h-1.5 bg-brand-border mt-3 rounded-full overflow-hidden">
            <div className="h-full bg-brand-accent" style={{ width: `${user.winRate || 0}%` }}></div>
          </div>
        </div>
        <div className="bg-brand-surface border border-brand-border rounded-xl p-6">
          <span className="text-xs uppercase font-bold text-text-tertiary">
            Available Cash
          </span>
          <div className="text-3xl font-mono font-bold text-text-primary mt-2">
            ${user.balance.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Positions Table */}
      <div className="bg-brand-surface border border-brand-border rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-brand-border flex justify-between items-center">
          <h3 className="font-bold text-text-primary">Open Positions</h3>
        </div>

        {user.portfolio.length === 0 ? (
          <div className="p-12 text-center text-text-tertiary">
            You have no open positions. Start trading to populate your
            portfolio.
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-brand-darker border-b border-brand-border text-xs uppercase text-text-tertiary">
                <th className="px-6 py-3 font-semibold">Market</th>
                <th className="px-6 py-3 font-semibold">Side</th>
                <th className="px-6 py-3 font-semibold text-right">Shares</th>
                <th className="px-6 py-3 font-semibold text-right">
                  Avg Price
                </th>
                <th className="px-6 py-3 font-semibold text-right">Current</th>
                <th className="px-6 py-3 font-semibold text-right">P&L</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {user.portfolio.map((item, idx) => {
                const m = getMarket(item.marketId);
                if (!m) return null;
                const currentPrice =
                  item.outcome === "YES" ? m.probability : 100 - m.probability;
                const totalValue = item.shares * (currentPrice / 100);
                const totalCost = item.shares * item.avgPrice;
                const pnl = totalValue - totalCost;

                return (
                  <tr
                    key={idx}
                    className="hover:bg-brand-border/20 transition-colors cursor-pointer"
                    onClick={() => onMarketClick(m)}
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-text-primary max-w-xs truncate">
                        {m.title}
                      </div>
                      <div className="text-xs text-text-tertiary">
                        {m.category}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          item.outcome === "YES"
                            ? "bg-market-yes/10 text-market-yes"
                            : "bg-market-no/10 text-market-no"
                        }`}
                      >
                        {item.outcome}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-text-secondary">
                      {item.shares}
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-text-secondary">
                      ${item.avgPrice.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-text-primary">
                      ${currentPrice.toFixed(0)}¢
                    </td>
                    <td
                      className={`px-6 py-4 text-right font-mono font-bold ${
                        pnl >= 0 ? "text-market-yes" : "text-market-no"
                      }`}
                    >
                      {pnl >= 0 ? "+" : ""}
                      {pnl.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Trade History */}
      <div className="bg-brand-surface border border-brand-border rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-brand-border flex justify-between items-center">
          <h3 className="font-bold text-text-primary">Trade History</h3>
          <div className="text-xs text-text-tertiary">
            Showing latest {historyItems.length || 0} trades
          </div>
        </div>

        {historyItems.length === 0 ? (
          <div className="p-12 text-center text-text-tertiary">
            Recent trades will appear here after your next order.
          </div>
        ) : (
          <div className="divide-y divide-brand-border">
            {historyItems.map((entry: any) => (
              <div
                key={entry.id}
                className="flex flex-wrap items-center justify-between px-6 py-4"
              >
                <div className="flex flex-col gap-1">
                  <div className="text-sm font-semibold text-text-primary">
                    {entry.market.title}
                  </div>
                  <div className="text-xs text-text-tertiary">
                    {entry.market.category} ·{" "}
                    {entry.timestamp.toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`px-2 py-1 rounded text-[11px] font-bold uppercase ${
                      entry.outcome === "YES"
                        ? "bg-market-yes/10 text-market-yes border border-market-yes/30"
                        : "bg-market-no/10 text-market-no border border-market-no/30"
                    }`}
                  >
                    {entry.outcome}
                  </span>
                  <div className="text-right">
                    <div className="text-xs text-text-tertiary uppercase">
                      Shares · Avg Price
                    </div>
                    <div className="text-sm font-mono text-text-primary">
                      {entry.shares} @ ${entry.avgPrice.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
