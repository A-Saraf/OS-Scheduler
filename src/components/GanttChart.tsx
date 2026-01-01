import React from 'react';
import { TimelineItem } from '@/types/scheduler';

interface GanttChartProps {
  timeline: TimelineItem[];
}

const GanttChart: React.FC<GanttChartProps> = ({ timeline }) => {
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

  return (
    <div className="space-y-2">
      {/* Gantt bars */}
      <div className="flex gap-0 p-3 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)]">
        {timeline.map((item, index) => {
          const width = ((item.end - item.start) / maxTime) * 100;
          const isIdle = item.process === 'IDLE';
          const colorClass = isIdle ? 'gantt-bar-idle' : `gantt-bar-${index % 6}`;

          return (
            <div
              key={`${item.process}-${item.start}-${index}`}
              className={`gantt-bar ${colorClass}`}
              style={{ 
                width: `${width}%`,
                animationDelay: `${index * 0.1}s`,
              }}
            >
              {item.process}
            </div>
          );
        })}
      </div>

      {/* Time axis */}
      <div className="relative h-8 mx-3">
        {Array.from({ length: maxTime + 1 }, (_, t) => (
          <div
            key={t}
            className="absolute text-xs text-muted-foreground font-medium"
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
