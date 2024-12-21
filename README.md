# No Safe Nook - Survival Simulation Game

A browser-based survival simulation game where you manage a group of survivors in a war-torn world. Make difficult decisions, manage resources, and try to keep your group alive as long as possible.

## For Players

### Windows Users
1. Download `no-safe-nook-win.exe` from the latest release
2. Double-click the executable to run the game
3. The game will automatically open in your default browser
4. To quit the game, close both the browser tab and the terminal window

### Mac Users
1. Download `no-safe-nook-macos` from the latest release
2. Open Terminal
3. Navigate to the download folder: `cd Downloads`
4. Make the file executable: `chmod +x no-safe-nook-macos`
5. Run the game: `./no-safe-nook-macos`
6. To quit the game, close both the browser tab and the terminal window

### Linux Users
1. Download `no-safe-nook-linux` from the latest release
2. Open Terminal
3. Navigate to the download folder: `cd Downloads`
4. Make the file executable: `chmod +x no-safe-nook-linux`
5. Run the game: `./no-safe-nook-linux`
6. To quit the game, close both the browser tab and the terminal window

## For Developers

### Prerequisites
- Node.js 16 or higher
- npm (Node Package Manager)

### Setup
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Development Server
```bash
npm start
```

### Building Executables
To create standalone executables for all platforms:
```bash
npm run build
```

The executables will be created in the `dist` folder:
- Windows: `no-safe-nook-win.exe`
- macOS: `no-safe-nook-macos`
- Linux: `no-safe-nook-linux`

## Game Features

- **Resource Management**: Manage food, water, medicine, materials, and morale
- **Survivor System**: Each survivor has unique skills, relationships, and health status
- **Event System**: Face random events that require difficult choices
- **Russian Roulette of Misfortune**: Weekly random catastrophic events
- **Relationship System**: Manage relationships between survivors

## License

This project is open source and available under the MIT License. 