# Koh-Pilot

A practice tracking application with a built-in metronome for musicians and performers.

## Features

### Practice Tracking
- Set the number of repetitions (1-10)
- Visual circle grid to track completed repetitions
- Automatic reset after completing all repetitions
- Celebration animation with confetti when finished

### Metronome
- Adjustable BPM (40-200 beats per minute)
- Multiple click tones:
  - **Beep**: High-pitched beep sound
  - **Click**: Standard metronome click
  - **Tick**: Short, sharp tick sound
  - **Woodblock**: Multi-layered woodblock sound
- Volume control (0-100%)
- Play/pause functionality
- Settings persist between sessions

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to the local development URL

## Usage

1. **Set Repetitions**: Click the settings icon and choose how many repetitions you want to practice
2. **Configure Metronome**: In settings, adjust BPM, select a click tone, and set volume
3. **Start Practice**: Click the play button to start the metronome, then use the check button to mark completed repetitions
4. **Reset**: Use the X button to reset your progress at any time

## Technologies

- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Web Audio API for metronome functionality
- Lucide React for icons

## Browser Compatibility

The metronome feature requires a modern browser with Web Audio API support. The application works best in:
- Chrome 66+
- Firefox 60+
- Safari 14+
- Edge 79+
