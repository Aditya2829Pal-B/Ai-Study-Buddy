import React, { useCallback, useState } from 'react';
import { Upload, X, FileText, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

interface UploadZoneProps {
  label: string;
  files: File[];
  onFilesChange: (files: File[]) => void;
  multiple?: boolean;
  accept?: string;
  id: string;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ 
  label, 
  files, 
  onFilesChange, 
  multiple = false, 
  accept = "image/*,application/pdf",
  id
}) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    
    if (droppedFiles.length > 0) {
      if (multiple) {
        onFilesChange([...files, ...droppedFiles]);
      } else {
        onFilesChange([droppedFiles[0]]);
      }
      triggerSuccess();
    }
  }, [files, multiple, onFilesChange]);

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      if (selectedFiles.length > 0) {
        if (multiple) {
          onFilesChange([...files, ...selectedFiles]);
        } else {
          onFilesChange([selectedFiles[0]]);
        }
        triggerSuccess();
      }
    }
  };

  const triggerSuccess = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 1500);
  };

  const removeFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    onFilesChange(newFiles);
  };

  return (
    <div id={id} className="space-y-3">
      <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-2">
        <span className="text-indigo-400 font-bold">{label.split(' / ')[0]}</span> / {label.split(' / ')[1]}
      </label>
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={cn(
          "relative border border-dashed rounded-2xl p-8 transition-all duration-300 ease-out cursor-pointer overflow-hidden group/zone",
          isDragActive 
            ? "border-purple-500 bg-purple-500/10 shadow-[0_0_40px_-10px_rgba(168,85,247,0.4)] scale-[1.02]" 
            : "border-white/20 bg-white/[0.02] backdrop-blur-xl hover:bg-white/[0.04] hover:border-indigo-400/50 hover:shadow-[0_0_20px_-5px_rgba(99,102,241,0.2)] hover:scale-[1.01]",
          files.length > 0 && !isDragActive && "border-indigo-500/30 bg-indigo-500/5"
        )}
        onClick={() => document.getElementById(`input-${id}`)?.click()}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 opacity-0 group-hover/zone:opacity-100 transition-opacity duration-500" />
        <input
          id={`input-${id}`}
          type="file"
          className="hidden"
          multiple={multiple}
          accept={accept}
          onChange={onFileSelect}
        />
        
        <AnimatePresence>
          {showSuccess && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-emerald-500/10 backdrop-blur-md z-20"
            >
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mb-2 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]" />
              <span className="text-emerald-300 font-bold uppercase tracking-widest text-xs">File Accepted</span>
            </motion.div>
          )}
        </AnimatePresence>

        {files.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 text-slate-400 relative z-10 transition-transform duration-300 group-hover/zone:scale-[1.05]">
            <div className={cn(
              "w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-300",
              isDragActive ? "bg-purple-500/20 border-purple-500 text-purple-400 shadow-[0_0_20px_-5px_rgba(168,85,247,0.5)]" : "bg-white/[0.03] border-white/10 text-indigo-400 group-hover/zone:bg-indigo-500/20 group-hover/zone:border-indigo-500 group-hover/zone:shadow-[0_0_15px_-5px_rgba(99,102,241,0.4)]"
            )}>
              <Upload className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium tracking-tight">
              {isDragActive ? <span className="text-purple-400 font-bold">Drop it here!</span> : "Drop files or click to Browse"}
            </p>
          </div>
        ) : (
          <div className="space-y-3 relative z-10">
            {files.map((file, i) => (
              <div 
                key={i} 
                className="flex items-center justify-between p-3 bg-black/60 rounded-xl border border-white/10 group ring-1 ring-white/0 hover:border-indigo-400/50 hover:bg-black/80 transition-all backdrop-blur-md hover:scale-[1.01]"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <FileText className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span className="text-sm font-medium truncate text-slate-200">{file.name}</span>
                </div>
                <button
                  id={`remove-${id}-${i}`}
                  onClick={() => removeFile(i)}
                  className="p-1 hover:bg-rose-500/20 rounded-full text-slate-500 hover:text-rose-400 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
