export interface Process {
  id: string;
  arrival: number;
  burst: number;
  priority: number;
}

export interface TimelineItem {
  process: string;
  start: number;
  end: number;
  arrival?: number;
}

export interface Metrics {
  avgWait: number;
  avgTurn: number;
  avgResp: number;
  totalTime: number;
  totalTurnSum: number;
  cpuUtil: number;
  responseTime: Record<string, number>;
}

export interface ProcessMetrics {
  id: string;
  arrival: number;
  burst: number;
  start: number;
  completion: number;
  waiting: number;
  turnaround: number;
  response: number;
}

export interface AlgorithmComparison {
  algorithm: string;
  avgWaitingTime: number;
  avgTurnaroundTime: number;
  avgResponseTime: number;
  cpuUtilization: number;
  totalTime: number;
}

export type AlgorithmType = 'FCFS' | 'SJF' | 'SRTF' | 'Priority' | 'RoundRobin';

export interface AlgorithmComplexity {
  timeComplexity: {
    best: string;
    average: string;
    worst: string;
  };
  spaceComplexity: string;
  dataStructures: string[];
}

export const algorithmNames: Record<AlgorithmType, string> = {
  FCFS: 'First Come First Served (FCFS)',
  SJF: 'Shortest Job First (SJF)',
  SRTF: 'Shortest Remaining Time First (SRTF)',
  Priority: 'Priority Scheduling (Preemptive)',
  RoundRobin: 'Round Robin',
};

export const algorithmComplexity: Record<AlgorithmType, AlgorithmComplexity> = {
  FCFS: {
    timeComplexity: {
      best: "O(n)",
      average: "O(n)",
      worst: "O(n)"
    },
    spaceComplexity: "O(n)",
    dataStructures: ["Queue (FIFO)", "Array"]
  },
  SJF: {
    timeComplexity: {
      best: "O(n log n)",
      average: "O(n log n)",
      worst: "O(n²)"
    },
    spaceComplexity: "O(n)",
    dataStructures: ["Array", "Sorting", "Linear Search"]
  },
  SRTF: {
    timeComplexity: {
      best: "O(n log n)",
      average: "O(n log n)",
      worst: "O(n²)"
    },
    spaceComplexity: "O(n)",
    dataStructures: ["Priority Queue (Min-Heap)", "Array"]
  },
  Priority: {
    timeComplexity: {
      best: "O(n log n)",
      average: "O(n log n)",
      worst: "O(n²)"
    },
    spaceComplexity: "O(n)",
    dataStructures: ["Priority Queue (Min-Heap)", "Array"]
  },
  RoundRobin: {
    timeComplexity: {
      best: "O(n)",
      average: "O(n × q)",
      worst: "O(n × q)"
    },
    spaceComplexity: "O(n)",
    dataStructures: ["Circular Queue", "Array"]
  }
};

export const algorithmDescriptions: Record<AlgorithmType, string> = {
  FCFS: "First Come First Served (FCFS) is the simplest CPU scheduling algorithm that executes processes in the exact order they arrive in the ready queue. It uses a FIFO (First In, First Out) approach where the first process to arrive gets CPU access first. While it's easy to understand and implement with no starvation, FCFS suffers from the convoy effect where short processes must wait for long processes to complete, leading to poor average waiting times. It's non-preemptive, meaning once a process starts execution, it runs to completion.",
  
  SJF: "Shortest Job First (SJF) selects the process with the smallest burst time from the ready queue. This non-preemptive algorithm is provably optimal for minimizing average waiting time when all processes are available simultaneously. However, it requires prior knowledge of burst times, which is often unavailable in practice. SJF can cause starvation for longer processes if shorter ones keep arriving. It's best suited for batch systems where execution times can be estimated accurately.",
  
  SRTF: "Shortest Remaining Time First (SRTF) is the preemptive version of SJF that can interrupt a running process if a new process arrives with a shorter remaining time. This allows for better average turnaround times and response times compared to non-preemptive SJF. However, the frequent context switching can add overhead, and longer processes may face significant starvation. SRTF is ideal for time-sharing systems where responsiveness is critical.",
  
  Priority: "Priority Scheduling assigns a priority value to each process and executes them in order of priority, with lower numbers typically indicating higher priority. This implementation uses preemptive priority scheduling, where a running process can be interrupted if a higher-priority process arrives. This flexible algorithm allows the system to favor important tasks, but it can lead to starvation of low-priority processes.",
  
  RoundRobin: "Round Robin (RR) is a preemptive algorithm designed for time-sharing systems that allocates a fixed time quantum to each process in circular order. When a process's time slice expires, it's moved to the back of the ready queue, ensuring fair CPU distribution and good response times. The performance heavily depends on the time quantum size.",
};
