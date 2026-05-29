export default function Technology() {
  return (
    <div className="bg-[#050816] min-h-screen py-24 px-8 pt-28">
      <div className="max-w-7xl mx-auto space-y-16">
        <header className="text-center">
            <h1 className="text-6xl font-bold mb-6 text-gradient">Technology</h1>
            <p className="text-xl text-[#AFC7FF]/70">The digital architecture supporting our logistics network.</p>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {['Tracking System', 'Smart Dispatch', 'Route Optimization', 'Fleet Intelligence', 'Automation', 'Future Systems'].map(tech => (
                <div key={tech} className="p-8 glass rounded-3xl space-y-4">
                    <h3 className="text-2xl font-semibold text-white">{tech}</h3>
                    <p className="text-[#AFC7FF]/70">Conceptual infrastructure designed to ensure maximum network efficiency.</p>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}
