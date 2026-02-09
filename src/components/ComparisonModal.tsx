import React, { useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { AlgorithmComparison } from '@/types/scheduler';
import { Volume2 } from 'lucide-react';

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: AlgorithmComparison[];
}

const ComparisonModal: React.FC<ComparisonModalProps> = ({ isOpen, onClose, data }) => {
  const [isSpeaking, setIsSpeaking] = React.useState(false);
  
  if (!isOpen) return null;
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

  const speakComparison = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported in your browser');
      return;
    }

    setIsSpeaking(true);

    // Find best performers
    const bestWaiting = data.reduce((a, b) => a.avgWaitingTime < b.avgWaitingTime ? a : b);
    const bestTurnaround = data.reduce((a, b) => a.avgTurnaroundTime < b.avgTurnaroundTime ? a : b);
    const bestResponse = data.reduce((a, b) => a.avgResponseTime < b.avgResponseTime ? a : b);
    const bestCPU = data.reduce((a, b) => a.cpuUtilization > b.cpuUtilization ? a : b);

    // Create concise, significant speech text
    let speechText = `Algorithm comparison results. `;
    speechText += `Best waiting time: ${bestWaiting.algorithm} at ${bestWaiting.avgWaitingTime.toFixed(1)} milliseconds. `;
    speechText += `Best turnaround time: ${bestTurnaround.algorithm} at ${bestTurnaround.avgTurnaroundTime.toFixed(1)} milliseconds. `;
    speechText += `Best response time: ${bestResponse.algorithm} at ${bestResponse.avgResponseTime.toFixed(1)} milliseconds. `;
    speechText += `Highest CPU utilization: ${bestCPU.algorithm} at ${bestCPU.cpuUtilization.toFixed(1)} percent. `;
    
    // Add key recommendation
    speechText += `For minimal waiting time, choose ${bestWaiting.algorithm}. For best overall performance, consider ${bestTurnaround.algorithm}.`;

    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.rate = 1.1; // Natural speaking rate
    utterance.pitch = 0.95; // Slightly lower pitch for more natural sound
    utterance.volume = 0.85;
    
    // Add pauses for more natural speech rhythm
    const sentences = speechText.split('. ');
    let enhancedText = '';
    sentences.forEach((sentence, index) => {
      if (sentence.trim()) {
        enhancedText += sentence.trim() + '. ';
        // Add pause after each sentence except the last
        if (index < sentences.length - 2) {
          enhancedText += ' ';
        }
      }
    });
    
    // Update utterance with enhanced text
    utterance.text = enhancedText;
    
    // Try to select the most natural, humanized voice
    const voices = window.speechSynthesis.getVoices();
    
    // Priority order for most natural voices
    const naturalVoices = [
      // Google voices (usually very natural)
      ...voices.filter(v => v.name.includes('Google') && v.lang.includes('en')),
      // Microsoft high-quality voices
      ...voices.filter(v => v.name.includes('Microsoft') && (
        v.name.includes('Zira') || v.name.includes('David') || 
        v.name.includes('Mark') || v.name.includes('Hazel')
      )),
      // macOS natural voices
      ...voices.filter(v => v.name.includes('Samantha') || v.name.includes('Karen')),
      // Amazon Polly-like voices if available
      ...voices.filter(v => v.name.includes('Joanna') || v.name.includes('Matthew') || v.name.includes('Kendra')),
      // Other high-quality voices
      ...voices.filter(v => v.name.includes('Alex') || v.name.includes('Daniel') || v.name.includes('Susan')),
      // Neural voices if available
      ...voices.filter(v => v.name.includes('Neural') || v.name.includes('Premium')),
      // Any English voice with "Natural" in name
      ...voices.filter(v => v.name.includes('Natural') && v.lang.includes('en')),
      // Fallback to any English voice
      ...voices.filter(v => v.lang.includes('en'))
    ];
    
    // Remove duplicates and get the best available voice
    const uniqueVoices = [...new Map(naturalVoices.map(v => [v.name, v])).values()];
    const preferredVoice = uniqueVoices[0];
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
      console.log('Using voice:', preferredVoice.name, preferredVoice.lang);
    } else {
      console.log('Using default voice');
    }
    
    utterance.onend = () => {
      setIsSpeaking(false);
    };
    
    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-5xl translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 max-h-[90vh] overflow-y-auto glass-card border-[rgba(255,255,255,0.1)]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold gradient-text">
              Algorithm Comparison Analysis
            </DialogTitle>
            <button
              onClick={speakComparison}
              className={`flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 ${
                isSpeaking 
                  ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30' 
                  : 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30'
              }`}
              title={isSpeaking ? "Stop speaking" : "Speak analysis"}
            >
              <Volume2 size={18} />
            </button>
          </div>
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
