# 🛠️ Toolkit Lab: Privacy-First Web Tools

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Built with React](https://img.shields.io/badge/Built%20with-React-61DAFB?logo=react)](https://reactjs.org/)
[![Powered by WebAssembly](https://img.shields.io/badge/Powered%20by-WebAssembly-orange)](https://webassembly.org/)

> **A suite of powerful, privacy-focused web tools running entirely in your browser.**
> **No server uploads. No data collection. 100% Client-side.**

[🚀 **Live Demo**](https://web-tool-kit.web.app) | [🤝 Contributing](#contributing)

---

## ✨ Features

### 🎬 **Media Tools**
- **GIF Converter**: Ultra-fast video to GIF conversion with cropping, trimming, and speed control.
- **Video Converter**: Convert between MP4, WebM, AVI, and MOV formats locally.
- **Retro Lab**: Apply vintage filters, noise, and glitch effects to your photos.
- **Image Editor**: Professional-grade image editing (crop, filter, adjust).

### ⚡ **Productivity Tools**
- **Warp Share**: Instant P2P file transfer between devices via QR code (End-to-End Encrypted).
- **Prompt Pro**: AI prompt engineering assistant for better generation results.

---

## 🔒 Why Toolkit Lab?

- **Privacy First**: All processing happens in your browser using WebAssembly. Your files never leave your device.
- **Lightning Fast**: No upload/download waiting times. Uses your device's full power.
- **Offline Capable**: Works without internet connection once loaded (PWA support).
- **Open Source**: Transparent development with modern web technologies.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React + TypeScript** | Type-safe UI framework |
| **Vite** | Lightning-fast build tool |
| **FFmpeg.wasm** | Video processing in WebAssembly |
| **WebRTC (PeerJS)** | P2P file transfer for Warp Share |
| **Tailwind CSS** | Modern, responsive styling |
| **i18next** | Internationalization (EN/JA) |
| **Firebase Hosting** | Deployment with COOP/COEP headers |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/kazamochi/gif-converter.git
cd gif-converter

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

---

## 📦 Deployment

### Firebase Hosting

This project requires `SharedArrayBuffer` support (COOP/COEP headers).

```bash
npm run build
firebase deploy --only hosting
```

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <strong>Made with ❤️ by Toolkit Lab</strong>
</div>
