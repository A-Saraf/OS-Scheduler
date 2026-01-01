import { Process, TimelineItem, Metrics, AlgorithmComparison, AlgorithmType } from '@/types/scheduler';

// FCFS - First Come First Served
export const fcfs = (processes: Process[]): TimelineItem[] => {
  const result: TimelineItem[] = [];
  const sorted = [...processes].sort((a, b) => a.arrival - b.arrival);
  let time = 0;

  for (const p of sorted) {
    if (time < p.arrival) {
      result.push({ process: 'IDLE', start: time, end: p.arrival });
      time = p.arrival;
    }
    result.push({ process: p.id, start: time, end: time + p.burst, arrival: p.arrival });
    time += p.burst;
  }

  return result;
};

// SJF - Shortest Job First (Non-Preemptive)
export const sjf = (processes: Process[]): TimelineItem[] => {
  const result: TimelineItem[] = [];
  const remaining = [...processes];
  let time = 0;

  while (remaining.length > 0) {
    const available = remaining.filter(p => p.arrival <= time);

    if (available.length === 0) {
      const nextArrival = Math.min(...remaining.map(p => p.arrival));
      result.push({ process: 'IDLE', start: time, end: nextArrival });
      time = nextArrival;
      continue;
    }

    const p = available.reduce((a, b) => a.burst < b.burst ? a : b);
    result.push({ process: p.id, start: time, end: time + p.burst, arrival: p.arrival });
    time += p.burst;
    remaining.splice(remaining.indexOf(p), 1);
  }

  return result;
};

// SRTF - Shortest Remaining Time First (Preemptive SJF)
export const srtf = (processes: Process[]): TimelineItem[] => {
  const procs = processes.map(p => ({ ...p, remaining: p.burst }));
  const result: TimelineItem[] = [];
  let time = 0;
  let active: typeof procs[0] | null = null;
  let startTime = 0;

  while (procs.some(p => p.remaining > 0)) {
    const available = procs.filter(p => p.arrival <= time && p.remaining > 0);

    if (available.length === 0) {
      const nextArrival = Math.min(...procs.filter(p => p.remaining > 0).map(p => p.arrival));
      result.push({ process: 'IDLE', start: time, end: nextArrival });
      time = nextArrival;
      continue;
    }

    const shortest = available.reduce((a, b) => a.remaining < b.remaining ? a : b);

    if (active !== shortest) {
      if (active !== null) {
        result.push({ process: active.id, start: startTime, end: time });
      }
      active = shortest;
      startTime = time;
    }

    active.remaining--;
    time++;

    if (active.remaining === 0) {
      result.push({ process: active.id, start: startTime, end: time, arrival: active.arrival });
      active = null;
    }
  }

  return result;
};

// Priority Scheduling (Preemptive)
export const priority = (processes: Process[]): TimelineItem[] => {
  const procs = processes.map(p => ({ ...p, remaining: p.burst }));
  const result: TimelineItem[] = [];
  let time = 0;
  let active: typeof procs[0] | null = null;
  let startTime = 0;

  while (procs.some(p => p.remaining > 0)) {
    const available = procs.filter(p => p.arrival <= time && p.remaining > 0);

    if (available.length === 0) {
      const nextArrival = Math.min(...procs.filter(p => p.remaining > 0).map(p => p.arrival));
      result.push({ process: 'IDLE', start: time, end: nextArrival });
      time = nextArrival;
      continue;
    }

    const highestPriority = available.reduce((a, b) => a.priority < b.priority ? a : b);

    if (active !== highestPriority) {
      if (active !== null) {
        result.push({ process: active.id, start: startTime, end: time });
      }
      active = highestPriority;
      startTime = time;
    }

    active.remaining--;
    time++;

    if (active.remaining === 0) {
      result.push({ process: active.id, start: startTime, end: time, arrival: active.arrival });
      active = null;
    }
  }

  return result;
};

// Round Robin
export const roundRobin = (processes: Process[], timeQuantum: number): TimelineItem[] => {
  const result: TimelineItem[] = [];
  const queue: (typeof procs[0])[] = [];
  const procs = processes.map(p => ({ ...p, remaining: p.burst }));
  let time = 0;

  while (queue.length > 0 || procs.some(p => p.remaining > 0)) {
    procs.filter(p => p.arrival === time).forEach(p => queue.push(p));

    if (queue.length === 0) {
      time++;
      continue;
    }

    const p = queue.shift()!;
    const exec = Math.min(timeQuantum, p.remaining);

    result.push({ process: p.id, start: time, end: time + exec, arrival: p.arrival });
    time += exec;
    p.remaining -= exec;

    procs.filter(px => px.arrival <= time && px.remaining > 0 && !queue.includes(px))
         .forEach(px => queue.push(px));

    if (p.remaining > 0) queue.push(p);
  }

  return result;
};

// Calculate metrics from timeline
export const calculateMetrics = (processes: Process[], timeline: TimelineItem[]): Metrics => {
  const completion: Record<string, number> = {};
  const responseTime: Record<string, number> = {};

  timeline.forEach(item => {
    if (item.process !== 'IDLE') {
      completion[item.process] = item.end;
      if (responseTime[item.process] === undefined) {
        responseTime[item.process] = item.start;
      }
    }
  });

  let totalWait = 0;
  let totalTurn = 0;
  let totalResp = 0;

  processes.forEach(p => {
    const c = completion[p.id];
    const tat = c - p.arrival;
    const wt = tat - p.burst;
    const rt = responseTime[p.id] - p.arrival;
    
    totalWait += wt;
    totalTurn += tat;
    totalResp += rt;
  });

  const totalTime = Math.max(...timeline.map(t => t.end));
  const totalBurst = processes.reduce((s, p) => s + p.burst, 0);

  return {
    avgWait: totalWait / processes.length,
    avgTurn: totalTurn / processes.length,
    avgResp: totalResp / processes.length,
    totalTime,
    totalTurnSum: totalTurn,
    cpuUtil: (totalBurst / totalTime) * 100,
    responseTime,
  };
};

// Run all algorithms for comparison
export const runAllAlgorithms = (processes: Process[], timeQuantum: number = 2): AlgorithmComparison[] => {
  if (processes.length === 0) return [];

  const algorithms: { type: AlgorithmType; run: () => TimelineItem[] }[] = [
    { type: 'FCFS', run: () => fcfs(processes) },
    { type: 'SJF', run: () => sjf(processes) },
    { type: 'SRTF', run: () => srtf(processes) },
    { type: 'Priority', run: () => priority(processes) },
    { type: 'RoundRobin', run: () => roundRobin(processes, timeQuantum) },
  ];

  return algorithms.map(({ type, run }) => {
    const timeline = run();
    const metrics = calculateMetrics(processes, timeline);
    
    return {
      algorithm: type,
      avgWaitingTime: metrics.avgWait,
      avgTurnaroundTime: metrics.avgTurn,
      avgResponseTime: metrics.avgResp,
      cpuUtilization: metrics.cpuUtil,
      totalTime: metrics.totalTime,
    };
  });
};

// Run a specific algorithm
export const runAlgorithm = (
  algorithm: AlgorithmType,
  processes: Process[],
  timeQuantum: number = 2
): TimelineItem[] => {
  switch (algorithm) {
    case 'FCFS':
      return fcfs(processes);
    case 'SJF':
      return sjf(processes);
    case 'SRTF':
      return srtf(processes);
    case 'Priority':
      return priority(processes);
    case 'RoundRobin':
      return roundRobin(processes, timeQuantum);
    default:
      return [];
  }
};
