import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Process, AlgorithmType, TimelineItem } from '@/types/scheduler';
import { runAlgorithm } from '@/utils/schedulerAlgorithms';
import { PROCESS_COLORS } from '@/utils/processColors';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { Play, Pause, RotateCcw, Gauge } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface QueueAnimationProps {
  processes: Process[];
  algorithm: AlgorithmType;
  timeQuantum: number;
  onLogUpdate?: (log: OperationLog[]) => void;
}

interface AnimationState {
  currentTime: number;
  queue: Process[];
  executing: Process | null;
  completed: Process[];
  waiting: Process[];
  timelineIndex: number;
  remainingBurst: Record<string, number>;
}

export interface OperationLog {
  time: number;
  message: string;
  type: 'arrival' | 'queue' | 'start' | 'complete' | 'idle' | 'reenter';
}

const QueueAnimation: React.FC<QueueAnimationProps> = ({ processes, algorithm, timeQuantum, onLogUpdate }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1); // 1x, 2x, 3x, etc.
  const [animationState, setAnimationState] = useState<AnimationState | null>(null);
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [allProcesses, setAllProcesses] = useState<Process[]>([]);
  const [operationLog, setOperationLog] = useState<OperationLog[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { playSound } = useSoundEffects();
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Memoized process sorting function
  const sortProcessesByAlgorithm = useCallback((processes: Process[]) => {
    const sorted = [...processes];
    switch (algorithm) {
      case 'FCFS':
        return sorted.sort((a, b) => a.arrival - b.arrival);
      case 'SJF':
        return sorted.sort((a, b) => a.burst - b.burst);
      case 'Priority':
        return sorted.sort((a, b) => a.priority - b.priority);
      default:
        return sorted;
    }
  }, [algorithm]);

  // Auto-scroll log to bottom when new entries are added
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [operationLog]);

  // Notify parent of log updates
  useEffect(() => {
    if (onLogUpdate) {
      onLogUpdate(operationLog);
    }
  }, [operationLog, onLogUpdate]);

  // Generate timeline and prepare processes
  useEffect(() => {
    if (processes.length === 0) {
      setTimeline([]);
      setAllProcesses([]);
      setAnimationState(null);
      return;
    }

    const timelineResult = runAlgorithm(algorithm, processes, timeQuantum);
    setTimeline(timelineResult);
    setAllProcesses([...processes]);

    // Initialize animation state
    const processesReadyAtStart = processes.filter(p => p.arrival <= 0);
    const initialRemainingBurst = processes.reduce((acc, p) => {
      acc[p.id] = p.burst;
      return acc;
    }, {} as Record<string, number>);
    const initialState: AnimationState = {
      currentTime: 0,
      queue: algorithm === 'FCFS' || algorithm === 'SJF' || algorithm === 'RoundRobin'
        ? sortProcessesByAlgorithm(processesReadyAtStart)
        : [],
      executing: null,
      completed: [],
      waiting: processes.filter(p => p.arrival > 0),
      timelineIndex: 0,
      remainingBurst: initialRemainingBurst,
    };
    setAnimationState(initialState);
    setOperationLog([{ time: 0, message: 'Animation initialized', type: 'start' }]);
    if (onLogUpdate) {
      onLogUpdate([{ time: 0, message: 'Animation initialized', type: 'start' }]);
    }
  }, [processes, algorithm, timeQuantum, onLogUpdate, sortProcessesByAlgorithm]);

  // Optimized animation logic
  useEffect(() => {
    if (!isPlaying || !animationState || timeline.length === 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    const baseInterval = 1000; // 1 second base
    const interval = baseInterval / speed;

    intervalRef.current = setInterval(() => {
      setAnimationState((prev) => {
        if (!prev) return prev;

        const newState = { ...prev };
        const maxTime = Math.max(...timeline.map(t => t.end));

        // Check if animation is complete
        if (newState.currentTime > maxTime) {
          setIsPlaying(false);
          return prev;
        }

        // Batch log updates to reduce re-renders
        const newLogEntries: OperationLog[] = [];

        // Add processes that arrive at current time
        const arrivingProcesses = allProcesses.filter(
          p => p.arrival === newState.currentTime &&
            !newState.waiting.some(w => w.id === p.id) &&
            !newState.queue.some(q => q.id === p.id) &&
            !newState.completed.some(c => c.id === p.id) &&
            newState.executing?.id !== p.id
        );

        if (arrivingProcesses.length > 0) {
          playSound('addProcess');
          const sorted = sortProcessesByAlgorithm(arrivingProcesses);
          newState.queue = [...newState.queue, ...sorted];

          const processIds = sorted.map(p => p.id).join(', ');
          newLogEntries.push({
            time: newState.currentTime,
            message: `Process${sorted.length > 1 ? 'es' : ''} ${processIds} arrived and entered ready queue`,
            type: 'arrival'
          });
        }

        // Move processes from waiting to queue - check all processes that should be ready
        const readyProcesses = newState.waiting.filter(
          p => p.arrival <= newState.currentTime &&
            !newState.queue.some(q => q.id === p.id) &&
            !newState.completed.some(c => c.id === p.id) &&
            newState.executing?.id !== p.id
        );

        if (readyProcesses.length > 0) {
          const sorted = sortProcessesByAlgorithm(readyProcesses);
          newState.queue = [...newState.queue, ...sorted];
          newState.waiting = newState.waiting.filter(p => !readyProcesses.some(rp => rp.id === p.id));

          // Log processes that moved from waiting to ready queue
          if (readyProcesses.length > 0) {
            const processIds = readyProcesses.map(p => p.id).join(', ');
            newLogEntries.push({
              time: newState.currentTime,
              message: `Process${readyProcesses.length > 1 ? 'es' : ''} ${processIds} moved from waiting to ready queue`,
              type: 'queue'
            });
          }
        }

        // Enhanced timeline processing - handle multiple timeline items at same time
        while (newState.timelineIndex < timeline.length) {
          const currentItem = timeline[newState.timelineIndex];
          if (!currentItem) break;

          const { process: processId, start, end } = currentItem;

          // If we're before this timeline item, stop
          if (newState.currentTime < start) {
            break;
          }

          // If we've passed this timeline item, move to next
          if (newState.currentTime > end) {
            newState.timelineIndex++;
            continue;
          }

          // Process completes time slice (check at end time first)
          if (newState.currentTime === end) {
            if (newState.executing && processId !== 'IDLE' && newState.executing.id === processId) {
              const process = newState.executing;
              const executionTime = end - start;

              // Update remaining burst time
              const currentRemaining = newState.remainingBurst[processId] ?? process.burst;
              const newRemaining = Math.max(0, currentRemaining - executionTime);
              newState.remainingBurst = {
                ...newState.remainingBurst,
                [processId]: newRemaining
              };

              // Check if process is complete based on remaining burst
              if (newRemaining <= 0) {
                // Remove from queue if somehow present
                newState.queue = newState.queue.filter(q => q.id !== processId);
                newState.completed = [...newState.completed, process];
                playSound('success');
                newLogEntries.push({
                  time: newState.currentTime,
                  message: `Process ${processId} completed execution`,
                  type: 'complete'
                });
              } else if (algorithm === 'RoundRobin' || algorithm === 'SRTF' || algorithm === 'Priority') {
                // Only add to queue if not already there
                if (!newState.queue.some(q => q.id === processId)) {
                  newState.queue = [...newState.queue, process];
                  playSound('addProcess');
                  newLogEntries.push({
                    time: newState.currentTime,
                    message: `Process ${processId} time slice ended (${newRemaining} remaining), re-entered ready queue`,
                    type: 'reenter'
                  });
                }
              }
            }
            newState.executing = null;
            newState.timelineIndex++;

            // Check if next item starts at same time
            const nextItem = timeline[newState.timelineIndex];
            if (nextItem && nextItem.start === newState.currentTime) {
              continue; // Continue to process next item immediately
            } else {
              break; // No more items at this time, exit loop
            }
          }

          // Process starts executing
          if (newState.currentTime === start) {
            if (processId !== 'IDLE') {
              const process = allProcesses.find(p => p.id === processId);
              if (process) {
                newState.queue = newState.queue.filter(p => p.id !== processId);
                newState.waiting = newState.waiting.filter(p => p.id !== processId);
                const wasCompleted = newState.completed.some(p => p.id === processId);
                newState.completed = newState.completed.filter(p => p.id !== processId);
                newState.executing = process;
                playSound('runGantt');

                newLogEntries.push({
                  time: newState.currentTime,
                  message: wasCompleted
                    ? `Process ${processId} re-entered queue and started executing (Round Robin)`
                    : `Process ${processId} started executing on CPU`,
                  type: wasCompleted ? 'reenter' : 'start'
                });
              }
            } else {
              newState.executing = null;
              newLogEntries.push({
                time: newState.currentTime,
                message: 'CPU is IDLE',
                type: 'idle'
              });
            }
            break; // Processed start, wait for next tick
          }

          // We're in the middle of execution, break
          break;
        }

        newState.currentTime += 1;

        // Batch update logs
        if (newLogEntries.length > 0) {
          setOperationLog(prev => [...prev, ...newLogEntries]);
        }

        return newState;
      });
    }, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPlaying, animationState, timeline, speed, algorithm, allProcesses, playSound, sortProcessesByAlgorithm]);

  const handlePlay = useCallback(() => {
    if (!animationState || timeline.length === 0) return;
    setIsPlaying(true);
    playSound('runGantt');
  }, [animationState, timeline, playSound]);

  const handlePause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const handleRestart = useCallback(() => {
    setIsPlaying(false);
    playSound('reset');

    const processesReadyAtStart = allProcesses.filter(p => p.arrival <= 0);
    const initialRemainingBurst = allProcesses.reduce((acc, p) => {
      acc[p.id] = p.burst;
      return acc;
    }, {} as Record<string, number>);
    const initialState: AnimationState = {
      currentTime: 0,
      queue: algorithm === 'FCFS' || algorithm === 'SJF' || algorithm === 'RoundRobin'
        ? sortProcessesByAlgorithm(processesReadyAtStart)
        : [],
      executing: null,
      completed: [],
      waiting: allProcesses.filter(p => p.arrival > 0),
      timelineIndex: 0,
      remainingBurst: initialRemainingBurst,
    };
    setAnimationState(initialState);
    setOperationLog([{ time: 0, message: 'Animation reset', type: 'start' }]);
  }, [allProcesses, algorithm, playSound, sortProcessesByAlgorithm]);

  // Use useMemo for consistent process colors based on order
  const processColorMap = useMemo(() => {
    const map: Record<string, typeof PROCESS_COLORS[0]> = {};
    allProcesses.forEach((process, index) => {
      map[process.id] = PROCESS_COLORS[index % PROCESS_COLORS.length];
    });
    return map;
  }, [allProcesses]);

  const getProcessColor = (processId: string): { bgClass: string; solid: string } => {
    const color = processColorMap[processId];
    return color || PROCESS_COLORS[0];
  };

  if (processes.length === 0) {
    return (
      <div className="glass-card p-8 text-center">
        <p className="text-muted-foreground">Add processes to see the animation</p>
      </div>
    );
  }

  if (!animationState) {
    return (
      <div className="glass-card p-8 text-center">
        <p className="text-muted-foreground">Preparing animation...</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Queue Animation</h2>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg border border-blue-500/30">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm font-semibold text-foreground">
            {algorithm === 'FCFS' ? 'First Come First Served' :
              algorithm === 'SJF' ? 'Shortest Job First' :
                algorithm === 'SRTF' ? 'Shortest Remaining Time First' :
                  algorithm === 'Priority' ? 'Priority Scheduling' :
                    algorithm === 'RoundRobin' ? `Round Robin (TQ: ${timeQuantum})` : algorithm}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-black/20 rounded-lg">
        <div className="flex items-center gap-2">
          <button
            onClick={isPlaying ? handlePause : handlePlay}
            disabled={timeline.length === 0}
            className="btn-execute"
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <button
            onClick={handleRestart}
            disabled={timeline.length === 0}
            className="btn-secondary"
          >
            <RotateCcw size={16} />
            Restart
          </button>
        </div>

        <div className="flex items-center gap-3 flex-1 min-w-[200px]">
          <Gauge size={16} className="text-muted-foreground" />
          <span className="text-sm text-muted-foreground min-w-[60px]">Speed: {speed}x</span>
          <Slider
            value={[speed]}
            onValueChange={(value) => setSpeed(value[0])}
            min={0.5}
            max={3}
            step={0.5}
            className="flex-1"
          />
        </div>

        <div className="text-sm text-muted-foreground">
          Time: <span className="text-foreground font-semibold">{animationState.currentTime}</span>
        </div>
      </div>

      {/* Animation Area */}
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Waiting Area */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-2 text-center">
            Waiting Processes (Arrival Time &gt; Current Time)
          </h3>
          <div className="flex flex-wrap gap-2 min-h-[60px] p-3 bg-black/10 rounded-lg border border-white/10 justify-center">
            {animationState.waiting.length === 0 ? (
              <span className="text-muted-foreground text-sm">No processes waiting</span>
            ) : (
              animationState.waiting.map((process) => {
                const processColor = getProcessColor(process.id);
                return (
                  <div
                    key={process.id}
                    className="process-card text-white px-4 py-2 rounded-lg font-semibold text-sm shadow-lg transition-all duration-300"
                    style={{ backgroundColor: processColor.solid }}
                  >
                    <div>{process.id}</div>
                    <div className="text-xs opacity-80">AT: {process.arrival}</div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Queue */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-2 text-center">
            Ready Queue
          </h3>
          <div className="flex items-center justify-center gap-2 min-h-[80px] p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg border-2 border-blue-500/30 queue-section">
            {animationState.queue.length === 0 ? (
              <span className="text-muted-foreground text-sm">Queue is empty</span>
            ) : (
              <>
                <div className="text-xs text-muted-foreground font-semibold">Front →</div>
                {animationState.queue.map((process) => {
                  const processColor = getProcessColor(process.id);
                  return (
                    <div
                      key={process.id}
                      className="process-card text-white px-4 py-3 rounded-lg font-semibold text-sm shadow-lg transition-all duration-500 transform hover:scale-105"
                      style={{ backgroundColor: processColor.solid }}
                    >
                      <div className="font-bold">{process.id}</div>
                      <div className="text-xs opacity-80">BT: {animationState.remainingBurst?.[process.id] ?? process.burst}/{process.burst}</div>
                      {algorithm === 'Priority' && (
                        <div className="text-xs opacity-80">P: {process.priority}</div>
                      )}
                    </div>
                  );
                })}
                <div className="text-xs text-muted-foreground font-semibold">← Back</div>
              </>
            )}
          </div>
        </div>

        {/* CPU/Executing */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-2 text-center">
            CPU (Currently Executing)
          </h3>
          <div className={`flex justify-center items-center min-h-[100px] p-4 bg-gradient-to-br from-yellow-500/30 to-orange-500/30 rounded-lg border-2 border-yellow-500/40 ${animationState.executing ? 'cpu-executing' : ''}`}>
            {animationState.executing ? (
              (() => {
                const processColor = getProcessColor(animationState.executing.id);
                return (
                  <div
                    className="text-white px-6 py-4 rounded-xl font-bold text-lg shadow-2xl transform transition-all duration-300"
                    style={{ backgroundColor: processColor.solid }}
                  >
                    <div className="text-2xl mb-1">{animationState.executing.id}</div>
                    <div className="text-sm opacity-90">Remaining: {animationState.remainingBurst?.[animationState.executing.id] ?? animationState.executing.burst}/{animationState.executing.burst}</div>
                    {algorithm === 'Priority' && (
                      <div className="text-sm opacity-90">Priority: {animationState.executing.priority}</div>
                    )}
                  </div>
                );
              })()
            ) : (
              <div className="text-muted-foreground text-sm">CPU is IDLE</div>
            )}
          </div>
        </div>

        {/* Completed */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-2 text-center">
            Completed Processes
          </h3>
          <div className="flex flex-wrap gap-2 min-h-[60px] p-3 bg-black/10 rounded-lg border border-white/10 justify-center">
            {animationState.completed.length === 0 ? (
              <span className="text-muted-foreground text-sm">No processes completed yet</span>
            ) : (
              animationState.completed.map((process) => {
                const processColor = getProcessColor(process.id);
                return (
                  <div
                    key={process.id}
                    className="process-card text-white px-4 py-2 rounded-lg font-semibold text-sm shadow-lg opacity-70 transition-all duration-300"
                    style={{ backgroundColor: processColor.solid }}
                  >
                    <div>{process.id}</div>
                    <div className="text-xs opacity-60">✓ Done</div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <div className="text-xs text-muted-foreground">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span>Process in queue</span>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 bg-yellow-500 rounded animate-pulse"></div>
            <span>Process executing</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-500 rounded opacity-70"></div>
            <span>Process completed</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueueAnimation;

