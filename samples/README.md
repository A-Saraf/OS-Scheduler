# Sample CSV Files for CPU Scheduling Analysis

This directory contains 5 sample CSV files designed to produce different results in the analyze comparison feature. Each file showcases specific scheduling scenarios and algorithm behaviors.

## Files Description

### 1. short_processes.csv
**Scenario**: Small burst times with quick arrivals
**Characteristics**:
- Very short burst times (1-3 units)
- Close arrival times (0-4 units)
- Mixed priorities

**Expected Results**:
- SJF and SRTF will perform excellently (short jobs first)
- Round Robin will show good balance
- FCFS will have moderate performance
- Priority will be influenced by priority levels

### 2. long_processes.csv
**Scenario**: Long burst times with overlapping arrivals
**Characteristics**:
- Long burst times (6-15 units)
- Overlapping arrival times (0-8 units)
- Moderate priority variation

**Expected Results**:
- SRTF will excel (preemptive shortest remaining)
- SJF will perform well
- FCFS will show convoy effect
- Round Robin will provide fairness but longer waiting times

### 3. mixed_arrival_times.csv
**Scenario**: Gaps between process arrivals
**Characteristics**:
- Significant gaps between arrivals (0, 10, 15, 20, 25)
- Variable burst times (2-8 units)
- Different priority levels

**Expected Results**:
- All algorithms will have idle periods
- Priority will show clear advantage for high-priority early arrivals
- FCFS will have minimal waiting due to gaps
- Round Robin will show context switching overhead

### 4. priority_varied.csv
**Scenario**: Same burst times, different priorities
**Characteristics**:
- Identical burst times (5 units each)
- Sequential arrivals (0-4 units)
- Clear priority hierarchy (1-5)

**Expected Results**:
- Priority scheduling will clearly outperform others
- FCFS and SJF will have identical results
- SRTF will match SJF (no preemptive advantage)
- Round Robin will show fair but slower completion

### 5. extreme_cases.csv
**Scenario**: Extreme variations in burst times and priorities
**Characteristics**:
- Very wide range of burst times (1-25 units)
- Mixed arrival patterns
- Inverse priority relationships (short job has low priority)

**Expected Results**:
- SJF and SRTF will dramatically outperform others
- Priority will show poor performance (short job has low priority)
- FCFS will suffer from convoy effect
- Round Robin will provide fairness but high waiting times

## How to Use

1. Load any CSV file using the "Upload CSV" button
2. Run the scheduler with your preferred algorithm
3. Click "Analyze Comparison" to see how different algorithms perform
4. Compare results across different CSV files to understand algorithm behaviors

## Learning Objectives

These sample files help demonstrate:
- **Convoy Effect**: How FCFS suffers with long processes blocking short ones
- **Preemptive Advantage**: When SRTF outperforms SJF
- **Priority Impact**: How priority scheduling affects waiting times
- **Fairness vs Efficiency**: Round Robin's trade-offs
- **Arrival Pattern Impact**: How process arrival timing affects performance

## Algorithm Complexity Insights

Each file highlights different aspects of the theoretical vs practical complexity:
- **Short processes**: Shows how O(n log n) algorithms excel with small jobs
- **Long processes**: Demonstrates the impact of theoretical complexity on large jobs
- **Mixed arrivals**: Reveals how arrival patterns affect algorithm efficiency
- **Priority varied**: Shows when priority scheduling is most beneficial
- **Extreme cases**: Illustrates worst-case scenarios for different algorithms
