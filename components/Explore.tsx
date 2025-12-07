"use client";

import React, { useState } from "react";
import { Market } from "../types";
import { MarketCard } from "./MarketCard";
import { LayoutGrid, List as ListIcon, Search } from "lucide-react";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<
    "relevance" | "volume" | "probability" | "endingSoon"
  >("relevance");

  const categories = [
    "All",
    "Crypto",
    "Tech",
    "Politics",
    "Science",
    "Sports",
    "Economics",
  ];

  const filteredMarkets = markets.filter((m) => {
    const matchesSearch = m.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "All" || m.category === categoryFilter;
    return matchesSearch && matchesCategory && m.type === "global";
  });

  const sortedMarkets = [...filteredMarkets].sort((a, b) => {
    switch (sortBy) {
      case "volume":
        return b.volume - a.volume;
      case "probability":
        return b.probability - a.probability;
      case "endingSoon":
        return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
      default:
        return 0;
    }
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-text-primary self-start md:self-center">
          Explore
        </h1>

        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary"
            size={16}
          />
          <input
            type="text"
            placeholder="Filter by keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-brand-surface border border-brand-border rounded-lg pl-10 pr-4 py-2 text-sm text-text-primary focus:border-brand-accent outline-none shadow-inner"
          />
        </div>
      </div>

      {/* Filters & Toggles */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 pb-4 border-b border-brand-border">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide w-full flex-nowrap md:flex-wrap md:overflow-visible">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex-shrink-0 ${
                categoryFilter === cat
                  ? "bg-brand-accent text-white shadow-md shadow-brand-accent/30"
                  : "bg-brand-surface border border-brand-border text-text-secondary hover:text-text-primary hover:border-brand-accent"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between w-full md:w-auto gap-3">
          <div className="bg-brand-surface border border-brand-border rounded-lg px-3 py-2 text-xs text-text-secondary shadow-inner flex-shrink-0">
            <label className="mr-2 font-semibold">Sort</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="bg-transparent focus:outline-none text-text-primary text-xs"
            >
              <option value="relevance">Relevance</option>
              <option value="volume">Volume</option>
              <option value="probability">Prob %</option>
              <option value="endingSoon">Ending soon</option>
            </select>
          </div>

          <div className="flex bg-brand-surface border border-brand-border rounded-lg p-1 shadow-inner flex-shrink-0 ml-auto md:ml-0">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded ${
                viewMode === "grid"
                  ? "bg-brand-border text-text-primary"
                  : "text-text-tertiary hover:text-text-primary"
              }`}
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded ${
                viewMode === "list"
                  ? "bg-brand-border text-text-primary"
                  : "text-text-tertiary hover:text-text-primary"
              }`}
            >
              <ListIcon size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-3"
        }
      >
        {sortedMarkets.length > 0 ? (
          sortedMarkets.map((market) =>
            viewMode === "grid" ? (
              <MarketCard
                key={market.id}
                market={market}
                onClick={onMarketClick}
                onQuickTrade={onQuickTrade}
              />
            ) : (
              // Simple List Item
              <div
                key={market.id}
                onClick={() => onMarketClick(market)}
                className="flex items-center justify-between p-4 bg-brand-surface border border-brand-border rounded-lg hover:border-brand-accent/40 cursor-pointer transition-colors shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-bold text-text-tertiary uppercase w-16">
                    {market.category}
                  </span>
                  <h4 className="text-sm font-semibold text-text-primary truncate max-w-md">
                    {market.title}
                  </h4>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <span
                      className={`block font-mono font-bold ${
                        market.probability >= 50
                          ? "text-market-yes"
                          : "text-market-no"
                      }`}
                    >
                      {market.probability}%
                    </span>
                  </div>
                  <span className="text-xs text-text-tertiary">
                    Vol: ${(market.volume / 1000).toFixed(0)}k
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onQuickTrade(market, "YES");
                      }}
                      className="text-[11px] font-semibold px-3 py-1 rounded-full bg-market-yes/10 text-market-yes border border-market-yes/40 hover:bg-market-yes/20"
                    >
                      Quick Yes
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onQuickTrade(market, "NO");
                      }}
                      className="text-[11px] font-semibold px-3 py-1 rounded-full bg-market-no/10 text-market-no border border-market-no/40 hover:bg-market-no/20"
                    >
                      Quick No
                    </button>
                  </div>
                </div>
              </div>
            )
          )
        ) : (
          <div className="py-20 text-center text-text-tertiary">
            No markets found. Try adjusting your filters.
          </div>
        )}
      </div>
    </div>
  );
};
