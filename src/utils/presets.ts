import { Process, AlgorithmType } from '@/types/scheduler';

export interface Scenario {
    id: string;
    name: string;
    description: string;
    recommendedAlgorithm: AlgorithmType;
    processes: Omit<Process, 'color'>[];
    timeQuantum?: number;
}

export const PRESET_SCENARIOS: Scenario[] = [
    {
        id: 'convoy-effect',
        name: 'The Convoy Effect',
        description: 'See how one long process blocks short interactive ones in FCFS.',
        recommendedAlgorithm: 'FCFS',
        processes: [
            { id: 'P1', arrival: 0, burst: 30, priority: 1 },
            { id: 'P2', arrival: 1, burst: 2, priority: 1 },
            { id: 'P3', arrival: 2, burst: 2, priority: 1 },
            { id: 'P4', arrival: 3, burst: 1, priority: 1 },
        ]
    },
    {
        id: 'sjf-advantage',
        name: 'SJF Efficiency',
        description: 'The same processes as Convoy Effect, but solved efficiently by SJF.',
        recommendedAlgorithm: 'SJF',
        processes: [
            { id: 'P1', arrival: 0, burst: 30, priority: 1 },
            { id: 'P2', arrival: 1, burst: 2, priority: 1 },
            { id: 'P3', arrival: 2, burst: 2, priority: 1 },
            { id: 'P4', arrival: 3, burst: 1, priority: 1 },
        ]
    },
    {
        id: 'starvation',
        name: 'Priority Starvation',
        description: 'A low priority process (P1) waits forever as higher priority ones arrive.',
        recommendedAlgorithm: 'Priority',
        processes: [
            { id: 'LowPri', arrival: 0, burst: 20, priority: 10 }, // Low priority (high number)
            { id: 'High1', arrival: 2, burst: 4, priority: 1 },
            { id: 'High2', arrival: 4, burst: 5, priority: 2 },
            { id: 'High3', arrival: 6, burst: 3, priority: 1 },
            { id: 'High4', arrival: 8, burst: 4, priority: 2 },
        ]
    },
    {
        id: 'rr-fairness',
        name: 'Round Robin Fairness',
        description: 'Similar burst times sharing CPU fairly via Time Quantum.',
        recommendedAlgorithm: 'RoundRobin',
        timeQuantum: 4,
        processes: [
            { id: 'A', arrival: 0, burst: 10, priority: 1 },
            { id: 'B', arrival: 2, burst: 8, priority: 1 },
            { id: 'C', arrival: 4, burst: 6, priority: 1 },
            { id: 'D', arrival: 6, burst: 12, priority: 1 },
        ]
    }
];
