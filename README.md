# 🎬 Global Ultra-Fast GIF Converter

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Built with React](https://img.shields.io/badge/Built%20with-React-61DAFB?logo=react)](https://reactjs.org/)
[![Powered by FFmpeg.wasm](https://img.shields.io/badge/Powered%20by-FFmpeg.wasm-green)](https://github.com/ffmpegwasm/ffmpeg.wasm)

> **Convert videos to GIFs instantly in your browser. No upload required. 100% private. Lightning fast.**

[🚀 **Live Demo**](https://yourdomain.com) | [📖 Documentation](#features) | [🤝 Contributing](#contributing)

---

## ✨ Features

### 🔒 **Privacy-First**
- **All processing happens in your browser** using WebAssembly (ffmpeg.wasm)
- Your files **never leave your device** - no server uploads
- No data collection, no tracking (except anonymous analytics)

### ⚡ **Lightning Fast**
- Instant conversion with no upload/download delays
- Runs at full speed on your hardware
- Works offline after initial load

### 🎨 **Powerful Editing Tools**
- **Interactive Cropping** - Drag & resize with aspect ratio presets (1:1, 16:9, 9:16, 4:5, 2.35:1)
- **Precise Trimming** - Select exact start/end points with live preview
- **Speed Control** - 0.5x to 2x playback speed
- **Playback Modes** - Normal, Reverse, Boomerang
- **Zoom Preview** - 10% to 200% zoom for detailed editing
- **Custom Output Size** - Quick presets (128px, 360px, 480px, 640px) or manual input
- **FPS Control** - Optimize file size vs quality

### 🌍 **Multi-Language Support**
Available in **10 languages**:
- 🇺🇸 English
- 🇯🇵 日本語 (Japanese)
- 🇪🇸 Español (Spanish)
- 🇧🇷 Português (Portuguese)
- 🇩🇪 Deutsch (German)
- 🇫🇷 Français (French)
- 🇨🇳 中文 (Chinese)
- 🇰🇷 한국어 (Korean)
- 🇷🇺 Русский (Russian)
- 🇮🇩 Indonesia (Indonesian)

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React + TypeScript** | Type-safe UI framework |
| **Vite** | Lightning-fast build tool |
| **FFmpeg.wasm** | Video processing in WebAssembly |
| **Tailwind CSS** | Modern, responsive styling |
| **react-i18next** | Internationalization (i18n) |
| **react-helmet-async** | SEO optimization |
| **Firebase Hosting** | Deployment with COOP/COEP headers |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/gif-converter.git
cd gif-converter

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

Output will be in the `dist/` directory.

---

## 📦 Deployment

### Firebase Hosting (Recommended)

This project requires specific headers for `SharedArrayBuffer` support:

```json
{
  "headers": [
    {
      "source": "**",
      "headers": [
        { "key": "Cross-Origin-Embedder-Policy", "value": "require-corp" },
        { "key": "Cross-Origin-Opener-Policy", "value": "same-origin" }
      ]
    }
  ]
}
```

Deploy to Firebase:

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

### Other Platforms

For Vercel, Netlify, or other platforms, ensure COOP/COEP headers are configured. See `firebase.json` for reference.

---

## 🎯 How It Works

1. **Upload** - Select a video file (MP4, MOV, AVI, WebM)
2. **Edit** - Trim, crop, adjust speed, and preview in real-time
3. **Convert** - FFmpeg.wasm processes the video entirely in your browser
4. **Download** - Get your optimized GIF instantly

**No servers involved. No waiting. Just pure browser magic.** ✨

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Development Guidelines

- Follow existing code style (TypeScript + ESLint)
- Add comments for complex logic
- Test on multiple browsers (Chrome, Firefox, Safari)
- Ensure mobile responsiveness

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **[FFmpeg.wasm](https://github.com/ffmpegwasm/ffmpeg.wasm)** - The legendary video processing library
- **[React](https://reactjs.org/)** - UI framework
- **[Tailwind CSS](https://tailwindcss.com/)** - Styling
- **[Lucide Icons](https://lucide.dev/)** - Beautiful icons

---

## 📊 Project Stats

- **Bundle Size**: ~110 kB (gzipped)
- **Languages**: 10
- **Browser Support**: Chrome 92+, Firefox 90+, Safari 15.2+, Edge 92+
- **Mobile**: Full touch support for interactive cropping

---

## 🔗 Links

- [Live Demo](https://yourdomain.com)
- [Report Bug](https://github.com/yourusername/gif-converter/issues)
- [Request Feature](https://github.com/yourusername/gif-converter/issues)
- [Privacy Policy](https://yourdomain.com/privacy)

---

<div align="center">

**Made with ❤️ for the global community**

If you find this project useful, please consider giving it a ⭐!

</div>
