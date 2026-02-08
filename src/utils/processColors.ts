/**
 * Unified Process Color System
 * Ensures consistent colors across Gantt Chart, Queue Animation, and Process List
 */

export interface ProcessColor {
    // Gradient for Gantt chart bars
    gradient: string;
    // Shadow color for 3D effects
    shadow: string;
    // Text color for contrast
    text: string;
    // Solid color for backgrounds
    solid: string;
    // Tailwind class for simple backgrounds
    bgClass: string;
    // Border color
    border: string;
}

// Premium color palette - vibrant and distinguishable
export const PROCESS_COLORS: ProcessColor[] = [
    {
        gradient: 'linear-gradient(180deg, #60a5fa 0%, #3b82f6 50%, #2563eb 100%)',
        shadow: 'rgba(59, 130, 246, 0.5)',
        text: '#e0e7ff',
        solid: '#3b82f6',
        bgClass: 'bg-blue-500',
        border: 'border-blue-400',
    },
    {
        gradient: 'linear-gradient(180deg, #a78bfa 0%, #8b5cf6 50%, #7c3aed 100%)',
        shadow: 'rgba(139, 92, 246, 0.5)',
        text: '#ede9fe',
        solid: '#8b5cf6',
        bgClass: 'bg-violet-500',
        border: 'border-violet-400',
    },
    {
        gradient: 'linear-gradient(180deg, #34d399 0%, #10b981 50%, #059669 100%)',
        shadow: 'rgba(16, 185, 129, 0.5)',
        text: '#d1fae5',
        solid: '#10b981',
        bgClass: 'bg-emerald-500',
        border: 'border-emerald-400',
    },
    {
        gradient: 'linear-gradient(180deg, #f472b6 0%, #ec4899 50%, #db2777 100%)',
        shadow: 'rgba(236, 72, 153, 0.5)',
        text: '#fce7f3',
        solid: '#ec4899',
        bgClass: 'bg-pink-500',
        border: 'border-pink-400',
    },
    {
        gradient: 'linear-gradient(180deg, #22d3ee 0%, #06b6d4 50%, #0891b2 100%)',
        shadow: 'rgba(6, 182, 212, 0.5)',
        text: '#cffafe',
        solid: '#06b6d4',
        bgClass: 'bg-cyan-500',
        border: 'border-cyan-400',
    },
    {
        gradient: 'linear-gradient(180deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)',
        shadow: 'rgba(245, 158, 11, 0.5)',
        text: '#1e293b',
        solid: '#f59e0b',
        bgClass: 'bg-amber-500',
        border: 'border-amber-400',
    },
    {
        gradient: 'linear-gradient(180deg, #fb7185 0%, #f43f5e 50%, #e11d48 100%)',
        shadow: 'rgba(244, 63, 94, 0.5)',
        text: '#ffe4e6',
        solid: '#f43f5e',
        bgClass: 'bg-rose-500',
        border: 'border-rose-400',
    },
    {
        gradient: 'linear-gradient(180deg, #818cf8 0%, #6366f1 50%, #4f46e5 100%)',
        shadow: 'rgba(99, 102, 241, 0.5)',
        text: '#e0e7ff',
        solid: '#6366f1',
        bgClass: 'bg-indigo-500',
        border: 'border-indigo-400',
    },
    {
        gradient: 'linear-gradient(180deg, #2dd4bf 0%, #14b8a6 50%, #0d9488 100%)',
        shadow: 'rgba(20, 184, 166, 0.5)',
        text: '#ccfbf1',
        solid: '#14b8a6',
        bgClass: 'bg-teal-500',
        border: 'border-teal-400',
    },
    {
        gradient: 'linear-gradient(180deg, #fb923c 0%, #f97316 50%, #ea580c 100%)',
        shadow: 'rgba(249, 115, 22, 0.5)',
        text: '#1e293b',
        solid: '#f97316',
        bgClass: 'bg-orange-500',
        border: 'border-orange-400',
    },
];

/**
 * Get color for a process based on its index in the process list
 */
export const getProcessColor = (index: number): ProcessColor => {
    return PROCESS_COLORS[index % PROCESS_COLORS.length];
};

/**
 * Get color for a process by ID, given a list of all processes
 */
export const getProcessColorById = (
    processId: string,
    allProcessIds: string[]
): ProcessColor => {
    const index = allProcessIds.indexOf(processId);
    return getProcessColor(index >= 0 ? index : 0);
};

/**
 * Create a mapping of process IDs to their colors
 */
export const createProcessColorMap = (
    processIds: string[]
): Record<string, ProcessColor> => {
    const map: Record<string, ProcessColor> = {};
    processIds.forEach((id, index) => {
        map[id] = getProcessColor(index);
    });
    return map;
};
