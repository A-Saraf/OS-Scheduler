import React, { useMemo, useRef, useEffect, useState } from 'react';
import { TimelineItem } from '@/types/scheduler';
import { PROCESS_COLORS, ProcessColor } from '@/utils/processColors';

// Chart layout constants
const CHART_PADDING = 32; // Horizontal padding for chart container (px)
const MIN_CONTAINER_WIDTH = 400; // Minimum chart container width (px)
const DEFAULT_CONTAINER_WIDTH = 600; // Default width before measurement (px)

// Bar sizing constants
const MIN_WIDTH_PER_UNIT = 40; // Minimum pixels per time unit
const MAX_WIDTH_PER_UNIT = 80; // Maximum pixels per time unit
const MIN_BAR_WIDTH = 28; // Minimum bar width for visibility (px)
const BAR_HEIGHT = 48; // Height of each Gantt bar (px)
const BAR_TOP_OFFSET = 8; // Top offset within container (px)

interface GanttChartProps {
  timeline: TimelineItem[];
}

const GanttChart: React.FC<GanttChartProps> = ({ timeline }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(DEFAULT_CONTAINER_WIDTH);

  // Get actual container width for responsive sizing
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth - CHART_PADDING);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Create a color map for unique processes - must be called before any early returns (Rules of Hooks)
  const processColorMap = useMemo(() => {
    if (!timeline || timeline.length === 0) return {} as Record<string, ProcessColor>;
    const filteredTimeline = timeline.filter(t => t.process !== 'IDLE');
    const uniqueProcesses = [...new Set(filteredTimeline.map(t => t.process))];
    const colorMap: Record<string, ProcessColor> = {};
    uniqueProcesses.forEach((process, index) => {
      colorMap[process] = PROCESS_COLORS[index % PROCESS_COLORS.length];
    });
    return colorMap;
  }, [timeline]);

  // Get unique processes for legend
  const uniqueProcesses = useMemo(() => {
    if (!timeline || timeline.length === 0) return [];
    return [...new Set(timeline.filter(t => t.process !== 'IDLE').map(t => t.process))];
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

  // Calculate responsive scaling to fit within container
  const maxTime = Math.max(...timeline.map(t => t.end));

  // Use container width for responsive sizing with extra padding for scroll comfort
  const availableWidth = Math.max(containerWidth, MIN_CONTAINER_WIDTH) - CHART_PADDING;

  // Calculate width per unit based on total time and available space
  let widthPerUnit: number;
  const idealWidth = availableWidth / maxTime;

  if (idealWidth >= MIN_WIDTH_PER_UNIT && idealWidth <= MAX_WIDTH_PER_UNIT) {
    widthPerUnit = idealWidth;
  } else if (idealWidth > MAX_WIDTH_PER_UNIT) {
    widthPerUnit = MAX_WIDTH_PER_UNIT;
  } else {
    widthPerUnit = MIN_WIDTH_PER_UNIT;
  }

  // Calculate exact content width with extra padding for the last time label
  const contentWidth = Math.max(maxTime * widthPerUnit + 40, availableWidth);

  // Filter timeline to only include blocks up to maxTime
  const filteredTimeline = timeline.filter(item => item.start < maxTime);

  return (
    <div ref={containerRef} className="space-y-4 w-full">
      {/* Process Legend */}
      {uniqueProcesses.length > 0 && (
        <div className="flex flex-wrap gap-3 px-4 py-2 bg-black/20 rounded-lg">
          {uniqueProcesses.map((process) => {
            const color = processColorMap[process];
            return (
              <div key={process} className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded"
                  style={{ background: color?.gradient }}
                />
                <span className="text-sm font-medium text-foreground">{process}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Scrollable container - only scrolls when content exceeds container */}
      <div
        className="overflow-x-auto overflow-y-visible custom-scrollbar"
        style={{
          maxWidth: '100%',
          width: '100%',
        }}
      >
        <div style={{ width: `${contentWidth}px`, minWidth: '100%' }}>
          {/* Gantt bars container */}
          <div className="relative px-4" style={{ width: `${contentWidth}px` }}>
            {/* Gantt bars */}
            <div
              className="relative rounded-xl bg-[rgba(0,0,0,0.25)] border border-[rgba(255,255,255,0.08)] p-3"
              style={{ width: `${contentWidth - CHART_PADDING}px`, minHeight: `${BAR_HEIGHT + BAR_TOP_OFFSET * 2}px` }}
            >
              {filteredTimeline.map((item, index) => {
                const barWidth = (item.end - item.start) * widthPerUnit;
                const left = item.start * widthPerUnit;
                const isIdle = item.process === 'IDLE';
                const processColor = isIdle ? null : processColorMap[item.process];

                return (
                  <div
                    key={`${item.process}-${item.start}-${index}`}
                    className="gantt-bar-3d absolute"
                    style={{
                      left: `${left}px`,
                      width: `${Math.max(barWidth, MIN_BAR_WIDTH)}px`,
                      height: `${BAR_HEIGHT}px`,
                      top: `${BAR_TOP_OFFSET}px`,
                      background: isIdle
                        ? 'repeating-linear-gradient(45deg, rgba(100, 116, 139, 0.2), rgba(100, 116, 139, 0.2) 6px, rgba(71, 85, 105, 0.2) 6px, rgba(71, 85, 105, 0.2) 12px)'
                        : processColor?.gradient,
                      color: isIdle ? '#64748b' : processColor?.text,
                      boxShadow: isIdle
                        ? 'inset 0 1px 0 rgba(255,255,255,0.05), 0 2px 4px rgba(0,0,0,0.3)'
                        : `inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.2), 0 4px 12px ${processColor?.shadow}`,
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 600,
                      fontSize: '13px',
                      textShadow: isIdle ? 'none' : '0 1px 2px rgba(0,0,0,0.3)',
                      border: isIdle ? '1px dashed rgba(100, 116, 139, 0.4)' : '1px solid rgba(255,255,255,0.2)',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      if (!isIdle && processColor) {
                        e.currentTarget.style.transform = 'translateY(-3px) scale(1.03)';
                        e.currentTarget.style.boxShadow = `inset 0 2px 4px rgba(255,255,255,0.4), inset 0 -2px 4px rgba(0,0,0,0.2), 0 10px 25px ${processColor.shadow}`;
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0) scale(1)';
                      if (!isIdle && processColor) {
                        e.currentTarget.style.boxShadow = `inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.2), 0 4px 12px ${processColor.shadow}`;
                      }
                    }}
                    title={`${item.process}: ${item.start} - ${item.end}`}
                  >
                    {item.process}
                  </div>
                );
              })}
            </div>

            {/* Time axis */}
            <div className="relative h-10 mt-2" style={{ width: `${contentWidth - CHART_PADDING}px` }}>
              {/* Main axis line */}
              <div
                className="absolute top-0 h-px bg-foreground/30"
                style={{ width: '100%' }}
              />

              {/* Time points */}
              {(() => {
                const significantTimes = new Set<number>();
                filteredTimeline.forEach(item => {
                  significantTimes.add(item.start);
                  significantTimes.add(item.end);
                });
                significantTimes.add(0);

                const timePoints = Array.from(significantTimes).sort((a, b) => a - b);

                return timePoints.map((t) => (
                  <div key={t}>
                    <div
                      className="absolute w-px h-3 bg-foreground/50"
                      style={{ left: `${t * widthPerUnit}px`, top: '0px' }}
                    />
                    <div
                      className="absolute text-xs text-muted-foreground font-medium"
                      style={{
                        left: `${t * widthPerUnit}px`,
                        top: '16px',
                        transform: 'translateX(-50%)',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {t}
                    </div>
                  </div>
                ));
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GanttChart;

