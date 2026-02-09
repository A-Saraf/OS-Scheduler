import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Process, AlgorithmType, TimelineItem, Metrics, AlgorithmComparison, algorithmNames, algorithmDescriptions } from '@/types/scheduler';
import { runAlgorithm, calculateMetrics, runAllAlgorithms } from '@/utils/schedulerAlgorithms';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { toast } from 'sonner';

import GanttChart from './GanttChart';
import MetricsPanel from './MetricsPanel';
import ExecutionTable from './ExecutionTable';
import ProcessList from './ProcessList';
import ProcessInputForm from './ProcessInputForm';
import FileUpload from './FileUpload';
import AlgorithmInfoModal from './AlgorithmInfoModal';
import { Scenario } from '@/utils/presets';
import ComparisonModal from './ComparisonModal';
import QueueAnimation from './QueueAnimation';
import { Play, RotateCcw, BarChart3, Volume2, VolumeX, Info, Dices } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CPUScheduler: React.FC = () => {
  // State
  // State - Initialized from localStorage if available
  const [algorithm, setAlgorithm] = useState<AlgorithmType>(() =>
    (localStorage.getItem('scheduler_algorithm') as AlgorithmType) || 'FCFS'
  );
  const [timeQuantum, setTimeQuantum] = useState(() =>
    parseInt(localStorage.getItem('scheduler_tq') || '2')
  );
  const [processes, setProcesses] = useState<Process[]>(() => {
    const saved = localStorage.getItem('scheduler_processes');
    return saved ? JSON.parse(saved) : [];
  });
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [activeTab, setActiveTab] = useState<'manual' | 'upload'>('manual');
  const [viewTab, setViewTab] = useState<'gantt' | 'animation'>(() =>
    (localStorage.getItem('scheduler_view_tab') as 'gantt' | 'animation') || 'gantt'
  );
  const [animationLog, setAnimationLog] = useState<Array<{ time: number; message: string; type: string }>>([]);
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Persistence Effect
  useEffect(() => {
    localStorage.setItem('scheduler_algorithm', algorithm);
    localStorage.setItem('scheduler_tq', timeQuantum.toString());
    localStorage.setItem('scheduler_processes', JSON.stringify(processes));
    localStorage.setItem('scheduler_view_tab', viewTab);
  }, [algorithm, timeQuantum, processes, viewTab]);

  // Auto-scroll log to bottom
  useEffect(() => {
    if (logContainerRef.current && viewTab === 'animation') {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [animationLog, viewTab]);

  // Form state
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

  // Randomize Processes
  const handleRandomize = useCallback(() => {
    playSound('addProcess');
    const randomProcesses: Process[] = Array.from({ length: 5 }, (_, i) => ({
      id: `P${i + 1}`,
      arrival: Math.floor(Math.random() * 10),
      burst: Math.floor(Math.random() * 10) + 1,
      priority: Math.floor(Math.random() * 5) + 1,
    })).sort((a, b) => a.arrival - b.arrival);

    setProcesses(randomProcesses);
    setTimeline([]);
    setMetrics(null);
    toast.success('Generated 5 random processes');
  }, [playSound]);

  // Load Scenario
  const handleLoadScenario = useCallback((scenario: Scenario) => {
    playSound('addProcess');
    // Ensure cleanup
    setTimeline([]);
    setMetrics(null);
    setAnimationLog([]);

    // Set scenario data
    setProcesses(scenario.processes as Process[]);
    setAlgorithm(scenario.recommendedAlgorithm);
    if (scenario.timeQuantum) {
      setTimeQuantum(scenario.timeQuantum);
    }

    toast.success(`Loaded "${scenario.name}" scenario`);
    toast.info(scenario.description, { duration: 4000 });
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

  // Keyboard Shortcuts
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Run: Ctrl + Enter or Cmd + Enter
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleRun();
      }
      // Reset: Escape
      if (e.key === 'Escape') {
        e.preventDefault();
        handleReset();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [handleRun, handleReset]);

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
  // Removed outdated handler

  return (
    <div className="h-screen overflow-hidden p-5 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-[1400px] mx-auto h-full flex flex-col">
        {/* Header */}
        <header className="text-center mb-6">
          <h1 className="text-3xl font-extrabold gradient-text mb-2">
            OS-Scheduler
          </h1>
          <h2 className="text-lg font-semibold text-foreground mb-2">
            An Interactive CPU Scheduling Visualization and Performance Analysis Tool
          </h2>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[350px_minmax(0,1fr)] gap-5 items-start relative overflow-x-clip flex-1 min-h-0">
          {/* Left Panel - Slides out in animation tab, replaced by operation log */}
          <aside
            className={`flex flex-col gap-5 transition-all duration-500 ease-in-out overflow-y-auto max-h-full custom-scrollbar ${viewTab === 'animation'
              ? 'lg:absolute lg:left-[-400px] lg:opacity-0 lg:pointer-events-none lg:w-[350px] lg:overflow-hidden'
              : 'lg:relative lg:left-0 lg:opacity-100 lg:pointer-events-auto'
              }`}
          >
            {/* Algorithm Selection */}
            <section className="glass-card">
              <h2 className="text-lg font-semibold text-foreground mb-3">Algorithm</h2>
              <div className="flex items-center gap-2">
                <Select value={algorithm} onValueChange={(val) => setAlgorithm(val as AlgorithmType)}>
                  <SelectTrigger className="glass-select-trigger flex-1 min-w-[200px]">
                    <SelectValue placeholder="Select Algorithm" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FCFS">FCFS - First Come First Served</SelectItem>
                    <SelectItem value="SJF">SJF - Shortest Job First</SelectItem>
                    <SelectItem value="SRTF">SRTF - Shortest Remaining Time First</SelectItem>
                    <SelectItem value="Priority">Priority Scheduling</SelectItem>
                    <SelectItem value="RoundRobin">Round Robin</SelectItem>
                  </SelectContent>
                </Select>
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
              <div className="tab-group mb-4">
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

              {/* Randomize Button */}
              {activeTab === 'manual' ? (
                <ProcessInputForm
                  algorithm={algorithm}
                  onAddProcess={handleAddProcess}
                  onRandomize={handleRandomize}
                  onLoadScenario={handleLoadScenario}
                />

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
              <h2 className="text-base font-semibold text-foreground mb-3">Controls</h2>
              <div className="flex justify-center gap-3 mb-3">
                <button onClick={handleRun} className="btn-execute" title="Shortcut: Ctrl+Enter">
                  <Play size={16} />
                  Run <span className="text-[10px] opacity-70 ml-1 font-mono tracking-tighter hidden group-hover:inline">(Ctrl+↵)</span>
                </button>
                <button onClick={handleReset} className="btn-secondary" title="Shortcut: Esc">
                  <RotateCcw size={16} />
                  Reset <span className="text-[10px] opacity-70 ml-1 font-mono tracking-tighter hidden group-hover:inline">(Esc)</span>
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
            className={`flex flex-col transition-all duration-500 ease-in-out min-h-0 max-h-full ${viewTab === 'animation'
              ? 'lg:relative lg:left-0 lg:opacity-100 lg:pointer-events-auto'
              : 'lg:absolute lg:left-[-400px] lg:opacity-0 lg:pointer-events-none lg:w-[350px] lg:overflow-hidden'
              }`}
          >
            <div className="glass-card p-4 flex-1 min-h-0 overflow-y-auto custom-scrollbar" ref={logContainerRef}>
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
                      className={`text-xs p-2 rounded border-l-2 ${log.type === 'arrival' ? 'border-blue-500 bg-blue-500/10' :
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
          <main className={`flex flex-col min-h-0 max-h-full min-w-0 transition-all duration-500 ease-in-out ${viewTab === 'animation' ? 'lg:col-span-1' : ''
            }`}>
            {/* View Tabs */}
            <section className="glass-card flex flex-col h-full min-h-0">
              <div className="tab-group mb-4">
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

              {/* Content area with internal scrolling */}
              <div className="flex-1 overflow-y-auto custom-scrollbar min-h-[500px]">
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
              </div>
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
    </div >
  );
};

export default CPUScheduler;
