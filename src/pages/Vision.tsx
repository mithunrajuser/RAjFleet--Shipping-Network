export default function Vision() {
  return (
    <div className="bg-[#050816] min-h-screen py-24 px-8 pt-32">
      <div className="max-w-4xl mx-auto space-y-16">
        <header className="text-center">
            <h1 className="text-6xl font-bold mb-6 text-gradient">Our Vision</h1>
            <p className="text-xl text-[#AFC7FF]/70">Building tomorrow's shipping network.</p>
        </header>
        
        <section className="space-y-6">
            <h2 className="text-3xl font-bold text-white">Why RAjFleet Exists</h2>
            <p className="text-[#AFC7FF]/70 leading-relaxed">Commerce remains fragmented. Current logistics systems often struggle to meet the scale and complexity of modern demands. We exist to provide the intelligent infrastructure required to unify this space, prioritizing technological innovation and long-term sustainability.</p>
        </section>

        <section className="space-y-6">
            <h2 className="text-3xl font-bold text-white">Roadmap</h2>
            <div className="grid md:grid-cols-2 gap-6">
                {[{y: '2026', title: 'Foundation'}, {y: '2027', title: 'Expansion'}, {y: '2028', title: 'Network Growth'}, {y: '2030', title: 'National Shipping Vision'}].map(item => (
                    <div key={item.y} className="p-6 glass rounded-xl">
                        <span className="text-[#1565FF] font-bold">{item.y}</span>
                        <h3 className="text-xl font-semibold mt-2">{item.title}</h3>
                    </div>
                ))}
            </div>
        </section>
      </div>
    </div>
  );
}
