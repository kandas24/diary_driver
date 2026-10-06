"use client";

import React from "react";
import { motion } from "framer-motion";

export type WeekPoint = {
  date: string;
  label: string;
  value: number;
};

export default function WeekChart({
  data,
  selected,
  onSelect,
  width = 400,
  height = 200,
}: {
  data: WeekPoint[];
  selected: string;
  onSelect: (date: string) => void;
  width?: number;
  height?: number;
}) {
  const selectedIndex = Math.max(
    0,
    data.findIndex((p) => p.date === selected)
  );
  const padding = 24;
  const bottomPadding = 30;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding - bottomPadding;
  const barSpacing = chartWidth / Math.max(data.length, 1);
  const baseline = height - bottomPadding;
  const baselineOffset = 8;
  const maxValue = Math.max(1, ...data.map((d) => d.value));
  const availableHeight = chartHeight - 40;
  const getBarHeight = (value: number) => (value / maxValue) * availableHeight;

  return (
    <div className="relative" role="group" aria-label="week">
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ position: "relative", zIndex: 2 }}
      >
        {data.map((point, index) => {
          const x = padding + index * barSpacing + barSpacing / 2;
          const barHeight = getBarHeight(point.value);
          const lineStartY = baseline - baselineOffset;
          const lineEndY = lineStartY - barHeight;
          const isSelected = index === selectedIndex;
          return (
            <g key={point.date}>
              <rect
                x={x - 25}
                y={0}
                width={50}
                height={height}
                fill="transparent"
                style={{ cursor: "pointer" }}
                onClick={() => onSelect(point.date)}
              />
              <motion.line
                x1={x}
                y1={lineStartY}
                x2={x}
                y2={lineEndY}
                stroke={isSelected ? "#e0263c" : "#4a2430"}
                strokeWidth={isSelected ? 3 : 2}
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ delay: index * 0.06, duration: 0.4 }}
                style={{ pointerEvents: "none" }}
              />
              {isSelected ? (
                <>
                  <motion.rect
                    x={x - 28}
                    y={lineEndY - 29}
                    width={56}
                    height={20}
                    rx={10}
                    fill="#e0263c"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.25 }}
                    style={{ pointerEvents: "none" }}
                  />
                  <motion.text
                    x={x}
                    y={lineEndY - 15}
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight="600"
                    fill="#fff5f5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ pointerEvents: "none" }}
                  >
                    {point.value.toLocaleString()}
                  </motion.text>
                </>
              ) : (
                <motion.circle
                  cx={x}
                  cy={lineEndY - 12}
                  r={3}
                  fill="#a89fa4"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  style={{ pointerEvents: "none" }}
                />
              )}
              <motion.text
                x={x}
                y={baseline + 16}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="11"
                fontWeight={isSelected ? "600" : "400"}
                fill={isSelected ? "#e0263c" : "#a89fa4"}
                style={{ cursor: "pointer" }}
                onClick={() => onSelect(point.date)}
              >
                {point.label}
              </motion.text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}