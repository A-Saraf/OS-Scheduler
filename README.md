# DSA Algorithm Visualizer: An Interactive Data Structures and Algorithms Learning Platform

<div>

**🚀 Live Application:** [https://os-scheduler-navy.vercel.app/](https://os-scheduler-navy.vercel.app/)

</div>

## 📖 About

DSA Algorithm Visualizer is an **interactive web application** designed to help students and developers understand **Data Structures and Algorithms** through **visual learning**. The application provides real-time animations, complexity analysis, and detailed algorithmic breakdowns to make complex DSA concepts intuitive and engaging. Perfect for computer science students and educators looking to explore algorithmic efficiency and data structure applications.

## 🎯 Key Features

### 📊 **Interactive Visualizations**
- **🎬 Real-time Animations**: Watch algorithms execute step-by-step with visual feedback
- **📈 Complexity Charts**: Big O notation comparison across different algorithms
- **📊 Algorithm Analysis**: Detailed time and space complexity breakdowns
- **🔍 Data Structure Visualization**: See queues, heaps, and arrays in action

### 🔄 **Multiple Scheduling Algorithms**
- **🏃 First Come First Served (FCFS)**: FIFO queue implementation with O(n) complexity
- **⚡ Shortest Job First (SJF)**: Sorting-based selection with O(n log n) average complexity
- **🎯 Shortest Remaining Time First (SRTF)**: Priority queue (min-heap) with O(n log n) complexity
- **🔢 Priority Scheduling**: Min-heap implementation with O(n log n) complexity
- **🔄 Round Robin**: Circular queue with O(n × q) complexity where q is time quantum

### 📝 **Flexible Input Methods**
- **📋 Table Input**: Manual process entry with intuitive form interface
- **📤 CSV Upload**: Bulk process data import
- **⚙️ Custom Parameters**: Configure arrival time, burst time, and priority
- **🎛️ Algorithm Configuration**: Adjustable time quantum and priority settings

### 🎨 **Modern UI/UX**
- **🌙 Dark Theme**: Eye-friendly glassmorphism design
- **📱 Responsive Layout**: Works seamlessly on desktop and mobile
- **🎭 Smooth Animations**: CSS transitions and micro-interactions
- **🔊 Sound Effects**: Audio feedback for process events
- **📚 Educational Tooltips**: Context-sensitive help and explanations

## 🧠 Understanding Data Structures & Algorithms

This application demonstrates the practical application of **Data Structures and Algorithms** through CPU scheduling scenarios. Each algorithm showcases different data structures and their efficiency characteristics:

### 📚 **Data Structures in Action**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Input Data    │───▶│  Data Structure │───▶│  Algorithm     │
│                 │    │                 │    │                 │
│ • Process Array │    │ • FIFO Queue    │    │ • FCFS O(n)     │
│ • Burst Times   │    │ • Min-Heap      │    │ • SJF O(n log n)│
│ • Priorities    │    │ • Circular Queue│    │ • SRTF O(n log n)│
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │  Complexity     │
                       │  Analysis       │
                       │                 │
                       │ • Time: O(1)-O(n²)│
                       │ • Space: O(n)   │
                       └─────────────────┘
```

### 🔍 **Algorithm Deep Dive & Complexity Analysis**

#### **1. First Come First Served (FCFS)**
- **Data Structure**: FIFO Queue
- **Time Complexity**: O(n) - Single pass through processes
- **Space Complexity**: O(n) - Process storage
- **Best Use Case**: Simple scenarios with predictable workloads
- **⚠️ Trade-off**: Convoy effect - short processes wait behind long ones

#### **2. Shortest Job First (SJF)**
- **Data Structure**: Array with Sorting
- **Time Complexity**: O(n log n) average, O(n²) worst case
- **Space Complexity**: O(n) - Process and timeline storage
- **Best Use Case**: Minimizing average waiting time
- **⚠️ Trade-off**: Requires burst time knowledge, potential starvation

#### **3. Shortest Remaining Time First (SRTF)**
- **Data Structure**: Priority Queue (Min-Heap)
- **Time Complexity**: O(n log n) - Heap operations dominate
- **Space Complexity**: O(n) - Heap and process storage
- **Best Use Case**: Interactive systems requiring quick response
- **⚡ Trade-off**: High overhead from frequent context switching

#### **4. Priority Scheduling**
- **Data Structure**: Priority Queue (Min-Heap)
- **Time Complexity**: O(n log n) - Heap insert/extract operations
- **Space Complexity**: O(n) - Heap and auxiliary storage
- **Best Use Case**: Real-time systems with deadline constraints
- **⚠️ Trade-off**: Low-priority processes may starve without aging

#### **5. Round Robin**
- **Data Structure**: Circular Queue
- **Time Complexity**: O(n × q) where q is time quantum
- **Space Complexity**: O(n) - Queue and process management
- **Best Use Case**: Time-sharing systems with fair CPU distribution
- **⚙️ Trade-off**: Performance heavily dependent on quantum size

## 🚀 Getting Started

### 📋 **Prerequisites**
- Node.js 16+ and npm
- Modern web browser (Chrome, Firefox, Safari, Edge)

### 🛠️ **Local Development**

```bash
# Clone the repository
git clone https://github.com/A-Saraf/OS-Scheduler.git

# Navigate to project directory
cd OS-Scheduler

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173 in your browser
```

### 🏗️ **Build for Production**

```bash
# Build optimized production bundle
npm run build

# Preview production build
npm run preview
```

## 🎮 How to Use

### **Step 1: Add Processes**
1. Navigate to the **Manual Input** tab
2. Enter process details:
   - **Process ID**: Unique identifier (P1, P2, etc.)
   - **Arrival Time**: When process becomes ready
   - **Burst Time**: CPU execution time required
   - **Priority**: For priority scheduling algorithms

### **Step 2: Select Algorithm**
1. Choose from the dropdown menu:
   - FCFS, SJF, SRTF, Priority, or Round Robin
2. Configure **Time Quantum** for Round Robin (default: 2)

### **Step 3: Analyze Results**
1. **Gantt Chart View**: Visual timeline of process execution
2. **Animation View**: Real-time process queue visualization
3. **Complexity Analysis**: Big O notation and data structure breakdown
4. **Algorithm Comparison**: Compare efficiency and complexity across algorithms
5. **Detailed Explanations**: Click info buttons for step-by-step algorithm analysis

## 📊 Algorithm Complexity Analysis

| Algorithm | Time Complexity | Space Complexity | Data Structure | Best Case |
|------------|----------------|------------------|---------------|-----------|
| **FCFS** | O(n) | O(n) | FIFO Queue | Already sorted |
| **SJF** | O(n log n) avg, O(n²) worst | O(n) | Array + Sorting | Small burst times |
| **SRTF** | O(n log n) avg, O(n²) worst | O(n) | Min-Heap | Predictable workloads |
| **Priority** | O(n log n) avg, O(n²) worst | O(n) | Min-Heap | Clear priority levels |
| **Round Robin** | O(n × q) | O(n) | Circular Queue | Optimal quantum |

### 🎯 **Key DSA Concepts Demonstrated**
- **Queue Operations**: Enqueue, dequeue, circular queue behavior
- **Heap Operations**: Insert, extract-min, heapify
- **Sorting Algorithms**: Comparison of different sorting approaches
- **Complexity Analysis**: Big O notation in practice
- **Data Structure Selection**: Choosing the right structure for the problem
- **Algorithm Trade-offs**: Time vs space, simplicity vs efficiency

## 🎨 Technology Stack

- **⚛️ React 18** - Modern UI framework with hooks
- **📘 TypeScript** - Type-safe development
- **🎨 Tailwind CSS** - Utility-first styling
- **🧩 Radix UI** - Accessible component library
- **⚡ Vite** - Fast development and build tool
- **🎭 Framer Motion** - Smooth animations and transitions

## 🌟 Highlights

### **🎬 Animation Features**
- **Process States**: New → Ready → Running → Completed
- **Queue Visualization**: See processes move through ready queue
- **Real-time Updates**: Live counter and event logging
- **Sound Effects**: Audio feedback for process events

### **📈 Comparison Tools**
- **Side-by-side Analysis**: Compare multiple algorithms with complexity charts
- **Complexity Breakdowns**: Detailed Big O notation analysis
- **Visual Insights**: Color-coded complexity comparisons
- **Interactive Info Modals**: Click for detailed algorithm explanations
- **Data Structure Showcase**: See queues, heaps, and arrays in action

### **🎯 Educational Value**
- **Interactive Learning**: Hands-on exploration of DSA concepts
- **Visual Understanding**: See abstract algorithms in action
- **Experimentation**: Try different scenarios and parameters
- **Complexity Analysis**: Understand Big O notation through examples
- **Algorithm Selection**: Learn when to use which data structure
- **Performance Trade-offs**: Compare efficiency vs simplicity

<div align="center">

**🎓 Made with ❤️ for Students and Educators**

**⭐ If this project helped you learn, give it a star!**

</div>
