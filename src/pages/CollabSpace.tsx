import React, { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '../lib/utils';
import { useAuthStore } from '../stores/useAuthStore';
import { ChatPanel } from '../components/collab/ChatPanel';
import { SessionHeader } from '../components/collab/SessionHeader';
import { NotesEditor } from '../components/collab/NotesEditor';
import { Whiteboard } from '../components/collab/Whiteboard';
import { DrawLine } from '../components/collab/types';
import { useCollabSocket } from '../hooks/useCollabSocket';
import { useRoomStore } from '../stores/collab/useRoomStore';
import { useChatStore } from '../stores/collab/useChatStore';
import { useWhiteboardStore } from '../stores/collab/useWhiteboardStore';
import { useVoiceStore } from '../stores/collab/useVoiceStore';

export function CollabSpace() {
  const { user } = useAuthStore();
  
  // A fixed room for now
  const roomId = 'global-collab-room';

  const {
    socket,
    startVoice,
    stopVoice
  } = useCollabSocket(roomId, user);

  // Notes Store
  const text = useRoomStore(state => state.text);
  const setText = useRoomStore(state => state.setText);

  // Whiteboard Store
  const lines = useWhiteboardStore(state => state.lines);
  const setLines = useWhiteboardStore(state => state.setLines);
  const tool = useWhiteboardStore(state => state.tool);
  const setTool = useWhiteboardStore(state => state.setTool);
  const color = useWhiteboardStore(state => state.color);
  const setColor = useWhiteboardStore(state => state.setColor);

  // Chat Store
  const chatMessages = useChatStore(state => state.messages);
  const addChatMessage = useChatStore(state => state.addMessage);

  // Voice Store
  const isVoiceActive = useVoiceStore(state => state.isVoiceActive);

  // Canvas Tools State
  const isDrawing = useRef(false);
  const stageRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Layout State
  const [isFullscreenCanvas, setIsFullscreenCanvas] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Invite State
  const [inviteSent, setInviteSent] = useState(false);

  // Chat State
  const [chatInput, setChatInput] = useState('');

  const handleSendMessage = useCallback((e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim()) return;

    const newMsg = {
      id: Date.now().toString(),
      sender: user?.name || 'You',
      text: chatInput,
      time: new Date()
    };
    
    addChatMessage(newMsg);
    setChatInput('');
    socket?.emit('chat-message', { roomId, message: newMsg });
  }, [chatInput, user, addChatMessage, socket, roomId]);

  const handleSendInvite = useCallback(() => {
    navigator.clipboard.writeText(`https://aistudybuddy.app/collab/${roomId}`);
    setInviteSent(true);
    setTimeout(() => {
      setInviteSent(false);
    }, 3000);
  }, [roomId]);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });
    observer.observe(containerRef.current);
    
    return () => observer.disconnect();
  }, []);

  const handleTextChange = useCallback((val: string) => {
    setText(val);
    socket?.emit('update-text', { roomId, text: val });
  }, [setText, socket, roomId]);

  const handleMouseDown = useCallback((e: any) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    const newLine: DrawLine = { tool, color, width: tool === 'eraser' ? 20 : 5, points: [pos.x, pos.y] };
    setLines([...lines, newLine]);
  }, [tool, color, lines, setLines]);

  const handleMouseMove = useCallback((e: any) => {
    if (!isDrawing.current) return;
    
    // Throttle / Idempotency - get active stage
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    
    // Modify last line locally
    setLines((prevLines) => {
      if (prevLines.length === 0) return prevLines;
      const lastLine = prevLines[prevLines.length - 1];
      const updatedLines = [...prevLines];
      updatedLines[updatedLines.length - 1] = {
        ...lastLine,
        points: lastLine?.points?.concat([point.x, point.y]) || [point.x, point.y],
      };
      return updatedLines;
    });
  }, [setLines]);

  const handleMouseUp = useCallback(() => {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    // Emit final line
    setLines((prevLines) => {
      if (prevLines.length > 0) {
        const lastLine = prevLines[prevLines.length - 1];
        if (lastLine && lastLine.points) {
          socket?.emit('draw-line', { roomId, line: lastLine });
        }
      }
      return prevLines;
    });
  }, [socket, roomId, setLines]);

  const clearCanvas = useCallback(() => {
    socket?.emit('clear-canvas', { roomId });
  }, [socket, roomId]);

  const downloadCanvas = useCallback(() => {
    const dataURL = stageRef.current.toDataURL({ pixelRatio: 2 });
    const link = document.createElement('a');
    link.download = 'collab-sketch.png';
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  return (
    <div className={cn("min-h-screen px-6 pb-12 flex flex-col items-center bg-[#050505] transition-all duration-500", isFullscreenCanvas ? "pt-8" : "pt-8")}>
      
      {/* Header Area - Clean Flex Layout */}
      <SessionHeader
        isFullscreenCanvas={isFullscreenCanvas}
        startVoice={startVoice}
        stopVoice={stopVoice}
        inviteSent={inviteSent}
        handleSendInvite={handleSendInvite}
      />

      <div className="w-full max-w-[1600px] mx-auto space-y-8 relative">
        {/* Mobile Title View */}
        <div className={cn("text-center space-y-2 mb-8 md:hidden transition-all duration-500", isFullscreenCanvas && "hidden")}>
          <h1 className="text-4xl font-black tracking-tighter leading-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-indigo-500 to-emerald-500 animate-text-move bg-[length:200%_auto]">
            Collab Space
          </h1>
          <p className="text-slate-400 text-sm font-medium mx-auto">
             Co-write & sketch in real-time.
          </p>
        </div>

        <div className={cn("flex flex-col xl:flex-row gap-6 items-start w-full", isFullscreenCanvas && "xl:flex-col")}>
          
          {/* Text Editor (Novel / Blog Diary) */}
          <NotesEditor 
            text={text} 
            handleTextChange={handleTextChange} 
            isFullscreenCanvas={isFullscreenCanvas} 
          />

          {/* Sketch Board */}
          <Whiteboard
            lines={lines}
            tool={tool}
            setTool={setTool}
            color={color}
            setColor={setColor}
            clearCanvas={clearCanvas}
            downloadCanvas={downloadCanvas}
            isFullscreenCanvas={isFullscreenCanvas}
            setIsFullscreenCanvas={setIsFullscreenCanvas}
            containerRef={containerRef}
            stageRef={stageRef}
            dimensions={dimensions}
            handleMouseDown={handleMouseDown}
            handleMouseMove={handleMouseMove}
            handleMouseUp={handleMouseUp}
          />

          {/* Live Chat Sidebar */}
          <ChatPanel 
            chatMessages={chatMessages} 
            chatInput={chatInput} 
            setChatInput={setChatInput} 
            handleSendMessage={handleSendMessage} 
            isFullscreenCanvas={isFullscreenCanvas} 
          />
        </div>
      </div>
    </div>
  );
}
