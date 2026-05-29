import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#050816] border-t border-white/10 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-8 grid md:grid-cols-3 gap-12 text-[11px] uppercase tracking-widest text-[#AFC7FF]/80">
        <div>
          <img src="https://mithunraj.com/wp-content/uploads/2026/05/RAjFleet-logo.png" alt="RAjFleet" className="h-10 mb-4" />
          <p className="text-white/60 normal-case">
            <span className="text-[#1565FF]">RAj</span>
            <span className="text-white"> Fleet</span> is building a technology-driven logistics network for the future movement of commerce.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-white">Navigation</h4>
          <ul className="space-y-4">
            <li><Link to="/" className="hover:text-white transition">Home</Link></li>
            <li><Link to="/vision" className="hover:text-white transition">Vision</Link></li>
            <li><Link to="/technology" className="hover:text-white transition">Technology</Link></li>
            <li><Link to="/contact" className="hover:text-white transition">Contact</Link></li>
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
