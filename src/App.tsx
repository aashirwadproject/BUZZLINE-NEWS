import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { NewsData, NewsSchema } from './types';
import { NewsForm } from './components/NewsForm';
import { NewsPreview } from './components/NewsPreview';
import { TikTokCaption } from './components/TikTokCaption';
import { motion, AnimatePresence } from 'motion/react';
import { Newspaper, Download, Share2, Zap, Info, Sparkles, Plus, Minus, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Image as ImageIcon, Type as TypeIcon } from 'lucide-react';
import { toPng } from 'html-to-image';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export default function App() {
  const [newsData, setNewsData] = useState<NewsData>({
    headline: 'Viral News Headline for Buzzline Media',
    details: 'This is where the detailed news content will go. It is automatically formatted to fit perfectly on a single TikTok slide, ensuring your viewers can read everything clearly while watching your video.',
    mediaUrl: 'https://picsum.photos/seed/viral/1080/1920',
    mediaType: 'image',
    logoUrl: '',
    logoText: 'Buzzline Media Nepal',
    date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    detailsFontSize: 16,
    newsType: 'BREAKING NEWS',
    themeColor: '#ff0000',
  });

  const [activeSlide, setActiveSlide] = useState<'HEADLINE' | 'DETAILS'>('HEADLINE');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleGenerateAIImage = async (customPrompt?: string) => {
    const promptToUse = customPrompt || newsData.headline;
    if (!promptToUse) return;
    
    setIsGeneratingImage(true);
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ 
            text: `Create a professional, high-quality news background image for a viral TikTok news slide. 
            Topic: ${promptToUse}. 
            Context: ${newsData.details.substring(0, 200)}...
            Style: Cinematic, professional news broadcast, dramatic lighting, high resolution, 9:16 aspect ratio. 
            No text in the image. The image should be visually striking and relevant to the news topic.` 
          }],
        },
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          const base64EncodeString = part.inlineData.data;
          const imageUrl = `data:image/png;base64,${base64EncodeString}`;
          setNewsData(prev => ({ ...prev, mediaUrl: imageUrl, mediaType: 'image' }));
          break;
        }
      }
    } catch (error) {
      console.error("AI Image generation failed:", error);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleAiGenerate = async (prompt: string) => {
    if (!prompt) return;
    setIsGenerating(true);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Transform the following raw news information into a viral TikTok news format for "Buzzline Media Nepal". 
        1. The headline should be punchy, attention-grabbing, and in a professional news style.
        2. The details MUST be a comprehensive news report of around 200 words. Use a professional journalistic tone.
        3. Ensure the content is engaging for a TikTok audience while remaining factual.
        
        Raw Info: ${prompt}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: NewsSchema,
        },
      });

      const result = JSON.parse(response.text || '{}');
      const updatedData = {
        ...newsData,
        ...result,
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      };
      
      setNewsData(updatedData);
      
      // Automatically generate a matching AI background image
      if (updatedData.headline) {
        handleGenerateAIImage(updatedData.headline);
      }

      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      console.error("AI Generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = async () => {
    const node = document.getElementById('news-capture-area');
    if (!node) return;
    
    setIsDownloading(true);
    try {
      const dataUrl = await toPng(node, { quality: 0.95, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `buzzline-${activeSlide.toLowerCase()}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const shareToTikTok = async () => {
    const node = document.getElementById('news-capture-area');
    if (!node) return;

    setIsSharing(true);
    try {
      const files: File[] = [];
      const slides: ('HEADLINE' | 'DETAILS')[] = ['HEADLINE', 'DETAILS'];

      for (const slideType of slides) {
        // Switch slide to capture
        setActiveSlide(slideType);
        // Wait for render
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const dataUrl = await toPng(node, { quality: 0.95, pixelRatio: 2 });
        const blob = await (await fetch(dataUrl)).blob();
        files.push(new File([blob], `buzzline-${slideType.toLowerCase()}.png`, { type: 'image/png' }));
      }

      if (navigator.canShare && navigator.canShare({ files })) {
        await navigator.share({
          files,
          title: 'Buzzline News',
          text: `${newsData.headline}\n\nGenerated by Buzzline Media Nepal`,
        });
      } else {
        alert('Your browser does not support direct sharing. Please use the "Save Slide" button instead.');
      }
    } catch (err) {
      console.error('Sharing failed:', err);
      alert('Failed to prepare slides for sharing.');
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-red-600 p-2 rounded-lg">
              <Newspaper className="text-white" size={20} />
            </div>
            <div>
              <h1 className="font-bold text-slate-900 leading-none tracking-tight">Buzzline Media</h1>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">TikTok Automator</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
              <Zap size={14} className="text-amber-500" /> System Online
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Form */}
          <div className="lg:col-span-5 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-2 italic">News Desk</h2>
              <p className="text-slate-500 text-sm mb-8">Create viral TikTok news slides in seconds.</p>
              
              <NewsForm 
                onAiGenerate={handleAiGenerate}
                onGenerateAIImage={handleGenerateAIImage}
                onUpdate={(update) => setNewsData(prev => ({ ...prev, ...update }))}
                isGenerating={isGenerating}
                isGeneratingImage={isGeneratingImage}
                currentData={newsData}
              />
            </section>
          </div>

          {/* Right Column: Preview */}
          <div className="lg:col-span-7">
            <div className="sticky top-28">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <h2 className="text-2xl font-bold text-slate-900 italic">Live Preview</h2>
                  <div className="flex bg-slate-200 p-1 rounded-xl">
                    <button 
                      onClick={() => setActiveSlide('HEADLINE')}
                      className={`px-4 py-1.5 text-[10px] font-black rounded-lg transition-all ${activeSlide === 'HEADLINE' ? 'bg-red-600 text-white shadow-lg' : 'text-slate-500'}`}
                    >
                      SLIDE 1: HEADLINE
                    </button>
                    <button 
                      onClick={() => setActiveSlide('DETAILS')}
                      className={`px-4 py-1.5 text-[10px] font-black rounded-lg transition-all ${activeSlide === 'DETAILS' ? 'bg-red-600 text-white shadow-lg' : 'text-slate-500'}`}
                    >
                      SLIDE 2: DETAILS
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={shareToTikTok}
                    disabled={isSharing || isDownloading}
                    className="bg-red-600 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-700 transition-all flex items-center gap-2 disabled:opacity-50 shadow-xl"
                  >
                    <Share2 size={14} /> {isSharing ? 'Preparing...' : 'Post to TikTok'}
                  </button>
                  
                  <button 
                    onClick={downloadImage}
                    disabled={isDownloading || isSharing}
                    className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2 disabled:opacity-50 shadow-xl"
                  >
                    <Download size={14} /> {isDownloading ? 'Saving...' : 'Save Slide'}
                  </button>
                </div>
              </div>

              <div className="flex justify-center flex-col items-center gap-4">
                <NewsPreview 
                  data={newsData} 
                  slide={activeSlide} 
                  isGeneratingImage={isGeneratingImage}
                />
              </div>

              <div className="mt-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
                <div className="bg-amber-100 p-2 rounded-lg text-amber-600">
                  <Info size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">TikTok Publishing Tip</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Download both slides and use them in your TikTok video. Start with the Headline slide to hook viewers, then transition to the Details slide for the full story.
                  </p>
                </div>
              </div>

              <TikTokCaption 
                headline={newsData.headline} 
                details={newsData.details} 
              />
            </div>
          </div>
        </div>
      </main>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 z-50"
          >
            <Sparkles className="text-red-500" size={18} />
            <span className="text-sm font-bold">Viral Styling Applied</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
