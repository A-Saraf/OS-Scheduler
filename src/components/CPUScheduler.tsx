import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Process, AlgorithmType, TimelineItem, Metrics, AlgorithmComparison, algorithmNames, algorithmDescriptions } from '@/types/scheduler';
import { runAlgorithm, calculateMetrics, runAllAlgorithms } from '@/utils/schedulerAlgorithms';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { toast } from 'sonner';

import GanttChart from './GanttChart';
import MetricsPanel from './MetricsPanel';
import ExecutionTable from './ExecutionTable';
import ProcessList from './ProcessList';
import FileUpload from './FileUpload';
import AlgorithmInfoModal from './AlgorithmInfoModal';
import ComparisonModal from './ComparisonModal';
import QueueAnimation from './QueueAnimation';
import { Play, RotateCcw, BarChart3, Volume2, VolumeX, Info } from 'lucide-react';

const CPUScheduler: React.FC = () => {
  // State
  const [algorithm, setAlgorithm] = useState<AlgorithmType>('FCFS');
  const [timeQuantum, setTimeQuantum] = useState(2);
  const [processes, setProcesses] = useState<Process[]>([]);
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [activeTab, setActiveTab] = useState<'manual' | 'upload'>('manual');
  const [viewTab, setViewTab] = useState<'gantt' | 'animation'>('gantt');
  const [animationLog, setAnimationLog] = useState<Array<{ time: number; message: string; type: string }>>([]);
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll log to bottom when new entries are added
  useEffect(() => {
    if (logContainerRef.current && viewTab === 'animation') {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [animationLog, viewTab]);

  // Form state
  const [processId, setProcessId] = useState('');
  const [arrivalTime, setArrivalTime] = useState(0);
  const [burstTime, setBurstTime] = useState(1);
  const [priority, setPriority] = useState(1);

  // Modal state
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [comparisonData, setComparisonData] = useState<AlgorithmComparison[]>([]);

  // Sound effects
  const { playSound, toggleSound, isSoundEnabled } = useSoundEffects();
  const [soundEnabled, setSoundEnabled] = useState(true);

  const handleToggleSound = () => {
    const enabled = toggleSound();
    setSoundEnabled(enabled);
    toast(enabled ? '🔊 Sound enabled' : '🔇 Sound disabled');
  };

  // Add process
  const handleAddProcess = useCallback(() => {
    if (!processId.trim()) {
      toast.error('Please provide a Process ID');
      return;
    }
    if (processes.some(p => p.id === processId.trim())) {
      toast.error('Process ID already exists');
      return;
    }
    if (burstTime <= 0) {
      toast.error('Burst Time must be at least 1');
      return;
    }

    playSound('addProcess');

    setProcesses(prev => [...prev, {
      id: processId.trim(),
      arrival: arrivalTime,
      burst: burstTime,
      priority: priority,
    }]);

    setProcessId('');
    setArrivalTime(0);
    setBurstTime(1);
    setPriority(1);
    
    toast.success(`Process ${processId} added`);
  }, [processId, arrivalTime, burstTime, priority, processes, playSound]);

  // Delete process
  const handleDeleteProcess = useCallback((id: string) => {
    playSound('removeProcess');
    setProcesses(prev => prev.filter(p => p.id !== id));
    toast.success(`Process ${id} removed`);
  }, [playSound]);

  // Clear all processes
  const handleClearAll = useCallback(() => {
    playSound('reset');
    setProcesses([]);
    setTimeline([]);
    setMetrics(null);
    toast.success('All processes cleared');
  }, [playSound]);

  // Import processes from file
  const handleProcessesImported = useCallback((imported: Process[]) => {
    playSound('importProcesses');
    setProcesses(prev => [...prev, ...imported]);
  }, [playSound]);

  // Run scheduler
  const handleRun = useCallback(() => {
    if (processes.length === 0) {
      toast.error('Please add at least one process');
      return;
    }

    playSound('runGantt');

    const result = runAlgorithm(algorithm, processes, timeQuantum);
    const calculatedMetrics = calculateMetrics(processes, result);

    setTimeline(result);
    setMetrics(calculatedMetrics);

    toast.success('Scheduler executed successfully');
  }, [algorithm, processes, timeQuantum, playSound]);

  // Reset visualization
  const handleReset = useCallback(() => {
    playSound('reset');
    setTimeline([]);
    setMetrics(null);
    toast.success('Visualization reset');
  }, [playSound]);

  // Open comparison modal
  const handleCompare = useCallback(() => {
    if (processes.length === 0) {
      toast.error('Please add at least one process');
      return;
    }

    playSound('success');

    const comparison = runAllAlgorithms(processes, timeQuantum);
    setComparisonData(comparison);
    setIsComparisonOpen(true);
  }, [processes, timeQuantum, playSound]);

  // Handle key press in process ID input
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddProcess();
    }
  };

  return (
    <div className="min-h-screen p-5 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <header className="text-center mb-6">
          <h1 className="text-3xl font-extrabold gradient-text mb-2">
            CPU Scheduler Visualizer
          </h1>
          <p className="text-muted-foreground">
            Understand CPU Scheduling Algorithms Through Intuitive Visualization
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-5 items-start relative">
          {/* Left Panel - Slides out in animation tab, replaced by operation log */}
          <aside 
            className={`flex flex-col gap-5 transition-all duration-500 ease-in-out ${
              viewTab === 'animation' 
                ? 'lg:absolute lg:left-[-400px] lg:opacity-0 lg:pointer-events-none lg:w-[350px]' 
                : 'lg:relative lg:left-0 lg:opacity-100 lg:pointer-events-auto'
            }`}
          >
            {/* Algorithm Selection */}
            <section className="glass-card">
              <h2 className="text-lg font-semibold text-foreground mb-3">Algorithm</h2>
              <div className="flex items-center gap-2">
                <select
                  value={algorithm}
                  onChange={(e) => setAlgorithm(e.target.value as AlgorithmType)}
                  className="glass-select flex-1"
                >
                  <option value="FCFS">FCFS - First Come First Served</option>
                  <option value="SJF">SJF - Shortest Job First (Non-Preemptive)</option>
                  <option value="SRTF">SRTF - Shortest Remaining Time First</option>
                  <option value="Priority">Priority Scheduling</option>
                  <option value="RoundRobin">Round Robin</option>
                </select>
                <button
                  onClick={() => setIsInfoModalOpen(true)}
                  className="btn-info"
                  title="Algorithm Information"
                >
                  i
                </button>
              </div>

              {algorithm === 'RoundRobin' && (
                <div className="mt-3">
                  <label className="block text-sm text-muted-foreground mb-1">
                    Time Quantum (TQ)
                  </label>
                  <input
                    type="number"
                    value={timeQuantum}
                    onChange={(e) => setTimeQuantum(Math.max(1, parseInt(e.target.value) || 1))}
                    min="1"
                    className="glass-input"
                  />
                </div>
              )}
            </section>

            {/* Tab Selection */}
            <section className="glass-card">
              <div className="flex gap-2 mb-4">
                <button
                  className={`tab-btn ${activeTab === 'manual' ? 'active' : ''}`}
                  onClick={() => setActiveTab('manual')}
                >
                  Manual Entry
                </button>
                <button
                  className={`tab-btn ${activeTab === 'upload' ? 'active' : ''}`}
                  onClick={() => setActiveTab('upload')}
                >
                  Upload Table
                </button>
              </div>

              {activeTab === 'manual' ? (
                <div>
                  <h3 className="text-base font-semibold text-foreground mb-3">Add Process</h3>
                  
                  <label className="block text-sm text-muted-foreground mb-1">Process ID</label>
                  <input
                    type="text"
                    value={processId}
                    onChange={(e) => setProcessId(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="e.g., P1"
                    className="glass-input mb-3"
                  />

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="block text-sm text-muted-foreground mb-1">Arrival Time</label>
                      <input
                        type="number"
                        value={arrivalTime}
                        onChange={(e) => setArrivalTime(parseInt(e.target.value) || 0)}
                        min="0"
                        className="glass-input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-muted-foreground mb-1">Burst Time</label>
                      <input
                        type="number"
                        value={burstTime}
                        onChange={(e) => setBurstTime(Math.max(1, parseInt(e.target.value) || 1))}
                        min="1"
                        className="glass-input"
                      />
                    </div>
                  </div>

                  {algorithm === 'Priority' && (
                    <div className="mb-3">
                      <label className="block text-sm text-muted-foreground mb-1">
                        Priority (lower = higher)
                      </label>
                      <input
                        type="number"
                        value={priority}
                        onChange={(e) => setPriority(Math.max(1, parseInt(e.target.value) || 1))}
                        min="1"
                        className="glass-input"
                      />
                    </div>
                  )}

                  <button onClick={handleAddProcess} className="btn-gradient w-full">
                    + Add Process
                  </button>
                </div>
              ) : (
                <FileUpload
                  existingProcesses={processes}
                  onProcessesImported={handleProcessesImported}
                />
              )}
            </section>

            {/* Process List */}
            <ProcessList
              processes={processes}
              algorithm={algorithm}
              onDelete={handleDeleteProcess}
              onClearAll={handleClearAll}
            />

            {/* Controls */}
            <section className="glass-card">
              <h2 className="text-lg font-semibold text-foreground mb-3">Controls</h2>
              <div className="flex justify-center gap-3 mb-3">
                <button onClick={handleRun} className="btn-gradient flex items-center gap-2">
                  <Play size={16} />
                  Run
                </button>
                <button onClick={handleReset} className="btn-secondary flex items-center gap-2">
                  <RotateCcw size={16} />
                  Reset
                </button>
              </div>
              
              <button onClick={handleCompare} className="btn-compare w-full flex items-center justify-center gap-2">
                <BarChart3 size={18} />
                Analyze Comparison
              </button>

              {/* Sound Toggle */}
              <button
                onClick={handleToggleSound}
                className="mt-3 mx-auto flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                {soundEnabled ? 'Sound On' : 'Sound Off'}
              </button>
            </section>
          </aside>

          {/* Operation Log - Slides in from left in animation tab */}
          <aside
            className={`flex flex-col gap-5 transition-all duration-500 ease-in-out ${
              viewTab === 'animation'
                ? 'lg:relative lg:left-0 lg:opacity-100 lg:pointer-events-auto'
                : 'lg:absolute lg:left-[-400px] lg:opacity-0 lg:pointer-events-none lg:w-[350px]'
            }`}
          >
            <div className="glass-card p-4 h-full max-h-[calc(100vh-200px)] overflow-y-auto" ref={logContainerRef}>
              <h3 className="text-sm font-semibold text-foreground mb-3 sticky top-0 bg-black/50 backdrop-blur-sm pb-2 z-10">
                Operation Log
              </h3>
              <div className="space-y-2">
                {animationLog.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No operations yet</p>
                ) : (
                  animationLog.map((log, index) => (
                    <div
                      key={index}
                      className={`text-xs p-2 rounded border-l-2 ${
                        log.type === 'arrival' ? 'border-blue-500 bg-blue-500/10' :
                        log.type === 'start' ? 'border-green-500 bg-green-500/10' :
                        log.type === 'complete' ? 'border-purple-500 bg-purple-500/10' :
                        log.type === 'reenter' ? 'border-yellow-500 bg-yellow-500/10' :
                        log.type === 'idle' ? 'border-gray-500 bg-gray-500/10' :
                        'border-muted bg-muted/10'
                      }`}
                    >
                      <div className="font-semibold text-foreground">T={log.time}</div>
                      <div className="text-muted-foreground mt-1">{log.message}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </aside>

          {/* Right Panel */}
          <main className={`flex flex-col gap-5 transition-all duration-500 ease-in-out ${
            viewTab === 'animation' ? 'lg:col-span-1' : ''
          }`}>
            {/* View Tabs */}
            <section className="glass-card">
              <div className="flex gap-2 mb-4">
                <button
                  className={`tab-btn ${viewTab === 'gantt' ? 'active' : ''}`}
                  onClick={() => setViewTab('gantt')}
                >
                  Gantt Chart
                </button>
                <button
                  className={`tab-btn ${viewTab === 'animation' ? 'active' : ''}`}
                  onClick={() => setViewTab('animation')}
                >
                  Queue Animation
                </button>
              </div>

              {viewTab === 'gantt' ? (
                <>
                  {/* Gantt Chart */}
                  <div className="mb-4">
                    <h2 className="text-lg font-semibold text-foreground mb-4">Gantt Chart</h2>
                    <GanttChart timeline={timeline} />
                  </div>

                  {/* Execution Details */}
                  <ExecutionTable
                    processes={processes}
                    timeline={timeline}
                    metrics={metrics}
                  />

                  {/* Metrics */}
                  <MetricsPanel metrics={metrics} />
                </>
              ) : (
                <QueueAnimation
                  processes={processes}
                  algorithm={algorithm}
                  timeQuantum={timeQuantum}
                  onLogUpdate={setAnimationLog}
                />
              )}
            </section>
          </main>
        </div>
      </div>

      {/* Modals */}
      <AlgorithmInfoModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
        title={algorithmNames[algorithm]}
        description={algorithmDescriptions[algorithm]}
      />

      <ComparisonModal
        isOpen={isComparisonOpen}
        onClose={() => setIsComparisonOpen(false)}
        data={comparisonData}
      />
    </div>
  );
};

export default CPUScheduler;
