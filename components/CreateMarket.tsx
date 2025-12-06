"use client";

import React, { useState } from "react";
import { generateMarketFromTopic } from "../services/geminiService";
import { Market } from "../types";
import { Button } from "./Button";

interface CreateMarketProps {
  onMarketCreated: (market: Market) => void;
  onCancel: () => void;
}

export const CreateMarket: React.FC<CreateMarketProps> = ({
  onMarketCreated,
  onCancel,
}) => {
  const [topic, setTopic] = useState("");
  const [mode, setMode] = useState<"global" | "social">("global");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsGenerating(true);
    const market = await generateMarketFromTopic(topic, mode === "social");
    setIsGenerating(false);

    if (market) {
      onMarketCreated(market);
    } else {
      alert("Failed to generate market. Please try a different topic.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 animate-fade-in">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-text-primary mb-2">
          Market Architect
        </h1>
        <p className="text-text-secondary">
          Describe a future event. Chromarock AI will structure the market for
          you.
        </p>
      </div>

      <div className="bg-brand-surface border border-brand-border rounded-xl p-1 shadow-2xl mb-8 flex">
        <button
          className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${
            mode === "global"
              ? "bg-brand-darker text-text-primary shadow-lg border border-brand-border"
              : "text-text-tertiary hover:text-text-primary"
          }`}
          onClick={() => setMode("global")}
        >
          🌍 Global Market
        </button>
        <button
          className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${
            mode === "social"
              ? "bg-pink-500/10 text-pink-500 border border-pink-500/20 shadow-lg"
              : "text-text-tertiary hover:text-text-primary"
          }`}
          onClick={() => setMode("social")}
        >
          👯 Friends & Social
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-brand-surface border border-brand-border rounded-xl p-8 shadow-2xl relative overflow-hidden"
      >
        {mode === "social" ? (
          <div className="absolute top-0 right-0 p-32 bg-pink-500/5 blur-[80px] rounded-full pointer-events-none"></div>
        ) : (
          <div className="absolute top-0 left-0 p-32 bg-brand-accent/5 blur-[80px] rounded-full pointer-events-none"></div>
        )}

        <div className="relative z-10 space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase text-text-tertiary mb-2">
              {mode === "global" ? "Market Topic" : "Friend Challenge"}
            </label>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder={
                mode === "global"
                  ? "e.g., Will Apple release a foldable phone in 2025?"
                  : "e.g., Will Chris arrive late to the dinner party again?"
              }
              className="w-full h-40 bg-brand-darker border border-brand-border rounded-lg p-4 text-text-primary placeholder-text-tertiary focus:ring-1 focus:ring-brand-accent focus:border-brand-accent outline-none resize-none text-lg transition-all"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="accent"
              className={`flex-1 ${
                mode === "social" ? "bg-pink-600 hover:bg-pink-500" : ""
              }`}
              isLoading={isGenerating}
              disabled={!topic.trim()}
            >
              {isGenerating ? "Architecting..." : "Create Market"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
