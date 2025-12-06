import React from "react";
import { ViewState } from "../types";
import { Home, Compass, Users, PieChart, LogOut, Settings } from "lucide-react";

interface SidebarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  onLogout: () => void;
  isLoggedIn: boolean;
  theme: "light" | "dark";
  onToggleTheme: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onChangeView,
  onLogout,
  isLoggedIn,
  theme,
  onToggleTheme,
}) => {
  const navItems = [
    { id: ViewState.HOME, label: "Home", icon: Home },
    { id: ViewState.EXPLORE, label: "Explore", icon: Compass },
    { id: ViewState.FRIENDS, label: "Friends", icon: Users },
    { id: ViewState.PORTFOLIO, label: "Portfolio", icon: PieChart },
  ];

  return (
    <div className="hidden md:flex flex-col w-64 h-[calc(100vh-48px)] fixed left-6 top-6 bg-brand-darker/80 border border-brand-border z-50 shadow-[0_25px_80px_rgba(0,0,0,0.4)] rounded-3xl backdrop-blur-xl overflow-hidden">
      {/* Brand */}
      <div className="h-16 flex items-center px-6 border-b border-brand-border/50">
        <div className="w-9 h-9 bg-gradient-to-br from-brand-accent via-brand-accent-2 to-brand-accent-3 rounded-xl mr-3 shadow-[0_12px_30px_rgba(241,153,63,0.35)]"></div>
        <span className="text-lg font-bold tracking-tight text-text-primary">
          Chromarock
        </span>
      </div>

      {/* Nav */}
      <div className="flex-1 py-6 px-3 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onChangeView(item.id)}
            className={`w-full flex items-center px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 ${
              currentView === item.id
                ? "bg-brand-border/20 text-text-primary border border-brand-border shadow-inner"
                : "text-text-secondary hover:text-text-primary hover:bg-brand-border/10"
            }`}
          >
            <item.icon
              size={18}
              className={`mr-3 ${
                currentView === item.id
                  ? "text-brand-accent"
                  : "text-text-tertiary"
              }`}
            />
            {item.label}
          </button>
        ))}
      </div>

      {/* Theme Switcher */}
      <div className="px-4 pb-4 border-t border-brand-border/70">
        <div className="flex items-center justify-between text-xs font-semibold text-text-secondary mb-3">
          <span>Theme</span>
          <span className="text-text-tertiary">
            {theme === "dark" ? "Dark" : "Light"}
          </span>
        </div>
        <button
          onClick={onToggleTheme}
          className="relative w-full flex items-center justify-between px-3 py-3 rounded-xl border border-brand-border bg-brand-surface overflow-hidden group transition-all hover:border-brand-accent hover:shadow-lg"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-brand-accent/10 via-brand-accent-2/10 to-brand-accent/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="flex items-center gap-2 z-10 text-sm font-semibold">
            {theme === "dark" ? "🌙" : "☀️"}
            {theme === "dark" ? "Switch to Light" : "Switch to Dark"}
          </span>
          <span className="z-10 text-brand-accent text-xs font-bold uppercase tracking-wide">
            {theme === "dark" ? "dark" : "light"}
          </span>
        </button>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-brand-border/70">
        {isLoggedIn ? (
          <button
            onClick={onLogout}
            className="w-full flex items-center px-4 py-2 text-xs font-medium text-text-tertiary hover:text-text-primary transition-colors"
          >
            <LogOut size={14} className="mr-3" />
            Sign Out
          </button>
        ) : (
          <div className="text-xs text-text-tertiary px-4">Guest Mode</div>
        )}
      </div>
    </div>
  );
};
