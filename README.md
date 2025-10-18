# PokerPay
[![Ask DeepWiki](https://devin.ai/assets/askdeepwiki.png)](https://deepwiki.com/franpfeiffer/PokerPay)

PokerPay is a web application designed to simplify the management of home poker games. It allows you to create game tables, add players, track buy-ins and rebuys, and automatically calculate the final results and payment settlements. Built as a Progressive Web App (PWA), it can be installed on your device for easy access.

## Features

*   **Game Management**: Create and manage multiple poker games, tracking active and ended sessions.
*   **Player Tracking**: Add players to games with their initial buy-in amounts.
*   **Live Chip Counts**: Update players' chip amounts in real-time as the game progresses.
*   **Rebuy System**: Easily handle rebuys and add-ons, with transactions tracked between players.
*   **Result Calculation**: Automatically calculate each player's net winnings or losses at the end of the game.
*   **Optimal Payment Settlements**: The app provides a simplified list of who-owes-who to make cashing out quick and easy.
*   **Transaction History**: View a detailed history of all rebuys and cash-ins within a game.
*   **Local Persistence**: Your game data is saved directly in your browser's `localStorage`, so you can close the tab and return to your game anytime.
*   **Progressive Web App (PWA)**: Installable on mobile and desktop devices for a native app-like experience and offline accessibility.

## Tech Stack

*   **Frontend**: React, TypeScript
*   **Build Tool**: Vite
*   **Styling**: Tailwind CSS
*   **Icons**: Lucide React
*   **PWA**: `vite-plugin-pwa`

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

You need to have Node.js and npm installed on your machine.

### Usage

1.  Go to the app: [PokerPay](https://pokerpay.pfeifferf.com).

### Installation & Usage

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/franpfeiffer/PokerPay.git
    ```

2.  **Navigate to the project directory:**
    ```sh
    cd PokerPay
    ```

3.  **Install NPM packages:**
    ```sh
    npm install
    ```

4.  **Run the development server:**
    ```sh
    npm run dev
    ```
    The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

5.  **Build for production:**
    ```sh
    npm run build
    ```
    This command builds the app for production to the `dist` folder.
