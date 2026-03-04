import React, { useState, useRef } from 'react';
import { Sparkles, Image as ImageIcon, Send, Upload, Video, Wand2 } from 'lucide-react';

interface NewsFormProps {
  onAiGenerate: (prompt: string) => void;
  onGenerateAIImage: (prompt?: string) => void;
  onUpdate: (data: any) => void;
  isGenerating: boolean;
  isGeneratingImage: boolean;
  currentData: any;
}

export const NewsForm: React.FC<NewsFormProps> = ({ 
  onAiGenerate, 
  onGenerateAIImage, 
  onUpdate, 
  isGenerating, 
  isGeneratingImage,
  currentData 
}) => {
  const [prompt, setPrompt] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Revoke previous object URL if it exists to prevent memory leaks
      if (currentData.mediaUrl.startsWith('blob:')) {
        URL.revokeObjectURL(currentData.mediaUrl);
      }
      
      const url = URL.createObjectURL(file);
      const type = file.type.startsWith('video') ? 'video' : 'image';
      onUpdate({ mediaUrl: url, mediaType: type });
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (currentData.logoUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(currentData.logoUrl);
      }
      const url = URL.createObjectURL(file);
      onUpdate({ logoUrl: url });
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Assistant */}
      <div className="bg-slate-900 rounded-2xl p-6 shadow-xl border border-white/5">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="text-red-500" size={18} />
          <h3 className="text-white font-bold text-sm uppercase tracking-widest">AI News Stylist</h3>
        </div>
        <div className="relative">
          <textarea 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Paste raw news text here..."
            className="w-full bg-slate-800 border border-white/10 rounded-xl p-4 text-white text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all h-32 resize-none"
          />
          <button 
            onClick={() => onAiGenerate(prompt)}
            disabled={isGenerating || !prompt}
            className="absolute bottom-4 right-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {isGenerating ? 'Styling...' : <><Send size={14} /> Automate</>}
          </button>
        </div>
      </div>

      {/* Manual Controls */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
        <h3 className="text-slate-900 font-bold text-sm uppercase tracking-widest mb-2">Manual Controls</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">News Type</label>
            <input 
              type="text" 
              value={currentData.newsType}
              onChange={(e) => onUpdate({ newsType: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-red-500 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Theme Color</label>
            <div className="flex gap-2">
              <input 
                type="color" 
                value={currentData.themeColor}
                onChange={(e) => onUpdate({ themeColor: e.target.value })}
                className="h-11 w-11 bg-slate-50 border border-slate-200 rounded-xl p-1 cursor-pointer"
              />
              <input 
                type="text" 
                value={currentData.themeColor}
                onChange={(e) => onUpdate({ themeColor: e.target.value })}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-red-500 outline-none transition-all font-mono"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Headline</label>
          <input 
            type="text" 
            value={currentData.headline}
            onChange={(e) => onUpdate({ headline: e.target.value })}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-red-500 outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Background Media</label>
          <div className="space-y-3">
            {/* Media Options */}
            <div className="flex gap-2">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl border border-slate-200 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest transition-all"
              >
                <Upload size={16} /> Upload File
              </button>
              <button 
                onClick={() => onGenerateAIImage()}
                disabled={isGeneratingImage || !currentData.headline}
                className="flex-1 py-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest transition-all bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200 disabled:opacity-50"
              >
                <Wand2 size={16} /> {isGeneratingImage ? 'Generating...' : 'AI Image'}
              </button>
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*,video/*"
                className="hidden"
              />
            </div>


            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 flex items-center gap-1">
                {currentData.mediaType === 'video' ? <Video size={16} /> : <ImageIcon size={16} />}
              </div>
              <input 
                type="text" 
                value={currentData.mediaUrl}
                onChange={(e) => onUpdate({ mediaUrl: e.target.value, mediaType: e.target.value.includes('video') || e.target.value.endsWith('.mp4') ? 'video' : 'image' })}
                placeholder="Or paste media URL..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 text-sm focus:ring-2 focus:ring-red-500 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Branding</label>
          <div className="space-y-3">
            <div className="flex gap-2">
              <button 
                onClick={() => logoInputRef.current?.click()}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl border border-slate-200 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest transition-all"
              >
                <Upload size={16} /> Upload Logo
              </button>
              <input 
                type="file" 
                ref={logoInputRef}
                onChange={handleLogoChange}
                accept="image/*"
                className="hidden"
              />
              {currentData.logoUrl && (
                <button 
                  onClick={() => onUpdate({ logoUrl: '' })}
                  className="bg-red-50 text-red-600 px-4 rounded-xl border border-red-100 text-[10px] font-black uppercase tracking-widest"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Date</label>
          <input 
            type="text" 
            value={currentData.date}
            onChange={(e) => onUpdate({ date: e.target.value })}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-red-500 outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 flex justify-between">
            <span>Details Font Size</span>
            <span className="text-red-600">{currentData.detailsFontSize}px</span>
          </label>
          <input 
            type="range" 
            min="8" 
            max="32" 
            step="1"
            value={currentData.detailsFontSize || 16}
            onChange={(e) => onUpdate({ detailsFontSize: parseInt(e.target.value) })}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-600"
          />
        </div>

        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Detailed Content</label>
          <textarea 
            value={currentData.details}
            onChange={(e) => onUpdate({ details: e.target.value })}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-red-500 outline-none transition-all h-40 resize-none"
          />
        </div>
      </div>
    </div>
  );
};
