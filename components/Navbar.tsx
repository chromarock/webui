import React from 'react';
import { ViewState, User } from '../types';
import { Button } from './Button';

interface NavButtonProps {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}

const NavButton: React.FC<NavButtonProps> = ({ children, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${active ? 'text-white bg-brand-card shadow-inner' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
  >
    {children}
  </button>
);

interface NavbarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  user: User;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onChangeView, user }) => {
  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-brand-bg/90 border-b border-brand-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => onChangeView(ViewState.HOME)}>
            <div className="w-8 h-8 bg-gradient-to-br from-chroma-blue to-cyan-400 rounded-lg mr-3 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">
              C
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              Chromarock
            </span>
          </div>

          {/* Center Links */}
          <div className="hidden md:flex items-center space-x-1">
             <NavButton active={currentView === ViewState.HOME} onClick={() => onChangeView(ViewState.HOME)}>Home</NavButton>
             <NavButton active={currentView === ViewState.EXPLORE} onClick={() => onChangeView(ViewState.EXPLORE)}>Explore</NavButton>
             <NavButton active={currentView === ViewState.FRIENDS} onClick={() => onChangeView(ViewState.FRIENDS)}>Friends</NavButton>
             <NavButton active={currentView === ViewState.PORTFOLIO} onClick={() => onChangeView(ViewState.PORTFOLIO)}>Portfolio</NavButton>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            {user.isLoggedIn ? (
              <>
                <Button size="sm" variant="accent" onClick={() => onChangeView(ViewState.CREATE)}>+ Create</Button>
                <div className="text-right hidden sm:block border-l border-brand-border pl-4">
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Balance</div>
                  <div className="text-sm font-mono font-bold text-market-yes">${user.balance.toFixed(2)}</div>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center text-xs font-bold text-white">
                  {user.username.charAt(0).toUpperCase()}
                </div>
              </>
            ) : (
              <>
                 <button onClick={() => onChangeView(ViewState.LOGIN)} className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Log In</button>
                 <Button size="sm" variant="primary" onClick={() => onChangeView(ViewState.SIGNUP)}>Sign Up</Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};