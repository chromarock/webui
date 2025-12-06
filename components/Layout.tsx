"use client";

import React, { useState } from "react";
import { ViewState, User } from "../types";
import {
  Search,
  Bell,
  Bookmark,
  SlidersHorizontal,
  ChevronRight,
} from "lucide-react";
import { Button } from "./Button";

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  user: User;
  onLogout: () => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  currentView,
  onChangeView,
  user,
  onLogout,
  theme,
  onToggleTheme,
}) => {
  const isDark = theme === "dark";
  const categoryOptions = [
    "All",
    "Trump",
    "Fed",
    "Ukraine",
    "Venezuela",
    "Honduras Election",
    "Bucharest Mayor",
    "Best of 2025",
    "Aztec",
    "Equities",
    "Weather",
  ];
  const [activeCategory, setActiveCategory] = useState<string>(
    categoryOptions[0]
  );

  return (
    <div className="min-h-screen text-text-primary font-sans selection:bg-brand-accent/20 flex justify-center">
      <div
        className={`flex flex-col rounded-3xl backdrop-blur-xl overflow-hidden min-h-screen w-full max-w-[1400px] ${
          isDark
            ? "bg-brand-darker/80"
            : "bg-gradient-to-br from-white via-[#f7fbfd] to-white"
        }`}
      >
        {/* Top Bar */}
        <header
          className={`h-16 sticky top-0 z-40 backdrop-blur-md border-b border-brand-border flex items-center px-4 sm:px-6 shadow-md transition-colors ${
            isDark ? "bg-brand-darker/90" : "bg-white/90"
          }`}
        >
          <div className="flex items-center gap-3 w-full">
            {/* Logo / Home */}
            <div
              className="flex items-center gap-3 pr-2 shrink-0 cursor-pointer"
              onClick={() => onChangeView(ViewState.HOME)}
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-chroma-blue to-cyan-400 border border-brand-border shadow-lg overflow-hidden flex items-center justify-center">
                <img
                  src="/assets/Screenshot_2025-12-06_at_12.31.00_AM-0e9c5967-ffd9-4454-9923-9e7b89239380.png"
                  alt="Chromarock logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-lg font-bold text-text-primary tracking-tight hidden sm:inline">
                Chromarock
              </span>
            </div>

            {/* Search + Filters */}
            <div className="flex items-center gap-2 flex-[1.4] min-w-[260px]">
              <div className="flex items-center bg-brand-surface border border-brand-border rounded-full px-3 py-2 shadow-inner w-full">
                <Search size={16} className="text-text-tertiary mr-2" />
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full bg-transparent text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none"
                />
              </div>
              <button className="p-2.5 rounded-full border border-brand-border bg-brand-surface text-text-secondary hover:text-text-primary hover:border-brand-accent transition-colors shadow-sm">
                <SlidersHorizontal size={18} />
              </button>
              <button className="p-2.5 rounded-full border border-brand-border bg-brand-surface text-text-secondary hover:text-text-primary hover:border-brand-accent transition-colors shadow-sm">
                <Bookmark size={18} />
              </button>
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-2 flex-1 overflow-x-auto scrollbar-hide px-2">
              {categoryOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setActiveCategory(opt)}
                  className={`px-4 py-2 text-sm font-semibold rounded-full border transition-colors whitespace-nowrap ${
                    activeCategory === opt
                      ? "bg-brand-surface border-brand-accent text-text-primary shadow-sm"
                      : "border-brand-border text-text-secondary hover:text-text-primary hover:border-brand-accent/70"
                  }`}
                >
                  {opt}
                </button>
              ))}
              <button className="p-2 rounded-full border border-brand-border bg-brand-surface text-text-secondary hover:text-text-primary hover:border-brand-accent transition-colors shadow-sm">
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Right Actions */}
            <div className="hidden md:flex items-center gap-3 shrink-0">
              {user.isLoggedIn ? (
                <>
                  <div className="flex flex-col items-end mr-1">
                    <span className="text-[10px] text-text-tertiary font-bold uppercase tracking-wider">
                      Balance
                    </span>
                    <span className="text-sm font-mono font-bold text-market-yes">
                      ${user.balance.toFixed(2)}
                    </span>
                  </div>
                  <button className="p-2 text-text-secondary hover:text-text-primary transition-colors relative">
                    <Bell size={20} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-accent rounded-full border-2 border-brand-surface"></span>
                  </button>
                  <div className="w-8 h-8 rounded-full bg-brand-surface border border-brand-border flex items-center justify-center text-xs font-bold text-text-primary overflow-hidden">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <Button
                    onClick={() => onChangeView(ViewState.CREATE)}
                    size="sm"
                    variant="accent"
                    className="ml-1"
                  >
                    + Create
                  </Button>
                  <Button onClick={onLogout} size="sm" variant="ghost">
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => onChangeView(ViewState.LOGIN)}
                    className="text-sm font-medium text-text-secondary hover:text-text-primary"
                  >
                    Log In
                  </button>
                  <Button
                    onClick={() => onChangeView(ViewState.SIGNUP)}
                    size="sm"
                    variant="primary"
                  >
                    Sign Up
                  </Button>
                </>
              )}
              <Button variant="pill" size="sm">
                Connect Wallet
              </Button>
              <Button onClick={onToggleTheme} size="sm" variant="ghost">
                {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
              </Button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};
