import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <nav className="max-w-7xl mx-auto px-6 md:px-8 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#1565FF] rounded-sm flex items-center justify-center">
            <span className="text-xs font-bold">RF</span>
          </div>
          <span className="text-xl font-bold tracking-tighter uppercase">RAj<span className="text-[#1565FF]">Fleet</span></span>
        </Link>
        <div className="hidden md:flex gap-6 text-[11px] font-semibold uppercase tracking-widest text-[#AFC7FF]/80">
          {['Home', 'Vision', 'Technology', 'Contact'].map((item) => (
            <Link key={item} to={item === 'Home' ? '/' : `/${item.toLowerCase()}`} className="hover:text-white transition-colors">
              {item}
            </Link>
          ))}
        </div>
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X /> : <Menu />}
        </button>
        <motion.button 
          className="hidden md:block px-5 py-2 rounded-full border border-white/20 text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all"
        >
          Coming Soon
        </motion.button>
      </nav>
      <AnimatePresence>
        {isOpen && (
            <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="md:hidden glass overflow-hidden">
                <div className="flex flex-col p-6 gap-4 text-[11px] font-semibold uppercase tracking-widest text-[#AFC7FF]/80">
                    {['Home', 'Vision', 'Technology', 'Contact'].map((item) => (
                        <Link key={item} to={item === 'Home' ? '/' : `/${item.toLowerCase()}`} onClick={() => setIsOpen(false)} className="hover:text-white transition-colors">
                        {item}
                        </Link>
                    ))}
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
