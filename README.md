# GameScout

GameScout is a community-driven game tracking platform that connects gamers and enables them to discover, review, and discuss their favorite games.

## Features

- **Game Discovery**: Browse and search through a comprehensive database of games
- **Game Reviews**: Share your thoughts and experiences by writing reviews for games
- **Community Interaction**: Connect with other gamers, follow their activities, and engage in discussions
- **Wishlists**: Keep track of games you're interested in
- **User Profiles**: Customize your profile and showcase your gaming preferences
- **Real-time Updates**: Stay informed about the latest game releases and community activities
- **AI Integration**: An AI integrated chatbot using Pinecone for vector persistence and the legacy gpt-3.5-turbo as the LLM.

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
- Google OAuth
- FastAPI 

### Infrastructure
- Cron jobs for automated game data updates
- Message queue for handling game data processing
- RESTful API architecture
- Nginx for reverse proxy
- FastAPI service for chatbot
