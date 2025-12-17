# 🚀 Project Spec: Audio Lab (The "Infinite MIDI Station")

**Objective:** Build a high-retention, client-side AI music workstation.
**Core Concept:** "AI Assisted MIDI Composition & Editing."
**Tech Stack:** `Magenta.js` (AI), `Tone.js` (Audio), `React` + `Canvas` (UI).

---

## 1. 🧠 Core Logic: The "Master Chord" Hierarchy
To ensure musical coherence during iterative generation ("Lock & Roll"), the system must enforce a strict dependency chain.

### 1.1. Dependency Chain
1.  **Global Context**: BPM, Key, Scale.
2.  **Master Chord Progression**: The harmonic foundation (Hidden layer).
3.  **Tracks**: Melody, Bass, Drums are generated *constrained* to the Master Chords.

### 1.2. Smart Regeneration Logic
* **Case A: Full Regeneration (Unlock All)**
    * AI picks a NEW Chord Progression based on the "Vibe".
    * All tracks are re-generated.
* **Case B: Partial Regeneration (Lock Active)**
    * **CRITICAL RULE**: If *any* track is locked, the **Master Chord Progression is LOCKED**.
    * **Action**: The AI generates a new pattern for the unlocked track, but *must* follow the existing chord structure.
    * *Result:* Users can change the bassline without clashing with the locked melody.

---

## 2. 🎣 "Addictive" UX Features

### 2.1. Vibe Selector (Chord Presets)
Replace random chaos with curated, emotional progressions to hook DTM users.
* **"J-Pop Royal"**: `IV - V - iii - vi` (The hit-maker).
* **"City Pop / Night"**: `IVM7 - III7 - vim7 - I7` (Jazzy/Lo-Fi).
* **"Anime Hero"**: `vi - VII - I` (Komuro style).
* **"Cyberpunk"**: Modal/Suspended chords.

### 2.2. The "Lock & Roll" System
Encourage multiple retries (and ad views).
* **UI**: Add a 🔒 Lock toggle next to each track (Melody, Chords, Bass, Drums).
* **Behavior**: Locked tracks persist. Unlocked tracks regenerate.

### 2.3. Instant Polish (Effect Rack)
Make the output sound "Pro" immediately.
* **Space (Slider)**: Controls Reverb mix (Dry -> Stadium).
* **Lo-Fi (Switch)**: Applies LowPass Filter + BitCrusher.

---

## 3. 🎹 Interactive Editor (The "Web DAW")
A visual workspace to edit the AI's output.

### 3.1. Piano Roll Canvas
* **Visuals**: Dark mode, grid-based, "Cubase-style" look.
* **Interactions**:
    * **Click Grid**: Add Note.
    * **Click Note**: Delete Note.
    * **Drag Note Body**: Move (Pitch/Time).
    * **Drag Note Edge**: Resize Duration.
* **Quantize**: Snap all inputs to nearest 1/16th grid.

### 3.2. Import / Export
* **Import**: Drag & Drop a `.mid` file onto the canvas to visualize/edit it.
* **Export**: Download button generates a Standard MIDI File (Type 1) containing all tracks.

---

## 4. 💰 Monetization Strategy (Ad-Supported)
* **Trigger**: User clicks "GENERATE".
* **UI**: Show a Modal with a progress bar and a **300x250 Rectangle Ad**.
* **Constraint**: Force a **minimum delay of 4000ms (4 seconds)** before showing results, even if AI finishes early.

---

## 5. 🔗 Serverless Sharing
Serialize MIDI JSON -> Compress (LZ-String) -> Append to URL (`?song=...`).

---

## 6. Implementation Roadmap
1.  **Setup**: Initialize Magenta (`MusicRNN`) and Tone.js.
2.  **UI**: Build the Piano Roll Canvas & Vibe Selector.
3.  **Logic**: Implement the Master Chord dependency & Lock system.
4.  **Engine**: Develop the Humanization & Articulation logic.
5.  **Ads**: Integrate the 4-second loading modal.
6.  **I/O**: Add MIDI Export & Import logic.

---

## 7. 🎭 The "Humanization & Articulation" Engine (Pro-Level Output)
To ensure a professional and emotive sound, the system automatically injects performance nuances during the generation process.

### 7.1. Dynamic Velocity Maps
- **Drums**: Auto-injects "Ghost Notes" on snare (low velocity fills) and adds 16th-note hi-hat accents (Strong-Weak-Medium-Weak).
- **Melody/Bass**: Accents start-of-bar notes and applies "Human-like" velocity randomization (±5 range).

### 7.2. Micro-Timing (Human Groove)
- Displaces notes from the perfect 1/16th grid by ±5-15ms to avoid a robotic, quantized feel.

### 7.3. Instrument Specific Physics
- **Guitar**: Strumming emulation (adds a serial timing offset of 10-30ms between notes in a chord to mimic pick travel).
- **Strings/Synth**: CC#1 (Modulation) or CC#11 (Expression) automation for swells and vibrato on long sustained notes.

---

## 8. 🎹 Universal Instrument Categories (Scalability)
To support a vast array of instruments without refactoring, the system uses a categorized Articulation Engine.

| Category | Typical Instruments | Special MIDI Logic (Automatic) |
| :--- | :--- | :--- |
| **Percussion** | Drums, Percussion, Taiko | Ghost notes, Round Robin, Human Timing. |
| **Plucked** | Guitar, Bass, Harp, Koto | Strum Engine (Up/Down), Chord Voicing, Muting. |
| **Sustained** | Strings, Brass, Flute | CC#11 Swells, Legato Note Overlap, Auto-Vibrato. |
| **Keyboard** | Piano, Organs, EP | CC#64 Sustain Pedal automation, Weight Mapping. |
| **Synth** | Lead, Pads | CC#74 Cutoff, Portamento time calculation. |

---

## 9. 📦 Material Provider & Export (Professional Workflow)
To attract professional DAW users who need high-quality components, the system optimizes for individual part extraction.

### 9.1. Individual Part "Gacha"
- Users can click "Regenerate" on a per-track basis (e.g., cycle through 100 drum patterns while keeping the Bass track).
- Each click triggers the ad-wait flow, maximizing revenue from "ideal phrase hunting".

### 9.2. Pro Export Options
- **Drag & Drop**: Small handle icon on each track allowing the user to drag the MIDI directly into their DAW (DAW must support browser drop, otherwise falls back to file download).
- **MIDI Clipboard**: Standard MIDI File data copied to clipboard for instant pasting.
- **Stem Export**: Zip all tracks as individual MIDI files for session-ready importing.

### 9.3. Visualization for Selection
- Small "Thumbnail" piano rolls for each generated variation to allow quick visual scanning of complexity.

