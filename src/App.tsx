import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { NetScouterProduct } from './pages/products/NetScouterProduct';
import { WarpShareProduct } from './pages/products/WarpShareProduct';
import { Layout } from './components/Layout';
// Components are loaded via lazy imports below
import { AdSpace } from './components/AdSpace';
import { ToolNav } from './components/ToolNav';
import { SEOHead } from './components/SEOHead';
import { ToolDescription } from './components/ToolDescription';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { SocialImpact } from './pages/SocialImpact';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { Terms } from './pages/Terms';
import LandingPage from './components/LandingPage';
import { CookieConsent } from './components/CookieConsent';
import { Link } from 'react-router-dom';
import { Translation } from 'react-i18next';
// WarpShare lazy load moved below
import { DomainWatermark } from './components/DomainWatermark';

const NetScouter = lazy(() => import('./features/net-scouter'));
const JitterWidgetPage = lazy(() => import('./features/net-scouter/pages/JitterWidgetPage').then(m => ({ default: m.JitterWidgetPage })));
// MIDI系は一時避難 (Magenta.js依存を排除)
// const AudioLabTest = lazy(() => import('./features/audio-lab/components/AudioLabTest').then(m => ({ default: m.AudioLabTest })));
// const AudioLab = lazy(() => import('./features/audio-lab/components/AudioLab').then(m => ({ default: m.AudioLab })));
// const AudioLabV2 = lazy(() => import('./features/audio-lab-v2/components/AudioLabV2').then(m => ({ default: m.AudioLabV2 })));

// Image Lab Pro - New AI Features
const BackgroundRemoverPage = lazy(() => import('./features/eraser/pages/BackgroundRemoverPage'));
const MagicEraserPage = lazy(() => import('./features/eraser/pages/MagicEraserPage'));
const SVGVectorizerPage = lazy(() => import('./features/creator/pages/SVGVectorizerPage'));

// Lazy load major tool components to optimize bundle size
const GifConverter = lazy(() => import('./features/gif-converter/components/GifConverter').then(module => ({ default: module.Converter })));
const VideoConverter = lazy(() => import('./features/video-converter/components/VideoConverter').then(module => ({ default: module.VideoConverter })));
const PromptPro = lazy(() => import('./features/prompt-pro/components/PromptPro'));
const InstantRetro = lazy(() => import('./features/image-lab/components/InstantRetro'));
const ProLab = lazy(() => import('./features/image-lab/components/ProLab'));
const WarpShare = lazy(() => import('./features/warp-share/components/WarpShare'));

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
            <div className="mt-16 mb-8">
              <AdSpace className="max-w-4xl mx-auto" slotId="warp-mid-ad" />
            </div>
            <Suspense fallback={<div className="h-64 flex items-center justify-center"><div className="animate-spin h-8 w-8 border-4 border-indigo-500 rounded-full border-t-transparent"></div></div>}>
              <ToolDescription toolId="warp-share" />
            </Suspense>
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
            <Suspense fallback={<div className="h-96 flex items-center justify-center text-slate-500">Loading Video Converter...</div>}>
              <VideoConverter />
              <div className="mt-16 mb-8">
                <AdSpace className="max-w-4xl mx-auto" slotId="vid-mid-ad" />
              </div>
              <ToolDescription toolId="video-converter" />
            </Suspense>
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
            <Suspense fallback={<div className="h-96 flex items-center justify-center text-slate-500">Loading GIF Converter...</div>}>
              <GifConverter />
              <div className="mt-16 mb-8">
                <AdSpace className="max-w-4xl mx-auto" slotId="gif-mid-ad" />
              </div>
            </Suspense>
            <ToolDescription toolId="gif-converter" />

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
            <Suspense fallback={<div className="h-96 flex items-center justify-center text-slate-500">Loading GIF Converter...</div>}>
              <GifConverter />
              <div className="mt-16 mb-8">
                <AdSpace className="max-w-4xl mx-auto" slotId="gif-mid-ad" />
              </div>
            </Suspense>
            <ToolDescription toolId="gif-converter" />

            {/* Ad Space */}
            <div className="mt-16">
              <AdSpace className="max-w-2xl mx-auto" slotId="footer-banner" />
            </div>
          </Layout>
        } />
        <Route path="/prompt-pro" element={
          <Layout>
            <Suspense fallback={<div className="h-96 flex items-center justify-center text-slate-500">Loading PromptPro...</div>}>
              <PromptPro />
              <ToolDescription toolId="prompt-pro" />
            </Suspense>
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
            <Suspense fallback={<div className="h-96 flex items-center justify-center text-orange-500">Loading Retro Lab...</div>}>
              <InstantRetro />
              <div className="mt-16 mb-8">
                <AdSpace className="max-w-4xl mx-auto" slotId="retro-mid-ad" />
              </div>
              <ToolDescription toolId="retro-instant" />
            </Suspense>
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
            <Suspense fallback={<div className="h-96 flex items-center justify-center text-red-500">Loading Image Editor...</div>}>
              <ProLab />
              <div className="mt-16 mb-8">
                <AdSpace className="max-w-4xl mx-auto" slotId="img-mid-ad" />
              </div>
              <ToolDescription toolId="image-tools" />
            </Suspense>
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
              <ToolDescription toolId="net-scouter" />
            </Suspense>
          </Layout>
        } />
        <Route path="/eraser/background-remover" element={
          <Layout>
            <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-orange-500">Loading AI Tools...</div>}>
              <BackgroundRemoverPage />
            </Suspense>
          </Layout>
        } />
        <Route path="/eraser/magic-eraser" element={
          <Layout>
            <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-purple-500">Loading AI Tools...</div>}>
              <MagicEraserPage />
            </Suspense>
          </Layout>
        } />
        <Route path="/creator/svg-vectorizer" element={
          <Layout>
            <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-emerald-500">Loading AI Tools...</div>}>
              <SVGVectorizerPage />
            </Suspense>
          </Layout>
        } />
      </Routes >
      <DomainWatermark />
      <CookieConsent />
    </>
  );
}

export default App;
