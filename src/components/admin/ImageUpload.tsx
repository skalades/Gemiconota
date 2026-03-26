'use client'

import { useState, useRef, useEffect } from "react";
import { Trash2, MoveLeft, MoveRight, Plus, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";

interface ImageItem {
  id: string;
  url: string;
  file?: File;
  isExisting?: boolean;
}

interface ImageUploadProps {
  name: string;
  defaultValue?: string[]; // Existing URLs
  maxImages?: number;
}

export default function ImageUpload({ name, defaultValue = [], maxImages = 10 }: ImageUploadProps) {
  const [items, setItems] = useState<ImageItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (defaultValue.length > 0 && items.length === 0) {
      setItems(defaultValue.map((url, i) => ({
        id: `existing-${i}-${url}`,
        url,
        isExisting: true
      })));
    }
  }, [defaultValue]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newItems: ImageItem[] = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      url: URL.createObjectURL(file),
      file,
      isExisting: false
    }));

    setItems(prev => [...prev, ...newItems].slice(0, maxImages));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (id: string) => {
    setItems(prev => {
      const itemToRemove = prev.find(item => item.id === id);
      if (itemToRemove && !itemToRemove.isExisting) {
        URL.revokeObjectURL(itemToRemove.url);
      }
      return prev.filter(item => item.id !== id);
    });
  };

  const moveItem = (index: number, direction: 'left' | 'right') => {
    const newIndex = direction === 'left' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= items.length) return;

    const newItems = [...items];
    [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];
    setItems(newItems);
  };

  // Sync ordered files to a hidden actual file input for form submission
  const hiddenFilesRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (!hiddenFilesRef.current) return;
    const dataTransfer = new DataTransfer();
    items.forEach(item => {
      if (item.file) dataTransfer.items.add(item.file);
    });
    hiddenFilesRef.current.files = dataTransfer.files;
  }, [items]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <AnimatePresence mode="popLayout">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative w-32 h-40 bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden group shadow-sm"
            >
              <Image 
                src={item.url} 
                alt="Preview" 
                fill 
                className="object-cover"
              />
              
              {/* Overlay Controls */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                <div className="flex justify-end">
                  <button 
                    type="button"
                    onClick={() => removeImage(item.id)}
                    className="p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                
                <div className="flex justify-between items-center">
                  <button 
                    type="button"
                    disabled={index === 0}
                    onClick={() => moveItem(index, 'left')}
                    className="p-1.5 bg-white/20 text-white rounded-lg hover:bg-white/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <MoveLeft size={14} />
                  </button>
                  <button 
                    type="button"
                    disabled={index === items.length - 1}
                    onClick={() => moveItem(index, 'right')}
                    className="p-1.5 bg-white/20 text-white rounded-lg hover:bg-white/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <MoveRight size={14} />
                  </button>
                </div>
              </div>

              {/* Order Badge */}
              <div className="absolute top-2 left-2 w-5 h-5 bg-white/80 backdrop-blur-sm rounded-md flex items-center justify-center text-[10px] font-black">
                {index + 1}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {items.length < maxImages && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-32 h-40 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50/30 transition-all group"
          >
            <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-blue-50 transition-colors">
              <Plus size={20} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest">Add Image</span>
          </button>
        )}
      </div>

      <input 
        ref={fileInputRef}
        type="file" 
        multiple 
        accept="image/*" 
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Hidden inputs for the form submission payload */}
      {/* We use the indexed name 'images_ordered' to help the server identify the order */}
      {items.map((item, index) => (
        <input 
          key={`hidden-${item.id}`} 
          type="hidden" 
          name={`${name}_data`} 
          value={item.isExisting ? item.url : `FILE_PLACEHOLDER_${index}`} 
        />
      ))}
      
      {/* Actual hidden file input that stays in sync with 'items' order */}
      <input 
        ref={hiddenFilesRef}
        type="file" 
        multiple 
        name="images_files" 
        className="hidden" 
      />

      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
        {items.length} / {maxImages} images (Arrows to reorder)
      </p>
    </div>
  );
}
