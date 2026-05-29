import { useState } from 'react';

export default function Contact() {
  const [status, setStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('Submitting...');
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (response.ok) {
            setStatus('Message sent successfully!');
            e.currentTarget.reset();
        } else {
            setStatus('Error sending message.');
        }
    } catch {
        setStatus('Error sending message.');
    }
  };

  return (
    <div className="bg-[#050816] min-h-screen py-24 px-6 md:px-8 pt-32">
      <div className="max-w-4xl mx-auto space-y-16">
        <header className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gradient">Contact</h1>
            <p className="text-xl text-[#AFC7FF]/70">Let's connect.</p>
        </header>

        <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
                <h2 className="text-2xl font-bold">Get In Touch</h2>
                <p className="text-[#AFC7FF]/70"><strong>Email:</strong> hello@rajhomeindia.com</p>
                <p className="text-[#AFC7FF]/70"><strong>Phone:</strong> +91-850000-8271</p>
                <p className="text-[#AFC7FF]/70"><strong>Location:</strong> Samastipur, Bihar, India</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input required name="name" type="text" placeholder="Name" className="w-full p-4 glass rounded-lg text-white" />
                <input required name="email" type="email" placeholder="Email" className="w-full p-4 glass rounded-lg text-white" />
                <textarea required name="message" placeholder="Message" className="w-full p-4 glass rounded-lg h-32 text-white"></textarea>
                <button type="submit" className="w-full p-4 bg-[#1565FF] rounded-lg font-bold text-white hover:bg-blue-600 transition">Submit</button>
                {status && <p className="text-center mt-4 text-white/80">{status}</p>}
            </form>
        </div>
      </div>
    </div>
  );
}
