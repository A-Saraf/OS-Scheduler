# OS-Scheduler: An Interactive CPU Scheduling Visualization and Performance Analysis Tool

<div>

**🚀 Live Application:** [https://os-scheduler-navy.vercel.app/](https://os-scheduler-navy.vercel.app/)

</div>

## 📖 About

OS-Scheduler is an **interactive web application** designed to help students and developers understand **CPU Scheduling algorithms** through **visual learning**. The application provides real-time animations, Gantt charts, performance metrics, and text-to-speech narration to make complex operating system concepts intuitive and engaging. Perfect for computer science students and educators looking to explore CPU scheduling algorithms, queue data structures, and performance analysis.

## 🎯 Key Features

### 📊 **Interactive Visualizations**
- **🎬 Real-time Animations**: Watch processes move through scheduling queues step-by-step
- **📈 Gantt Charts**: Timeline visualization of process execution
- **� Performance Metrics**: Detailed analysis of waiting time, turnaround time, response time
- **� Algorithm Comparison**: Side-by-side performance comparison with charts
- **🗣️ Text-to-Speech**: Natural voice narration of algorithm information and results
- **🔍 Queue Visualization**: See FIFO queues, priority queues, and circular queues in action

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
- **�️ Voice Narration**: Text-to-speech with natural human-like voices
- **�📚 Educational Tooltips**: Context-sensitive help and explanations
- **🎛️ Interactive Controls**: Keyboard shortcuts and intuitive interface

## 🧠 Understanding CPU Scheduling & Data Structures

This application demonstrates the practical application of **CPU Scheduling algorithms** and **queue data structures** through interactive visualizations. Each algorithm showcases different data structures and their efficiency characteristics:

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
1. Navigate to the **Manual Entry** tab
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
2. **Queue Animation View**: Real-time process queue visualization
3. **Performance Metrics**: Detailed analysis table with all metrics
4. **Algorithm Comparison**: Side-by-side performance comparison with charts
5. **Voice Narration**: Click speak buttons for audio explanation of results
6. **Keyboard Shortcuts**: Use Ctrl+Enter to run, Esc to reset

## 📊 Performance Metrics & Analysis

| Algorithm | Avg Waiting Time | Avg Turnaround Time | Avg Response Time | CPU Utilization | Data Structure |
|------------|------------------|--------------------|------------------|----------------|---------------|
| **FCFS** | Variable | Variable | Variable | Variable | FIFO Queue |
| **SJF** | Low | Low | Variable | High | Array + Sorting |
| **SRTF** | Low | Low | Very Low | High | Min-Heap |
| **Priority** | Variable | Variable | Variable | High | Min-Heap |
| **Round Robin** | Fair | Fair | Low | High | Circular Queue |

### 🎯 **Key OS Concepts Demonstrated**
- **CPU Scheduling**: FCFS, SJF, SRTF, Priority, Round Robin algorithms
- **Queue Operations**: Enqueue, dequeue, circular queue behavior
- **Process States**: New, Ready, Running, Waiting, Terminated
- **Context Switching**: Process switching overhead and timing
- **Performance Metrics**: Waiting time, turnaround time, response time analysis
- **Time Quantum**: Round Robin time slice management
- **Priority Levels**: Process priority management and starvation prevention
- **Gantt Charts**: Timeline representation of process execution

## 🎨 Technology Stack

- **⚛️ React 18** - Modern UI framework with hooks
- **📘 TypeScript** - Type-safe development
- **🎨 Tailwind CSS** - Utility-first styling
- **🧩 Radix UI** - Accessible component library
- **📊 Recharts** - Data visualization and charts
- **⚡ Vite** - Fast development and build tool
- **🗣️ Web Speech API** - Text-to-speech functionality
- **🔊 Audio API** - Sound effects and audio feedback

## 🌟 Highlights

### **🎬 Animation Features**
- **Process States**: New → Ready → Running → Completed
- **Queue Visualization**: See processes move through ready queue
- **Real-time Updates**: Live counter and event logging
- **Sound Effects**: Audio feedback for process events

### **📈 Comparison Tools**
- **Side-by-side Analysis**: Compare multiple algorithms with performance charts
- **Performance Breakdowns**: Detailed metrics analysis with visual charts
- **Interactive Info Modals**: Click for detailed algorithm explanations with voice narration
- **Queue Visualization**: See FIFO queues, priority queues, and circular queues in action
- **Voice Narration**: Natural voice explanation of comparison results and recommendations
- **Export Options**: Save results for further analysis

### **🎯 Educational Value**
- **Interactive Learning**: Hands-on exploration of CPU scheduling concepts
- **Visual Understanding**: See abstract algorithms in action
- **Audio Learning**: Listen to natural voice explanations of complex concepts
- **Experimentation**: Try different scenarios and parameters
- **Performance Analysis**: Understand algorithm trade-offs and efficiency
- **OS Concepts**: Learn about process scheduling, queues, and system performance
- **Real-world Applications**: Understand how operating systems manage CPU resources

<div align="center">

**🎓 Made with ❤️ for Students and Educators**

**⭐ If this project helped you learn, give it a star!**

</div>
