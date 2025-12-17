import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import './i18n' // Initialize i18n
import App from './App.tsx'
import { registerSW } from './pwa'
import { initGA } from './analytics'
import { ALLOWED_DOMAINS } from './config/security'

registerSW()
initGA()

// ========================================
// 🛡️ Domain Integrity Check
// ========================================
const currentHostname = window.location.hostname;

if (!ALLOWED_DOMAINS.some(domain => currentHostname.includes(domain))) {
  console.warn(
    '%c⚠️ UNAUTHORIZED DOMAIN DETECTED',
    'color: #ff4444; font-size: 16px; font-weight: bold; background: black; padding: 10px;'
  );
  console.log(
    '%cThis application is running on an unauthorized domain.\nOfficial site: https://toolkit-lab.com',
    'color: #ffaa00; font-size: 12px;'
  );

  // 🪤 TRAP: Self-Destruct Timer (60 seconds)
  setTimeout(() => {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.95);
      color: #ff4444;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 999999;
      font-family: monospace;
    `;
    overlay.innerHTML = `
      <div style="text-align: center;">
        <div style="font-size: 48px; margin-bottom: 20px;">⚠️</div>
        <div style="font-size: 24px; font-weight: bold; margin-bottom: 10px;">UNAUTHORIZED DOMAIN</div>
        <div style="font-size: 14px; color: #ffaa00; margin-bottom: 30px;">
          This site is running stolen code from Toolkit Lab.<br>
          Redirecting to the official site...
        </div>
        <div style="font-size: 12px; opacity: 0.6;">toolkit-lab.com</div>
      </div>
    `;
    document.body.appendChild(overlay);

    setTimeout(() => {
      window.location.href = 'https://toolkit-lab.com';
    }, 3000);
  }, 60000); // 60 seconds
}

// ========================================
// 🎨 Console Signature
// ========================================
console.log(
  '%c╔══════════════════════════════════════╗',
  'color: #00ff00; font-family: monospace; font-size: 14px;'
);
console.log(
  '%c║   🛠️  TOOLKIT LAB - Official Repo   ║',
  'color: #00ff00; font-family: monospace; font-size: 14px; font-weight: bold;'
);
console.log(
  '%c╚══════════════════════════════════════╝',
  'color: #00ff00; font-family: monospace; font-size: 14px;'
);
console.log(
  '%c✨ Built with React + TypeScript + WebAssembly',
  'color: #61dafb; font-size: 12px;'
);
console.log(
  '%c🛡️ 100% Client-Side Processing - No Data Logging',
  'color: #4ade80; font-size: 12px; font-weight: bold;'
);
console.log(
  '%c📖 Source: https://github.com/kazamochi/gif-converter',
  'color: #888; font-size: 11px;'
);
console.log(
  '%c⚖️ Licensed under GPLv3',
  'color: #888; font-size: 11px;'
);
console.log('');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>,
)
