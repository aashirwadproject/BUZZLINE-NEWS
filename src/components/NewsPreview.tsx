import React from 'react';
import { NewsData } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight } from 'lucide-react';

import { BuzzlineLogo } from './BuzzlineLogo';
import { Wand2, Loader2 } from 'lucide-react';

interface NewsPreviewProps {
  data: NewsData;
  slide: 'HEADLINE' | 'DETAILS';
  isGeneratingImage?: boolean;
}

export const NewsPreview: React.FC<NewsPreviewProps> = ({ 
  data, 
  slide, 
  isGeneratingImage = false,
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  const getHeadlineFontSize = (text: string) => {
    const length = text.length;
    if (length < 30) return 'text-2xl';
    if (length < 50) return 'text-xl';
    if (length < 80) return 'text-lg';
    return 'text-base';
  };


  return (
    <div className="flex flex-col items-center">
      <motion.div 
        id="news-capture-area"
        ref={containerRef}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-[450px] h-[600px] bg-black overflow-hidden shadow-2xl rounded-lg cursor-default"
      >
        {/* Background Media */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {data.mediaUrl ? (
            data.mediaType === 'video' ? (
              <video 
                src={data.mediaUrl} 
                autoPlay 
                muted 
                loop 
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <img 
                src={data.mediaUrl} 
                alt="News" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            )
          ) : (
            <div className="w-full h-full bg-slate-900 flex items-center justify-center text-slate-700 font-bold">
              NO MEDIA
            </div>
          )}
          {/* Dark Gradient Overlay for bottom-up readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        </div>

        {/* Logo - Top Right */}
        <div className="absolute top-6 right-6 z-20">
          <div className="relative">
            <div className="absolute inset-0 bg-white/20 blur-xl rounded-full" />
            {data.logoUrl ? (
              <img 
                src={data.logoUrl} 
                alt="Buzzline Nepal Logo" 
                className="w-16 h-16 object-cover rounded-full border-2 border-white/40 shadow-2xl relative z-10"
                referrerPolicy="no-referrer"
              />
            ) : (
              <BuzzlineLogo className="w-16 h-16 relative z-10 shadow-2xl" />
            )}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {slide === 'HEADLINE' ? (
            <motion.div 
              key="headline-slide"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-10 flex flex-col items-center justify-end pb-12"
            >
              {/* News Type - Positioned around 65% down */}
              <div className="mb-4 flex flex-col items-center">
                <h2 
                  className="font-black uppercase italic tracking-tighter text-3xl leading-none drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]"
                  style={{ color: data.themeColor }}
                >
                  {data.newsType}
                </h2>
                <div 
                  className="h-[3px] w-full mt-1" 
                  style={{ backgroundColor: data.themeColor }}
                />
              </div>

              {/* Headline */}
              <div className="px-8 mb-6 flex items-center justify-center gap-2 w-full">
                <h1 className={`text-white font-sans font-black leading-tight tracking-tight text-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] ${getHeadlineFontSize(data.headline)}`}>
                  {data.headline || 'Headline'}
                </h1>
              </div>

              {/* CTA */}
              <div className="mb-4">
                <p className="text-white font-bold tracking-tight text-[11px] border-b border-white/80 pb-0.5 drop-shadow-md">
                  Follow Us For All The Quick News Update
                </p>
              </div>

              {/* Footer Info */}
              <div className="flex flex-col items-center gap-1 mb-4 shrink-0">
                <span className="text-white/60 font-mono text-[9px] drop-shadow-md">{data.date}</span>
              </div>

              {/* Arrows */}
              <div className="flex gap-0.5">
                {[...Array(15)].map((_, i) => (
                  <span 
                    key={i} 
                    className="font-black text-xl leading-none drop-shadow-md tracking-tighter"
                    style={{ color: data.themeColor }}
                  >
                    {'>'}
                  </span>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="details-slide"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-10 flex flex-col items-center bg-white pt-24 pb-8"
            >
              {/* Full Story Header */}
              <div className="mb-6 flex flex-col items-center shrink-0">
                <h2 
                  className="font-black uppercase italic tracking-tighter text-3xl leading-none"
                  style={{ color: data.themeColor }}
                >
                  {data.newsType}
                </h2>
                <div 
                  className="h-[3px] w-full mt-1" 
                  style={{ backgroundColor: data.themeColor }}
                />
              </div>

              {/* Details Text - Adjustable font size, no scrolling */}
              <div className="px-10 mb-6 w-full flex-1 flex flex-col items-center justify-center">
                <p 
                  className="text-slate-900 leading-snug font-bold tracking-tight text-center"
                  style={{ fontSize: `${data.detailsFontSize || 16}px` }}
                >
                  {data.details}
                </p>
              </div>

              {/* Footer Info */}
              <div className="flex flex-col items-center gap-1 mb-4 shrink-0">
                <span className="text-slate-400 font-mono text-[9px]">{data.date}</span>
              </div>

              {/* Arrows */}
              <div className="flex gap-0.5 shrink-0">
                {[...Array(15)].map((_, i) => (
                  <span 
                    key={i} 
                    className="font-black text-xl leading-none tracking-tighter"
                    style={{ color: data.themeColor }}
                  >
                    {'>'}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Subtle Scanline Effect */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,4px_100%]" />

        {/* AI Image Generation Loading Overlay */}
        <AnimatePresence>
          {isGeneratingImage && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4"
            >
              <div className="relative">
                <Loader2 className="text-red-600 animate-spin" size={48} />
                <Wand2 className="text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" size={16} />
              </div>
              <div className="text-center">
                <p className="text-white font-black italic uppercase tracking-widest text-sm">Generating AI Image</p>
                <p className="text-slate-400 text-[10px] uppercase font-bold tracking-tighter mt-1">Creating your custom news background...</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};



