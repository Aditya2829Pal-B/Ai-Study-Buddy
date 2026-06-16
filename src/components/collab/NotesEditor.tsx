import React, { memo, useEffect, useRef, useState } from 'react';
import { BookOpen, Bold, Italic, Heading1, Heading2, List, ListOrdered, Code, Highlighter, FileUp, Loader2, PlayCircle, StopCircle } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';

interface NotesEditorProps {
  text: string;
  handleTextChange: (val: string) => void;
  isFullscreenCanvas: boolean;
}

export const NotesEditor = memo(function NotesEditor({ text, handleTextChange, isFullscreenCanvas }: NotesEditorProps) {
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Highlight,
    ],
    content: text,
    onUpdate: ({ editor }) => {
      handleTextChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert prose-sm max-w-none focus:outline-none flex-1 overflow-y-auto hide-scrollbar min-h-full font-serif text-slate-300 leading-relaxed',
      },
    },
  });

  useEffect(() => {
    if (editor && text !== editor.getHTML() && !editor.isFocused) {
      editor.commands.setContent(text);
    }
  }, [text, editor]);

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Only PDF files are supported");
      return;
    }

    setIsUploadingPdf(true);
    try {
      const formData = new FormData();
      formData.append("pdf", file);

      const res = await fetch("/api/upload-pdf", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      
      // Append summary at the end of the current content
      if (editor) {
        editor.commands.focus('end');
        editor.commands.insertContent('<br/><br/><h2>PDF Summary</h2>' + data.summary.replace(/\n/g, '<br/>'));
      }
    } catch (e) {
      console.error(e);
      alert("Failed to process PDF.");
    } finally {
      setIsUploadingPdf(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const toggleAudioSummary = () => {
    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    if (!editor) return;
    const plainText = editor.getText();
    if (!plainText.trim()) return;

    const utterance = new SpeechSynthesisUtterance(plainText);
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);
    
    setIsPlayingAudio(true);
    window.speechSynthesis.speak(utterance);
  };

  // Cleanup speech synthesis on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  return (
    <div className={cn("w-full h-full bg-[#0A0A0A] border border-white/10 rounded-[2rem] p-6 flex flex-col shadow-2xl relative transition-all duration-500", isFullscreenCanvas ? "hidden" : "")}>
       <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 rounded-xl">
              <BookOpen className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Co-Write</h2>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Live Document</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
             <button onClick={toggleAudioSummary} title={isPlayingAudio ? "Stop Reading" : "Read Aloud"} className={cn("flex items-center justify-center p-1.5 rounded-full transition", isPlayingAudio ? "bg-rose-500/10 text-rose-400 hover:bg-rose-500/20" : "bg-blue-500/10 text-blue-400 hover:bg-blue-500/20")}>
               {isPlayingAudio ? <StopCircle className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
             </button>
             <input type="file" ref={fileInputRef} accept=".pdf" className="hidden" onChange={handlePdfUpload} />
             <button title="Upload PDF to summarized notes" disabled={isUploadingPdf} onClick={() => fileInputRef.current?.click()} className="flex items-center justify-center p-1.5 rounded-full bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition disabled:opacity-50">
               {isUploadingPdf ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileUp className="w-4 h-4" />}
             </button>
             <span className="flex items-center justify-center p-1.5 rounded-full bg-emerald-400/10" title="Live sync active">
               <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
             </span>
          </div>
       </div>

       {editor && (
         <div className="flex flex-wrap gap-1.5 mb-3 p-1.5 bg-[#111] border border-white/5 rounded-xl shrink-0">
           <button onClick={() => editor.chain().focus().toggleBold().run()} className={cn("p-1.5 rounded-lg transition-colors", editor.isActive('bold') ? "bg-white/10 text-white" : "text-slate-400 hover:text-white")}>
             <Bold className="w-3.5 h-3.5" />
           </button>
           <button onClick={() => editor.chain().focus().toggleItalic().run()} className={cn("p-1.5 rounded-lg transition-colors", editor.isActive('italic') ? "bg-white/10 text-white" : "text-slate-400 hover:text-white")}>
             <Italic className="w-3.5 h-3.5" />
           </button>
           <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={cn("p-1.5 rounded-lg transition-colors", editor.isActive('heading', { level: 1 }) ? "bg-white/10 text-white" : "text-slate-400 hover:text-white")}>
             <Heading1 className="w-3.5 h-3.5" />
           </button>
           <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={cn("p-1.5 rounded-lg transition-colors", editor.isActive('heading', { level: 2 }) ? "bg-white/10 text-white" : "text-slate-400 hover:text-white")}>
             <Heading2 className="w-3.5 h-3.5" />
           </button>
           <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={cn("p-1.5 rounded-lg transition-colors", editor.isActive('bulletList') ? "bg-white/10 text-white" : "text-slate-400 hover:text-white")}>
             <List className="w-3.5 h-3.5" />
           </button>
           <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={cn("p-1.5 rounded-lg transition-colors", editor.isActive('orderedList') ? "bg-white/10 text-white" : "text-slate-400 hover:text-white")}>
             <ListOrdered className="w-3.5 h-3.5" />
           </button>
           <button onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={cn("p-1.5 rounded-lg transition-colors", editor.isActive('codeBlock') ? "bg-white/10 text-white" : "text-slate-400 hover:text-white")}>
             <Code className="w-3.5 h-3.5" />
           </button>
           <button onClick={() => editor.chain().focus().toggleHighlight().run()} className={cn("p-1.5 rounded-lg transition-colors", editor.isActive('highlight') ? "bg-yellow-500/20 text-yellow-300" : "text-slate-400 hover:text-yellow-300")}>
             <Highlighter className="w-3.5 h-3.5" />
           </button>
         </div>
       )}
       
       <EditorContent editor={editor} className="flex-1 overflow-hidden flex flex-col" />
       
    </div>
  );
});
