import React, { memo } from 'react';
import { Stage, Layer, Line } from 'react-konva';
import { PenTool, Eraser, Download, Trash2, Expand, Shrink } from 'lucide-react';
import { cn } from '../../lib/utils';
import { DrawLine } from './types';

interface WhiteboardProps {
  lines: DrawLine[];
  tool: 'pen' | 'eraser';
  setTool: (t: 'pen' | 'eraser') => void;
  color: string;
  setColor: (c: string) => void;
  clearCanvas: () => void;
  downloadCanvas: () => void;
  isFullscreenCanvas: boolean;
  setIsFullscreenCanvas: (v: boolean) => void;
  containerRef: React.RefObject<HTMLDivElement>;
  stageRef: React.RefObject<any>;
  dimensions: { width: number; height: number };
  handleMouseDown: (e: any) => void;
  handleMouseMove: (e: any) => void;
  handleMouseUp: () => void;
}

export const Whiteboard = memo(function Whiteboard({
  lines,
  tool,
  setTool,
  color,
  setColor,
  clearCanvas,
  downloadCanvas,
  isFullscreenCanvas,
  setIsFullscreenCanvas,
  containerRef,
  stageRef,
  dimensions,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp
}: WhiteboardProps) {
  return (
    <div className={cn("flex-1 w-full bg-[#0A0A0A] border border-white/10 rounded-[2rem] p-6 flex flex-col shadow-2xl relative transition-all duration-500", isFullscreenCanvas ? "h-[85vh]" : "h-[600px]")}>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-white/5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-pink-500/10 rounded-xl">
              <PenTool className="w-5 h-5 text-pink-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Sketch Board</h2>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Live Canvas</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 bg-[#111] p-1.5 rounded-xl border border-white/5">
            <button onClick={() => setTool('pen')} className={cn("p-1.5 rounded-lg transition-colors border", tool === 'pen' ? "bg-indigo-500/20 border-indigo-500/50 text-indigo-300 shadow-sm" : "bg-transparent border-transparent text-slate-400 hover:text-white")}>
              <PenTool className="w-4 h-4" />
            </button>
            <button onClick={() => setTool('eraser')} className={cn("p-1.5 rounded-lg transition-colors border", tool === 'eraser' ? "bg-pink-500/20 border-pink-500/50 text-pink-300 shadow-sm" : "bg-transparent border-transparent text-slate-400 hover:text-white")}>
              <Eraser className="w-4 h-4" />
            </button>
            
            {/* Colors - Only show if Pen is selected */}
            {tool === 'pen' && (
              <div className="flex items-center gap-1.5 px-2 ml-1 border-l border-white/10">
                 {['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#ffffff'].map(c => (
                   <button 
                     key={c} 
                     onClick={() => setColor(c)} 
                     className={cn("w-4 h-4 rounded-full border-2 transition-transform", color === c ? "border-white scale-125" : "border-transparent opacity-60 hover:opacity-100")}
                     style={{ backgroundColor: c }}
                   />
                 ))}
              </div>
            )}

            <div className="w-px h-5 bg-white/10 mx-1 hidden sm:block" />

            <button onClick={clearCanvas} className="p-1.5 bg-transparent text-rose-400/80 rounded-lg hover:text-rose-400 hover:bg-rose-500/10 transition-colors" title="Clear Canvas">
              <Trash2 className="w-4 h-4" />
            </button>
            <button onClick={downloadCanvas} className="p-1.5 bg-transparent text-emerald-400/80 rounded-lg hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors" title="Download Image">
              <Download className="w-4 h-4" />
            </button>
            <button onClick={() => setIsFullscreenCanvas(!isFullscreenCanvas)} className="p-1.5 bg-transparent text-slate-400 rounded-lg hover:text-white hover:bg-white/5 transition-colors" title="Toggle Fullscreen Canvas">
              {isFullscreenCanvas ? <Shrink className="w-4 h-4" /> : <Expand className="w-4 h-4" />}
            </button>
          </div>
      </div>
      
      <div className="flex-1 w-full relative bg-[#050505] rounded-xl overflow-hidden cursor-crosshair border border-white/5" ref={containerRef}>
        <div className="absolute inset-0">
          <Stage
             width={dimensions.width}
             height={dimensions.height}
             onMouseDown={handleMouseDown}
             onMousemove={handleMouseMove}
             onMouseup={handleMouseUp}
             onMouseLeave={handleMouseUp}
             onTouchStart={handleMouseDown}
             onTouchMove={handleMouseMove}
             onTouchEnd={handleMouseUp}
             ref={stageRef}
          >
            <Layer>
              {lines.map((line, i) => (
                <Line
                  key={i}
                  points={line.points}
                  stroke={line.color}
                  strokeWidth={line.width}
                  tension={0.5}
                  lineCap="round"
                  lineJoin="round"
                  globalCompositeOperation={
                    line.tool === 'eraser' ? 'destination-out' : 'source-over'
                  }
                />
              ))}
            </Layer>
          </Stage>
        </div>
      </div>
    </div>
  );
});
