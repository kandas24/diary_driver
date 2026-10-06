import React, { useState, useEffect } from 'react';

export type SeriesPoint = {
  dates: string[];
  revenue: number[];
  trips: number[];
  peak: number;
  average: number;
  growth: string;
};

export type StatsLabels = {
  heading: string;
  subheading: string;
  revenue: string;
  trips: string;
  peak: string;
  average: string;
  growth: string;
  weekTotal: string;
};

const CleanWireframeAnalytics = ({
  data,
  labels,
  onSelect,
  selectedIndex
}: {
  data: SeriesPoint;
  labels: StatsLabels;
  onSelect?: (date: string) => void;
  selectedIndex?: number;
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const [animationPhase, setAnimationPhase] = useState(0);
  const [chartVisible, setChartVisible] = useState(false);

  const currentData = data;
  const mobile = currentData.revenue;
  const desktop = currentData.trips;
  const maxValue = Math.max(1, ...mobile, ...desktop) * 1.1;

  // Generate path for smooth curves
  const generateSmoothPath = (values: number[], height = 300, isArea = false) => {
    const width = 800;
    const padding = 60;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    
    const points = values.map((value: number, index: number) => ({
      x: padding + (index / (values.length - 1)) * chartWidth,
      y: padding + (1 - value / maxValue) * chartHeight
    }));

    if (points.length < 2) return '';

    let path = `M ${points[0].x},${points[0].y}`;
    
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const next = points[i + 1];
      
      const cp1x = prev.x + (curr.x - prev.x) * 0.5;
      const cp1y = prev.y;
      const cp2x = curr.x - (next ? (next.x - curr.x) * 0.3 : 0);
      const cp2y = curr.y;
      
      path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${curr.x},${curr.y}`;
    }
    
    if (isArea) {
      path += ` L ${points[points.length - 1].x},${height - padding} L ${padding},${height - padding} Z`;
    }
    
    return path;
  };

  useEffect(() => {
    setChartVisible(false);
    setAnimationPhase(0);
    
    const timers = [
      setTimeout(() => setAnimationPhase(1), 100),
      setTimeout(() => setAnimationPhase(2), 400),
      setTimeout(() => setAnimationPhase(3), 800),
      setTimeout(() => setChartVisible(true), 1200)
    ];
    
    return () => timers.forEach(clearTimeout);
  }, [currentData]);

  const periods: any[] = [];

  const metrics = [
    { label: labels.peak, value: currentData.peak, color: '', size: '' },
    { label: labels.average, value: currentData.average, color: '', size: '' },
    { label: labels.growth, value: currentData.growth, color: '', size: '' }
  ];

  return (
    <div className="stats font-light">
      <div>
        {/* Header */}
        <div className="mb-8 pl-0.5">
          <h1 
            className={`text-4xl leading-tight font-extralight text-zinc-100 mb-1 tracking-normal transition-all duration-1000 ${
              animationPhase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            {labels.heading}
          </h1>
          <p 
            className={`text-base text-zinc-500 font-light transition-all duration-1000 delay-200 ${
              animationPhase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            {labels.subheading}
          </p>
        </div>

        {/* Main Chart Container */}
        <div className="relative bg-zinc-950 rounded-none shadow-sm border border-white/10">
          
          {/* Legend */}
          <div className="absolute top-8 left-8 z-10 flex gap-8">
            <div 
              className={`flex items-center gap-2 transition-all duration-800 delay-300 ${
                animationPhase >= 2 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
              }`}
            >
              <span className="text-zinc-400 font-medium">{labels.revenue}</span>
              <span className="text-zinc-100 font-semibold">{mobile[mobile.length - 1]}</span>
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
            </div>
            <div 
              className={`flex items-center gap-2 transition-all duration-800 delay-400 ${
                animationPhase >= 2 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
              }`}
            >
              <span className="text-zinc-400 font-medium">{labels.trips}</span>
              <span className="text-zinc-100 font-semibold">{desktop[desktop.length - 1]}</span>
              <span className="w-2 h-2 rounded-full bg-zinc-400"></span>
            </div>
          </div>

          {/* Chart Area */}
          <div className="p-8 pt-20 pb-16">
            <div className="h-96 relative">
              <svg className="w-full h-full" viewBox="0 0 800 400">
                {/* Background Grid */}
                <defs>
                  <pattern id="grid" width="40" height="30" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 30" fill="none" stroke="#1c1c1c" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="800" height="400" fill="url(#grid)"/>

                {/* Desktop Area */}
                <path
                  d={generateSmoothPath(desktop, 340, true)}
                  fill="rgba(161, 161, 170, 0.10)"
                  className={chartVisible ? 'chart-in' : 'chart-out'}
                />

                {/* Mobile Area */}
                <path
                  d={generateSmoothPath(mobile, 340, true)}
                  fill="rgba(239, 68, 68, 0.14)"
                  className={chartVisible ? 'chart-in' : 'chart-out'}
                />

                {/* Desktop Line */}
                <path
                  d={generateSmoothPath(desktop, 340)}
                  fill="none"
                  stroke="#a1a1aa"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="chart-line"
                  strokeDasharray={1000}
                  strokeDashoffset={chartVisible ? 0 : 1000}
                />

                {/* Mobile Line */}
                <path
                  d={generateSmoothPath(mobile, 340)}
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="chart-line"
                  strokeDasharray={1000}
                  strokeDashoffset={chartVisible ? 0 : 1000}
                />

                {/* Data Points */}
                {currentData.dates.map((date: string, index: number) => {
                  const padding = 60;
                  const chartWidth = 800 - padding * 2;
                  const chartHeight = 340 - padding * 2;
                  const x = padding + (index / (currentData.dates.length - 1)) * chartWidth;
                  const mobileY = padding + (1 - mobile[index] / maxValue) * chartHeight;
                  const desktopY = padding + (1 - desktop[index] / maxValue) * chartHeight;
                  
                  return (
                    <g key={index}>
                      <rect
                        x={x - 14}
                        y={padding}
                        width={28}
                        height={chartHeight}
                        fill="transparent"
                        onMouseEnter={() => setHoveredPoint(index)}
                        onMouseLeave={() => setHoveredPoint(null)}
                        onClick={() => onSelect && onSelect(date)}
                      />
                      {/* Desktop Point */}
                      <circle
                        cx={x}
                        cy={desktopY}
                        r={hoveredPoint === index ? 6 : 3.5}
                        fill="#a1a1aa"
                        className={`cursor-pointer ${chartVisible ? 'chart-dot' : 'chart-dot-off'}`}
                        style={{ animationDelay: `${(1500 * index) / Math.max(currentData.dates.length - 1, 1)}ms` }}
                        onMouseEnter={() => setHoveredPoint(index)}
                        onMouseLeave={() => setHoveredPoint(null)}
                      />
                      
                      {/* Mobile Point */}
                      <circle
                        cx={x}
                        cy={mobileY}
                        r={hoveredPoint === index ? 6 : 3.5}
                        fill="#ef4444"
                        className={`cursor-pointer ${chartVisible ? 'chart-dot' : 'chart-dot-off'}`}
                        style={{ animationDelay: `${(1500 * index) / Math.max(currentData.dates.length - 1, 1)}ms` }}
                        onMouseEnter={() => setHoveredPoint(index)}
                        onMouseLeave={() => setHoveredPoint(null)}
                      />
                    </g>
                  );
                })}

                {/* X-axis Labels */}
                {currentData.dates.map((date: string, index: number) => {
                  const padding = 60;
                  const chartWidth = 800 - padding * 2;
                  const x = padding + (index / (currentData.dates.length - 1)) * chartWidth;
                  
                  return (
                    <text
                      key={index}
                      x={x}
                      y={365}
                      textAnchor="middle"
                      fill={selectedIndex === index ? '#fafafa' : '#71717a'}
                      fontSize="13"
                      fontWeight="400"
                      className={`cursor-pointer ${chartVisible ? 'chart-label' : 'chart-label-off'}`}
                      style={{ animationDelay: `${1200 + (400 * index) / Math.max(currentData.dates.length - 1, 1)}ms` }}
                      onClick={() => onSelect && onSelect(date)}
                    >
                      {date}
                    </text>
                  );
                })}

                {/* Hover Tooltip */}
                {hoveredPoint !== null && (() => {
                  const pad = 60;
                  const ch = 340 - pad * 2;
                  const cx = 60 + (hoveredPoint / (currentData.dates.length - 1)) * 680;
                  const topY = Math.min(
                    pad + (1 - mobile[hoveredPoint] / maxValue) * ch,
                    pad + (1 - desktop[hoveredPoint] / maxValue) * ch
                  );
                  const ty = Math.max(8, topY - 82);
                  return (
                  <g style={{ pointerEvents: "none" }}>
                    <rect
                      x={cx - 50}
                      y={ty}
                      width="100"
                      height="70"
                      fill="#18181b"
                      stroke="#3f3f46"
                      strokeWidth="1"
                      rx="6"
                      className="drop-shadow-xl"
                    />
                    <text
                      x={cx}
                      y={ty + 18}
                      textAnchor="middle"
                      fill="#fafafa"
                      fontSize="12"
                      fontWeight="600"
                    >
                      {currentData.dates[hoveredPoint]}
                    </text>
                    <text
                      x={cx}
                      y={ty + 35}
                      textAnchor="middle"
                      fill="#ef4444"
                      fontSize="11"
                      fontWeight="500"
                    >
                      {labels.revenue}: {mobile[hoveredPoint]}
                    </text>
                    <text
                      x={cx}
                      y={ty + 52}
                      textAnchor="middle"
                      fill="#a1a1aa"
                      fontSize="11"
                      fontWeight="500"
                    >
                      {labels.trips}: {desktop[hoveredPoint]}
                    </text>
                  </g>
                  );
                })()}
              </svg>
            </div>
          </div>

          {/* Bottom Metrics */}
          <div className="px-8 pb-8 flex justify-between items-end">
            <div className="flex gap-4">
              {metrics.map((metric: any, index: number) => (
                <div
                  key={metric.label}
                  className={`
                    bg-zinc-900 rounded-lg shadow-sm border border-white/12 p-4 min-w-[120px]
                    transition-all duration-800 hover:scale-105 hover:shadow-md
                    ${animationPhase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}
                  `}
                  style={{
                    transitionDelay: `${1800 + index * 200}ms`
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-500"></div>
                    <span className="text-xs text-zinc-500 font-medium">{metric.size}</span>
                  </div>
                  <div className="text-2xl font-bold text-zinc-100 mb-1">{metric.value}</div>
                  <div className="text-sm text-zinc-400 font-medium">{metric.label}</div>
                </div>
              ))}
            </div>

            {/* Bundle Size */}
            <div 
              className={`bg-gray-900 text-white px-6 py-3 rounded-lg transition-all duration-800 ${
                animationPhase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
              style={{ transitionDelay: '2400ms' }}
            >
              <div className="flex items-center gap-3">
                <span className="text-zinc-400 font-medium">{labels.weekTotal}</span>
                <span className="font-bold">{currentData.peak + currentData.average}</span>
              </div>
              <div className="w-48 h-2 bg-gray-700 rounded-full mt-2 overflow-hidden">
                <div 
                  className={`h-full bg-red-500 rounded-full transition-all duration-2000 ${
                    chartVisible ? 'w-full' : 'w-0'
                  }`}
                  style={{ transitionDelay: '2800ms' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CleanWireframeAnalytics;