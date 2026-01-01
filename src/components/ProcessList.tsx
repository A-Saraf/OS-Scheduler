import React from 'react';
import { Process, AlgorithmType } from '@/types/scheduler';
import { X } from 'lucide-react';

interface ProcessListProps {
  processes: Process[];
  algorithm: AlgorithmType;
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

const ProcessList: React.FC<ProcessListProps> = ({ processes, algorithm, onDelete, onClearAll }) => {
  const showPriority = algorithm === 'Priority';

  if (processes.length === 0) {
    return (
      <div className="glass-card">
        <h2 className="text-lg font-semibold text-foreground mb-4">Processes List</h2>
        <p className="text-muted-foreground text-center py-4">No processes added</p>
      </div>
    );
  }

  return (
    <div className="glass-card">
      <h2 className="text-lg font-semibold text-foreground mb-4">Processes List</h2>
      
      <div className="flex flex-col gap-2 max-h-[210px] overflow-y-auto">
        {processes.map((p) => (
          <div key={p.id} className="process-item">
            <div>
              <p className="font-bold text-[15px] text-foreground">{p.id}</p>
              <p className="text-muted-foreground text-xs">
                AT:{p.arrival} • BT:{p.burst}
                {showPriority && ` • P:${p.priority}`}
              </p>
            </div>
            <button
              onClick={() => onDelete(p.id)}
              className="btn-danger flex items-center justify-center"
              aria-label={`Delete ${p.id}`}
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={onClearAll}
        className="btn-danger mt-4 mx-auto flex items-center gap-1"
      >
        🗑 Clear All
      </button>
    </div>
  );
};

export default ProcessList;
