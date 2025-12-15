import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Converter as GifConverter } from './features/gif-converter/components/GifConverter';
import { VideoConverter } from './features/video-converter/components/VideoConverter';
import PromptPro from './features/prompt-pro/components/PromptPro';
import { AdSpace } from './components/AdSpace';
import { ToolNav } from './components/ToolNav';
import { SEOHead } from './components/SEOHead';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { SocialImpact } from './pages/SocialImpact';
import { Link } from 'react-router-dom';

function App() {
  return (
    <>
      <SEOHead />
      <ToolNav />
      <Routes>
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/social-impact" element={<SocialImpact />} />
        <Route path="/video-converter" element={
          <Layout>
            <div className="text-center mb-12 space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400 tracking-tight">
                Video Format Converter
              </h1>
              <p className="text-lg text-slate-400 max-w-xl mx-auto">
                Convert MP4, WebM, MOV, AVI, and more.
                Fast, private, and client-side.
              </p>
            </div>
            <VideoConverter />
            <div className="mt-16">
              <AdSpace className="max-w-2xl mx-auto" slotId="footer-banner" />
            </div>
            <footer className="mt-16 text-center text-slate-600 text-sm">
              <p>&copy; {new Date().getFullYear()} Toolkit Lab. All rights reserved.</p>
              <p className="mt-1 text-xs opacity-50">Powered by FFmpeg.wasm & Antigravity</p>
              <div className="mt-4 flex justify-center gap-4 text-xs">
                <Link to="/" className="hover:text-slate-400 transition-colors">GIF Converter</Link>
                <span>•</span>
                <Link to="/privacy" className="hover:text-slate-400 transition-colors">Privacy Policy</Link>
                <span>•</span>
                <Link to="/about" className="hover:text-slate-400 transition-colors">About Us</Link>
                <span>•</span>
                <Link to="/contact" className="hover:text-slate-400 transition-colors">Contact</Link>
                <span>•</span>
                <Link to="/social-impact" className="hover:text-amber-400 transition-colors">Social Impact</Link>
              </div>
            </footer>
          </Layout>
        } />
        <Route path="/convert/:format" element={
          <Layout>
            {/* Hero Section */}
            <div className="text-center mb-12 space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 tracking-tight">
                Video to GIF
              </h1>
              <p className="text-lg text-slate-400 max-w-xl mx-auto">
                Ultra-fast, secure, and client-side conversion.
                Your files never leave your device.
              </p>
            </div>

            {/* Main Converter */}
            <GifConverter />

            {/* Ad Space */}
            <div className="mt-16">
              <AdSpace className="max-w-2xl mx-auto" slotId="footer-banner" />
            </div>

            {/* Footer */}
            <footer className="mt-16 text-center text-slate-600 text-sm">
              <p>&copy; {new Date().getFullYear()} Global Ultra-Fast GIF Converter. All rights reserved.</p>
              <p className="mt-1 text-xs opacity-50">Powered by FFmpeg.wasm & Antigravity</p>
              <div className="mt-4 flex justify-center gap-4 text-xs">
                <Link to="/privacy" className="hover:text-slate-400 transition-colors">Privacy Policy</Link>
                <span>•</span>
                <Link to="/about" className="hover:text-slate-400 transition-colors">About Us</Link>
                <span>•</span>
                <Link to="/contact" className="hover:text-slate-400 transition-colors">Contact</Link>
                <span>•</span>
                <Link to="/social-impact" className="hover:text-amber-400 transition-colors">Social Impact</Link>
              </div>
            </footer>
          </Layout>
        } />
        <Route path="/" element={
          <Layout>
            {/* Hero Section */}
            <div className="text-center mb-12 space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 tracking-tight">
                Video to GIF
              </h1>
              <p className="text-lg text-slate-400 max-w-xl mx-auto">
                Ultra-fast, secure, and client-side conversion.
                Your files never leave your device.
              </p>
            </div>

            {/* Main Converter */}
            <GifConverter />

            {/* Ad Space */}
            <div className="mt-16">
              <AdSpace className="max-w-2xl mx-auto" slotId="footer-banner" />
            </div>

            {/* Footer */}
            <footer className="mt-16 text-center text-slate-600 text-sm">
              <p>&copy; {new Date().getFullYear()} Global Ultra-Fast GIF Converter. All rights reserved.</p>
              <p className="mt-1 text-xs opacity-50">Powered by FFmpeg.wasm & Antigravity</p>
              <div className="mt-4 flex justify-center gap-4 text-xs">
                <Link to="/privacy" className="hover:text-slate-400 transition-colors">Privacy Policy</Link>
                <span>•</span>
                <Link to="/about" className="hover:text-slate-400 transition-colors">About Us</Link>
                <span>•</span>
                <Link to="/contact" className="hover:text-slate-400 transition-colors">Contact</Link>
                <span>•</span>
                <Link to="/social-impact" className="hover:text-amber-400 transition-colors">Social Impact</Link>
              </div>
            </footer>
          </Layout>
        } />
        <Route path="/prompt-pro" element={
          <Layout>
            <div className="text-center mb-12 space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400 tracking-tight">
                Prompt Pro
              </h1>
              <p className="text-lg text-slate-400 max-w-xl mx-auto">
                Turn vague ideas into professional prompts with AI.<br />
                <span className="text-emerald-400/80">Gourmet Lab: Business-ready recipes for restaurants & chefs.</span>
              </p>
            </div>
            <PromptPro />
            <footer className="mt-16 text-center text-slate-600 text-sm">
              <p>&copy; {new Date().getFullYear()} Toolkit Lab. All rights reserved.</p>
              <div className="mt-4 flex justify-center gap-4 text-xs">
                <Link to="/" className="hover:text-slate-400 transition-colors">Home</Link>
                <span>•</span>
                <Link to="/privacy" className="hover:text-slate-400 transition-colors">Privacy Policy</Link>
                <span>•</span>
                <Link to="/about" className="hover:text-slate-400 transition-colors">About Us</Link>
                <span>•</span>
                <Link to="/contact" className="hover:text-slate-400 transition-colors">Contact</Link>
                <span>•</span>
                <Link to="/social-impact" className="hover:text-amber-400 transition-colors">Social Impact</Link>
              </div>
            </footer>
          </Layout>
        } />
      </Routes>
    </>
  );
}

export default App;
