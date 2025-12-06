"use client";

import React, { useEffect, useState } from "react";
import { AreaChart, Area, ResponsiveContainer, YAxis } from "recharts";

interface MarketChartProps {
  data: number[];
  height?: number;
  showGradient?: boolean;
  strokeWidth?: number;
}

export const MarketChart: React.FC<MarketChartProps> = ({
  data,
  height = 60,
  showGradient = true,
  strokeWidth = 2,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const chartData = data.map((val, idx) => ({ i: idx, val }));

  const isUp = data[data.length - 1] >= data[0];
  const color = isUp ? "#10B981" : "#F43F5E"; // Emerald vs Rose

  if (!mounted) {
    return (
      <div
        className="w-full rounded-lg bg-brand-surface/60 select-none"
        style={{ height }}
      />
    );
  }

  return (
    <div style={{ height }} className="w-full select-none">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient
              id={`gradient-${isUp ? "up" : "down"}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <YAxis domain={["dataMin - 2", "dataMax + 2"]} hide />
          <Area
            type="monotone"
            dataKey="val"
            stroke={color}
            strokeWidth={strokeWidth}
            fill={
              showGradient
                ? `url(#gradient-${isUp ? "up" : "down"})`
                : "transparent"
            }
            isAnimationActive={true}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
