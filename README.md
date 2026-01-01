# OS-Scheduler: An Interactive CPU Scheduling Visualization and Performance Analysis Tool

<div>

**🚀 Live Application:** [https://os-scheduler-navy.vercel.app/](https://os-scheduler-navy.vercel.app/)

</div>

## 📖 About

OS-Scheduler is an **interactive web application** designed to help students and developers understand CPU scheduling algorithms through **visual learning**. The application provides real-time animations, Gantt charts, and performance metrics to make complex operating system concepts intuitive and engaging.

## 🎯 Key Features

### 📊 **Interactive Visualizations**
- **🎬 Real-time Animations**: Watch processes move through queues and execute on CPU
- **📈 Gantt Charts**: Visual timeline representation of process execution
- **📊 Performance Metrics**: Detailed analysis of waiting time, turnaround time, and response time

### 🔄 **Multiple Scheduling Algorithms**
- **🏃 First Come First Served (FCFS)**: Processes execute in arrival order
- **⚡ Shortest Job First (SJF)**: Non-preemptive shortest burst time first
- **🎯 Shortest Remaining Time First (SRTF)**: Preemptive version of SJF
- **🔢 Priority Scheduling**: Processes execute based on priority levels
- **🔄 Round Robin**: Time-slice based scheduling with configurable quantum

### 📝 **Flexible Input Methods**
- **📋 Table Input**: Manual process entry with intuitive form interface
- **📤 CSV Upload**: Bulk process data import
- **⚙️ Custom Parameters**: Configure arrival time, burst time, and priority

### 🎨 **Modern UI/UX**
- **🌙 Dark Theme**: Eye-friendly glassmorphism design
- **📱 Responsive Layout**: Works seamlessly on desktop and mobile
- **🎭 Smooth Animations**: CSS transitions and micro-interactions
- **🔊 Sound Effects**: Audio feedback for process events

## 🧠 Understanding CPU Scheduling

CPU scheduling is a fundamental concept in operating systems that determines which process gets access to the CPU when multiple processes are ready to execute. The **queue data structure** plays a crucial role in this process:

### 📚 **The Role of Queues in Scheduling**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   New Processes │───▶│   Ready Queue   │───▶│   CPU Execution │
│                 │    │                 │    │                 │
│ • Arrival Time  │    │ • FCFS Queue    │    │ • Running State │
│ • Burst Time    │    │ • Priority Queue│    │ • Time Quantum  │
│ • Priority      │    │ • Round Robin   │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │  Waiting Queue  │
                       │                 │
                       │ • I/O Waiting   │
                       │ • Not Ready     │
                       └─────────────────┘
```

### 🔍 **Algorithm Deep Dive**

#### **1. First Come First Served (FCFS)**
- **Principle**: "First in, first out" approach
- **Queue Type**: Simple FIFO queue
- **Best for**: Batch systems with predictable workloads
- **⚠️ Convoy Effect**: Short processes wait behind long ones

#### **2. Shortest Job First (SJF)**
- **Principle**: Execute shortest burst time first
- **Queue Type**: Sorted by burst time
- **Best for**: Minimizing average waiting time
- **⚠️ Starvation**: Long processes may wait indefinitely

#### **3. Shortest Remaining Time First (SRTF)**
- **Principle**: Preemptive SJF - always run shortest remaining
- **Queue Type**: Dynamic priority queue
- **Best for**: Interactive systems requiring quick response
- **⚡ High Overhead**: Frequent context switching

#### **4. Priority Scheduling**
- **Principle**: Higher priority processes execute first
- **Queue Type**: Priority queue (min/max heap)
- **Best for**: Real-time systems with deadlines
- **⚠️ Aging**: Required to prevent starvation

#### **5. Round Robin**
- **Principle**: Equal time slices for all processes
- **Queue Type**: Circular queue with time quantum
- **Best for**: Time-sharing systems
- **⚙️ Tunable**: Time quantum affects performance

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
3. **Performance Metrics**: Detailed analysis table
4. **Comparison**: Compare different algorithms

## 📊 Performance Metrics

| Metric | Formula | Significance |
|--------|---------|--------------|
| **Waiting Time** | `Turnaround Time - Burst Time` | Time spent in ready queue |
| **Turnaround Time** | `Completion Time - Arrival Time` | Total time from arrival to completion |
| **Response Time** | `First Response - Arrival Time` | Time until first CPU allocation |
| **CPU Utilization** | `Busy Time / Total Time` | Efficiency of CPU usage |
| **Throughput** | `Processes Completed / Time Unit` | System productivity |

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
- **Side-by-side Analysis**: Compare multiple algorithms
- **Performance Tables**: Detailed metric breakdowns
- **Visual Insights**: Color-coded Gantt charts
- **Export Options**: Save results for further analysis

### **🎯 Educational Value**
- **Interactive Learning**: Hands-on exploration of concepts
- **Visual Understanding**: See abstract concepts in action
- **Experimentation**: Try different scenarios and parameters
- **Performance Analysis**: Understand trade-offs between algorithms

<div align="center">

**🎓 Made with ❤️ for Students and Educators**

**⭐ If this project helped you learn, give it a star!**

</div>
