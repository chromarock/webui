"use client";

import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "accent"
    | "danger"
    | "success"
    | "ghost"
    | "pill";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  isLoading,
  className = "",
  ...props
}) => {
  const baseStyle =
    "inline-flex items-center justify-center font-medium transition-all duration-200 rounded-lg focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-brand-surface border border-brand-border text-text-primary hover:border-brand-accent hover:shadow-sm",
    secondary:
      "bg-transparent border border-brand-border text-text-secondary hover:text-text-primary hover:border-brand-accent",
    accent:
      "bg-brand-accent hover:bg-[#00b303] text-white shadow-md shadow-brand-accent/30",
    success:
      "bg-market-yes hover:bg-[#00b303] text-white shadow-md shadow-brand-accent/30",
    danger:
      "bg-market-no hover:bg-rose-600 text-white shadow-md shadow-rose-200/50",
    ghost:
      "bg-transparent text-text-secondary hover:text-text-primary hover:bg-brand-darker",
    pill: "bg-brand-accent hover:bg-[#e58936] text-white border border-brand-accent shadow-md shadow-brand-accent/25",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-currentColor"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : null}
      {children}
    </button>
  );
};
