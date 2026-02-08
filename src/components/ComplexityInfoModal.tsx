import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlgorithmType, algorithmComplexity } from '@/types/scheduler';
import { Info, Clock, HardDrive, Database } from 'lucide-react';

interface ComplexityInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  algorithm: AlgorithmType;
}

const ComplexityInfoModal: React.FC<ComplexityInfoModalProps> = ({ isOpen, onClose, algorithm }) => {
  const complexity = algorithmComplexity[algorithm];

  const getComplexityColor = (complexity: string) => {
    if (complexity.includes('O(1)')) return 'text-green-400';
    if (complexity.includes('O(log n)')) return 'text-blue-400';
    if (complexity.includes('O(n)')) return 'text-yellow-400';
    if (complexity.includes('O(n log n)')) return 'text-orange-400';
    if (complexity.includes('O(n²)')) return 'text-red-400';
    return 'text-gray-400';
  };

  const getComplexityExplanation = (algorithm: AlgorithmType) => {
    switch (algorithm) {
      case 'FCFS':
        return {
          time: {
            explanation: "FCFS processes each process exactly once in arrival order.",
            steps: [
              "Sort processes by arrival time: O(n log n) or O(n) if already sorted",
              "Process each process once: O(n)",
              "Total: O(n) for n processes"
            ],
            visual: (
              <div className="bg-black/30 p-3 rounded-lg font-mono text-xs">
                <div className="text-green-400">for each process p in sorted_list:</div>
                <div className="text-blue-400 ml-4">execute(p.burst_time)</div>
                <div className="text-gray-400 mt-2">{`// Total operations: n (one per process)`}</div>
              </div>
            )
          },
          space: {
            explanation: "Storage for process queue and timeline data.",
            structures: ["Process array: O(n)", "Timeline array: O(n)", "Total: O(n)"]
          }
        };

      case 'SJF':
        return {
          time: {
            explanation: "SJF finds the shortest job among available processes at each step.",
            steps: [
              "For each time unit, search available processes: O(n)",
              "Find minimum burst time: O(n)",
              "Repeat for all processes: O(n × n) = O(n²)"
            ],
            visual: (
              <div className="bg-black/30 p-3 rounded-lg font-mono text-xs">
                <div className="text-green-400">while processes_remaining:</div>
                <div className="text-blue-400 ml-4">available = get_available_processes() // O(n)</div>
                <div className="text-blue-400 ml-4">shortest = find_min_burst(available) // O(n)</div>
                <div className="text-blue-400 ml-4">execute(shortest)</div>
                <div className="text-gray-400 mt-2">{`// Worst case: O(n²) when searching each time`}</div>
              </div>
            )
          },
          space: {
            explanation: "Storage for processes and sorting operations.",
            structures: ["Process array: O(n)", "Available processes: O(n)", "Timeline: O(n)"]
          }
        };

      case 'SRTF':
        return {
          time: {
            explanation: "SRTF always selects the process with shortest remaining time using a priority queue.",
            steps: [
              "Maintain min-heap of processes by remaining time: O(log n)",
              "Extract minimum: O(log n)",
              "Update remaining time: O(log n)",
              "Total: O(n log n) average case"
            ],
            visual: (
              <div className="bg-black/30 p-3 rounded-lg font-mono text-xs">
                <div className="text-green-400">priority_queue pq; // min-heap by remaining_time</div>
                <div className="text-blue-400">while pq not empty:</div>
                <div className="text-blue-400 ml-4">current = pq.extract_min() // O(log n)</div>
                <div className="text-blue-400 ml-4">current.remaining--</div>
                <div className="text-blue-400 ml-4">if current.remaining &gt; 0:</div>
                <div className="text-blue-400 ml-8">pq.insert(current) // O(log n)</div>
                <div className="text-gray-400 mt-2">{`// Each operation: O(log n), Total: O(n log n)`}</div>
              </div>
            )
          },
          space: {
            explanation: "Priority queue and process storage.",
            structures: ["Priority queue: O(n)", "Process array: O(n)", "Timeline: O(n)"]
          }
        };

      case 'Priority':
        return {
          time: {
            explanation: "Priority scheduling uses a min-heap to always get the highest priority process.",
            steps: [
              "Build priority queue: O(n)",
              "Extract min priority: O(log n)",
              "Insert new processes: O(log n)",
              "Total: O(n log n) average case"
            ],
            visual: (
              <div className="bg-black/30 p-3 rounded-lg font-mono text-xs">
                <div className="text-green-400">priority_queue pq; // min-heap by priority</div>
                <div className="text-blue-400">while processes_remaining:</div>
                <div className="text-blue-400 ml-4">current = pq.extract_min() // O(log n)</div>
                <div className="text-blue-400 ml-4">execute_one_time_unit(current)</div>
                <div className="text-blue-400 ml-4">check_new_arrivals(pq) // O(log n) per insert</div>
                <div className="text-gray-400 mt-2">{`// Heap operations: O(log n), Total: O(n log n)`}</div>
              </div>
            )
          },
          space: {
            explanation: "Priority queue implementation and process storage.",
            structures: ["Priority queue: O(n)", "Process array: O(n)", "Timeline: O(n)"]
          }
        };

      case 'RoundRobin':
        return {
          time: {
            explanation: "Round Robin uses a circular queue and processes each for a fixed time quantum.",
            steps: [
              "Initialize circular queue: O(n)",
              "Each process executes for quantum q: O(1) per quantum",
              "Total operations: O(n × q) where q is time quantum"
            ],
            visual: (
              <div className="bg-black/30 p-3 rounded-lg font-mono text-xs">
                <div className="text-green-400">queue q; // circular queue</div>
                <div className="text-blue-400">while q not empty:</div>
                <div className="text-blue-400 ml-4">process = q.dequeue() // O(1)</div>
                <div className="text-blue-400 ml-4">execute(process, time_quantum) // O(q)</div>
                <div className="text-blue-400 ml-4">if process.remaining &gt; 0:</div>
                <div className="text-blue-400 ml-8">q.enqueue(process) // O(1)</div>
                <div className="text-gray-400 mt-2">{`// Each quantum: O(q), Total: O(n × q)`}</div>
              </div>
            )
          },
          space: {
            explanation: "Circular queue and process management.",
            structures: ["Circular queue: O(n)", "Process array: O(n)", "Timeline: O(n)"]
          }
        };

      default:
        return {
          time: { explanation: "", steps: [], visual: null },
          space: { explanation: "", structures: [] }
        };
    }
  };

  const explanation = getComplexityExplanation(algorithm);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-[hsl(222,47%,5%)] to-[hsl(217,33%,10%)] border-[rgba(255,255,255,0.1)]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold gradient-text flex items-center gap-2">
            <Info size={24} />
            {algorithm} Complexity Analysis
          </DialogTitle>
          <div className="modal-divider mt-4" />
        </DialogHeader>

        <div className="space-y-6">
          {/* Time Complexity Section */}
          <div className="glass-card">
            <div className="flex items-center gap-2 mb-4">
              <Clock size={20} className="text-blue-400" />
              <h3 className="text-lg font-semibold text-foreground">Time Complexity</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="text-center p-3 rounded-lg bg-[rgba(34,197,94,0.1)] border border-[rgba(34,197,94,0.2)]">
                <p className="text-xs text-muted-foreground">Best Case</p>
                <p className={`font-mono font-bold ${getComplexityColor(complexity.timeComplexity.best)}`}>
                  {complexity.timeComplexity.best}
                </p>
              </div>
              <div className="text-center p-3 rounded-lg bg-[rgba(251,191,36,0.1)] border border-[rgba(251,191,36,0.2)]">
                <p className="text-xs text-muted-foreground">Average Case</p>
                <p className={`font-mono font-bold ${getComplexityColor(complexity.timeComplexity.average)}`}>
                  {complexity.timeComplexity.average}
                </p>
              </div>
              <div className="text-center p-3 rounded-lg bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.2)]">
                <p className="text-xs text-muted-foreground">Worst Case</p>
                <p className={`font-mono font-bold ${getComplexityColor(complexity.timeComplexity.worst)}`}>
                  {complexity.timeComplexity.worst}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-foreground mb-2">How it's calculated:</h4>
                <p className="text-sm text-muted-foreground mb-3">{explanation.time.explanation}</p>
                
                <div className="space-y-2">
                  {explanation.time.steps.map((step, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <span className="text-blue-400 font-mono text-xs">Step {index + 1}:</span>
                      <span className="text-sm text-muted-foreground">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {explanation.time.visual && (
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Code Visualization:</h4>
                  {explanation.time.visual}
                </div>
              )}
            </div>
          </div>

          {/* Space Complexity Section */}
          <div className="glass-card">
            <div className="flex items-center gap-2 mb-4">
              <HardDrive size={20} className="text-green-400" />
              <h3 className="text-lg font-semibold text-foreground">Space Complexity</h3>
            </div>
            
            <div className="text-center p-4 rounded-lg bg-[rgba(34,197,94,0.1)] border border-[rgba(34,197,94,0.2)] mb-4">
              <p className="text-xs text-muted-foreground mb-1">Space Complexity</p>
              <p className={`font-mono font-bold text-xl ${getComplexityColor(complexity.spaceComplexity)}`}>
                {complexity.spaceComplexity}
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">{explanation.space.explanation}</p>
              <div className="space-y-2">
                {explanation.space.structures.map((structure, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Database size={16} className="text-blue-400 mt-0.5" />
                    <span className="text-sm text-muted-foreground">{structure}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Data Structures Section */}
          <div className="glass-card">
            <div className="flex items-center gap-2 mb-4">
              <Database size={20} className="text-purple-400" />
              <h3 className="text-lg font-semibold text-foreground">Data Structures Used</h3>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {complexity.dataStructures.map((ds, index) => (
                <span key={index} className="px-3 py-2 rounded-lg bg-[rgba(139,92,246,0.2)] border border-[rgba(139,92,246,0.3)] text-purple-300 font-mono text-sm">
                  {ds}
                </span>
              ))}
            </div>
          </div>

          {/* Complexity Scale Reference */}
          <div className="glass-card">
            <h3 className="text-lg font-semibold text-foreground mb-4">Complexity Scale Reference</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[
                { complexity: "O(1)", color: "text-green-400", desc: "Constant" },
                { complexity: "O(log n)", color: "text-blue-400", desc: "Logarithmic" },
                { complexity: "O(n)", color: "text-yellow-400", desc: "Linear" },
                { complexity: "O(n log n)", color: "text-orange-400", desc: "Linearithmic" },
                { complexity: "O(n²)", color: "text-red-400", desc: "Quadratic" },
                { complexity: "O(n³)", color: "text-red-500", desc: "Cubic" },
                { complexity: "O(2^n)", color: "text-red-600", desc: "Exponential" },
                { complexity: "O(n!)", color: "text-red-700", desc: "Factorial" }
              ].map((item, index) => (
                <div key={index} className="text-center p-2 rounded bg-black/30 border border-[rgba(255,255,255,0.1)]">
                  <p className={`font-mono font-bold ${item.color}`}>{item.complexity}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ComplexityInfoModal;
