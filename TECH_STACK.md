# OS-Scheduler - Technical Documentation

## 🛠️ Technology Stack

### Frontend
- **React 18.3.1** - UI framework with TypeScript
- **TypeScript 5.8.3** - Type-safe development
- **Vite 5.4.19** - Build tool and dev server
- **Tailwind CSS 3.4.17** - Styling framework

### UI Components
- **Radix UI** - Accessible component library (20+ components)
- **Lucide React 0.462.0** - Icon system
- **Recharts 2.15.4** - Data visualization
- **React Hook Form 7.61.1** - Form management
- **Zod 3.25.76** - Schema validation
- **Sonner 1.7.4** - Toast notifications
- **React Router DOM 6.30.1** - Client-side routing
- **React Query 5.83.0** - State management

### Development Tools
- **ESLint 9.32.0** - Code linting
- **PostCSS 8.5.6** - CSS processing
- **Autoprefixer 10.4.21** - Browser compatibility

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/                    # 20+ reusable Radix UI components
│   ├── CPUScheduler.tsx       # Main app component
│   ├── ComparisonModal.tsx    # Algorithm comparison
│   ├── AlgorithmInfoModal.tsx # Algorithm information
│   ├── GanttChart.tsx        # Timeline visualization
│   ├── QueueAnimation.tsx     # Real-time animation
│   ├── MetricsPanel.tsx      # Performance metrics
│   ├── ProcessList.tsx        # Process management
│   ├── FileUpload.tsx         # CSV import
│   ├── ExecutionTable.tsx     # Execution results
│   ├── ProcessInputForm.tsx   # Process input form
│   └── ComplexityInfoModal.tsx # Complexity analysis
├── hooks/
│   ├── useSoundEffects.ts     # Audio management
│   └── use-toast.ts           # Notifications
├── types/
│   └── scheduler.ts           # TypeScript interfaces
├── utils/
│   ├── schedulerAlgorithms.ts # Core CPU scheduling algorithms
│   ├── fileParser.ts         # CSV parsing
│   ├── presets.ts            # Predefined scenarios
│   └── processColors.ts      # Color management
└── main.tsx                   # Entry point
```

## 🔧 Core CPU Scheduling Algorithms

### Algorithms Implemented
- **FCFS** - First Come First Served (O(n))
- **SJF** - Shortest Job First (O(n log n) average, O(n²) worst)
- **SRTF** - Shortest Remaining Time First (O(n log n) average, O(n²) worst)
- **Priority** - Priority Scheduling (O(n log n) average, O(n²) worst)
- **Round Robin** - Time-slice scheduling (O(n × q) where q is time quantum)

### Data Structures
- **FIFO Queue** - FCFS algorithm
- **Min-Heap** - SRTF/Priority algorithms
- **Circular Queue** - Round Robin algorithm
- **Arrays** - Process storage and sorting

### Complexity Analysis
```typescript
interface AlgorithmComplexity {
  timeComplexity: { best: string; average: string; worst: string; };
  spaceComplexity: string;
  dataStructures: string[];
}
```

## 🎨 Design System

### Colors
- Primary: Purple (#8b5cf6)
- Secondary: Blue (#5b9cff)
- Accent: Cyan (#06b6d4)
- Success: Green (#22c55e)
- Warning: Orange (#f97316)
- Error: Red (#ef4444)

### Typography
- Font: Inter (Google Fonts)
- Weights: 400-800
- Responsive scaling

## 📊 Data Flow

### State Management
```typescript
const [processes, setProcesses] = useState<Process[]>([]);
const [algorithm, setAlgorithm] = useState<AlgorithmType>('FCFS');
const [timeline, setTimeline] = useState<TimelineItem[]>([]);
```

### Pipeline
Input → Validation → Algorithm → Execution → Visualization → Analysis

## 🚀 Build Commands

```bash
npm run dev      # Development server (localhost:8080)
npm run build    # Production build
npm run preview  # Preview build
npm run lint     # Code linting
```

## 📦 Dependencies

### Production
- React ecosystem (React, TypeScript, Tailwind)
- UI libraries (Radix UI, Lucide, Recharts)
- Utilities (React Hook Form, Zod, Sonner)

### Development
- Vite (build tool)
- ESLint (linting)
- PostCSS (CSS processing)

## 🎯 Key Features

- **CPU Scheduling Visualization**: Real-time algorithm execution
- **Interactive Gantt Charts**: Timeline visualization of process execution
- **Queue Animation**: Watch processes move through scheduling queues
- **Performance Analysis**: Waiting time, turnaround time, response time
- **Algorithm Comparison**: Side-by-side performance metrics
- **CSV Import**: Bulk process data upload
- **Sound Effects**: Audio feedback for process events
- **Modern UI**: Glassmorphism design with smooth animations
- **Responsive Design**: Works on desktop and mobile

## 📱 Browser Support
- Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

## 📈 Performance
- Bundle size: ~500KB (gzipped)
- First Contentful Paint: <1s
- Interactive: <2s
