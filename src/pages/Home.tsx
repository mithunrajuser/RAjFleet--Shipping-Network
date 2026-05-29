import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="bg-[#050816] min-h-screen pt-20 relative overflow-hidden">
      <div className="accent-glow top-[-200px] right-[-100px]"></div>
      <div className="accent-glow bottom-[-200px] left-[-200px]"></div>
      <div className="absolute inset-0 grid-lines pointer-events-none"></div>

      {/* Hero */}
      <section className="h-screen flex items-center px-12 relative z-10 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="w-1/2 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1565FF]/10 border border-[#1565FF]/20 text-[10px] uppercase tracking-widest text-[#AFC7FF]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1565FF] animate-pulse"></span>
            Building the Future
          </div>
          <h1 className="text-7xl font-bold leading-[0.9] text-gradient">Moving <br/>Commerce <br/>Through <span className="text-[#1565FF]">Intelligent Networks</span></h1>
          <p className="text-lg text-[#AFC7FF]/70 max-w-md leading-relaxed">
            RAjFleet is building a smarter logistics infrastructure designed to connect businesses, customers and future delivery networks through intelligent technology.
          </p>
          <div className="flex gap-4 pt-4">
            <Link to="/vision" className="px-8 py-4 bg-[#1565FF] rounded-md font-bold text-sm uppercase tracking-widest hover:brightness-110 transition-all">Explore Vision</Link>
            <Link to="/technology" className="px-8 py-4 glass rounded-md font-bold text-sm uppercase tracking-widest hover:bg-white/10 transition-all">Technology</Link>
          </div>
        </motion.div>
      </section>

      {/* Vision Intro */}
      <section className="py-24 px-8 border-t border-white/10 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-4xl font-bold">What is RAjFleet?</h2>
          <p className="text-[#AFC7FF]/70 text-lg">
            RAjFleet is a forward-thinking initiative established to reshape how commerce moves. We are not just thinking about current deliveries; we are architecting a future infrastructure that bridges technology and logistics to enable seamless, reliable, and intelligent movement of goods.
          </p>
        </div>
      </section>
      
      {/* Ecosystem Preview */}
      <section className="py-24 px-8 bg-white/[0.02] relative z-10">
        <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-16">Ecosystem</h2>
            <div className="p-8 glass rounded-3xl max-w-2xl mx-auto border-white/5">
                <h3 className="text-2xl font-semibold mb-4 text-[#AFC7FF]">RAjHOME + RAjFleet</h3>
                <p className="text-[#AFC7FF]/70">RAjFleet powers the movement layer of the broader RAj ecosystem, designed to unite digital and physical commerce.</p>
            </div>
        </div>
      </section>

      {/* Founder Message */}
      <section className="py-24 px-8 relative z-10">
        <div className="max-w-4xl mx-auto glass p-12 rounded-3xl">
            <h2 className="text-3xl font-bold mb-6">A Message from the Founder</h2>
            <p className="text-lg text-[#AFC7FF]/70 italic mb-8">"Logistics is the backbone of commerce. Our goal is to build an intelligent network that stands the test of time, prioritizing long-term infrastructure over short-term gains."</p>
            <p className="font-semibold text-white">Mithun Raj</p>
            <p className="text-[#AFC7FF]">Founder, RAjFleet</p>
        </div>
      </section>

       {/* Final CTA */}
      <section className="py-24 px-8 border-t border-white/10 text-center relative z-10">
        <h2 className="text-4xl font-bold mb-4">The Future Is Under Construction</h2>
        <p className="text-[#AFC7FF]/70 mb-8">RAjFleet is currently being developed as a future-ready logistics network.</p>
        <button className="px-8 py-4 glass rounded-md font-bold text-sm uppercase tracking-widest cursor-not-allowed">Coming Soon</button>
      </section>
    </div>
  );
}
