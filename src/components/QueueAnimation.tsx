import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Process, AlgorithmType, TimelineItem } from '@/types/scheduler';
import { runAlgorithm } from '@/utils/schedulerAlgorithms';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { Play, Pause, RotateCcw, Gauge } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface QueueAnimationProps {
  processes: Process[];
  algorithm: AlgorithmType;
  timeQuantum: number;
}

interface AnimationState {
  currentTime: number;
  queue: Process[];
  executing: Process | null;
  completed: Process[];
  waiting: Process[];
  timelineIndex: number;
}

const QueueAnimation: React.FC<QueueAnimationProps> = ({ processes, algorithm, timeQuantum }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1); // 1x, 2x, 3x, etc.
  const [animationState, setAnimationState] = useState<AnimationState | null>(null);
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [allProcesses, setAllProcesses] = useState<Process[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { playSound } = useSoundEffects();

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
    const processesAtTime0 = processes.filter(p => p.arrival === 0);
    const initialState: AnimationState = {
      currentTime: 0,
      queue: algorithm === 'FCFS' || algorithm === 'SJF' || algorithm === 'RoundRobin' 
        ? [...processesAtTime0].sort((a, b) => {
            if (algorithm === 'FCFS') return a.arrival - b.arrival;
            if (algorithm === 'SJF') return a.burst - b.burst;
            return 0;
          })
        : [],
      executing: null,
      completed: [],
      waiting: processes.filter(p => p.arrival > 0),
      timelineIndex: 0,
    };
    setAnimationState(initialState);
  }, [processes, algorithm, timeQuantum]);

  // Animation logic
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

        // Add processes that arrive at current time to waiting
        const arrivingProcesses = allProcesses.filter(
          p => p.arrival === newState.currentTime && 
          !newState.waiting.some(w => w.id === p.id) && 
          !newState.queue.some(q => q.id === p.id) && 
          !newState.completed.some(c => c.id === p.id) &&
          newState.executing?.id !== p.id
        );

        if (arrivingProcesses.length > 0) {
          playSound('addProcess');
          newState.waiting = [...newState.waiting, ...arrivingProcesses];
        }

        // Move processes from waiting to queue if they've arrived
        const readyProcesses = newState.waiting.filter(
          p => p.arrival <= newState.currentTime &&
          !newState.queue.some(q => q.id === p.id) &&
          !newState.completed.some(c => c.id === p.id) &&
          newState.executing?.id !== p.id
        );

        if (readyProcesses.length > 0) {
          // Sort based on algorithm for queue ordering
          let sorted = [...readyProcesses];
          if (algorithm === 'FCFS') {
            sorted.sort((a, b) => a.arrival - b.arrival);
          } else if (algorithm === 'SJF') {
            sorted.sort((a, b) => a.burst - b.burst);
          } else if (algorithm === 'Priority') {
            sorted.sort((a, b) => a.priority - b.priority);
          }
          
          newState.queue = [...newState.queue, ...sorted];
          newState.waiting = newState.waiting.filter(p => !readyProcesses.some(rp => rp.id === p.id));
        }

        // Check timeline for execution changes
        // First, advance timeline index if we've passed the end of current item
        while (newState.timelineIndex < timeline.length) {
          const currentItem = timeline[newState.timelineIndex];
          if (!currentItem) break;
          
          const { process: processId, start, end } = currentItem;
          
          // If we've passed this timeline item, move to next
          if (newState.currentTime > end) {
            newState.timelineIndex++;
            continue;
          }
          
          // If we're before this timeline item, stop
          if (newState.currentTime < start) {
            break;
          }
          
          // Process completes time slice (check at end time first)
          if (newState.currentTime === end) {
            if (newState.executing && processId !== 'IDLE' && newState.executing.id === processId) {
              const process = newState.executing;
              
              // Check if process is fully completed by checking if it appears again in timeline
              const remainingItems = timeline.slice(newState.timelineIndex + 1);
              const willExecuteAgain = remainingItems.some(item => item.process === processId);
              
              if (!willExecuteAgain) {
                // Process is fully completed
                newState.completed = [...newState.completed, process];
                playSound('success');
              } else {
                // Process will execute again (Round Robin or preemption) - add back to queue
                if (algorithm === 'RoundRobin' || algorithm === 'SRTF' || algorithm === 'Priority') {
                  newState.queue = [...newState.queue, process];
                  playSound('addProcess');
                }
              }
            }
            newState.executing = null;
            // Move to next timeline item and continue to check if next starts immediately
            newState.timelineIndex++;
            continue; // Continue loop to check next timeline item
          }
          
          // Process starts executing
          if (newState.currentTime === start) {
            if (processId !== 'IDLE') {
              const process = allProcesses.find(p => p.id === processId);
              if (process) {
                // Remove from queue/waiting (but not from completed if it's re-entering)
                newState.queue = newState.queue.filter(p => p.id !== processId);
                newState.waiting = newState.waiting.filter(p => p.id !== processId);
                // Remove from completed if it's re-entering (for Round Robin)
                newState.completed = newState.completed.filter(p => p.id !== processId);
                newState.executing = process;
                playSound('runGantt');
              }
            } else {
              newState.executing = null;
            }
            break; // Processed start, wait for next tick
          }
          
          // We're in the middle of execution, break
          break;
        }

        newState.currentTime += 1;

        return newState;
      });
    }, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPlaying, animationState, timeline, speed, algorithm, allProcesses, playSound]);

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
    
    const processesAtTime0 = allProcesses.filter(p => p.arrival === 0);
    const initialState: AnimationState = {
      currentTime: 0,
      queue: algorithm === 'FCFS' || algorithm === 'SJF' || algorithm === 'RoundRobin' 
        ? [...processesAtTime0].sort((a, b) => {
            if (algorithm === 'FCFS') return a.arrival - b.arrival;
            if (algorithm === 'SJF') return a.burst - b.burst;
            return 0;
          })
        : [],
      executing: null,
      completed: [],
      waiting: allProcesses.filter(p => p.arrival > 0),
      timelineIndex: 0,
    };
    setAnimationState(initialState);
  }, [allProcesses, algorithm, playSound]);

  const getProcessColor = (processId: string): string => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 
      'bg-pink-500', 'bg-indigo-500', 'bg-red-500', 'bg-cyan-500',
      'bg-orange-500', 'bg-teal-500'
    ];
    const index = allProcesses.findIndex(p => p.id === processId);
    return colors[index % colors.length] || 'bg-gray-500';
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
    <div className="glass-card p-6">
      <h2 className="text-lg font-semibold text-foreground mb-4">Queue Animation</h2>
      
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-black/20 rounded-lg">
        <div className="flex items-center gap-2">
          <button
            onClick={isPlaying ? handlePause : handlePlay}
            disabled={timeline.length === 0}
            className="btn-gradient flex items-center gap-2"
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <button
            onClick={handleRestart}
            disabled={timeline.length === 0}
            className="btn-secondary flex items-center gap-2"
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
              animationState.waiting.map((process) => (
                <div
                  key={process.id}
                  className={`${getProcessColor(process.id)} text-white px-4 py-2 rounded-lg font-semibold text-sm shadow-lg transition-all duration-300 animate-pulse`}
                >
                  <div>{process.id}</div>
                  <div className="text-xs opacity-80">AT: {process.arrival}</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Queue */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-2 text-center">
            Ready Queue
          </h3>
          <div className="flex items-center justify-center gap-2 min-h-[80px] p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg border-2 border-blue-500/30">
            {animationState.queue.length === 0 ? (
              <span className="text-muted-foreground text-sm">Queue is empty</span>
            ) : (
              <>
                <div className="text-xs text-muted-foreground font-semibold">Front →</div>
                {animationState.queue.map((process, index) => (
                  <div
                    key={process.id}
                    className={`${getProcessColor(process.id)} text-white px-4 py-3 rounded-lg font-semibold text-sm shadow-lg transition-all duration-500 transform hover:scale-105`}
                    style={{
                      animation: index === 0 ? 'pulse 1s infinite' : 'none',
                    }}
                  >
                    <div className="font-bold">{process.id}</div>
                    <div className="text-xs opacity-80">BT: {process.burst}</div>
                    {algorithm === 'Priority' && (
                      <div className="text-xs opacity-80">P: {process.priority}</div>
                    )}
                  </div>
                ))}
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
          <div className="flex justify-center items-center min-h-[100px] p-4 bg-gradient-to-br from-yellow-500/30 to-orange-500/30 rounded-lg border-2 border-yellow-500/40">
            {animationState.executing ? (
              <div
                className={`${getProcessColor(animationState.executing.id)} text-white px-6 py-4 rounded-xl font-bold text-lg shadow-2xl transform transition-all duration-300 animate-pulse`}
              >
                <div className="text-2xl mb-1">{animationState.executing.id}</div>
                <div className="text-sm opacity-90">Burst: {animationState.executing.burst}</div>
                {algorithm === 'Priority' && (
                  <div className="text-sm opacity-90">Priority: {animationState.executing.priority}</div>
                )}
              </div>
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
              animationState.completed.map((process) => (
                <div
                  key={process.id}
                  className={`${getProcessColor(process.id)} text-white px-4 py-2 rounded-lg font-semibold text-sm shadow-lg opacity-70 transition-all duration-300`}
                >
                  <div>{process.id}</div>
                  <div className="text-xs opacity-60">✓ Done</div>
                </div>
              ))
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

