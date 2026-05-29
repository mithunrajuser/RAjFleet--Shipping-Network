export default function Footer() {
  return (
    <footer className="bg-[#050816] border-t border-white/10 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-8 grid md:grid-cols-3 gap-12 text-[11px] uppercase tracking-widest text-[#AFC7FF]/80">
        <div>
          <div className="w-8 h-8 bg-[#1565FF] rounded-sm flex items-center justify-center mb-4">
            <span className="text-xs font-bold text-white">RF</span>
          </div>
          <p className="text-white/60 normal-case">RAjFleet is building a technology-driven logistics network for the future movement of commerce.</p>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-white">Navigation</h4>
          <ul className="space-y-4">
            <li>Home</li>
            <li>Vision</li>
            <li>Technology</li>
            <li>Contact</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-white">Contact</h4>
          <ul className="space-y-4">
            <li>hello@rajhomeindia.com</li>
            <li>+91-850000-8271</li>
            <li>Samastipur, Bihar</li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-8 mt-20 pt-10 border-t border-white/10 text-center text-[9px] text-white/40 uppercase tracking-[0.2em]">
        RAjFleet | Your Smart Shipping Network &copy; 2026 All Rights Reserved
      </div>
    </footer>
  );
}
