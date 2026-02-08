import React, { useState, useEffect } from 'react';
import { Plus, Dices, BookOpen } from 'lucide-react';
import { Process, AlgorithmType } from '@/types/scheduler';
import { PRESET_SCENARIOS, Scenario } from '@/utils/presets';
import { toast } from 'sonner';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface ProcessInputFormProps {
    algorithm: AlgorithmType;
    onAddProcess: (process: Omit<Process, 'color'>) => void;
    onRandomize: () => void;
    onLoadScenario: (scenario: Scenario) => void;
}

const ProcessInputForm: React.FC<ProcessInputFormProps> = ({
    algorithm,
    onAddProcess,
    onRandomize,
    onLoadScenario
}) => {
    const [processId, setProcessId] = useState('');
    const [arrivalTime, setArrivalTime] = useState(0);
    const [burstTime, setBurstTime] = useState(1);
    const [priority, setPriority] = useState(1);

    // Auto-generate next process ID (P1, P2, etc.)
    // We can't know the next ID perfectly without the full list, 
    // but we can default to P1 or just leave it empty. 
    // For better UX, let's just leave it empty or use a placeholder.

    const handleSubmit = () => {
        if (!processId.trim()) {
            toast.error('Process ID is required');
            return;
        }

        if (burstTime <= 0) {
            toast.error('Burst time must be greater than 0');
            return;
        }

        onAddProcess({
            id: processId,
            arrival: arrivalTime,
            burst: burstTime,
            priority: priority,
        });

        // Reset fields
        setProcessId('');
        setBurstTime(Math.floor(Math.random() * 10) + 1);
        setArrivalTime(0);
        setPriority(1);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    return (
        <div className="glass-card mb-6">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <h2 className="text-lg font-semibold text-foreground">Add Process</h2>
                <div className="flex gap-2">
                    <Select onValueChange={(val) => {
                        const scenario = PRESET_SCENARIOS.find(s => s.id === val);
                        if (scenario) onLoadScenario(scenario);
                    }}>
                        <SelectTrigger className="h-7 text-xs bg-blue-500/10 border-blue-500/20 text-blue-400 hover:bg-blue-500/20 w-[110px]">
                            <BookOpen size={14} className="mr-2" />
                            <SelectValue placeholder="Presets" />
                        </SelectTrigger>
                        <SelectContent>
                            {PRESET_SCENARIOS.map(s => (
                                <SelectItem key={s.id} value={s.id}>
                                    {s.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <button
                        onClick={onRandomize}
                        className="flex items-center gap-1 text-xs px-2 py-1.5 rounded bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors border border-transparent hover:border-white/10 h-7"
                        title="Generate random processes"
                    >
                        <Dices size={14} />
                        <span>Randomize</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block text-xs text-muted-foreground mb-1.5 ml-1">
                        Process ID
                    </label>
                    <input
                        type="text"
                        value={processId}
                        onChange={(e) => setProcessId(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="e.g., P1"
                        className="glass-input"
                        autoFocus
                    />
                </div>
                <div>
                    <label className="block text-xs text-muted-foreground mb-1.5 ml-1">
                        Arrival Time
                    </label>
                    <input
                        type="number"
                        value={arrivalTime}
                        onChange={(e) => setArrivalTime(Math.max(0, parseInt(e.target.value) || 0))}
                        onKeyDown={handleKeyDown}
                        min="0"
                        className="glass-input"
                    />
                </div>
                <div>
                    <label className="block text-xs text-muted-foreground mb-1.5 ml-1">
                        Burst Time
                    </label>
                    <input
                        type="number"
                        value={burstTime}
                        onChange={(e) => setBurstTime(Math.max(1, parseInt(e.target.value) || 1))}
                        onKeyDown={handleKeyDown}
                        min="1"
                        className="glass-input"
                    />
                </div>
                {algorithm === 'Priority' && (
                    <div>
                        <label className="block text-xs text-muted-foreground mb-1.5 ml-1">
                            Priority
                        </label>
                        <input
                            type="number"
                            value={priority}
                            onChange={(e) => setPriority(Math.max(1, parseInt(e.target.value) || 1))}
                            onKeyDown={handleKeyDown}
                            min="1"
                            className="glass-input"
                        />
                    </div>
                )}
            </div>

            <button
                onClick={handleSubmit}
                className="btn-gradient w-full group"
            >
                <Plus size={18} className="mr-2 transition-transform group-hover:rotate-90" />
                Add Process <span className="text-[10px] opacity-70 ml-1 font-mono tracking-tighter hidden group-hover:inline">(Enter)</span>
            </button>
        </div>
    );
};

export default ProcessInputForm;
