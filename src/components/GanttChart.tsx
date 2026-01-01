import React, { useMemo } from 'react';
import { TimelineItem } from '@/types/scheduler';

interface GanttChartProps {
  timeline: TimelineItem[];
}

const GanttChart: React.FC<GanttChartProps> = ({ timeline }) => {
  // Create a color map for unique processes
  const processColorMap = useMemo(() => {
    const uniqueProcesses = [...new Set(timeline.filter(t => t.process !== 'IDLE').map(t => t.process))];
    const colorMap: Record<string, number> = {};
    uniqueProcesses.forEach((process, index) => {
      colorMap[process] = index % 6;
    });
    return colorMap;
  }, [timeline]);

  if (!timeline || timeline.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-8">
        <table className="w-[90%] border-collapse opacity-10">
          <tbody>
            {[0, 1, 2].map((row) => (
              <tr key={row}>
                {[0, 1, 2, 3, 4].map((col) => (
                  <td key={col} className="border border-dashed border-muted/20 h-7" />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-muted-foreground text-sm">
          Run the scheduler to generate the Gantt chart.
        </p>
      </div>
    );
  }

  const maxTime = Math.max(...timeline.map(t => t.end));

  // Color configurations for 3D effect
  const colorConfigs = [
    { bg: 'linear-gradient(180deg, #60a5fa 0%, #3b82f6 50%, #2563eb 100%)', shadow: 'rgba(59, 130, 246, 0.5)', text: '#e0e7ff' },
    { bg: 'linear-gradient(180deg, #a78bfa 0%, #8b5cf6 50%, #7c3aed 100%)', shadow: 'rgba(139, 92, 246, 0.5)', text: '#ede9fe' },
    { bg: 'linear-gradient(180deg, #f472b6 0%, #ec4899 50%, #db2777 100%)', shadow: 'rgba(236, 72, 153, 0.5)', text: '#fce7f3' },
    { bg: 'linear-gradient(180deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)', shadow: 'rgba(245, 158, 11, 0.5)', text: '#1e293b' },
    { bg: 'linear-gradient(180deg, #34d399 0%, #10b981 50%, #059669 100%)', shadow: 'rgba(16, 185, 129, 0.5)', text: '#d1fae5' },
    { bg: 'linear-gradient(180deg, #22d3ee 0%, #06b6d4 50%, #0891b2 100%)', shadow: 'rgba(6, 182, 212, 0.5)', text: '#cffafe' },
  ];

  return (
    <div className="space-y-3">
      {/* Gantt bars */}
      <div className="flex gap-[2px] p-4 rounded-xl bg-[rgba(0,0,0,0.3)] border border-[rgba(255,255,255,0.08)]">
        {timeline.map((item, index) => {
          const width = ((item.end - item.start) / maxTime) * 100;
          const isIdle = item.process === 'IDLE';
          const colorIndex = isIdle ? -1 : processColorMap[item.process];
          const config = isIdle ? null : colorConfigs[colorIndex];

          return (
            <div
              key={`${item.process}-${item.start}-${index}`}
              className="gantt-bar-3d"
              style={{
                width: `${width}%`,
                minWidth: '30px',
                background: isIdle
                  ? 'repeating-linear-gradient(45deg, rgba(100, 116, 139, 0.15), rgba(100, 116, 139, 0.15) 8px, rgba(71, 85, 105, 0.15) 8px, rgba(71, 85, 105, 0.15) 16px)'
                  : config?.bg,
                color: isIdle ? '#64748b' : config?.text,
                boxShadow: isIdle
                  ? 'inset 0 1px 0 rgba(255,255,255,0.05), 0 2px 4px rgba(0,0,0,0.3)'
                  : `inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.2), 0 4px 12px ${config?.shadow}`,
                borderRadius: '6px',
                padding: '12px 8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '13px',
                textShadow: isIdle ? 'none' : '0 1px 2px rgba(0,0,0,0.3)',
                border: isIdle ? '1px dashed rgba(100, 116, 139, 0.4)' : '1px solid rgba(255,255,255,0.2)',
                transform: 'translateY(0)',
                transition: 'all 0.2s ease',
                animation: `growBar 0.5s ease forwards`,
                animationDelay: `${index * 0.08}s`,
                opacity: 0,
              }}
              onMouseEnter={(e) => {
                if (!isIdle) {
                  e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                  e.currentTarget.style.boxShadow = `inset 0 2px 4px rgba(255,255,255,0.4), inset 0 -2px 4px rgba(0,0,0,0.2), 0 8px 20px ${config?.shadow}`;
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                if (!isIdle && config) {
                  e.currentTarget.style.boxShadow = `inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.2), 0 4px 12px ${config.shadow}`;
                }
              }}
            >
              {item.process}
            </div>
          );
        })}
      </div>

      {/* Time axis */}
      <div className="relative h-8 mx-4">
        {Array.from({ length: maxTime + 1 }, (_, t) => (
          <div
            key={t}
            className="absolute text-xs text-muted-foreground font-semibold"
            style={{
              left: `${(t / maxTime) * 100}%`,
              transform: 'translateX(-50%)',
            }}
          >
            {t}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GanttChart;
