# GameScout

GameScout is a community-driven game tracking platform that connects gamers and enables them to discover, review, and discuss their favorite games.

## Features

- **Game Discovery**: Browse and search through a comprehensive database of games
- **Game Reviews**: Share your thoughts and experiences by writing reviews for games
- **Community Interaction**: Connect with other gamers, follow their activities, and engage in discussions
- **Wishlists**: Keep track of games you're interested in
- **User Profiles**: Customize your profile and showcase your gaming preferences
- **Real-time Updates**: Stay informed about the latest game releases and community activities

## Tech Stack

### Frontend
- React.js with TypeScript
- Material-UI (MUI) for styling
- Axios for API requests

### Backend
- Node.js with Express
- TypeScript
- PostgreSQL database
- IGDB API integration for game data
- JWT for authentication

### Infrastructure
- Cron jobs for automated game data updates
- Message queue for handling game data processing
- RESTful API architecture
- Nginx for reverse proxy

## Getting Started

### Prerequisites
- Node.js
- PostgreSQL
- IGDB API credentials

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd gamescout
```

2. Install dependencies
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. Set up environment variables
```bash
# Create .env files in both server and client directories
# Add necessary environment variables
```

4. Start the development servers
```bash
# Start server
cd server
npm run dev

# Start client
cd client
npm run dev
```