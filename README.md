# Countdown Timer Website

> [!WARNING]
> This Project was vibe coded and is not representative for my coding skills.
> I didn't check every code line so use at your own risk! It works for me, so didn't care enough to make it perfect.


A modern, responsive countdown timer website with multiple themes and timezone support.

## Features

- **Live Countdown**: Real-time countdown to any specific date and time
- **Multiple Themes**: 
  - Gradient (default) - Vibrant animated gradient background
  - shadcn/ui Dark - Modern dark theme with clean aesthetics
  - Minimalistic - Simple gray background with cozy fonts
- **Timezone Support**: Configure countdown in any timezone (city names or UTC offsets)
- **Collapsible Sidebar**: Settings panel that can be hidden for full-screen countdown
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Smooth Animations**: Elegant transitions and micro-interactions
- **Local Storage**: Settings are saved and persist between sessions

## Quick Start with Docker

### Build and Run
```bash
# Build the Docker image
docker build -t countdown-timer .

# Run the container
docker run -p 8080:80 countdown-timer
```

Then visit `http://localhost:8080` in your browser.

### Development Setup

If you want to run locally without Docker:

```bash
# Start a simple HTTP server
python3 -m http.server 8000

# Or use Node.js if you prefer
npx serve .

# Then visit http://localhost:8000
```

## Usage

1. **Open Settings**: Click the menu button (☰) in the top-left corner
2. **Configure Countdown**:
   - Set a title for your countdown
   - Choose date and time
   - Select timezone (city style like "Europe/Berlin" or offset style like "UTC+8")
   - Pick your preferred theme
3. **Apply Changes**: Click "Apply Changes" to save settings
4. **Close Sidebar**: Click outside the sidebar or press Escape to hide it

## Keyboard Shortcuts

- `Ctrl/Cmd + B`: Toggle sidebar
- `Escape`: Close sidebar

## Themes

### Gradient (Default)
- Vibrant purple-blue gradient background
- Animated floating particles
- Glowing text effects
- Orbitron font for countdown numbers

### shadcn/ui Dark
- Dark theme inspired by shadcn/ui components
- Clean, modern aesthetics
- Space Grotesk font for typography
- Subtle glass morphism effects

### Minimalistic
- Simple gray background
- Clean, distraction-free design
- Source Sans Pro font for comfortable reading
- Minimal animations

## Technologies Used

- **HTML5** - Semantic markup
- **Tailwind CSS** - Utility-first CSS framework
- **Vanilla JavaScript** - No framework dependencies
- **Font Awesome** - Icons
- **Google Fonts** - Typography

## Browser Support

- Chrome/Chromium 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## License

MIT License - feel free to use this project for personal or commercial purposes.


## IDEAS
- maybe i can add predefined countdown settings which are accessable via the path like /birthday or /anniversary and /custom (settings disabled) is this where you can make a custom one