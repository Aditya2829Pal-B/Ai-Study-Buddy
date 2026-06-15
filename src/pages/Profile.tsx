import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/useAuthStore';
import { useMaterialStore } from '../stores/useMaterialStore';
import { LogIn, Loader2, Trash2, FileUp, Download } from 'lucide-react';
import { cn } from '../lib/utils';
import { toast } from 'sonner';

export function Profile() {
  const { user, setAuthModalOpen } = useAuthStore();
  
  const [materials, setMaterials] = useState<any[]>([]);
  const [uploads, setUploads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (!user) return;
    
    Promise.all([
      fetch('/api/profile/materials').then(res => res.json()),
      fetch('/api/profile/uploads').then(res => res.json())
    ]).then(([mats, ups]) => {
      if (Array.isArray(mats)) setMaterials(mats);
      if (Array.isArray(ups)) setUploads(ups);
    }).finally(() => setIsLoading(false));
  }, [user]);

  const handleDeleteMaterial = async (id: string) => {
    try {
      const res = await fetch(`/api/profile/materials/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMaterials(materials.filter(m => m.id !== id));
        toast.success("Material deleted");
      }
    } catch {
      toast.error("Failed to delete material");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, uploadType: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_type", uploadType);

      const res = await fetch("/api/profile/uploads", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      
      const newUps = await fetch('/api/profile/uploads').then(r => r.json());
      setUploads(newUps);
      toast.success("File uploaded successfully");
    } catch {
      toast.error("Failed to upload file");
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleDownload = async (id: string, filename: string) => {
    try {
      const res = await fetch(`/api/profile/uploads/${id}`);
      const data = await res.json();
      if (data.data) {
        const link = document.createElement("a");
        link.href = data.data;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch {
      toast.error("Failed to download file");
    }
  };

  if (!user) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center space-y-6">
        <div className="w-20 h-20 bg-indigo-500/10 rounded-3xl flex items-center justify-center">
          <LogIn className="w-10 h-10 text-indigo-400" />
        </div>
        <div className="max-w-md space-y-2">
          <h2 className="text-3xl font-bold text-white tracking-tight">Access Your Profile</h2>
          <p className="text-slate-400 leading-relaxed">Please log in to view your saved study materials, uploads, and account details.</p>
        </div>
        <button 
          onClick={() => setAuthModalOpen(true)}
          className="px-8 py-3 bg-white text-black font-semibold rounded-full hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]"
        >
          Sign In / Create Account
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-12 space-y-12 animate-in fade-in duration-700">
      <div className="flex items-center gap-6">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 border border-white/10 flex items-center justify-center overflow-hidden shadow-2xl">
          <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.email)}&background=random&color=fff&size=96`} alt="Profile" className="w-full h-full object-cover" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tight mb-2">{user.name || 'Student'}</h1>
          <p className="text-slate-400 font-medium">{user.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Saved Materials */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white tracking-tight">Saved Materials</h2>
            <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full uppercase tracking-widest">{materials.length} Items</span>
          </div>
          
          <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-6 shadow-xl min-h-[300px] flex flex-col">
            {isLoading ? (
              <div className="flex-1 flex items-center justify-center"><Loader2 className="w-6 h-6 text-indigo-500 animate-spin" /></div>
            ) : materials.length > 0 ? (
              <div className="space-y-4">
                {materials.map(mat => (
                  <div key={mat.id} className="group bg-white/[0.02] border border-white/5 p-4 rounded-2xl flex items-center justify-between hover:bg-white/[0.04] transition-colors cursor-pointer" onClick={() => {
                    useMaterialStore.getState().setResult({
                      roadmap: mat.roadmap,
                      flashcards: mat.flashcards,
                      practiceQuestions: mat.practiceQuestions,
                      sources: mat.sources
                    });
                    useMaterialStore.getState().setTopic(mat.topic);
                    window.location.href = '/app';
                  }}>
                    <div>
                      <h3 className="text-white font-medium mb-1 group-hover:text-indigo-400 transition-colors">{mat.topic}</h3>
                      <p className="text-xs text-slate-500">{new Date(mat.createdAt).toLocaleDateString()}</p>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); handleDeleteMaterial(mat.id); }} className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors opacity-0 group-hover:opacity-100">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
                <p>No saved materials yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Uploads */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white tracking-tight">Uploads</h2>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full uppercase tracking-widest">{uploads.length} Files</span>
          </div>

          <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-6 shadow-xl min-h-[300px] flex flex-col space-y-6">
            <div className="flex gap-4">
              <label className="flex-1 cursor-pointer group">
                <input type="file" className="hidden" accept=".pdf,.doc,.docx,.txt" onChange={(e) => handleFileUpload(e, 'syllabus')} />
                <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 group-hover:bg-indigo-500/20 hover:border-indigo-500/30 transition-all text-indigo-400 text-center">
                  {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileUp className="w-5 h-5" />}
                  <span className="text-sm font-medium">Upload Syllabus</span>
                </div>
              </label>
              <label className="flex-1 cursor-pointer group">
                <input type="file" className="hidden" accept=".pdf,.doc,.docx,.txt" onChange={(e) => handleFileUpload(e, 'paper')} />
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 group-hover:bg-purple-500/20 hover:border-purple-500/30 transition-all text-purple-400 text-center">
                  {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileUp className="w-5 h-5" />}
                  <span className="text-sm font-medium">Upload Papers</span>
                </div>
              </label>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-3">
              {isLoading ? (
                <div className="flex h-full items-center justify-center"><Loader2 className="w-6 h-6 text-indigo-500 animate-spin" /></div>
              ) : uploads.length > 0 ? (
                uploads.map(file => (
                  <div key={file.id} className="bg-white/[0.02] border border-white/5 p-4 rounded-xl flex flex-col gap-3">
                     <div className="flex items-center justify-between">
                       <span className={cn("text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full", file.upload_type === 'syllabus' ? "bg-indigo-500/20 text-indigo-300" : "bg-purple-500/20 text-purple-300")}>
                         {file.upload_type}
                       </span>
                       <span className="text-xs text-slate-500">{new Date(file.created_at).toLocaleDateString()}</span>
                     </div>
                     <div className="flex items-center justify-between">
                       <p className="text-sm text-slate-300 truncate max-w-[200px]" title={file.filename}>{file.filename}</p>
                       <button onClick={() => handleDownload(file.id, file.filename)} className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                         <Download className="w-4 h-4" />
                       </button>
                     </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 mt-4">
                  <p>No uploaded files.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
