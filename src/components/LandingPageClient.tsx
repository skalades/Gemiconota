"use client";

import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { ShoppingBag, ShoppingCart, Trash2, Plus, Minus, MapPin, ArrowRight, Menu, X, Globe, ArrowUpRight, LogOut, Calendar, Image as ImageIcon } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { cn, formatPrice } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/store/useCartStore';
import { useSession, signOut } from 'next-auth/react';
import ImageCarousel from './ImageCarousel';

// --- Types ---
interface Product {
  id: string;
  name: string;
  price: number;
  badge?: string;
  description?: string;
  images?: string[];
  category?: string;
  sizes?: string[];
}

interface LandingPageProps {
  stats: {
    alumni: number;
    cities: number;
  };
  products: Product[];
  companies: string[];
  settings?: Record<string, string>;
  activities?: any[];
  gallery?: any[];
}

export default function LandingPageClient({ stats, products, companies, settings = {}, activities = [], gallery = [] }: LandingPageProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { items, totalItems, totalPrice, addItem, removeItem, updateQuantity } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalCount = mounted ? totalItems() : 0;
  const currentTotalPrice = mounted ? totalPrice() : 0;

  return (
    <div className="relative">
      <div className="grain" />
      
      {/* Navbar */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl">
        <div className="glass-pill px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 relative">
              <Image src="/logo.png" alt="Gemiconota Logo" fill className="object-contain" />
            </div>
            <span className="font-display font-black text-xl text-ink tracking-tighter uppercase">Gemiconota</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            {['Peta', 'Kegiatan', 'Store'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-ink/60 hover:text-brand-blue font-bold text-xs uppercase tracking-widest transition-colors">
                {item}
              </a>
            ))}
            
            {/* Cart Trigger */}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-ink/60 hover:text-brand-blue transition-colors"
            >
              <ShoppingCart size={20} />
              {totalCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-blue text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-bounce-slow">
                  {totalCount}
                </span>
              )}
            </button>

            {session ? (
              <div className="flex items-center gap-2">
                <Link 
                  href={('user' in session && (session.user as any)?.role === 'ADMIN') ? '/admin' : '/dashboard'} 
                  className="bg-ink text-white px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-brand-blue transition-all flex items-center gap-2"
                >
                  {('user' in session && (session.user as any)?.role === 'ADMIN') ? 'Admin' : 'Dashboard'}
                  <ArrowRight size={14} />
                </Link>
                <button 
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="bg-red-50 text-red-500 px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center gap-2 border border-red-100"
                >
                  <LogOut size={14} />
                  Keluar
                </button>
              </div>
            ) : (
              <Link href="/auth/login" className="bg-ink text-white px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-brand-blue transition-all">
                Masuk
              </Link>
            )}
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-ink">
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="md:hidden absolute top-20 left-0 right-0 glass-pill p-6 flex flex-col gap-4 text-center"
          >
            <a href="#map" className="text-ink font-bold text-sm uppercase tracking-widest">Peta</a>
            <a href="#kegiatan" className="text-ink font-bold text-sm uppercase tracking-widest">Kegiatan</a>
            <a href="#store" className="text-ink font-bold text-sm uppercase tracking-widest">Store</a>
            <Link href="/auth/register" className="bg-ink text-white px-6 py-3 rounded-full font-bold text-sm uppercase tracking-widest">
              Gabung
            </Link>
          </motion.div>
        )}
      </nav>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[95%] pb-safe">
        <div className="glass-pill px-6 py-4 flex justify-between items-center bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl">
          <a href="#peta" className="flex flex-col items-center gap-1 text-ink hover:text-brand-blue">
            <MapPin size={20} />
            <span className="text-[9px] font-bold uppercase tracking-widest">Peta</span>
          </a>
          <a href="#store" className="flex flex-col items-center gap-1 text-ink hover:text-brand-blue">
            <ShoppingBag size={20} />
            <span className="text-[9px] font-bold uppercase tracking-widest">Store</span>
          </a>
          <button onClick={() => setIsCartOpen(true)} className="relative flex flex-col items-center gap-1 text-ink hover:text-brand-blue">
            <ShoppingCart size={20} />
            {totalCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-brand-blue text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-bounce-slow">
                {totalCount}
              </span>
            )}
            <span className="text-[9px] font-bold uppercase tracking-widest">Cart</span>
          </button>
          {session ? (
            <>
              <Link href={'user' in session && (session.user as any)?.role === 'ADMIN' ? '/admin' : '/dashboard'} className="flex flex-col items-center gap-1 text-ink hover:text-brand-blue">
                <Globe size={20} />
                <span className="text-[9px] font-bold uppercase tracking-widest">Dash</span>
              </Link>
              <button onClick={() => signOut({ callbackUrl: '/' })} className="flex flex-col items-center gap-1 text-red-500 hover:text-red-700">
                <LogOut size={20} />
                <span className="text-[9px] font-bold uppercase tracking-widest">Keluar</span>
              </button>
            </>
          ) : (
            <Link href="/auth/login" className="flex flex-col items-center gap-1 text-ink hover:text-brand-blue">
              <ArrowRight size={20} />
              <span className="text-[9px] font-bold uppercase tracking-widest">Masuk</span>
            </Link>
          )}
        </div>
      </div>

      <main>
        <Hero companies={companies} settings={settings} />
        <AlumniMap stats={stats} settings={settings} />
        <AlumniActivities activities={activities} settings={settings} />
        <AlumniGallery gallery={gallery} settings={settings} />
        <MerchStore products={products} onAddToCart={addItem} />
      </main>

      <Footer settings={settings} />

      {/* Cart Drawer Overlay */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[100] bg-ink/20 backdrop-blur-md" onClick={() => setIsCartOpen(false)} />
      )}

      {/* Cart Drawer */}
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: isCartOpen ? 0 : '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[101] shadow-2xl flex flex-col"
      >
        <div className="p-8 border-b border-ink/5 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black italic">KERANJANG</h2>
            <p className="text-[10px] font-bold uppercase tracking-widest text-ink/40">{totalCount} ITEM PILIHAN</p>
          </div>
          <button onClick={() => setIsCartOpen(false)} className="w-10 h-10 rounded-full bg-paper flex items-center justify-center text-ink hover:bg-brand-blue hover:text-white transition-all">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {mounted && items.length > 0 ? (
            items.map((item) => (
              <div key={item.id} className="flex gap-6 items-center">
                <div className="w-20 h-24 bg-paper rounded-2xl relative overflow-hidden flex-shrink-0">
                  <Image 
                    src={item.imageUrl || 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=200&q=80'} 
                    alt={item.name} 
                    fill 
                    className="object-cover" 
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-sm uppercase tracking-tight mb-1">{item.name}</h3>
                  <p className="text-brand-blue font-black text-xs mb-4">
                    {formatPrice(item.price)}
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 bg-paper rounded-full px-3 py-1">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-ink/40 hover:text-ink"><Minus size={12} /></button>
                      <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-ink/40 hover:text-ink"><Plus size={12} /></button>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="text-pink-500 hover:text-pink-700 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center opacity-20 text-center">
              <ShoppingCart size={64} className="mb-4" />
              <p className="font-black text-xs uppercase tracking-[0.2em]">Keranjang Kosong</p>
            </div>
          )}
        </div>

        {mounted && items.length > 0 && (
          <div className="p-8 bg-paper border-t border-ink/5">
            <div className="flex justify-between items-end mb-8">
              <div className="text-[10px] font-bold uppercase tracking-widest text-ink/40">Total Estimasi</div>
              <div className="text-2xl font-black text-ink">
                {formatPrice(currentTotalPrice)}
              </div>
            </div>
            <button className="w-full bg-ink text-white py-5 rounded-full font-black text-sm uppercase tracking-[0.3em] hover:bg-brand-blue transition-all">
              Lanjut Checkout
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

const Hero = ({ companies, settings }: { companies: string[], settings: Record<string, string> }) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  let images: string[] = [];
  try {
    if (settings.hero_images) {
      images = JSON.parse(settings.hero_images);
    } else if (settings.hero_image) {
      images = [settings.hero_image];
    }
  } catch(e) {}
  if (images.length === 0) {
    images = ["https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80"];
  }

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section ref={containerRef} className="relative min-h-screen flex flex-col justify-center pt-32 pb-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "circOut" }}
          >
            <div className="flex items-center gap-2 mb-8">
              <div className="h-[1px] w-12 bg-brand-blue" />
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-brand-blue font-bold">Alumni Network 2.0</span>
            </div>
            
            <h1 className="text-[12vw] lg:text-[7rem] mb-8 leading-[0.85] font-display">
              {settings.hero_title1 || "KONEKSI"} <br />
              <span className="text-brand-blue italic">{settings.hero_title2 || "GLOBAL"}</span> <br />
              <span className="relative">
                {settings.hero_title3 || "LOKAL"}
                <motion.span 
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 0.5, duration: 1 }}
                  className="absolute -bottom-2 left-0 h-2 bg-brand-gold/30 -z-10" 
                />
              </span>
            </h1>

            <p className="text-lg text-ink/60 max-w-md mb-12 font-medium leading-relaxed">
              {settings.hero_desc || "Platform modern untuk alumni SMKN 2 Garut. Menyatukan visi, membangun sinergi, dan merayakan pencapaian kolektif."}
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/auth/register" className="bg-brand-blue text-white px-10 py-5 rounded-full font-black text-sm uppercase tracking-widest hover:bg-ink transition-all shadow-2xl shadow-brand-blue/30 flex items-center gap-3 group">
                Daftar Sekarang
                <ArrowUpRight size={20} className="group-hover:rotate-45 transition-transform" />
              </Link>
            </div>
          </motion.div>

          <motion.div 
            style={{ y, opacity }}
            className="relative hidden lg:block"
          >
            <div className="relative aspect-[4/5] rounded-[4rem] overflow-hidden shadow-2xl rotate-3 bg-slate-100">
              <AnimatePresence mode="popLayout">
                <motion.img 
                  key={currentIndex}
                  src={images[currentIndex]}
                  alt="Alumni" 
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-brand-blue/10 mix-blend-multiply pointer-events-none" />
            </div>

            {images.length > 1 && (
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, i) => (
                  <button 
                    key={i} 
                    onClick={() => setCurrentIndex(i)}
                    className={cn(
                      "h-2 rounded-full transition-all", 
                      currentIndex === i ? "bg-brand-blue w-6" : "bg-ink/20 w-2 hover:bg-ink/40"
                    )} 
                  />
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <div className="mt-32 border-y border-ink/5 py-12 overflow-hidden bg-white">
        <div className="marquee">
          <div className="marquee-content">
            {companies.map((name, i) => (
              <span key={`c1-${i}`} className="text-4xl font-black text-ink/10 tracking-tighter mx-12">{name}</span>
            ))}
          </div>
          <div className="marquee-content" aria-hidden="true">
            {companies.map((name, i) => (
              <span key={`c2-${i}`} className="text-4xl font-black text-ink/10 tracking-tighter mx-12">{name}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const AlumniMap = ({ stats, settings }: { stats: { alumni: number; cities: number }, settings: Record<string, string> }) => {
  return (
    <section id="peta" className="py-32 bg-ink text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-5">
            <div className="inline-block px-4 py-1 rounded-full border border-white/20 text-[10px] font-bold uppercase tracking-widest mb-8">
              Live Network
            </div>
            <h2 className="text-6xl md:text-8xl mb-8 font-display">
              {settings.map_title1 || "PETA"} <br />
              <span className="text-brand-blue">{settings.map_title2 || "SINERGI"}</span>
            </h2>
            <p className="text-lg text-white/60 mb-12 leading-relaxed">
              {settings.map_desc || "Jelajahi jaringan alumni kami yang dinamis. Dari Garut untuk dunia."}
            </p>
            
            <div className="grid grid-cols-2 gap-8">
              <div>
                <div className="text-4xl font-black text-brand-gold mb-2">{stats.alumni}+</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-white/40">Alumni Terverifikasi</div>
              </div>
              <div>
                <div className="text-4xl font-black text-brand-blue mb-2">{stats.cities}+</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-white/40">Kota Global</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 relative">
            <div className="aspect-square bg-white/5 rounded-[4rem] border border-white/10 p-8 flex items-center justify-center overflow-hidden">
              <div className="relative w-full h-full opacity-40">
                <Globe size="100%" className="text-white" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 bg-brand-blue rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_50px_rgba(2,132,199,0.5)]">
                    <MapPin size={32} />
                  </div>
                  <div className="font-mono text-xs uppercase tracking-widest">Scanning Network...</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const AlumniActivities = ({ activities, settings }: { activities: any[], settings: Record<string, string> }) => {
  return (
    <section id="kegiatan" className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-20">
          <h2 className="text-6xl md:text-8xl font-display mb-6">
            {settings.act_title1 || "KEGIATAN"} <br />
            <span className="text-brand-blue italic">{settings.act_title2 || "ALUMNI"}</span>
          </h2>
          <p className="text-ink/60 text-lg max-w-sm">
            {settings.act_desc || "Update dan agenda terbaru dari komunitas alumni GEMICONOTA."}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {activities.length > 0 ? activities.map((activity) => (
            <div key={activity.id} className="group relative overflow-hidden rounded-[3rem] bg-paper flex flex-col items-start border border-ink/5 p-8 transition-all hover:bg-slate-50">
              {activity.imageUrl && (
                <div className="w-full h-64 rounded-3xl overflow-hidden mb-8 relative">
                  <Image src={activity.imageUrl} alt={activity.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
              )}
              <div className="flex gap-4 items-center text-xs font-bold uppercase tracking-widest text-brand-blue mb-4 bg-brand-blue/10 px-4 py-2 rounded-full">
                <Calendar size={14} />
                {new Date(activity.date).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
              <h3 className="text-2xl font-black text-ink mb-4">{activity.title}</h3>
              <p className="text-ink/60 mb-6 line-clamp-3 leading-relaxed">{activity.description}</p>
              {activity.location && (
                <div className="flex items-center gap-2 text-ink/40 text-sm font-medium mt-auto">
                  <MapPin size={16} />
                  {activity.location}
                </div>
              )}
            </div>
          )) : (
            <div className="col-span-2 text-center py-20 bg-paper rounded-[3rem] border border-ink/5 border-dashed">
              <Calendar size={48} className="mx-auto mb-4 text-ink/20" />
              <p className="text-ink/40 font-bold uppercase tracking-widest font-mono text-sm">Belum ada kegiatan terbaru.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const AlumniGallery = ({ gallery, settings }: { gallery: any[], settings: Record<string, string> }) => {
  return (
    <section id="galeri" className="py-32 bg-ink text-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-20 text-center">
          <h2 className="text-6xl md:text-8xl font-display mb-6">
            {settings.gal_title1 || "GALERI"} <br />
            <span className="text-brand-blue italic">{settings.gal_title2 || "KITA"}</span>
          </h2>
          <p className="text-white/60 text-lg max-w-sm mx-auto">
            {settings.gal_desc || "Momen kebersamaan yang tak terlupakan."}
          </p>
        </div>

        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {gallery.map((img) => (
            <div key={img.id} className="relative group rounded-3xl overflow-hidden break-inside-avoid shadow-2xl">
              <img src={img.imageUrl} alt={img.caption || "Alumni moment"} className="w-full object-cover" />
              {img.caption && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                  <p className="text-white font-bold text-sm leading-relaxed">{img.caption}</p>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {gallery.length === 0 && (
          <div className="text-center py-20 border border-white/10 rounded-[3rem] border-dashed">
             <ImageIcon size={48} className="mx-auto mb-4 text-white/20" />
             <p className="text-white/40 font-bold uppercase tracking-widest font-mono text-sm">Galeri masih kosong.</p>
          </div>
        )}
      </div>
    </section>
  );
};

const MerchStore = ({ products, onAddToCart }: { products: Product[], onAddToCart: (p: any) => void }) => {
  return (
    <section id="store" className="py-32 bg-paper">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-24 gap-8">
          <h2 className="text-7xl md:text-9xl font-display">
            MERCH <br />
            <span className="text-brand-teal italic">STORE</span>
          </h2>
          <div className="max-w-sm">
            <p className="text-ink/60 mb-8 font-medium">
              Koleksi eksklusif untuk alumni. Setiap pembelian mendukung program beasiswa alumni GEMICONOTA.
            </p>
            <button className="flex items-center gap-4 font-black text-xs uppercase tracking-[0.3em] group">
              Explore All <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {products.map((product, idx) => (
            <Link 
              key={product.id}
              href={`/store/products/${product.id}`}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[3/4] rounded-[3rem] overflow-hidden mb-8 bg-paper group">
                <ImageCarousel 
                  images={product.images && product.images.length > 0 
                    ? product.images 
                    : ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=600&q=80']} 
                  aspectRatio="aspect-full h-full"
                />
                <div className="absolute top-6 right-6 glass-pill px-4 py-2 text-[10px] font-black uppercase tracking-widest z-20">
                  {product.badge || 'New'} Choice
                </div>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <h3 className="text-2xl font-black mb-1">{product.name}</h3>
                  <p className="text-brand-teal font-bold mb-2">
                    {formatPrice(product.price)}
                  </p>
                </div>
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    onAddToCart(product);
                  }}
                  className="w-12 h-12 rounded-full border border-ink/10 flex items-center justify-center hover:bg-ink hover:text-white transition-all transform active:scale-95 z-30 relative"
                >
                  <ShoppingBag size={20} />
                </button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer = ({ settings }: { settings: Record<string, string> }) => {
  return (
    <footer className="bg-white pt-32 pb-12 border-t border-ink/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20 mb-32">
          <div>
            <h2 className="text-6xl md:text-8xl mb-12 font-display">SAY <span className="text-brand-blue">{settings.footer_title || "HELLO"}</span></h2>
            <div className="flex flex-wrap gap-8">
              {['Instagram', 'LinkedIn', 'Twitter', 'Facebook'].map(social => (
                <a key={social} href="#" className="font-black text-xs uppercase tracking-widest text-ink/40 hover:text-brand-blue transition-colors">
                  {social}
                </a>
              ))}
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-12">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-ink/30 mb-6">Navigasi</div>
              <ul className="space-y-4 font-black text-sm uppercase tracking-widest">
                <li><Link href="/" className="hover:text-brand-blue">Beranda</Link></li>
                <li><a href="#peta" className="hover:text-brand-blue">Peta Alumni</a></li>
                <li><a href="#kegiatan" className="hover:text-brand-blue">Kegiatan</a></li>
                <li><a href="#galeri" className="hover:text-brand-blue">Galeri</a></li>
                <li><a href="#store" className="hover:text-brand-blue">Merch Store</a></li>
              </ul>
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-ink/30 mb-6">Kontak</div>
              <div className="font-black text-sm uppercase tracking-widest leading-loose">
                {settings.footer_address1 || "Jl. Suherman No.90"} <br />
                {settings.footer_address2 || "Garut, Indonesia"} <br />
                {settings.footer_email || "hello@gemiconota.com"}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-ink/5 gap-8">
          <div className="flex items-center gap-4">
             <div className="w-8 h-8 relative">
               <Image src="/logo.png" alt="Logo" fill className="object-contain" />
             </div>
             <span className="text-[10px] font-bold uppercase tracking-widest text-ink/40">© {new Date().getFullYear()} Gemiconota Platform</span>
          </div>
          <div className="flex gap-12 text-[10px] font-bold uppercase tracking-widest text-ink/40">
            <a href="#" className="hover:text-ink">Privacy</a>
            <a href="#" className="hover:text-ink">Terms</a>
            <a href="#" className="hover:text-ink">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
