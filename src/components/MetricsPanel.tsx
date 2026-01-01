import React from 'react';
import { Metrics } from '@/types/scheduler';

interface MetricsPanelProps {
  metrics: Metrics | null;
}

const MetricsPanel: React.FC<MetricsPanelProps> = ({ metrics }) => {
  const cpuPercent = metrics ? Math.round(metrics.cpuUtil) : 0;
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - cpuPercent / 100);

  return (
    <div className="glass-card">
      <h2 className="text-lg font-semibold text-foreground mb-4">Metrics</h2>

      {/* SVG Gradient Definition */}
      <svg width="0" height="0">
        <defs>
          <linearGradient id="cpuGrad" x1="0%" x2="100%">
            <stop offset="0%" stopColor="#5b9cff" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
      </svg>

      <div className="grid grid-cols-3 gap-4">
        {/* CPU Utilization Circle */}
        <div className="metric-glass flex flex-col items-center gap-2">
          <p className="text-muted-foreground text-sm">CPU Utilization</p>
          <div className="relative w-[110px] h-[110px]">
            <svg className="w-full h-full" viewBox="0 0 110 110">
              <circle
                className="ring-bg"
                cx="55"
                cy="55"
                r={radius}
                strokeWidth="10"
                fill="none"
              />
              <circle
                className="ring-progress"
                cx="55"
                cy="55"
                r={radius}
                strokeWidth="10"
                strokeLinecap="round"
                fill="none"
                transform="rotate(-90 55 55)"
                style={{
                  strokeDasharray: `${circumference} ${circumference}`,
                  strokeDashoffset: metrics ? strokeDashoffset : circumference,
                  transition: 'stroke-dashoffset 0.8s ease',
                }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-extrabold text-xl text-foreground">
                {cpuPercent}%
              </span>
            </div>
          </div>
        </div>

        {/* Avg Waiting Time */}
        <MetricCard
          title="Avg Waiting Time"
          value={metrics?.avgWait.toFixed(2) ?? '0.00'}
          unit="ms"
          filled={!!metrics}
        />

        {/* Avg Turnaround Time */}
        <MetricCard
          title="Avg Turnaround Time"
          value={metrics?.avgTurn.toFixed(2) ?? '0.00'}
          unit="ms"
          filled={!!metrics}
        />

        {/* Avg Response Time */}
        <MetricCard
          title="Avg Response Time"
          value={metrics?.avgResp.toFixed(2) ?? '0.00'}
          unit="ms"
          filled={!!metrics}
        />

        {/* Total Time */}
        <MetricCard
          title="Total Time"
          value={metrics?.totalTime?.toString() ?? '0'}
          unit="ms"
          filled={!!metrics}
        />

        {/* Sum Turnaround */}
        <MetricCard
          title="Sum Turnaround"
          value={metrics?.totalTurnSum?.toString() ?? '0'}
          unit="ms"
          filled={!!metrics}
        />
      </div>
    </div>
  );
};

interface MetricCardProps {
  title: string;
  value: string;
  unit: string;
  filled: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, unit, filled }) => {
  return (
    <div className="metric-glass">
      <p className="text-muted-foreground text-sm mb-2">{title}</p>
      <div className="flex flex-col gap-2">
        <div className="glass-progress-bar">
          <div
            className="glass-progress-fill"
            style={{ width: filled ? '100%' : '0%' }}
          />
        </div>
        <p className="font-bold text-sm text-foreground">
          {value} {unit}
        </p>
      </div>
    </div>
  );
};

export default MetricsPanel;
