"use client";

import React, {
  useMemo,
  useRef,
  useState,
  useEffect,
  useCallback,
} from "react";
import { ViewState, User } from "../types";
import {
  Search,
  Bell,
  Bookmark,
  SlidersHorizontal,
  TrendingUp,
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
  homeSearchTerm?: string;
  homeActiveTopic?: string;
  onHomeSearchChange?: (value: string) => void;
  onHomeTopicChange?: (value: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  currentView,
  onChangeView,
  user,
  onLogout,
  theme,
  onToggleTheme,
  homeSearchTerm,
  homeActiveTopic,
  onHomeSearchChange,
  onHomeTopicChange,
}) => {
  const isDark = theme === "dark";
  const isHome = currentView === ViewState.HOME;
  const contentWidthClass =
    currentView === ViewState.PORTFOLIO ? "max-w-5xl" : "max-w-7xl";
  const navItems = [
    { label: "Home", view: ViewState.HOME },
    { label: "Explore", view: ViewState.EXPLORE },
    { label: "Friends", view: ViewState.FRIENDS },
    { label: "Portfolio", view: ViewState.PORTFOLIO },
  ];
  const homeTopics = useMemo(
    () => [
      "For you",
      "All",
      "Trump",
      "Fed",
      "Ukraine",
      "Venezuela",
      "Google Search",
      "Honduras Election",
      "Best of 2025",
      "Aztec",
      "Equities",
      "Epstein",
    ],
    []
  );
  const pillScrollerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const newsNavItems = useMemo(
    () => [
      "Trending",
      "Breaking",
      "New",
      "|",
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
      "More ▾",
    ],
    []
  );

  const updatePillScrollState = useCallback(() => {
    const el = pillScrollerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 4);
  }, []);

  useEffect(() => {
    updatePillScrollState();
    const el = pillScrollerRef.current;
    if (!el) return;
    const handleScroll = () => updatePillScrollState();
    const handleResize = () => updatePillScrollState();
    el.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    return () => {
      el.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [updatePillScrollState]);

  return (
    <div className="min-h-screen text-text-primary font-sans selection:bg-brand-accent/20 flex justify-center">
      <div
        className={`flex flex-col rounded-3xl backdrop-blur-xl min-h-screen w-full max-w-[1400px] ${
          isDark
            ? "bg-brand-darker/80"
            : "bg-gradient-to-br from-white via-[#f7fbfd] to-white"
        }`}
      >
        {/* Top Bar (sticky) */}
        <header
          className={`sticky top-0 z-40 backdrop-blur-md border-b border-brand-border flex flex-col gap-0 px-0 py-3 transition-colors relative shadow-none ${
            isDark ? "bg-brand-darker/90" : "bg-white/90"
          }`}
        >
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 flex flex-col gap-3">
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

              {/* Primary Nav */}
              <div className="hidden lg:flex items-center gap-1 shrink-0">
                {navItems.map((item) => {
                  const active = currentView === item.view;
                  return (
                    <button
                      key={item.view}
                      onClick={() => onChangeView(item.view)}
                      className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                        active
                          ? `${
                              isDark ? "text-white" : "text-black"
                            } bg-brand-card shadow-inner border border-brand-border`
                          : "text-text-secondary border border-transparent hover:text-text-primary hover:border-brand-accent/60"
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>

              {/* Search + Filters */}
              <div className="flex items-center gap-2 flex-1 min-w-[260px]">
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
            <div className="flex items-center gap-4 text-sm text-text-secondary">
              <TrendingUp size={16} className="text-text-primary" />
              {newsNavItems.map((item) =>
                item === "|" ? (
                  <span
                    key="divider"
                    className="h-4 w-px bg-brand-border inline-block"
                  />
                ) : (
                  <button
                    key={item}
                    className={`transition-colors ${
                      item === "Trending"
                        ? "text-text-primary font-semibold"
                        : "hover:text-text-primary"
                    }`}
                  >
                    {item}
                  </button>
                )
              )}
            </div>
          </div>
          {/* Full-width underline */}
          <div
            className="pointer-events-none absolute -bottom-px left-1/2 -translate-x-1/2 w-screen h-px bg-brand-border"
            aria-hidden
          />
        </header>

        {/* Content */}
        <main className="flex-1 overflow-x-hidden pb-8">
          {isHome && (
            <div>
              <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2">
                <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide w-full py-1">
                  <div className="flex items-center min-w-[220px] bg-brand-darker border border-brand-border rounded-xl px-3 py-2 flex-shrink-0">
                    <Search size={16} className="text-text-tertiary mr-2" />
                    <input
                      value={homeSearchTerm ?? ""}
                      onChange={(e) => onHomeSearchChange?.(e.target.value)}
                      placeholder="Search"
                      className="w-full bg-transparent text-text-primary placeholder-text-tertiary focus:outline-none text-sm"
                    />
                  </div>
                  <button className="p-2 rounded-lg border border-brand-border text-text-secondary hover:text-text-primary hover:border-brand-accent transition-colors flex-shrink-0">
                    <SlidersHorizontal size={18} />
                  </button>
                  <button className="p-2 rounded-lg border border-brand-border text-text-secondary hover:text-text-primary hover:border-brand-accent transition-colors flex-shrink-0">
                    <Bookmark size={18} />
                  </button>
                  <div className="relative flex-1 min-w-[200px]">
                    <div
                      className="flex items-center gap-2 flex-nowrap overflow-x-auto scrollbar-hide pr-14"
                      ref={pillScrollerRef}
                      onScroll={updatePillScrollState}
                    >
                      {homeTopics.map((topic) => {
                        const isActive = topic === homeActiveTopic;
                        return (
                          <button
                            key={topic}
                            onClick={() => onHomeTopicChange?.(topic)}
                            className={`px-3 py-1.5 text-sm font-semibold rounded-full border transition-all flex-shrink-0 ${
                              isActive
                                ? "bg-brand-accent text-white border-brand-accent"
                                : "bg-brand-darker text-text-secondary border-brand-border hover:text-text-primary hover:border-brand-accent"
                            }`}
                          >
                            {topic}
                          </button>
                        );
                      })}
                    </div>
                    <div
                      className={`pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-brand-surface via-brand-surface/80 to-transparent rounded-2xl transition-opacity ${
                        canScrollRight ? "opacity-100" : "opacity-0"
                      }`}
                    ></div>
                    <button
                      aria-label="Scroll topics right"
                      onClick={() =>
                        pillScrollerRef.current?.scrollBy({
                          left: 200,
                          behavior: "smooth",
                        })
                      }
                      className={`absolute inset-y-0 right-2 my-auto h-8 w-8 flex items-center justify-center rounded-full border border-brand-border bg-brand-surface text-text-secondary hover:text-text-primary hover:border-brand-accent transition-colors shadow-sm ${
                        canScrollRight
                          ? "opacity-100"
                          : "opacity-0 pointer-events-none"
                      }`}
                    >
                      ›
                    </button>
                    <button
                      aria-label="Scroll topics left"
                      onClick={() =>
                        pillScrollerRef.current?.scrollBy({
                          left: -200,
                          behavior: "smooth",
                        })
                      }
                      className={`absolute inset-y-0 left-2 my-auto h-8 w-8 flex items-center justify-center rounded-full border border-brand-border bg-brand-surface text-text-secondary hover:text-text-primary hover:border-brand-accent transition-colors shadow-sm ${
                        canScrollLeft
                          ? "opacity-100"
                          : "opacity-0 pointer-events-none"
                      }`}
                    >
                      ‹
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div
            className={`pt-2 sm:pt-3 lg:pt-4 px-4 sm:px-6 lg:px-8 pb-8 w-full ${contentWidthClass} mx-auto`}
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
