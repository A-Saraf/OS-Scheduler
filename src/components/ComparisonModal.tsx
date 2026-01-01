import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { AlgorithmComparison } from '@/types/scheduler';

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: AlgorithmComparison[];
}

const ComparisonModal: React.FC<ComparisonModalProps> = ({ isOpen, onClose, data }) => {
  if (!data || data.length === 0) return null;

  const chartData = data.map(d => ({
    name: d.algorithm,
    'Avg Waiting': Number(d.avgWaitingTime.toFixed(2)),
    'Avg Turnaround': Number(d.avgTurnaroundTime.toFixed(2)),
    'Avg Response': Number(d.avgResponseTime.toFixed(2)),
    'CPU Util %': Number(d.cpuUtilization.toFixed(1)),
    'Total Time': d.totalTime,
  }));

  const colors = {
    waiting: '#5b9cff',
    turnaround: '#8b5cf6',
    response: '#4fd1c5',
    cpu: '#fb923c',
    total: '#f472b6',
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-[hsl(222,47%,5%)] to-[hsl(217,33%,10%)] border-[rgba(255,255,255,0.1)]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold gradient-text">
            Algorithm Comparison Analysis
          </DialogTitle>
          <div className="modal-divider mt-4" />
        </DialogHeader>

        <div className="space-y-8">
          {/* Time Metrics Comparison - Line Chart */}
          <div className="glass-card">
            <h3 className="text-lg font-semibold text-foreground mb-4">Time Metrics Comparison</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#94a3b8', fontSize: 12 }} 
                  axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                />
                <YAxis 
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                  label={{ value: 'Time (ms)', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    color: '#e2e8f0',
                  }}
                />
                <Legend 
                  wrapperStyle={{ color: '#94a3b8' }}
                />
                <Line
                  type="monotone"
                  dataKey="Avg Waiting"
                  stroke={colors.waiting}
                  strokeWidth={3}
                  dot={{ fill: colors.waiting, strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="Avg Turnaround"
                  stroke={colors.turnaround}
                  strokeWidth={3}
                  dot={{ fill: colors.turnaround, strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="Avg Response"
                  stroke={colors.response}
                  strokeWidth={3}
                  dot={{ fill: colors.response, strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart for CPU Utilization */}
          <div className="glass-card">
            <h3 className="text-lg font-semibold text-foreground mb-4">CPU Utilization & Total Time</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                />
                <YAxis 
                  yAxisId="left"
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                  label={{ value: 'Utilization %', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                  label={{ value: 'Time (ms)', angle: 90, position: 'insideRight', fill: '#94a3b8' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    color: '#e2e8f0',
                  }}
                />
                <Legend />
                <Bar 
                  yAxisId="left"
                  dataKey="CPU Util %" 
                  fill={colors.cpu}
                  radius={[6, 6, 0, 0]}
                />
                <Bar 
                  yAxisId="right"
                  dataKey="Total Time" 
                  fill={colors.total}
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Summary Table */}
          <div className="glass-card overflow-x-auto">
            <h3 className="text-lg font-semibold text-foreground mb-4">Detailed Metrics</h3>
            <table className="execution-table">
              <thead>
                <tr>
                  <th>Algorithm</th>
                  <th>Avg Waiting (ms)</th>
                  <th>Avg Turnaround (ms)</th>
                  <th>Avg Response (ms)</th>
                  <th>CPU Utilization</th>
                  <th>Total Time (ms)</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row) => (
                  <tr key={row.algorithm}>
                    <td className="font-semibold text-foreground">{row.algorithm}</td>
                    <td>{row.avgWaitingTime.toFixed(2)}</td>
                    <td>{row.avgTurnaroundTime.toFixed(2)}</td>
                    <td>{row.avgResponseTime.toFixed(2)}</td>
                    <td>{row.cpuUtilization.toFixed(1)}%</td>
                    <td>{row.totalTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Best Algorithm Recommendation */}
          <div className="glass-card">
            <h3 className="text-lg font-semibold text-foreground mb-3">Recommendations</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-[rgba(91,156,255,0.1)] border border-[rgba(91,156,255,0.2)]">
                <p className="text-sm text-muted-foreground mb-1">Best Waiting Time</p>
                <p className="text-lg font-bold" style={{ color: colors.waiting }}>
                  {data.reduce((a, b) => a.avgWaitingTime < b.avgWaitingTime ? a : b).algorithm}
                </p>
                <p className="text-xs text-muted-foreground">
                  {data.reduce((a, b) => a.avgWaitingTime < b.avgWaitingTime ? a : b).avgWaitingTime.toFixed(2)} ms
                </p>
              </div>
              <div className="p-4 rounded-xl bg-[rgba(139,92,246,0.1)] border border-[rgba(139,92,246,0.2)]">
                <p className="text-sm text-muted-foreground mb-1">Best Turnaround</p>
                <p className="text-lg font-bold" style={{ color: colors.turnaround }}>
                  {data.reduce((a, b) => a.avgTurnaroundTime < b.avgTurnaroundTime ? a : b).algorithm}
                </p>
                <p className="text-xs text-muted-foreground">
                  {data.reduce((a, b) => a.avgTurnaroundTime < b.avgTurnaroundTime ? a : b).avgTurnaroundTime.toFixed(2)} ms
                </p>
              </div>
              <div className="p-4 rounded-xl bg-[rgba(79,209,197,0.1)] border border-[rgba(79,209,197,0.2)]">
                <p className="text-sm text-muted-foreground mb-1">Best Response</p>
                <p className="text-lg font-bold" style={{ color: colors.response }}>
                  {data.reduce((a, b) => a.avgResponseTime < b.avgResponseTime ? a : b).algorithm}
                </p>
                <p className="text-xs text-muted-foreground">
                  {data.reduce((a, b) => a.avgResponseTime < b.avgResponseTime ? a : b).avgResponseTime.toFixed(2)} ms
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ComparisonModal;
