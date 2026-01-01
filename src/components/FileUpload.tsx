import React, { useState, useRef, useCallback } from 'react';
import { Process } from '@/types/scheduler';
import { parseCSVData, processUploadedData, generateSampleCSV, downloadFile } from '@/utils/fileParser';
import { toast } from 'sonner';
import { Upload, Download, FileSpreadsheet } from 'lucide-react';

interface FileUploadProps {
  existingProcesses: Process[];
  onProcessesImported: (processes: Process[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ existingProcesses, onProcessesImported }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    const fileName = file.name.toLowerCase();
    
    if (!fileName.endsWith('.csv')) {
      toast.error('Please upload a CSV file (.csv)');
      return;
    }

    try {
      const text = await file.text();
      const data = parseCSVData(text);
      
      if (data.length === 0) {
        toast.error('No data found in the file');
        return;
      }

      const { processes, successCount, errors } = processUploadedData(data, existingProcesses);

      if (successCount > 0) {
        onProcessesImported(processes);
        toast.success(`Successfully imported ${successCount} process(es)`, {
          description: errors.length > 0 ? `${errors.length} error(s) found` : undefined,
        });
      } else {
        toast.error('No processes imported', {
          description: errors.slice(0, 3).join('\n'),
        });
      }
    } catch (error) {
      toast.error('Error reading file');
      console.error(error);
    }
  }, [existingProcesses, onProcessesImported]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
      e.target.value = '';
    }
  }, [handleFile]);

  const handleDownloadTemplate = () => {
    const csv = generateSampleCSV();
    downloadFile(csv, 'cpu_scheduler_template.csv', 'text/csv;charset=utf-8;');
    toast.success('Template downloaded');
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`upload-dropzone ${isDragOver ? 'dragover' : ''}`}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
      >
        <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
        <p className="text-foreground font-semibold text-sm mb-1">
          Click to upload or drag & drop
        </p>
        <p className="text-muted-foreground text-xs">
          Supports CSV files (.csv)
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={handleFileInput}
        />
      </div>

      {/* Download Template */}
      <button
        onClick={handleDownloadTemplate}
        className="btn-secondary w-full flex items-center justify-center gap-2"
      >
        <Download size={16} />
        Download Sample Template
      </button>

      {/* Format Info */}
      <div className="rounded-xl p-3 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)]">
        <p className="text-foreground font-semibold text-xs mb-2 flex items-center gap-2">
          <FileSpreadsheet size={14} />
          Expected Format:
        </p>
        <div className="rounded-lg p-2 bg-[rgba(0,0,0,0.3)] font-mono text-xs space-y-1">
          <code className="block text-[hsl(168,76%,52%)]">Process, ArrivalTime, BurstTime, Priority</code>
          <code className="block text-[hsl(168,76%,52%)]">P1, 0, 5, 2</code>
          <code className="block text-[hsl(168,76%,52%)]">P2, 1, 3, 1</code>
        </div>
        <p className="text-muted-foreground text-xs italic mt-2">
          * Priority column is optional (only for Priority Scheduling)
        </p>
      </div>
    </div>
  );
};

export default FileUpload;
