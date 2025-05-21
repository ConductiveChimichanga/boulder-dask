# Boulder Dash Game Clone

A modern implementation of the classic Boulder Dash game using TypeScript and Phaser 3 game framework, generated with the help of CLaude 3.5 Agent mode in Copilot.

## Description

Boulder Dash is a classic game where players navigate through cave systems, collecting diamonds while avoiding falling boulders and dangerous creatures. This implementation features:

- Classic Boulder Dash gameplay mechanics
- Modern TypeScript implementation
- Phaser 3 game engine
- Various game elements:
  - Player character
  - Destructible walls
  - Boulders
  - Diamonds
  - Enemies (Butterflies and Fireflies)
  - Magic walls
  - Amoeba

## Prerequisites

- Node.js (latest LTS version recommended)
- npm (comes with Node.js)

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

## Development

To run the game in development mode:

```bash
npm run dev
```

This will start a Vite development server. Open your browser and navigate to the URL shown in the terminal (typically http://localhost:5173).

## Building

To build the game for production:

```bash
npm run build
```

## Project Structure

- `src/` - Source code directory
  - `game.ts` - Main game scene and configuration
  - `level.ts` - Level management and tile system
  - `menuScene.ts` - Game menu implementation
  - `types.ts` - TypeScript interfaces and types
  - `tiles/` - Game tile implementations
    - Various tile types (Amoeba, Boulder, Butterfly, etc.)

## Technologies Used

- TypeScript
- Phaser 3
- Vite (Build tool)

## License

ISC

## Contributing

Feel free to open issues and submit pull requests.
