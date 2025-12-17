# 🛠️ Toolkit Lab: Privacy-First Web Tools

> [!IMPORTANT]
> **🛡️ Official Repository of Toolkit Lab**
> 
> This is the official source code repository. All processing is **100% client-side**.
> We do NOT store any user files, IP addresses, or logs on our servers.
> 
> [View Source Code Transparency Policy](#security--privacy)

[![License: GPLv3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![Built with React](https://img.shields.io/badge/Built%20with-React-61DAFB?logo=react)](https://reactjs.org/)
[![Powered by WebAssembly](https://img.shields.io/badge/Powered%20by-WebAssembly-orange)](https://webassembly.org/)

> **A suite of powerful, privacy-focused web tools running entirely in your browser.**
> **No server uploads. No data collection. 100% Client-side.**

[🚀 **Live Demo**](https://toolkit-lab.com) | [🤝 Contributing](#contributing)

---

## ✨ Features

### 🎬 **Media Tools**
- **GIF Converter**: Ultra-fast video to GIF conversion with cropping, trimming, and speed control.
- **Video Converter**: Convert between MP4, WebM, AVI, and MOV formats locally.
- **Retro Lab**: Apply vintage filters, noise, and glitch effects to your photos.
- **Image Editor**: Professional-grade image editing (crop, filter, adjust).

### 🌐 **Network Tools**
- **Net Scouter**: Advanced network diagnostics with Bufferbloat testing, WebRTC leak detection, and real-time jitter monitoring.

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
| **WebRTC (PeerJS)** | P2P file transfer & network diagnostics |
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

This project is licensed under the **GNU General Public License v3.0**.

**Why GPLv3?** This ensures that anyone who uses or modifies this code must also keep their derivative work open-source, preventing closed-source commercial copycats.

See the [LICENSE](LICENSE) file for full details.

---

## 🛡️ Security & Privacy

**English:**
This tool is intended for network diagnostic and media processing purposes only. All tests (Speed Test, Bufferbloat, WebRTC Leak Detection, and media conversions) run **strictly on the client-side** within your browser. **No personal data, IP addresses, or files are stored on our servers.**

To ensure transparency, the source code is publicly available on GitHub. Feel free to audit the code.

**日本語:**
このツールは、純粋なネットワーク診断およびメディア処理を目的としています。バッファブロート測定やIP漏洩チェック、メディア変換を含むすべてのテストは、お客様のブラウザ内（クライアントサイド）のみで実行されます。**計測結果やIPアドレス、ファイルなどの個人データが当サイトのサーバーに保存・送信されることは一切ありません。**

透明性を担保するため、ソースコードはGitHub上で公開しています。

---

<div align="center">
  <strong>Made with ❤️ by Toolkit Lab</strong>
  <br>
  <sub>Developed by <a href="https://github.com/kazamochi">@kazamochi</a> with Antigravity AI</sub>
</div>
