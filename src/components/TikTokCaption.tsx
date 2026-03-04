import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Sparkles, Copy, Check, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

interface TikTokCaptionProps {
  headline: string;
  details: string;
}

export const TikTokCaption: React.FC<TikTokCaptionProps> = ({ headline, details }) => {
  const [caption, setCaption] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateCaption = async () => {
    setIsGenerating(true);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Create a viral, engaging TikTok caption for a news post by "Buzzline Media Nepal". 
        Use a mix of emojis. 
        The news headline is: "${headline}". 
        The details are: "${details}". 
        Include exactly 5 relevant and trending hashtags at the end. 
        Keep it punchy and formatted for TikTok.`,
      });

      setCaption(response.text || '');
    } catch (error) {
      console.error("Caption generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(caption);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mt-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="bg-red-100 p-2 rounded-lg text-red-600">
            <MessageSquare size={18} />
          </div>
          <h3 className="font-bold text-slate-900 italic">TikTok Caption Generator</h3>
        </div>
        <button
          onClick={generateCaption}
          disabled={isGenerating || !headline}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 disabled:opacity-50"
        >
          {isGenerating ? (
            <>Generating...</>
          ) : (
            <>
              <Sparkles size={14} /> Generate Caption
            </>
          )}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {caption ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="relative group"
          >
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 pr-12 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
              {caption}
            </div>
            <button
              onClick={copyToClipboard}
              className="absolute top-3 right-3 p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-red-600 hover:border-red-200 transition-all shadow-sm"
              title="Copy to clipboard"
            >
              {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
            </button>
          </motion.div>
        ) : (
          <div className="text-center py-8 border-2 border-dashed border-slate-100 rounded-xl">
            <p className="text-slate-400 text-xs font-medium">Click generate to create a viral caption for your video.</p>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
