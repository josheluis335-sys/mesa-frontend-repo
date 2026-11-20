'use client';

interface BarChartProps {
  data: Array<{ label: string; value: number; color: string }>;
  maxValue?: number;
  height?: number;
  showValues?: boolean;
  className?: string;
}

export function BarChart({ 
  data, 
  maxValue, 
  height = 220, 
  showValues = true,
  className = '' 
}: BarChartProps) {
  const max = maxValue || Math.max(...data.map(d => d.value), 1);
  const barCount = data.length;
  const barWidth = 48;
  const gap = (barCount > 1) ? Math.min(40, 300 / barCount) : 0;
  const totalWidth = barCount * barWidth + (barCount - 1) * gap + 60;
  const leftMargin = 50;
  const bottomMargin = 50;
  const topMargin = 20;
  const chartHeight = height - topMargin - bottomMargin;

  const getY = (value: number) => topMargin + chartHeight - (value / max) * chartHeight;

  return (
    <div className={`w-full ${className}`} role="img" aria-label="Gráfico de barras">
      <svg 
        viewBox={`0 0 ${totalWidth} ${height}`}
        className="w-full h-auto"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {data.map((item, index) => (
            <linearGradient key={index} id={`barGradient-${index}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={item.color} stopOpacity="1" />
              <stop offset="100%" stopColor={item.color} stopOpacity="0.25" />
            </linearGradient>
          ))}
        </defs>
        
        {/* Grid lines */}
        <g className="grid-lines" stroke="currentColor" strokeWidth="0.5" opacity="0.1">
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
            <line 
              key={ratio}
              x1={leftMargin}
              y1={topMargin + chartHeight * (1 - ratio)}
              x2={totalWidth - 10}
              y2={topMargin + chartHeight * (1 - ratio)}
            />
          ))}
        </g>

        {/* Y-axis labels */}
        <g className="axis-labels" fontSize="11" fill="currentColor" opacity="0.5">
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
            <text 
              key={ratio}
              x={leftMargin - 10}
              y={topMargin + chartHeight * (1 - ratio) + 4}
              textAnchor="end"
              className="text-gray-500 dark:text-gray-400"
            >
              {Math.round(max * ratio)}
            </text>
          ))}
        </g>

        {/* X-axis line */}
        <line
          x1={leftMargin}
          y1={topMargin + chartHeight}
          x2={totalWidth - 10}
          y2={topMargin + chartHeight}
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-gray-300 dark:text-gray-600"
        />

        {/* Bars */}
        <g>
          {data.map((item, index) => {
            const x = leftMargin + index * (barWidth + gap);
            const barHeight = (item.value / max) * chartHeight;
            const y = topMargin + chartHeight - barHeight;

            return (
              <g key={index} className="bar-group">
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={Math.max(barHeight, 0)}
                  rx={6}
                  fill={`url(#barGradient-${index})`}
                  className="transition-all duration-500 hover:opacity-90"
                  style={{ transformOrigin: `${x + barWidth / 2}px ${topMargin + chartHeight}px` }}
                />
                {showValues && item.value > 0 && (
                  <text
                    x={x + barWidth / 2}
                    y={Math.max(y - 8, topMargin + 14)}
                    textAnchor="middle"
                    fontSize="12"
                    fontWeight="600"
                    className="text-black dark:text-white"
                  >
                    {item.value}
                  </text>
                )}
                <text
                  x={x + barWidth / 2}
                  y={topMargin + chartHeight + 22}
                  textAnchor="middle"
                  fontSize="11"
                  className="text-gray-500 dark:text-gray-400"
                >
                  {item.label}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}

interface DonutChartProps {
  data: Array<{ label: string; value: number; color: string }>;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export function DonutChart({ 
  data, 
  size = 180, 
  strokeWidth = 16,
  className = '' 
}: DonutChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  let currentOffset = 0;

  return (
    <div className={`flex flex-col items-center ${className}`} role="img" aria-label="Gráfico de dona">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          {data.map((item, index) => (
            <linearGradient key={index} id={`donutGradient-${index}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={item.color} stopOpacity="1" />
              <stop offset="100%" stopColor={item.color} stopOpacity="0.3" />
            </linearGradient>
          ))}
        </defs>
       
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-gray-100 dark:text-gray-800"
        />
       
        {/* Data segments */}
        {data.map((item, index) => {
          const percentage = total > 0 ? item.value / total : 0;
          const dashArray = circumference * percentage;
          const dashOffset = circumference - currentOffset;

          currentOffset += circumference * percentage;

          return (
            <circle
              key={index}
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={`url(#donutGradient-${index})`}
              strokeWidth={strokeWidth}
              strokeDasharray={`${dashArray} ${circumference}`}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              className="transition-all duration-700"
              style={{ transformOrigin: 'center', transformBox: 'fill-box', transform: 'rotate(-90deg)' }}
            />
          );
        })}
       
        {/* Center text */}
        {total > 0 && (
          <text
            x={center}
            y={center + 5}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={size * 0.22}
            fontWeight="700"
            className="text-black dark:text-white"
          >
            {total}
          </text>
        )}
      </svg>
     
      {/* Legend */}
      <div className="mt-4 w-full space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex-1 truncate">
              {item.label}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400 font-mono flex-shrink-0">
              {total > 0 ? Math.round((item.value / total) * 100) : 0}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  trend?: { value: number; label: string; positive?: boolean };
  color?: string;
  className?: string;
}

export function StatCard({ 
  title, 
  value, 
  icon, 
  trend, 
  color = 'bg-gray-100 dark:bg-gray-800 text-black dark:text-white',
  className = '' 
}: StatCardProps) {
  return (
    <div className={`stat-card group ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{title}</p>
          <p className="text-3xl md:text-4xl font-display font-bold text-black dark:text-white">
            {value}
          </p>
          {trend && (
            <div className={`flex items-center gap-1 mt-2 ${trend.positive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              <span className="text-sm font-semibold">{trend.value > 0 ? '+' : ''}{trend.value}%</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{trend.label}</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

interface AreaChartProps {
  data: Array<{ label: string; value: number }>;
  height?: number;
  color?: string;
  className?: string;
  fillOpacity?: number;
}

export function AreaChart({ 
  data, 
  height = 140, 
  color = '#000000',
  className = '',
  fillOpacity = 0.08
}: AreaChartProps) {
  const maxValue = Math.max(...data.map(d => d.value), 1);
  const minValue = Math.min(...data.map(d => d.value));
  const width = Math.max(data.length * 60, 300);
  const stepX = width / (data.length - 1 || 1);
  const topMargin = 20;
  const bottomMargin = 30;
  const leftMargin = 50;
  const chartHeight = height - topMargin - bottomMargin;

  const points = data.map((item, index) => {
    const x = leftMargin + index * stepX;
    const y = topMargin + chartHeight - (item.value / maxValue) * chartHeight;
    return `${x},${y}`;
  }).join(' ');

  const areaPoints = [
    `${leftMargin},${topMargin + chartHeight}`,
    ...points.split(' '),
    `${leftMargin + (data.length - 1) * stepX},${topMargin + chartHeight}`,
  ].join(' ');

  // Y-axis labels
  const yLabels = [0, 0.25, 0.5, 0.75, 1].map(ratio => ({
    value: Math.round(maxValue * ratio),
    y: topMargin + chartHeight * (1 - ratio)
  }));

  return (
    <div className={`w-full ${className}`} role="img" aria-label="Gráfico de área">
      <svg viewBox={`0 0 ${width + leftMargin + 10} ${height}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={fillOpacity} />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
       
        {/* Grid lines */}
        <g stroke="currentColor" strokeWidth="0.5" className="text-gray-200 dark:text-gray-700" opacity="0.3">
          {yLabels.map(({ y }) => (
            <line key={y} x1={leftMargin} y1={y} x2={width + leftMargin} y2={y} />
          ))}
        </g>

        {/* Y-axis labels */}
        <g fontSize="10" fill="currentColor" className="text-gray-500 dark:text-gray-400">
          {yLabels.map(({ value, y }) => (
            <text key={value} x={leftMargin - 10} y={y + 4} textAnchor="end">{value}</text>
          ))}
        </g>

        {/* X-axis line */}
        <line
          x1={leftMargin}
          y1={topMargin + chartHeight}
          x2={width + leftMargin}
          y2={topMargin + chartHeight}
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-gray-300 dark:text-gray-600"
        />

        {/* Area fill */}
        <polyline
          points={areaPoints}
          fill="url(#areaGradient)"
          className="transition-all duration-500"
        />
        {/* Line */}
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-all duration-500"
        />
        {/* Data points */}
        {data.map((item, index) => (
          <circle
            key={index}
            cx={leftMargin + index * stepX}
            cy={topMargin + chartHeight - (item.value / maxValue) * chartHeight}
            r={5}
            fill={color}
            stroke="white"
            strokeWidth={2}
            className="dark:stroke-black opacity-0 group-hover:opacity-100 transition-opacity"
          />
        ))}
        {/* X-axis labels */}
        <g fontSize="10" fill="currentColor" className="text-gray-500 dark:text-gray-400">
          {data.map((item, index) => (
            <text 
              key={index} 
              x={leftMargin + index * stepX} 
              y={topMargin + chartHeight + 20} 
              textAnchor="middle"
              transform={`rotate(-30 ${leftMargin + index * stepX} ${topMargin + chartHeight + 20})`}
            >
              {item.label}
            </text>
          ))}
        </g>
      </svg>
    </div>
  );
}