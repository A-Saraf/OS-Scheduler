import { Process } from '@/types/scheduler';

// Parse CSV data
export const parseCSVData = (text: string): Array<Record<string, string>> => {
  const lines = text.trim().split('\n');
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  const data: Array<Record<string, string>> = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    if (values.length !== headers.length) continue;

    const row: Record<string, string> = {};
    headers.forEach((header, index) => {
      row[header] = values[index];
    });
    data.push(row);
  }

  return data;
};

// Process uploaded data into processes
export const processUploadedData = (
  data: Array<Record<string, string>>,
  existingProcesses: Process[]
): { processes: Process[]; successCount: number; errors: string[] } => {
  const processes: Process[] = [];
  const errors: string[] = [];
  let successCount = 0;

  data.forEach((row, index) => {
    const normalizedRow: Record<string, string> = {};
    Object.keys(row).forEach(key => {
      normalizedRow[key.toLowerCase().trim()] = row[key];
    });

    let processId: string | null = null;
    let arrival: number | null = null;
    let burst: number | null = null;
    let priority = 1;

    // Find Process ID
    if (normalizedRow.id) processId = normalizedRow.id;
    else if (normalizedRow.process) processId = normalizedRow.process;
    else if (normalizedRow.processid) processId = normalizedRow.processid;
    else if (normalizedRow.pid) processId = normalizedRow.pid;

    // Find Arrival Time
    if (normalizedRow.arrivaltime !== undefined) arrival = parseFloat(normalizedRow.arrivaltime);
    else if (normalizedRow.arrival !== undefined) arrival = parseFloat(normalizedRow.arrival);
    else if (normalizedRow.at !== undefined) arrival = parseFloat(normalizedRow.at);

    // Find Burst Time
    if (normalizedRow.bursttime !== undefined) burst = parseFloat(normalizedRow.bursttime);
    else if (normalizedRow.burst !== undefined) burst = parseFloat(normalizedRow.burst);
    else if (normalizedRow.bt !== undefined) burst = parseFloat(normalizedRow.bt);

    // Find Priority
    if (normalizedRow.priority !== undefined) priority = parseInt(normalizedRow.priority) || 1;
    else if (normalizedRow.p !== undefined) priority = parseInt(normalizedRow.p) || 1;

    // Validation
    if (!processId) {
      errors.push(`Row ${index + 2}: Missing process ID`);
      return;
    }

    if (existingProcesses.some(p => p.id === processId) || processes.some(p => p.id === processId)) {
      errors.push(`Row ${index + 2}: Process ${processId} already exists`);
      return;
    }

    if (arrival === null || isNaN(arrival) || arrival < 0) {
      errors.push(`Row ${index + 2}: Invalid arrival time for ${processId}`);
      return;
    }

    if (burst === null || isNaN(burst) || burst <= 0) {
      errors.push(`Row ${index + 2}: Invalid burst time for ${processId}`);
      return;
    }

    processes.push({
      id: processId,
      arrival: arrival,
      burst: Math.floor(burst),
      priority: priority,
    });

    successCount++;
  });

  return { processes, successCount, errors };
};

// Generate sample CSV template
export const generateSampleCSV = (): string => {
  return `id,arrival,burst,priority
P1,0,5,2
P2,1,3,1
P3,2,8,3
P4,3,6,2
P5,4,4,1`;
};

// Download file helper
export const downloadFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
