# TourviaHPT - Tourism and Social Media Platform

TourviaHPT is a high-performance, secure, and scalable tourism and social media website that combines travel features with social networking capabilities. It allows users to explore destinations, share experiences, and book travel services.

## Features

- **User Authentication**: Secure registration and login system
- **Explore Destinations**: Browse and discover featured travel destinations
- **Social Feed**: Share travel experiences and interact with other travelers
- **Booking System**: Book tours, experiences, and accommodations
- **Live Chat**: Real-time messaging with other travelers and guides
- **AI Assistant**: Get travel recommendations and answers to travel-related questions
- **Shopping Cart**: Add and manage travel bookings
- **User Profiles**: Personalized profiles to showcase travel experiences
- **Dark/Light Mode**: Toggle between dark and light themes

## Technology Stack

- **Frontend**: React, TailwindCSS, Shadcn UI components
- **Backend**: Node.js, Express
- **Database**: In-memory storage (can be configured for PostgreSQL with Drizzle ORM)
- **Authentication**: Session-based with Passport.js
- **State Management**: React Query for data fetching
- **Routing**: Wouter for client-side routing

## Installation and Setup

### Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)

### Installation Steps

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd tourviaHPT
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
   - Create a `.env` file based on the provided `.env.example`
   - Fill in necessary environment variables

4. Start the development server
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5000`

## Project Structure

```
├── client/                  # Frontend code
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utility functions
│   │   ├── pages/           # Page components
│   │   ├── App.tsx          # Main React component
│   │   └── main.tsx         # Entry point
│   └── index.html           # HTML template
├── server/                  # Backend code
│   ├── auth.ts              # Authentication logic
│   ├── index.ts             # Server entry point
│   ├── routes.ts            # API routes
│   ├── storage.ts           # Data storage interface
│   └── vite.ts              # Vite configuration
├── shared/                  # Shared code
│   └── schema.ts            # Data schema definitions
├── package.json             # Project dependencies
└── .env                     # Environment variables
```

## API Endpoints

- **Authentication**
  - `POST /api/register` - Register a new user
  - `POST /api/login` - Log in a user
  - `POST /api/logout` - Log out a user
  - `GET /api/user` - Get current user info

- **Destinations**
  - `GET /api/destinations` - Get all destinations
  - `GET /api/destinations/:id` - Get a specific destination
  - `GET /api/destinations/featured` - Get featured destinations

- **Experiences**
  - `GET /api/experiences` - Get all experiences
  - `GET /api/experiences/:id` - Get a specific experience
  - `GET /api/experiences/trending` - Get trending experiences

- **Posts**
  - `GET /api/posts` - Get all posts
  - `GET /api/posts/user/:userId` - Get posts from a specific user
  - `POST /api/posts` - Create a new post

- **Comments**
  - `GET /api/comments/post/:postId` - Get comments for a post
  - `POST /api/comments` - Add a comment to a post

- **Bookings**
  - `GET /api/bookings/user/:userId` - Get bookings for a user
  - `POST /api/bookings` - Create a new booking

## License

[MIT License](LICENSE)

## Credits

Developed by [Your Name/Team Name]