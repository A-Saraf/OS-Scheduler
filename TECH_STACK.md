# DSA Algorithm Visualizer - Technical Documentation

## 🛠️ Technology Stack

### Frontend
- **React 18.3.1** - UI framework with TypeScript
- **TypeScript 5.8.3** - Type-safe development
- **Vite 5.4.19** - Build tool and dev server
- **Tailwind CSS 3.4.17** - Styling framework

### UI Components
- **Radix UI** - Accessible component library
- **Lucide React 0.462.0** - Icon system
- **Recharts 2.15.4** - Data visualization

### Development Tools
- **ESLint 9.32.0** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - Browser compatibility

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/                    # 20+ reusable components
│   ├── CPUScheduler.tsx       # Main app component
│   ├── ComparisonModal.tsx    # Algorithm comparison
│   ├── ComplexityInfoModal.tsx # Complexity details
│   ├── GanttChart.tsx        # Timeline visualization
│   └── QueueAnimation.tsx     # Real-time animation
├── hooks/
│   ├── useSoundEffects.ts     # Audio management
│   └── use-toast.ts           # Notifications
├── types/
│   └── scheduler.ts           # TypeScript interfaces
├── utils/
│   ├── schedulerAlgorithms.ts # Core algorithms
│   └── fileParser.ts         # CSV parsing
└── main.tsx                   # Entry point
```

## 🔧 Core Algorithms

### Data Structures
- **FIFO Queue** - FCFS (O(n))
- **Min-Heap** - SRTF/Priority (O(n log n))
- **Circular Queue** - Round Robin (O(n × q))
- **Arrays** - Process storage

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

- **Interactive Visualizations**: Real-time algorithm execution
- **Complexity Analysis**: Big O notation breakdowns
- **Data Structure Demos**: Queues, heaps, arrays in action
- **Educational Tools**: Step-by-step explanations
- **Modern UI**: Glassmorphism design with animations

## 📱 Browser Support
- Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

## 📈 Performance
- Bundle size: ~500KB (gzipped)
- First Contentful Paint: <1s
- Interactive: <2s
