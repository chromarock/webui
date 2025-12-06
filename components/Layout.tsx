import React, { useState } from "react";
import { ViewState, User } from "../types";
import { Search, Bell, Menu } from "lucide-react";
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
    "For you",
    "Trending",
    "Breaking",
    "New",
    "Politics",
    "Sports",
    "Finance",
    "Crypto",
    "Geopolitics",
    "Earnings",
    "Tech",
    "Culture",
    "World",
    "Economy",
    "Elections",
    "Mentions",
  ];
  const [activeCategory, setActiveCategory] = useState<string>(
    categoryOptions[0]
  );

  return (
    <div className="min-h-screen text-text-primary font-sans selection:bg-brand-accent/20 flex justify-center">
      <div className="flex flex-col bg-brand-darker/80 rounded-3xl backdrop-blur-xl overflow-hidden min-h-screen w-full max-w-[1400px]">
        {/* Top Bar */}
        <header
          className={`h-16 sticky top-0 z-40 backdrop-blur-md border-b border-brand-border flex items-center justify-between px-4 sm:px-6 shadow-md transition-colors ${
            isDark ? "bg-brand-darker/85" : "bg-white/90"
          }`}
        >
          {/* Mobile Menu Button & Logo */}
          <div className="flex items-center md:hidden">
            <button className="p-2 mr-2 text-text-secondary">
              <Menu size={20} />
            </button>
            <span className="font-bold text-text-primary">Chromarock</span>
          </div>

          {/* Brand + Pills + Search */}
          <div className="flex-1 flex items-center gap-3 md:gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-full bg-brand-surface border border-brand-border shadow-sm">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-accent via-brand-accent-2 to-brand-accent-3 flex items-center justify-center text-[10px] font-black text-white">
                CR
              </div>
              <div className="font-semibold text-text-primary">Chromarock</div>
            </div>

            <div className="hidden md:flex items-center gap-2 px-2 py-1.5 rounded-full bg-brand-surface border border-brand-border shadow-inner">
              {[
                { label: "Home", id: ViewState.HOME },
                { label: "Explore", id: ViewState.EXPLORE },
                { label: "Friends", id: ViewState.FRIENDS },
                { label: "Portfolio", id: ViewState.PORTFOLIO },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => onChangeView(item.id)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-colors ${
                    currentView === item.id
                      ? "bg-brand-accent text-white shadow-md"
                      : "text-text-secondary hover:text-text-primary hover:bg-brand-border/60"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="flex-1 max-w-xl mx-2 hidden md:block relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search
                  size={16}
                  className="text-text-tertiary group-focus-within:text-brand-accent transition-colors"
                />
              </div>
              <input
                type="text"
                placeholder="Search markets, assets, or topics..."
                className="w-full bg-brand-surface border border-brand-border rounded-full pl-10 pr-4 py-2 text-sm text-text-primary focus:outline-none focus:border-brand-accent/60 focus:ring-1 focus:ring-brand-accent/60 transition-all shadow-inner"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            {user.isLoggedIn ? (
              <>
                <div className="hidden sm:flex flex-col items-end mr-2">
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
                  className="ml-2"
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
            <Button variant="pill" size="sm" className="hidden sm:inline-flex">
              Connect Wallet
            </Button>
            <Button
              onClick={onToggleTheme}
              size="sm"
              variant="ghost"
              className="hidden sm:inline-flex"
            >
              {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
            </Button>
          </div>
        </header>

        {/* Category bar */}
        <div className="flex items-center gap-4 px-4 sm:px-6 py-3 border-b border-brand-border bg-brand-darker/70">
          <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">
            {categoryOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => setActiveCategory(opt)}
                className={`text-sm font-semibold whitespace-nowrap transition-colors ${
                  activeCategory === opt
                    ? "text-brand-accent"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};
