import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export default function AppExperience() {
  return (
    <div className="bg-[#050816] min-h-screen pt-28 pb-20 relative overflow-hidden">
      <div className="accent-glow top-[-200px] right-[-100px]"></div>
      <div className="accent-glow bottom-[-200px] left-[-200px]"></div>
      <div className="absolute inset-0 grid-lines pointer-events-none"></div>

      {/* Hero */}
      <section className="px-8 relative z-10 max-w-7xl mx-auto space-y-6 text-center py-24">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1565FF]/10 border border-[#1565FF]/20 text-[10px] uppercase tracking-widest text-[#AFC7FF]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1565FF] animate-pulse"></span>
            Currently In Development
          </div>
          <h1 className="text-6xl md:text-7xl font-bold leading-[0.9] text-gradient">The Future Of Logistics <br/> Is Under Construction</h1>
          <p className="text-lg text-[#AFC7FF]/70 max-w-2xl mx-auto leading-relaxed">
            RAjFleet is currently being developed as a next-generation shipping network designed to connect businesses, customers and commerce through intelligent technology and infrastructure.
          </p>
          <div className="flex gap-4 pt-4 justify-center">
            <Link to="/technology" className="px-8 py-4 bg-[#1565FF] rounded-md font-bold text-sm uppercase tracking-widest hover:brightness-110 transition-all">Explore Technology</Link>
            <Link to="/vision" className="px-8 py-4 glass rounded-md font-bold text-sm uppercase tracking-widest hover:bg-white/10 transition-all">View Roadmap</Link>
          </div>
      </section>

      {/* Why & What */}
      <section className="py-24 px-8 relative z-10 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center space-y-16">
            <h2 className="text-4xl font-bold">Why We Are Building RAjFleet</h2>
            <p className="text-[#AFC7FF]/70 max-w-3xl mx-auto text-lg leading-relaxed">Modern commerce depends on movement. Businesses need reliable logistics to thrive in an increasingly digital world. We are architecting an intelligent infrastructure that transforms fragmented logistics into a seamless, unified network, prioritizing long-term thinking over efficiency alone.</p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {['Smart Routing', 'Intelligent Dispatch', 'Live Tracking', 'Automation'].map(item => (
                <div key={item} className="p-8 glass rounded-3xl text-left space-y-4">
                  <h3 className="text-xl font-semibold">{item}</h3>
                  <p className="text-[#AFC7FF]/70 text-sm">Next-gen capability engineered for network-wide efficiency.</p>
                </div>
              ))}
            </div>
        </div>
      </section>

      {/* Preview */}
      <section className="py-24 px-8 bg-white/[0.02] relative z-10">
        <div className="max-w-7xl mx-auto space-y-16">
          <h2 className="text-4xl font-bold text-center">A Preview Of What Is Being Built</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { title: 'Fleet Operations Command', description: 'Monitoring deliveries, riders, incentives, performance metrics and operational activity through a unified command environment.', image: 'https://mithunraj.com/wp-content/uploads/2026/05/RAjFleet-control-room-4.png' },
              { title: 'Logistics Intelligence Engine', description: 'Transforming real-time operational data into actionable insights across the delivery network.', image: 'https://mithunraj.com/wp-content/uploads/2026/05/RAjFleet-control-room-1.png' },
              { title: 'Network Visibility Platform', description: 'Providing continuous awareness of fleet movement, operational health and system-wide performance.', image: 'https://mithunraj.com/wp-content/uploads/2026/05/RAjFleet-control-room-2.png' },
              { title: 'Operations Control Room', description: 'A centralized command environment designed to coordinate and oversee logistics operations at scale.', image: 'https://mithunraj.com/wp-content/uploads/2026/05/RAjFleet-control-room-3.png' }
            ].map(item => (
              <div key={item.title} className="group p-8 glass rounded-3xl text-center space-y-4 transition-all duration-300 hover:border-[#1565FF]/50 hover:-translate-y-1.5">
                  <div className="relative w-full h-64 overflow-hidden rounded-xl">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2 px-3 py-1 bg-[#1565FF] rounded-full text-[10px] font-bold text-white shadow-xl shadow-[#1565FF]/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                        PREVIEW AVAILABLE
                    </div>
                  </div>
                  <h3 className="text-2xl font-semibold">{item.title}</h3>
                  <p className="text-[#AFC7FF]/70 text-sm leading-relaxed">{item.description}</p>
                </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-8 text-center relative z-10">
        <h2 className="text-4xl font-bold mb-4">The Network Is Being Built</h2>
        <p className="text-[#AFC7FF]/70 mb-8 max-w-xl mx-auto">RAjFleet is currently being developed as a future-ready logistics platform. The vision is long-term. The work has already begun.</p>
        <Link to="/" className="px-8 py-4 glass rounded-md font-bold text-sm uppercase tracking-widest">Return To Homepage</Link>
      </section>
    </div>
  );
}
