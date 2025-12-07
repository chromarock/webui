"use client";

import React, { useEffect, useId, useState } from "react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  LabelList,
  Tooltip,
  CartesianGrid,
} from "recharts";

const MarketTooltip: React.FC<any> = ({ active, payload, yesColor, noColor }) => {
  if (!active || !payload || !payload.length) return null;
  const yesVal = payload.find((p: any) => p.dataKey === "yes")?.value;
  const noVal = payload.find((p: any) => p.dataKey === "no")?.value;
  return (
    <div className="rounded-lg border border-brand-border bg-brand-surface/90 px-3 py-2 shadow-md text-xs text-text-primary">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full" style={{ background: yesColor }} />
        <span className="font-semibold">YES</span>
        <span className="font-mono">{Math.round(yesVal ?? 0)}%</span>
      </div>
      <div className="flex items-center gap-2 mt-1">
        <span className="w-2 h-2 rounded-full" style={{ background: noColor }} />
        <span className="font-semibold">NO</span>
        <span className="font-mono">{Math.round(noVal ?? 0)}%</span>
      </div>
    </div>
  );
};
MarketTooltip.displayName = "MarketTooltip";

const HoverLabel: React.FC<any> = ({
  x,
  y,
  index,
  value,
  targetIndex,
  color,
  labelText,
  dy = -6,
}) => {
  if (index !== targetIndex || value === undefined || value === null) return null;
  return (
    <g transform={`translate(${x + 8}, ${y + dy})`}>
      <text fill={color} fontWeight={700} textAnchor="start">
        <tspan x={0} y={0} fontSize={11}>
          {labelText.toUpperCase()}
        </tspan>
        <tspan x={0} dy={23} fontSize={20}>{`${Math.round(value)}%`}</tspan>
      </text>
    </g>
  );
};
HoverLabel.displayName = "HoverLabel";

interface MarketChartProps {
  data: number[];
  height?: number | string;
  showGradient?: boolean;
  strokeWidth?: number;
}

export const MarketChart: React.FC<MarketChartProps> = ({
  data,
  height = "100%",
  showGradient = true,
  strokeWidth = 2,
}) => {
  const [mounted, setMounted] = useState(false);
  const [hoverValues, setHoverValues] = useState<{
    yes: number;
    no: number;
  } | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const chartData = data.map((val, idx) => ({
    i: idx,
    yes: val,
    no: 100 - val,
  }));

  const yesColor = "#48A1A9";
  const noColor = "#D84939";
  const yesGradientId = `yes-gradient-${useId()}`;
  const noGradientId = `no-gradient-${useId()}`;
  const lastIndex = chartData.length - 1;
  const lastYes = chartData[lastIndex]?.yes ?? 0;
  const lastNo = chartData[lastIndex]?.no ?? 0;
  const allValues = chartData.flatMap((d) => [d.yes, d.no]);
  const minVal = allValues.length ? Math.min(...allValues) : 0;
  const maxVal = allValues.length ? Math.max(...allValues) : 100;
  const paddedMin = Math.max(0, minVal * 0.9);
  const paddedMax = Math.min(100, maxVal * 1.1);
  const axisMin =
    paddedMin === paddedMax ? Math.max(0, paddedMin - 1) : paddedMin;
  const axisMax = paddedMin === paddedMax ? paddedMax + 1 : paddedMax;

  if (!mounted) {
    return (
      <div
        className="w-full rounded-lg bg-brand-surface/60 select-none"
        style={{ height }}
      />
    );
  }

  const displayYes = hoverValues?.yes ?? lastYes;
  const displayNo = hoverValues?.no ?? lastNo;

  return (
    <div style={{ height }} className="relative w-full h-full select-none">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 0, right: 4, bottom: 12, left: 0 }}
          onMouseMove={(state: any) => {
            const activeIdx = state?.activeTooltipIndex;
            if (typeof activeIdx === "number") {
              setActiveIndex(activeIdx);
            }
            const yesVal = state?.activePayload?.find(
              (p: any) => p.dataKey === "yes"
            )?.value;
            const noVal = state?.activePayload?.find(
              (p: any) => p.dataKey === "no"
            )?.value;
            if (yesVal !== undefined && noVal !== undefined) {
              setHoverValues({ yes: yesVal, no: noVal });
            }
          }}
          onMouseLeave={() => {
            setHoverValues(null);
            setActiveIndex(null);
          }}
        >
          <defs>
            <linearGradient id={yesGradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={yesColor} stopOpacity={0.25} />
              <stop offset="95%" stopColor={yesColor} stopOpacity={0} />
            </linearGradient>
            <linearGradient id={noGradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={noColor} stopOpacity={0.25} />
              <stop offset="95%" stopColor={noColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="i" hide padding={{ right: 84 }} />
          <YAxis
            orientation="right"
            domain={[axisMin, axisMax]}
            tickFormatter={(v) => `${Math.round(v)}%`}
            tick={{ fill: "rgba(148,163,184,0.9)", fontSize: 11 }}
            tickMargin={8}
            width={38}
          />
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(148,163,184,0.3)"
            vertical={false}
          />
          <Area
            type="monotone"
            dataKey="yes"
            stroke={yesColor}
            strokeWidth={strokeWidth}
            fill={showGradient ? `url(#${yesGradientId})` : "transparent"}
            isAnimationActive={true}
            dot={false}
          >
            <LabelList
              content={
                <HoverLabel
                  targetIndex={activeIndex ?? lastIndex}
                  color={yesColor}
                  labelText="YES"
                  dy={-10}
                />
              }
            />
          </Area>
          <Area
            type="monotone"
            dataKey="no"
            stroke={noColor}
            strokeWidth={strokeWidth}
            fill={showGradient ? `url(#${noGradientId})` : "transparent"}
            isAnimationActive={true}
            dot={false}
          >
            <LabelList
              content={
                <HoverLabel
                  targetIndex={activeIndex ?? lastIndex}
                  color={noColor}
                  labelText="NO"
                  dy={14}
                />
              }
            />
          </Area>
          <Tooltip
            cursor={{
              stroke: "#ffffff22",
              strokeWidth: 1,
              strokeDasharray: "4 4",
            }}
            content={<MarketTooltip yesColor={yesColor} noColor={noColor} />}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
      <div className="absolute top-2 left-2 rounded-lg border border-brand-border bg-brand-surface/90 px-3 py-2 shadow-md text-xs text-text-primary">
        <div className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full"
            style={{ background: yesColor }}
          />
          <span className="font-semibold">YES</span>
          <span className="font-mono">{Math.round(displayYes)}%</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span
            className="w-2 h-2 rounded-full"
            style={{ background: noColor }}
          />
          <span className="font-semibold">NO</span>
          <span className="font-mono">{Math.round(displayNo)}%</span>
        </div>
      </div>
    </div>
  );
};

MarketChart.displayName = "MarketChart";
