import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Converter } from './components/Converter';
import { AdSpace } from './components/AdSpace';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { SEOHead } from './components/SEOHead';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Link } from 'react-router-dom';

function App() {
  return (
    <>
      <SEOHead />
      <Routes>
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/convert/:format" element={
          <Layout>
            {/* Hero Section */}
            <div className="text-center mb-12 space-y-4">
              <div className="flex justify-end mb-4">
                <LanguageSwitcher />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 tracking-tight">
                Video to GIF
              </h1>
              <p className="text-lg text-slate-400 max-w-xl mx-auto">
                Ultra-fast, secure, and client-side conversion.
                Your files never leave your device.
              </p>
            </div>

            {/* Main Converter */}
            <Converter />

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
              </div>
            </footer>
          </Layout>
        } />
        <Route path="/" element={
          <Layout>
            {/* Hero Section */}
            <div className="text-center mb-12 space-y-4">
              <div className="flex justify-end mb-4">
                <LanguageSwitcher />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 tracking-tight">
                Video to GIF
              </h1>
              <p className="text-lg text-slate-400 max-w-xl mx-auto">
                Ultra-fast, secure, and client-side conversion.
                Your files never leave your device.
              </p>
            </div>

            {/* Main Converter */}
            <Converter />

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
              </div>
            </footer>
          </Layout>
        } />
      </Routes>
    </>
  );
}

export default App;
