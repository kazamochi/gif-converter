import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { NetScouterProduct } from './pages/products/NetScouterProduct';
import { WarpShareProduct } from './pages/products/WarpShareProduct';
import { Layout } from './components/Layout';
import { Converter as GifConverter } from './features/gif-converter/components/GifConverter';
import { VideoConverter } from './features/video-converter/components/VideoConverter';
import PromptPro from './features/prompt-pro/components/PromptPro';
import InstantRetro from './features/image-lab/components/InstantRetro';
import ProLab from './features/image-lab/components/ProLab';
import { AdSpace } from './components/AdSpace';
import { ToolNav } from './components/ToolNav';
import { SEOHead } from './components/SEOHead';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { SocialImpact } from './pages/SocialImpact';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { Terms } from './pages/Terms';
import LandingPage from './components/LandingPage';
import { CookieConsent } from './components/CookieConsent';
import { Link } from 'react-router-dom';
import { Translation } from 'react-i18next';
import WarpShare from './features/warp-share/components/WarpShare';
import { DomainWatermark } from './components/DomainWatermark';

const NetScouter = lazy(() => import('./features/net-scouter'));
const JitterWidgetPage = lazy(() => import('./features/net-scouter/pages/JitterWidgetPage').then(m => ({ default: m.JitterWidgetPage })));
const AudioLabTest = lazy(() => import('./features/audio-lab/components/AudioLabTest').then(m => ({ default: m.AudioLabTest })));

function App() {
  return (
    <>
      <SEOHead />
      <ToolNav />
      <Routes>
        <Route path="/" element={<Layout maxWidth="max-w-6xl"><LandingPage /></Layout>} />
        <Route path="/product/net-scouter" element={<Layout><NetScouterProduct /></Layout>} />
        <Route path="/product/warp-share" element={<Layout><WarpShareProduct /></Layout>} />
        <Route path="/privacy" element={<Layout><PrivacyPolicy /></Layout>} />
        <Route path="/terms" element={<Layout><Terms /></Layout>} />
        <Route path="/about" element={<Layout><About /></Layout>} />
        <Route path="/contact" element={<Layout><Contact /></Layout>} />
        <Route path="/social-impact" element={<Layout><SocialImpact /></Layout>} />
        <Route path="/warp-share" element={
          <Layout>
            <WarpShare />
            <div className="mt-16">
              <AdSpace className="max-w-2xl mx-auto" slotId="footer-banner" />
            </div>
          </Layout>
        } />
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
              <p>&copy; {new Date().getFullYear()} Toolkit Lab. All rights reserved.</p>
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
        <Route path="/gif-converter" element={
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
          </Layout>
        } />
        <Route path="/retro-instant" element={
          <Layout>
            <div className="text-center mb-8 space-y-2">
              <h1 className="text-4xl md:text-5xl font-bold text-orange-500 font-mono tracking-tighter transform -rotate-2">
                <Translation>{(t) => t('retro.title')}</Translation>
              </h1>
              <p className="text-sm text-zinc-500 font-mono tracking-widest">
                <Translation>{(t) => t('retro.subtitle')}</Translation>
              </p>
            </div>
            <InstantRetro />
            <div className="mt-16">
              <AdSpace className="max-w-xl mx-auto" slotId="footer-banner" />
            </div>
          </Layout>
        } />
        <Route path="/image-tools" element={
          <Layout>
            <div className="text-center mb-12 space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-500 tracking-tight">
                Image Editor
              </h1>
              <p className="text-lg text-slate-400 max-w-xl mx-auto">
                Advanced Image Processing & Format Conversion.
              </p>
            </div>
            <ProLab />
            <div className="mt-16">
              <AdSpace className="max-w-xl mx-auto" slotId="footer-banner" />
            </div>
          </Layout>
        } />
        <Route path="/tools/jitter-widget" element={
          <Suspense fallback={
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
              <div className="text-green-400 font-mono text-xs animate-pulse">Loading Widget...</div>
            </div>
          }>
            <JitterWidgetPage />
          </Suspense>
        } />
        <Route path="/net-scouter" element={
          <Layout>
            <Suspense fallback={
              <div className="min-h-screen bg-slate-950 flex items-center justify-center font-mono text-green-500">
                <div className="animate-pulse tracking-widest uppercase text-sm border border-green-500/30 px-4 py-2">
                  Initializing Scouter HUD...
                </div>
              </div>
            }>
              <NetScouter />
            </Suspense>
          </Layout>
        } />
        <Route path="/lab/audio-internal-v1-test" element={
          <Suspense fallback={
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
              <div className="text-purple-400 font-mono text-sm animate-pulse">Loading Audio Lab...</div>
            </div>
          }>
            <AudioLabTest />
          </Suspense>
        } />
      </Routes >
      <DomainWatermark />
      <CookieConsent />
    </>
  );
}

export default App;
