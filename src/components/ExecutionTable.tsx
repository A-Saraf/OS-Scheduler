import React from 'react';
import { Process, Metrics, TimelineItem } from '@/types/scheduler';

interface ExecutionTableProps {
  processes: Process[];
  timeline: TimelineItem[];
  metrics: Metrics | null;
}

const ExecutionTable: React.FC<ExecutionTableProps> = ({ processes, timeline, metrics }) => {
  if (!timeline || timeline.length === 0 || !metrics) {
    return (
      <div className="glass-card">
        <h2 className="text-lg font-semibold text-foreground mb-4">Process Execution Details</h2>
        <p className="text-muted-foreground text-center py-8">
          Execute scheduler to see process execution details
        </p>
      </div>
    );
  }

  // Calculate completion times
  const completion: Record<string, number> = {};
  timeline.forEach(t => {
    if (t.process !== 'IDLE') {
      completion[t.process] = t.end;
    }
  });

  return (
    <div className="glass-card overflow-x-auto">
      <h2 className="text-lg font-semibold text-foreground mb-4">Process Execution Details</h2>
      <table className="execution-table">
        <thead>
          <tr>
            <th>Process</th>
            <th>AT (ms)</th>
            <th>BT (ms)</th>
            <th>Start (ms)</th>
            <th>End (ms)</th>
            <th>Waiting (ms)</th>
            <th>Turnaround (ms)</th>
            <th>Response (ms)</th>
          </tr>
        </thead>
        <tbody>
          {processes.map(p => {
            const comp = completion[p.id];
            const tat = comp - p.arrival;
            const wt = tat - p.burst;
            const rt = (metrics.responseTime[p.id] ?? 0) - p.arrival;
            const firstStart = timeline.find(t => t.process === p.id)?.start ?? '-';

            return (
              <tr key={p.id}>
                <td className="font-semibold text-foreground">{p.id}</td>
                <td>{p.arrival}</td>
                <td>{p.burst}</td>
                <td>{firstStart}</td>
                <td>{comp}</td>
                <td>{wt}</td>
                <td>{tat}</td>
                <td>{rt}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ExecutionTable;
