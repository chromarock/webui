import React, { useState } from "react";
import { Button } from "./Button";
import { ViewState } from "../types";

interface AuthProps {
  view: ViewState;
  onSuccess: (username: string) => void;
  onSwitch: (view: ViewState) => void;
}

export const Auth: React.FC<AuthProps> = ({ view, onSuccess, onSwitch }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Mock Auth Delay
    setTimeout(() => {
      setLoading(false);
      onSuccess(email.split("@")[0] || "Trader");
    }, 1000);
  };

  const isLogin = view === ViewState.LOGIN;

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-brand-surface border border-brand-border p-8 rounded-2xl shadow-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            {isLogin ? "Welcome Back" : "Join Chromarock"}
          </h1>
          <p className="text-text-secondary">
            {isLogin
              ? "Enter your credentials to access your portfolio."
              : "Start trading on the world's information."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-slate-500 mb-1">
              EMAIL
            </label>
            <input
              type="email"
              required
              className="w-full bg-brand-darker border border-brand-border rounded-lg p-3 text-text-primary focus:border-brand-accent outline-none transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-slate-500 mb-1">
              PASSWORD
            </label>
            <input
              type="password"
              required
              className="w-full bg-brand-darker border border-brand-border rounded-lg p-3 text-text-primary focus:border-brand-accent outline-none transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button variant="accent" className="w-full py-3" isLoading={loading}>
            {isLogin ? "Log In" : "Create Account"}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-slate-500">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
          </span>
          <button
            onClick={() =>
              onSwitch(isLogin ? ViewState.SIGNUP : ViewState.LOGIN)
            }
            className="text-brand-accent hover:text-text-primary transition-colors font-medium"
          >
            {isLogin ? "Sign up" : "Log in"}
          </button>
        </div>
      </div>
    </div>
  );
};
