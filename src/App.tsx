import { Layout } from './components/Layout';
import { Converter } from './components/Converter';
import { AdSpace } from './components/AdSpace';

function App() {
  return (
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
      <Converter />

      {/* Ad Space */}
      <div className="mt-16">
        <AdSpace className="max-w-2xl mx-auto" slotId="footer-banner" />
      </div>

      {/* Footer */}
      <footer className="mt-16 text-center text-slate-600 text-sm">
        <p>&copy; {new Date().getFullYear()} Global Ultra-Fast GIF Converter. All rights reserved.</p>
        <p className="mt-1 text-xs opacity-50">Powered by FFmpeg.wasm & Antigravity</p>
      </footer>
    </Layout>
  );
}

export default App;
