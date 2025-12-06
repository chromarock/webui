"use client";

import React, { useState } from "react";
import { Market } from "../types";
import { MarketCard } from "./MarketCard";
import { LayoutGrid, List as ListIcon, Search } from "lucide-react";

interface ExploreProps {
  markets: Market[];
  onMarketClick: (market: Market) => void;
}

export const Explore: React.FC<ExploreProps> = ({ markets, onMarketClick }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

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
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                categoryFilter === cat
                  ? "bg-brand-accent text-white shadow-md shadow-brand-accent/30"
                  : "bg-brand-surface border border-brand-border text-text-secondary hover:text-text-primary hover:border-brand-accent"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex bg-brand-surface border border-brand-border rounded-lg p-1 shadow-inner">
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

      {/* Content */}
      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-3"
        }
      >
        {filteredMarkets.length > 0 ? (
          filteredMarkets.map((market) =>
            viewMode === "grid" ? (
              <MarketCard
                key={market.id}
                market={market}
                onClick={onMarketClick}
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
